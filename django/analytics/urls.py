from django.conf.urls import url

from analytics.views import home, user_journey, export_json, password_set, sci_html, clear_score, searchuser, \
    export_json_for_all, QuickSightAnalytics

urlpatterns = [
    url(r'^$', home, name="analytics home"),
    url(r'^search/$', searchuser, name="user search"),
    url(r'^journey/(?P<user_id>\d+)/$', user_journey, name="user journey"),
    url(r'^export_json/(?P<user_id>\d+)/$', export_json, name="user json data"),
    url(r'^export_json_for_all_users/$', export_json_for_all, name="all user json data"),
    url(r'^password_set/$', password_set, name="set password "),
    url(r'^clear_score/(?P<user_id>\d+)/$', clear_score, name="clear score"),
    url(r'^dashboard_url/$', QuickSightAnalytics.as_view(), name="quicksight_analytics"),
]
