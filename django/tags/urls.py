from django.conf.urls import url

from tags.views import LifestyleAPI

urlpatterns = [
    url(r'^lifestyle/', LifestyleAPI.as_view(), name='lifestyle'),
]