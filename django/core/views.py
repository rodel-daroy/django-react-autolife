"""
User related views will be included in this file
"""
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView

from core.utility.utils import Subscribe
from library.al_lib import ALResponse
from users.models import Profile


class ProfileAPI(APIView):
	"""
	User related API
	"""

	def post(self):
		pass

	def get(self):
		pass


class SubscribeMailChimp(APIView):
	"""
	Subscribing to mailchimp server
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		sub_obj = Subscribe(request.data)
		email = request.data.get("email", None).lower()
		if email:
			try:
				user = Profile.objects.get(email=email)

			except ObjectDoesNotExist as e:
				user = None

			if user and user.is_subscribed :
				response_message = sub_obj.resubscribe(is_alredy_member=True,subscribe=True)
				return ALResponse(data=[], status=200, message={"message": "Already subscribed"}).success()


			elif user:

				user.is_subscribed = True
				user.save()
				response_message = sub_obj.subscribe(template="daily")
				if isinstance(response_message, str):
					return ALResponse(data=response_message, status=200, message={"message":"Subscribed successfully"}).success()
				else:
					response_message = sub_obj.resubscribe(is_alredy_member=False,subscribe=True)
					return ALResponse(data=[], status=200,message={"message":"Subscribed successfully"}).success()
			else:
				response_message = sub_obj.subscribe(template="daily")
				if isinstance(response_message, str):
					return ALResponse(data=response_message, status=200, message={"message": "Subscribed successfully"}).success()
				else:
					response_message = sub_obj.resubscribe(is_alredy_member=True,subscribe=True)
					return ALResponse(data=[], status=200, message={"message": "Already subscribed"}).success()




class MonthlyNewsDigetSubscribeMailChimp(APIView):
	"""
	Subscribing to mailchimp server
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		sub_obj = Subscribe(request.data)
		email = request.data.get("email", None).lower()
		if email:
			try:
				user = Profile.objects.get(email=email)

			except ObjectDoesNotExist as e:
				user = None

			if user and user.monthly_newsletter_subscription:
				response_message = sub_obj.resubscribe(is_alredy_member=True, subscribe=False)
				return ALResponse(data=[], status=200, message={"message": "Already subscribed"}).success()


			elif user:

				user.monthly_newsletter_subscription = True
				user.save()
				response_message = sub_obj.subscribe(template="monthly")
				if isinstance(response_message, str):
					return ALResponse(data=response_message, status=200,
									  message={"message": "Subscribed successfully"}).success()
				else:
					response_message = sub_obj.resubscribe(is_alredy_member=False, subscribe=False)
					return ALResponse(data=[], status=200, message={"message": "Subscribed successfully"}).success()
			else:
				response_message = sub_obj.subscribe(template="monthly")
				if isinstance(response_message, str):
					return ALResponse(data=response_message, status=200,
									  message={"message": "Subscribed successfully"}).success()
				else:
					response_message = sub_obj.resubscribe(is_alredy_member=True, subscribe=False)
					return ALResponse(data=[], status=200, message={"message": "Already subscribed"}).success()
