"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from datetime import datetime
from random import randint
from threading import Thread

from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core.validators import RegexValidator, validate_email
from django.db.models import Q
from rest_framework_jwt.settings import api_settings
from django.utils import timezone

from autolife.local_settings import HOST_NAME, INFO_MAIL_FROM, DEFAULT_EMAIL_FROM, AWS_S3_CUSTOM_DOMAIN
from content_manager.models import TemplateContent
from core.utility.utils import Subscribe
from library.al_lib import MailThread, Slug, SendMail, HTMLMailThread
from library.constants import CONFIRM_MAIL_SUBJECT, CONFIRM_MAIL_MESSAGE
from tags.models import Tag
from users.models import Profile, EmailConfirmation, UserTagRelation, ContactAction
from vehicles.models import Make, Vehicle
from rest_framework.exceptions import APIException


class Register(object):
	"""
	Python class for registering user
	"""
	def __init__(self, params):
		self.params = params
		self.status = False
		self.message = None
		self.created_user = None
		self.response_data = None
		self.token = None
		self.email_validate()   # calling method in sequence i.e validate and then register

	def email_validate(self):
		try:        # Email Validation should be done here
			validate_email(self.params['email'])    # Validating Email Format
			try:
				Profile.objects.get(email=self.params['email'].lower())    # Checking if email already exists
				self.status = False     # Set status False if email already registered
				self.message = "Email Already registered! ."  # set
			except ObjectDoesNotExist as e:     # If objects doesn't exists then status will be true
				self.status = True
		except ValidationError as e:
			self.status = False
		self.generate_username()    # Generating Username
		if self.status:
			self.register()
			if self.created_user:
				self.response_data = self.created_user.to_json
		else:
			self.message = self.message if self.message else "Email is not valid"

	def register(self):
		"""
		After validating the input parameters user will be able to register,
		If user exists than appropriate msg will be added int he response
		:return:
		"""
		try:		# Profile creation will go here
			self.created_user = Profile.objects.create_user(
				username=self.params["username"].lower().strip(),
				password=self.params["password"],
				email=self.params["email"].lower().strip(),
				first_name=self.params["first_name"].strip().split('@')[0][0:30] if self.params["first_name"] else "",
				last_name=self.params["last_name"].strip() if self.params["last_name"] else "",
				contact=self.params.get("tel", "").strip()
			)   # If registration happened successfully send email verification asynchronously
			# Associating brands added during soft_registration
			self.add_interests(self.created_user, self.params.get("brands"), self.params.get("lifestyle"))
			# Associating options added during soft_registration
			self.status = True		# If successfully created then status True will be set
			self.message = "Successfully registered"		# And success message too
			self.token = str(self.created_user.id)+self.generate_verification_token  # Now generate email verification token
			self.save_token_for_update()		# Save it to the database and generate the URL to verify email
			HTMLMailThread(
				[self.params["email"]],
				CONFIRM_MAIL_SUBJECT,
				{'verify_email_link': self.confirm_mail_message},
				'hello-responsive.html',
				DEFAULT_EMAIL_FROM
			).start()
		# MailThread([self.params["email"]], CONFIRM_MAIL_SUBJECT, self.confirm_mail_message, mail_from=DEFAULT_EMAIL_FROM).start()
		except Exception as e:     # If username already exists then ask for new username or if input values are invalid
			self.status = False
			self.message = str(e)

	@staticmethod
	def add_interests(created_user, brands, lifestyle):
		if isinstance(brands, list):
			for brand_id in brands:
				try:
					created_user.brands.add(Make.objects.get(id=int(brand_id)))
				except ObjectDoesNotExist as e:
					pass
		# Associating lifestyle added during soft_registration
		if isinstance(lifestyle, list):
			for lifestyle_id in lifestyle:
				try:
					created_user.interests.add(Tag.objects.get(id=int(lifestyle_id)))
				except ObjectDoesNotExist as e:
					pass

	def generate_username(self):
		"""
		This method will generate a new username for new user from his/her email,
		if the username  already exists then it will add random integer at the end of the user's username
		extracted from his/her email.
		:return:
		"""
		username = self.params["email"].split("@")[0]
		if Profile.objects.filter(username=username).exists():
			username += str(randint(1, 100))
		self.params["username"] = username

	@property
	def confirm_mail_message(self):
		"""
		Generates confirm mail message and embed token inside the URl,
		this URL is one time accessible and User has to confirm his email within 30 days.
		:return:
		"""
		return HOST_NAME +"user/verification/" + self.token + "/"
	# return CONFIRM_MAIL_MESSAGE+"\n Click link to verify your mail "+ HOST_NAME +"user/verification/" + self.token + "/"

	@property
	def generate_verification_token(self):
		"""
		Generates email verification token and return to the appropriate statement
		:return: Token(String)
		"""
		return Slug(
			date=str(datetime.now().date()).replace(":","").replace(".","").replace("-","")[::-1]
		).slug

	def save_token_for_update(self):
		"""
		Saves token to the database , so that the One time URL can be created to User to verisy it's email.
		:return:
		"""
		EmailConfirmation.objects.get_or_create(
			confirmation_token = self.token,
			user = self.created_user
		)


class EmailVerificationThread(object):
	"""
	Generates random slug from
	"""
	def __new__(cls, user, *args, **kwargs):
		pass


class Authenticate(object):
	"""
	Authentication of user using email and password
	"""
	def __init__(self, email, password):
		self.email = email
		self.password = password
		self.status = False
		self.message = ""
		self.user = None

	def validate(self):
		try:
			self.user = Profile.objects.get(email=self.email)
			self.username = self.user.username
			self.status = True
		except:
			self.status = False
		return self.status

	def auth(self):
		if self.validate():
			self.user = authenticate(username=self.username, password=self.password)
			if self.user:
				# pass
				if not self.user.is_verified:
					self.status = False
					self.message = "Email is not Verified!"
				self.user.last_login = timezone.now()
				self.user.save()

			else:
				self.status = False
				self.message = "Username and Password are incorrect, Please try again."
			return self.status
		else:
			self.message = "This email is not registered"
			return self.status

	@property
	def get_user(self):
		return self.user if self.status else None


class AuthenticationToken(object):
	"""
	Takes user object and returns JW Token
	"""
	def __new__(cls, user, *args, **kwargs):
		jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
		jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
		payload = jwt_payload_handler(user)
		token = jwt_encode_handler(payload)
		return token


class GetUser(object):
	"""
	Takes User_ID and returns latest Profile object
	"""
	def __new__(cls, user_id,  *args, **kwargs):
		try:
			return Profile.objects.get(id=user_id)
		except ObjectDoesNotExist as e:
			return None


class VerifySocialEmail(object):
	"""
	Verfifies social email
	"""
	def __new__(cls, user_id, *args, **kwargs):
		try:
			user = GetUser(user_id)
			if user:
				user.is_verified = True
				user.save()
				return GetUser(user_id)
		except:
			pass


class SaveUserThread(Thread):
	"""
	Saving as a thread
	"""
	def __init__(self, user):
		super(SaveUserThread, self).__init__()
		self.user = user

	def run(self):
		self.user.save()


class ProfileUpdate(object):
	"""
	Fetch user details
	"""
	def __init__(self, data, user):
		try:
			if data.get("first_name"):
				user.first_name = data["first_name"]
				user.last_name = data["last_name"]
				user.contact = data["contact"]
				user.is_subscribed = data.get("is_subscribed")
				user.monthly_newsletter_subscription = data.get("monthly_newsletter_subscription")

				if data.get("is_subscribed")==True :
					sub_obj = Subscribe(data)
					response_message = sub_obj.subscribe(template="daily")
					print("response message",response_message)
					if response_message !="subscribed" and response_message.get('error'):
						response_message = sub_obj.resubscribe(is_alredy_member=False,subscribe=True)


				if data.get("monthly_newsletter_subscription") ==True:
					sub_obj = Subscribe(data)
					response_message = sub_obj.subscribe(template="monthly")
					print("response message",response_message)
					if response_message !="subscribed" and response_message.get('error'):
						response_message = sub_obj.resubscribe(is_alredy_member=False,subscribe=False)

				if data.get("is_subscribed")==False and data.get("monthly_newsletter_subscription") ==False:
					sub_obj = Subscribe(data)
					response_message = sub_obj.unsubscribe()
					# response_message = sub_obj.delete_subscriber()
					print(response_message)




			if data.get("password"):
				user.set_password(data["password"])
			try:
				user.avatar_url = data.get("avatar_url").replace("https://" + AWS_S3_CUSTOM_DOMAIN, "")
			except AttributeError as e:     # In case avatar_url came empty
				pass

			self.status=True
			user.save()
		except KeyError as e:
			self.status = False


class LifestylePreferences(object):
	"""
	Lifestyle Preferences
	"""
	def  __new__(cls, data, user, lifestyle_type, *args, **kwargs):
		status = {"status": 200, "message": "successfully updated preferences"}
		if lifestyle_type == "brand":
			if isinstance(data.get("brands"), list):
				user.brands.clear()
				for brand in data["brands"]:
					if brand["value"]:
						try:
							user.brands.add(Make.objects.get(id=int(brand["brand_id"])))
						except:
							status = {"status": 400, "message": "invalid brand_id found"}
							return status
			else:
				return {"status": 406, "message": "invalid input format"}
		elif lifestyle_type == "interest":
			if isinstance(data.get("interests"), list):
				user.interests.clear()
				for interest in data["interests"]:
					if interest["value"]:
						try:
							user.interests.add(Tag.objects.get(id=int(interest['interest_id'])))
						except:
							status = {"status": 400, "message": "invalid interest_id found"}
							return status
			else:
				return {"status": 406, "message": "invalid input format"}
		else:
			status = {"status": 400, "message": "url not found"}
			return status
		return status


class LastVisited(Thread):
	"""
	Records Last visiting time
	"""
	def __init__(self, user):
		super(LastVisited, self).__init__()
		self.user = user

	def run(self):
		self.user.last_visited_on = timezone.now()
		if (timezone.now() - self.user.last_visited_on).seconds > 60:
			if self.user.is_authenticated:
				self.user.save()


class UserScore(object):
	"""

	returns User's total score
	"""
	def __new__(cls, user_id, *args, **kwargs):
		total_weight = 0
		for ut_r in UserTagRelation.objects.filter(user_id=int(user_id)):
			total_weight += ut_r.weight
		return total_weight


class ContentScores(object):
	"""
	It gives content details and total score of the tags
	"""
	def __init__(self, user):
		self.user = user

	def get_visited_content(self):
		visited_content = []
		if self.user:
			user_content = self.user.visited_content.all()
			for content in user_content:
				visited_content.append({"content": content, "total_score": content.content_score})
		return visited_content

	def get_liked_content(self):
		liked_content = []
		if self.user:
			user_content = self.user.liked_content.all()
			for content in user_content:
				liked_content.append({"content": content, "total_score": content.content_score})
		return liked_content


class IndividualTagScore(object):
	"""
	return Individual score of the User
	"""
	def __new__(cls, user_id, *args, **kwargs):
		obj = {}
		for ut_r in UserTagRelation.objects.filter(user_id=int(user_id)):
			if ut_r.tag.tag_type:
				if ut_r.tag.tag_type.type_name in obj.keys():
					obj[ut_r.tag.tag_type.type_name].append({"tag": ut_r.tag.name, "score": ut_r.weight})
				else:
					obj[ut_r.tag.tag_type.type_name] = [{"tag": ut_r.tag.name, "score": ut_r.weight}]
			elif "others" in obj.keys():
				obj["others"].append({"tag": ut_r.tag.name, "score": ut_r.weight})
			else:
				obj["others"] = [{"tag": ut_r.tag.name, "score": ut_r.weight}]
		return obj


class SaveCarThread(Thread):

	"""
	Saves car into users profile
	"""
	def __init__(self, user, car_id, browse_section=False):
		super(SaveCarThread, self).__init__()
		self.user = user
		self.car_id = str(car_id)
		self.browse_section = browse_section


	def run(self):
		if not self.browse_section:
			if Vehicle.objects.filter(source_id=self.car_id,
									  category_id=None).exists():
				obj = Vehicle.objects.filter(
					source_id=self.car_id,
					category_id=None
				)[0]
			else:
				obj = Vehicle.objects.create(
					source_id=self.car_id,
					category_id=None
				)

			self.user.saved_cars.add(obj)
		else:
			try:
				obj = Vehicle.objects.get(id=self.car_id)
				if obj.source_id:
					if not self.user.saved_cars.filter(source_id=obj.source_id).exists():  # If not already in saved cars
						self.user.saved_cars.add(obj)
			except ObjectDoesNotExist as e: pass


class ContactUsMessage(object):
	"""
	process contact us query
	"""
	def __new__(cls, data, *args, **kwargs):
		message = data.get("text")
		mobile = data.get("mobile")
		email = data.get("email")
		first_name = data.get("first_name")
		last_name = data.get("last_name")
		if not first_name:
			raise APIException("First Name is required")

		fullname= "{first_name} {last_name}".format(first_name=first_name, last_name=last_name)

		if message and email:
			ContactAction.objects.get_or_create(
				text = message,
				email = email,
				name = fullname,
				mobile = mobile
			)
			# Sending acknowledgement message to the user
			MailThread(
				mail_from="Autolife <{email}>".format(email=DEFAULT_EMAIL_FROM),
				recipient_list=[email],
				message="Thanks for contacting us, we will get back to you soon!",
				subject="Thanks for contacting"
			).start()
			# Sending mail to info@autolife.ca
			MailThread(
				mail_from="Autolife <{email}>".format(email=DEFAULT_EMAIL_FROM),
				recipient_list=[INFO_MAIL_FROM],
				message="{email}: {message}".format(email=email, message=message),
				subject="Query from users"
			)


class SendMailToUnverifiedUsers(object):
	"""
	Sending mail to unverified users
	"""
	def __new__(cls, *args, **kwargs):
		unverified_accounts = [{"email": obj.user.email, "confirmation_token": obj.confirmation_token} for obj in EmailConfirmation.objects.all()]
		for each_account in unverified_accounts:
			print(each_account)
			HTMLMailThread(
				[each_account["email"]],
				CONFIRM_MAIL_SUBJECT,
				{'verify_email_link': HOST_NAME +"user/verification/" + each_account["confirmation_token"] + "/"},
				'hello-responsive.html',
				DEFAULT_EMAIL_FROM
			).start()
