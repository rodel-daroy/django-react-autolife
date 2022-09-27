"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import functools

from django.contrib.auth.models import Group
from rest_framework.decorators import api_view, permission_classes
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from content_manager.models import TemplateContent
from users.models import Profile
from vehicles.models import Vehicle


class content_visited(object):
	"""
	Session authenticator for joyage, It Take cares of whether a user is valid or not
	"""

	def __init__(self, view_func):
		self.view_func = view_func
		functools.wraps(view_func)(self)

	def __call__(self, request, *args, **kwargs):
		# maybe do something before the view_func call
		response = self.view_func(object, request, *args, **kwargs)
		try:
			content = TemplateContent.objects.get(slug=kwargs["guid"])
			content.views += 1
			if request.user.is_authenticated:
				try:
					group = Group.objects.filter(name="STAFF_MEMBER")
				except Group.DoesNotExist:
					group = None
				if group and request.user.is_authenticated:
					if group in request.user.groups.all():
						return response
				request.user.visited_content.add(content)
				# added this to visited content
			content.save()
		except:
			pass

		# maybe do something after the view_func call
		return response


class vehicle_content_seen(object):
	"""
	when vehicle content related data seen add to to visisted content for user and increase the views
	"""
	def __init__(self, view_func):
		self.view_func = view_func
		functools.wraps(view_func)(self)

	def __call__(self, request, *args, **kwargs):
		response = self.view_func(object, request, *args, **kwargs)
		try:
			if not request.user.is_superuser:
				try:
					group = Group.objects.filter(name="STAFF_MEMBER")
				except Group.DoesNotExist:
					group = None
				if group:
					if group in request.user.groups.all():
						return response
				vehicle_obj = Vehicle.objects.get(id=int(kwargs["vehicle_id"]))
				if vehicle_obj.article:
					article = vehicle_obj.article
					article.views += 1
					if request.user.is_authenticated:
						request.user.visited_content.add(article)
						if article in request.user.visited_content.all():
							return response
					article.save()
		except:
			pass
		return response