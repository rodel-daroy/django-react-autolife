"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.conf.urls import url, include

urlpatterns = [
	url(r'^api/', include('autolife.urls')),
]