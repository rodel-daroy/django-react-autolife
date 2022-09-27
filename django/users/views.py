import csv
import uuid

from django.conf import settings
from django.utils import timezone

from django.contrib import auth
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import redirect
from oauth2_provider.models import AccessToken, Application
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.views import refresh_jwt_token, RefreshJSONWebToken
from rest_framework_social_oauth2.views import ConvertTokenView

from autolife.local_settings import DOMAIN, DEFAULT_EMAIL_FROM
from library.al_lib import ALResponse, MailThread, HTMLMailThread
from library.cache_store import GetValuesFromCache, SetValuesInCache, UpdateCache
from library.constants import GRANT_TYPE, BACKENDS, DEFAULT_USER_IMAGE, RESET_PASSWORD_TEXT, VERIFICATION_SUCCESS, \
	RESET_PASSWORD_SUBJECT, CONFIRM_MAIL_SUBJECT
from users.models import EmailConfirmation, Profile, UserUpdatePassword
from users.serializer import UploadImageSerializer
from users.utils.utility import Register, Authenticate, AuthenticationToken, GetUser, ProfileUpdate, \
	LifestylePreferences, SaveCarThread, ContactUsMessage, SendMailToUnverifiedUsers
from vehicles.models import Vehicle
from django.core.cache import cache


class TokenCheck(APIView):
	"""
	Returns status whether token is valid checked or not
	"""

	def get(self, request):
		pass


class Registration(APIView):
	"""
	User Registration using email and username
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		try:  # check if the required fields are present
			email = request.data["email"]
			password = request.data["password"]
			first_name = request.data["first_name"]
			last_name = request.data["last_name"]
		except KeyError as e:
			return ALResponse(status=406, message="invalid parameters").server_error()
		register = Register(request.data)
		if register.status:
			return ALResponse(status=200, data=register.response_data).success()
		else:
			return ALResponse(status=409, message=register.message).server_error()


class VerifyEmail(APIView):
	"""
	Verify Registered email , this view is one time accessible and will destroy the URL which is accessed once
	"""
	authentication_classes = ()
	permission_classes = ()

	def get(self, request, confirmation_token):
		try:
			confirmation_object = EmailConfirmation.objects.get(confirmation_token=confirmation_token)
			profile_object = Profile.objects.get(id=confirmation_object.user_id)
			profile_object.is_verified = True
			profile_object.save()
			HTMLMailThread(
				[profile_object.email],
				VERIFICATION_SUCCESS,
				{},
				'welcome-responsive.html',
				DEFAULT_EMAIL_FROM
			).start()
			confirmation_object.delete()
			return redirect(DOMAIN + "?message=Your email " + profile_object.email + " has been successfully verified!")
		except:
			return redirect(DOMAIN + "?message=Email has been already verified!!")


class Login(APIView):
	"""
	User Login using Email and password
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		try:
			email = request.data["email"].lower()
			password = request.data["password"]
		except KeyError as e:
			return ALResponse(message="Parameter Error!!", status=406).server_error()
		auth_obj = Authenticate(email, password)
		if auth_obj.auth():  # auth method call will return true/false status of authentication
			if auth_obj.status:
				auth_token = AuthenticationToken(auth_obj.get_user)
				message = "Authenticated Successfully"
			else:
				auth_token = None
				message = auth_obj.message
		else:
			auth_token = None
			message = auth_obj.message
		if auth_token:
			return ALResponse(
				data={"token": auth_token, "user_details": auth_obj.user.to_json, 'token_expires_in': settings.JWT_TOKEN_TIME_SPAN},
				status=200,
				message=message
			).success()
		else:
			return ALResponse(status=401, message=message).server_error()


class Logout(APIView):
	"""
	Invalidate token
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def post(self, request):
		# request.user.auth_token.delete()
		cache.delete_pattern("{username}_*".format(username=request.user.username))

		update = UpdateCache()
		update.update_user_related(username=request.user.username)

		auth.logout(request)
		return ALResponse(message="logout successfully", status=200).success()


class ProfileDetails(APIView):
	"""
	User specific Details
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def post(self, request):
		return ALResponse(
			data={
				"user_details": request.user.to_json, "is_superuser": request.user.to_json.get('is_superuser', False)
			}, status=200
		).success()


class SocialLogin(ConvertTokenView):
	"""
	Implementing the Social Login (Google and Facebook)
	"""

	def post(self, request, *args, **kwargs):
		newuser = False
		email = request.data.get("email", None)
		social_uid = request.data.get("uid", None)

		if email:
			user = Profile.objects.filter(email=email).first()
			if user is None:
				newuser = True

		if social_uid and not newuser:
			user = Profile.objects.filter(social_uid=social_uid).first()
			if user is None:
				newuser = True

		try:
			client_id = Application.objects.latest("id").client_id
			client_secret = Application.objects.get(client_id=client_id).client_secret
		except ObjectDoesNotExist as e:
			client_secret = None
		custom_request = request.POST._mutable
		request.POST._mutable = True
		if client_secret:
			try:
				request.data["client_id"] = client_id
				request.data["client_secret"] = client_secret
				request.data["grant_type"] = GRANT_TYPE
				request.data["backend"] = BACKENDS[request.data["backend"]]
			except KeyError as e:
				return ALResponse(status=406, message="invalid parameters").server_error()
			request.POST._mutable = custom_request
			try:
				response = super(SocialLogin, self).post(request, *args, **kwargs)
			except Exception as e:
				return ALResponse(status=304, message=str(e)).server_error()
			try:
				# print(response.data)
				access_token = response.data["access_token"]
				user = AccessToken.objects.get(token=access_token).user
				user.avatar_url = request.data.get("profile_image", DEFAULT_USER_IMAGE)
				user.social_login = True
				user.is_verified = True
				user.social_uid = social_uid
				Register.add_interests(user, request.data.get('brands'), request.data.get('lifestyle'))
				user.save()
				user = GetUser(user.id)
				if user:
					token = AuthenticationToken(user)
					user_details = user.to_json
					user_details["newuser"] = newuser

					return ALResponse(data={"token": token, "user_details": user_details}, status=200).success()
				else:
					return ALResponse(status=500).server_error()
			except KeyError as e:
				message = response.data["error"]
				return ALResponse(status=404, data=response.data, message=message).success()
		else:
			return ALResponse(status=500, message="client credentials were wrong").server_error()


class UserPreferences(APIView):
	"""
	User COntent Preferences
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get(self, request):
		data = GetValuesFromCache().user_content_preferences(request.user.username)
		if not data:
			data = request.user.user_content_preferences
			SetValuesInCache().set_content_preferences(request.user.username, data)
		return ALResponse(data=data, status=200).success()


class UpdateInfo(APIView):
	"""
	API for update personal information
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def post(self, request):
		profile_obj = ProfileUpdate(request.data, request.user)
		if profile_obj.status:
			return ALResponse(status=200, data=request.user.to_json).success()
		else:
			return ALResponse(message="Parameter Error!!", status=406).server_error()

class Refreshtoken(RefreshJSONWebToken):
	"""
	API for update personal information
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request, *args, **kwargs):
		response = super(RefreshJSONWebToken, self).post(request,*args, *kwargs)

		if response.status_code == 200:
			self.update_user_details(request)
			response.data['token_expires_in']= settings.JWT_TOKEN_TIME_SPAN
			return ALResponse(status=200, data=response.data).success()

		else:
			return ALResponse(message="Invalid token", status=400).success()

	def update_user_details(self, request):
		serializer = self.get_serializer(data=request.data)
		if serializer.is_valid():
			user = serializer.object.get('user') or request.user
			user.last_login = timezone.now()
			user.save()



class CheckOldPassword(APIView):
	"""
	API for check password matches or not
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def post(self, request):
		password = request.data.get("password")
		if check_password(password, self.request.user.password):
			return ALResponse(status=200, data=[], message="password matched").success()
		else:
			return ALResponse(status=404, data=[], message="Not found").server_error()


class ProfileUpload(APIView):
	"""
	Image Uploading for user
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)
	parser_classes = (MultiPartParser, FormParser,)

	def post(self, request):
		try:
			for file in request.FILES.items():
				file_obj = file[1]
			serializer = UploadImageSerializer(data={"image": file_obj})
			if serializer.is_valid():
				serializer.save()
			return Response({"status": 200, "url": serializer.data["image"], "message": "Image uploaded"})
		except:
			return Response({"status": 304, "message": "Resource Not modified"})


class UpdatePreferences(APIView):
	"""
	Updating likes and dislikes
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def post(self, request, lifestyle_type):
		status = LifestylePreferences(request.data, request.user, lifestyle_type)
		return ALResponse(
			status=status["status"],
			message=status["message"],
			data=request.user.only_lifestyle
		).success()


class RemoveSavedCars(APIView):
	"""
	Removing saved cars from the list
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def post(self, request, model_id):
		try:
			# This is wrong way to to do
			browse_section = request.data.get("browse_section", None)  # If save action came form browse section
			shop_section = request.data.get("shop_section", None)  # If save action came form browse section
			if not shop_section:
				request.user.saved_cars.remove(Vehicle.objects.get(id=int(model_id)))
			else:
				vehicle_obj = request.user.saved_cars.get(source_id=str(model_id))
				request.user.saved_cars.remove(vehicle_obj)
			return ALResponse(
				status=200,
				message="car removed",
				data=[] if shop_section or browse_section else request.user.user_content_preferences
			).success()
		except ObjectDoesNotExist as e:
			return ALResponse(
				status=400,
				message="car not found",
				data=[]
			).server_error()


class SaveCar(APIView):
	"""
	Save cars into profile
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = ()

	def post(self, request, car_id):
		if car_id.isdigit():
			browse_section = request.data.get("browse_section", None)  # If save action came form browse section
			SaveCarThread(request.user, car_id, browse_section=browse_section).run()
			return ALResponse(data=[], message="Car saved successfully!", status=200).success()
		else:
			return ALResponse(data=[], message="car id not found", status=404).server_error()


class ForgotPassword(APIView):
	"""
	Forgot your password
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		email = request.data.get("email", None).lower()
		if email:
			try:
				user = Profile.objects.get(email=email)
			except ObjectDoesNotExist as e:
				user = None
			if user:
				try:
					token_obj = UserUpdatePassword.objects.get(user_id=user.id)
				except ObjectDoesNotExist as e:
					token_obj = UserUpdatePassword.objects.create(
						user_id=user.id,
						token=str(uuid.uuid1())
					)
				HTMLMailThread(
					[email],
					RESET_PASSWORD_SUBJECT,
					{'reset_password_link': DOMAIN + "/reset-password/?email={email}&token={token}".format(email=email,
																										   token=token_obj.token)},
					'forgot-password-responsive.html',
					DEFAULT_EMAIL_FROM
				).start()
				return ALResponse(data={"email": email}, message="Check your email to update your password",
								  status=200).success()
		return ALResponse(message="Provide registered email to update your password", status=406).server_error()


class ResetPassword(APIView):
	"""
	Reset Password
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		token = request.data.get("token", None)
		email = request.data.get("email", None).lower()
		new_password = request.data.get("password", None)
		if token and email and new_password:
			try:
				user = Profile.objects.get(email=email)
				user_obj = UserUpdatePassword.objects.get(token=token, user_id=user.id)
				user.set_password(new_password)
				user.save()
				user_obj.delete()
				return ALResponse(message="Password reset successfully", status=200).success()
			except ObjectDoesNotExist as e:
				pass
		return ALResponse(message="Invalid request", status=400).success()


class ContactUs(APIView):
	"""
	contact us API
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		ContactUsMessage(request.data)
		return ALResponse(message="OK", status=200).success()


@user_passes_test(lambda u: u.is_superuser)
def resend_confirmation_mail(request):
	SendMailToUnverifiedUsers()
	return HttpResponse("OK")

@user_passes_test(lambda u: u.is_superuser)
def all_user_as_csv(request):
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="user_data.csv"'

	writer = csv.writer(response)
	for user in Profile.objects.all():
		writer.writerow([
			user.id, user.first_name, user.last_name, user.email, user.is_verified, user.username,
			user.is_superuser, user.avatar_url
		])

	return response



class ClearCache(APIView):
	"""
	contact us API
	"""
	authentication_classes = ()
	permission_classes = ()

	def get(self, request):
		cache.clear()
		return ALResponse(message="OK", status=200).success()
