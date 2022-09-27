"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.contrib.auth.middleware import get_user
from django.urls import reverse
from django.utils.functional import SimpleLazyObject
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class AuthenticationMiddlewareJWT(object):
	def __init__(self, get_response):
		self.get_response = get_response
		self.user = None

	def __call__(self, request):
		if reverse('ui_controls:tile_ordering') == request.path:
			if not request.user.is_superuser:
				request.unauthorized = True
			else:
				request.unauthorized = False
		print(request.user)
		request.user = SimpleLazyObject(lambda: self.__class__.get_jwt_user(request))
		return self.get_response(request)

	@staticmethod
	def get_jwt_user(request):
		user = get_user(request)
		if user.is_authenticated:
			return user
		jwt_authentication = JSONWebTokenAuthentication()
		if jwt_authentication.get_jwt_value(request):
			user, jwt = jwt_authentication.authenticate(request)
		return user