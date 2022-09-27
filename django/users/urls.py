"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

from django.conf.urls import url, include
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import Registration, Login, SocialLogin, ProfileDetails, VerifyEmail, UpdateInfo, \
	UserPreferences, CheckOldPassword, ProfileUpload, UpdatePreferences, RemoveSavedCars, SaveCar, ForgotPassword, \
	ResetPassword, ContactUs, ClearCache, Logout, resend_confirmation_mail, all_user_as_csv, Refreshtoken

urlpatterns = [
	url(r'^verification/(?P<confirmation_token>\w+)/', VerifyEmail.as_view()),
	url(r'^users_dump/$', all_user_as_csv),
	url(r'^send_mail/unverified_user/$', resend_confirmation_mail),
	url(r'^info/$', ProfileDetails.as_view(), name="info"),
	url(r'^register/$', Registration.as_view(), name="register"),
	url(r'^login-username$', obtain_jwt_token, name="login"),     # login using username and Password
	url(r'^login/$', Login.as_view()),       # login using email and password
	url(r'^logout/$', Logout.as_view()),       # login using email and password
	url(r'^refresh/$', Refreshtoken.as_view()),   # refreshing JW token
	url(r'^verify/$', verify_jwt_token),
	url(r'^social_login/', SocialLogin.as_view()),
	url(r'^user_content_preferences/$', UserPreferences.as_view(), name="user content preferences"),
	url(r'^update/$', UpdateInfo.as_view(), name="update"),
	url(r'^upload/', ProfileUpload.as_view(), name="upload"),
	url(r'^checkpassword/$', CheckOldPassword.as_view(), name="checkpassword"),
	url(r'^forgot_password/$', ForgotPassword.as_view(), name="forgot password"),
	url(r'^reset_password/$', ResetPassword.as_view(), name="Reset password"),
	url(r'^update/(?P<lifestyle_type>\w+)/$', UpdatePreferences.as_view(), name="update preferences"),
	url(r'^save_car/(?P<car_id>\w+)/$', SaveCar.as_view(), name="add cars to profile"),
	url(r'^remove_saved_cars/(?P<model_id>\d+)/$', RemoveSavedCars.as_view(), name="remove saved cars"),
	url(r'^contact/$', ContactUs.as_view(), name="contact us"),
	url(r'^clear_cache/$', ClearCache.as_view(), name="clear_cache"),
]