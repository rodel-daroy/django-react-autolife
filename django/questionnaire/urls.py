"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.conf.urls import include, url

from questionnaire.routers import router
from questionnaire.views import SoftRegistration

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^next_question/$', SoftRegistration.as_view(), name="next_question"),
]