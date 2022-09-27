"""autolife URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.documentation import include_docs_urls
from rest_framework_swagger.views import get_swagger_view

from autolife.local_settings import DEBUG
from content_manager.views import AllAssets,CreateAsset
from autolife.views import index, add_assets, all_assets_list, asset_details, UpdateOrder, edit_asset, clear_cache, \
    version_number, services, jato_cache_clear, GetIP, generate_thumbnail, GenerateClip, easy_insure_cache_clear, \
    gunicorn_restart, nginx_restart, GetImageSource
from core.views import SubscribeMailChimp, MonthlyNewsDigetSubscribeMailChimp

schema_view = get_swagger_view(title='Autolife API Documentation', url="")

urlpatterns = [
    url('^jet/', include('jet.urls', 'jet')),  # Django JET URLS
    url('^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
    url(r'^$', index),
    url(r'^get_version', version_number),
    url(r'^generate_clip/$', GenerateClip.as_view()),
    url(r'^get_ip', GetIP.as_view()),
    # url(r'^swagger_api_docs/', schema_view),
    url(r'^get_image_source/', GetImageSource.as_view()),
    url(r'^generate_thumbnail/(?P<asset_id>\d+)/$', generate_thumbnail, name="generate_thumbnail"),
    url(r'^admin/', admin.site.urls),
    url(r'^services/', services, name="3rd_party_services"),
    url(r'^jato_cache/', jato_cache_clear, name="jato_cache_update"),
    url(r'^easy_insure_cache/', easy_insure_cache_clear, name="easy_insure_cache_update"),
    url(r'^restart_gunicorn/', gunicorn_restart, name="restart_gunicorn"),
    url(r'^restart_nginx/', nginx_restart, name="restart_nginx"),
    url(r'^subscribe/$', SubscribeMailChimp.as_view(), name="subscribe"),
    url(r'^monthly_news_digest_subscribe/$', MonthlyNewsDigetSubscribeMailChimp.as_view(), name="monthly news letter subscribe"),
    url(r'^admin/add_assets/$', add_assets, name="assets_url"),
    url(r'^admin/edit_assets/(?P<asset_id>\d+)/$', edit_asset, name="edit_assets"),
    url(r'^admin/update_order/(?P<asset_id>\d+)/$', UpdateOrder.as_view(), name="update_order"),
    url(r'^admin/all_assets/$', all_assets_list, name="all_assets"),
    url(r'^admin/asset_detail/(?P<asset_id>\d+)$', asset_details, name="asset_details"),
    url(r'^clear_cache/$', clear_cache, name="clear_cache"),
    url(r'^services/$', services, name="services"),
    url(r'^soft_registration/', include('questionnaire.urls')),
    url(r'^analytics/', include('analytics.urls')),
    url(r'^marketplace/', include('marketplace.urls', namespace="marketplace")),
    url(r'^oauth2_provider/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    # needed for Oauth URL check
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),  # Never ever change this to somewhere else
    url(r'^user/', include('users.urls', namespace="users")),
    url(r'^content_manager/', include('content_manager.urls', namespace="content management")),
    url(r'^soft_registration/', include('questionnaire.urls', namespace="questionnaire")),
    url(r'^tags/', include('tags.urls', namespace="tags")),
    url(r'^vehicles/', include('vehicles.urls', namespace="vehicles")),
    url(r'^assets/all/', AllAssets.as_view(), name="list-all-assets"),
    url(r'^assets/create/', CreateAsset.as_view(), name="create-assets"),
    url(r'^ui_controllers/', include('ui_controllers.urls', namespace="ui_controls")),
    url(r'^recall/', include('vehicles.urls', namespace="recall")),
    # Add assets

]

if DEBUG:
    urlpatterns += [
        url(r'^drf_api_docs/', include_docs_urls(title="Autolife Api Docs", authentication_classes=[],
                                                 permission_classes=[])),
    ]
