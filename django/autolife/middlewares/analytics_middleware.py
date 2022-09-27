"""
This file consists of Middleware to handle the analytics of User Activity
"""
# from django.contrib.gis.geoip import GeoIP
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.utils import timezone

from analytics.utils.utility import RecordRequest, AutolifeUserActions, MongoUpdate
from library.al_lib import GetIp
from users.models import Profile, save_user_visits
from users.utils.utility import LastVisited


class AnalyticsMiddleware(object):
	"""
	This middleware will take care of visits and user actions on the website

	"""
	def __init__(self, get_response):
		self.get_response = get_response
	# One-time configuration and initialization.

	def __call__(self, request):
		# Code to be executed for each request before
		# the view (and later middleware) are called.
		response = self.get_response(request)
		if request.user.is_authenticated:
			user_payload = self.authenticated_payload(request)
			LastVisited(request.user).start()
			# Record Autolife User Action Asynchronously
			AutolifeUserActions(payload=user_payload, user=request.user).start()
			user = Profile.objects.get(id=request.user.id).analytics_json
			save_user_visits(payload=user_payload)
			# MongoUpdate(user).start()
		else:
			# Record Anonymous User Action Asynchronoussly
			pass
		# the view is called.
		return response

	def authenticated_payload(self, request):
		IP = GetIp(request.META)
		# geo_info = GeoIP()
		return {
			"visits": {
				"ip_address": IP,
				"url_accessed": request.META["PATH_INFO"],
				"timestamp": timezone.now(),
				"geo_location": {"country": None, "city": None},
			},
			"user": request.user.analytics_json
		}