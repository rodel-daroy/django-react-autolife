import datetime
import json

from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, render_to_response
from django.template import RequestContext
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from analytics.utils.utility import GetUserInfo, PrettyJsonRenderer, GetAllUserInfo, QuickSightUserAnalytics
from autolife.local_settings import DEBUG, ALL_USER_JOURNEY_FILE_PATH
from library.cache_store import UpdateCache
from marketplace.utility.SCIXML import SCIXML
from users.models import Profile, UserTagRelation
import os
from django.conf import settings
from django.http import HttpResponse, Http404
from users.utils.utility import UserScore, IndividualTagScore, ContentScores


def home(request):
    users = Profile.objects.all().order_by('-date_joined')
    for i in users:
        i.last_login = i.last_login.date() if i.last_login else None
        i.date_joined = i.date_joined.date() if i.date_joined else None

    return render(
        request,
        'index.html',
        {
            "user_count": len(users),
            "profiles": users
        }
    )


def searchuser(request):
    userobj = []
    if request.method == 'POST':

        username = request.POST.get('username')
        userid = request.POST.get('userid')
        from_date = request.POST.get('from')
        to_date = request.POST.get('to')
        datefilter = request.POST.get('datefilter')
        if username:
            try:
                userobj = Profile.objects.filter(username__icontains=username)
            except:
                userobj = None
        if userid:
            try:
                userobj = Profile.objects.filter(id=userid)
            except:
                userobj = None
        if from_date and to_date and datefilter:
            if int(datefilter) == 1:
                userobj = Profile.objects.filter(date_joined__gte=from_date, date_joined__lte=to_date)
            elif int(datefilter) == 2:
                userobj = Profile.objects.filter(last_login__gte=from_date, last_login__lte=to_date)

        if len(userobj) == 1:
            newuserobj = Profile.objects.get(username=userobj.values('username'))
            newuserobj.last_login = newuserobj.last_login.date() if newuserobj.last_login else None
            newuserobj.date_joined = newuserobj.date_joined.date() if newuserobj.date_joined else None
            return render(
                request,
                'index.html',
                {
                    "user_count": 1,
                    "profile": newuserobj,
                    'userid': userid,
                    'username': username,
                    'from': from_date,
                    'to': to_date,
                    'datefilter': datefilter
                }

            )
        elif len(userobj) > 1:

            for i in userobj:
                i.last_login = i.last_login.date() if i.last_login else None
                i.date_joined = i.date_joined.date() if i.date_joined else None

            return render(
                request,
                'index.html',
                {
                    "user_count": len(userobj),
                    "profiles": userobj,
                    'userid': userid,
                    'username': username,
                    'from': from_date,
                    'to': to_date,
                    'datefilter': datefilter
                }
            )
        else:
            context = {'alert': "Not found any matching user"}

            return render(
                request, 'index.html',
                {
                    'userid': userid,
                    'username': username,
                    'from': from_date,
                    'to': to_date,
                    'datefilter': datefilter,
                    'alert': "Not found any matching user"
                },
                context
            )


def user_journey(request, user_id):
	user = Profile.objects.get(id=int(user_id))
	user_content_obj = ContentScores(user)
	return render(

		request,
		'details.html',
		{
			"user_profile": user.analytics_json,
			"total_score": UserScore(user_id),
			# "mongo_details": GetUserInfo(int(user_id)),
			"visited_content": user_content_obj.get_visited_content(),
			"liked_content": user_content_obj.get_liked_content(),
			"tag_scores": IndividualTagScore(user_id),
			"interests": user.interests.all(),
			"actions":user.actions.all(),
			"visits":user.visits.all(),
			"insurances":user.visit_insurance.all(),
			"average_asking_prices":user.tools_avg_asking_price.all(),
			"trade_in_values":user.tools_trade_in_value.all(),
			"future_values":user.tools_future_value.all(),
			"recalls":user.tools_recall_check.all(),
			"vehicles":user.visit_vehicles.all()
		}
	)



@api_view(['GET', ])
@renderer_classes((PrettyJsonRenderer,))
def export_json(request, user_id):
    """
	Exports JSON Data of user Journey from NoSQL Database Records
	"""
    try:

        return Response(data=GetUserInfo(int(user_id)))
    except ObjectDoesNotExist as e:
        return Response(data={"Error": "invalid username"})


@api_view(['GET', ])
# @renderer_classes((PrettyJsonRenderer,))
def export_json_for_all(request):
    """
	Exports JSON Data of All users Journey from NoSQL Database Records
	"""
    try:
        data = GetAllUserInfo()
        for date in data:
            if ('_id') in date:
                del date['_id']  # converting data into json format
            date['last_login'] = date['last_login'].strftime('%Y-%m-%dT%H:%M:%S.%f') if date['last_login'] else None
            date['date_joined'] = date['date_joined'].strftime('%Y-%m-%dT%H:%M:%S.%f') if date['date_joined'] else None
            if 'visits' in date:
                for time_stamp in date['visits']:
                    time_stamp['timestamp'] = time_stamp['timestamp'].strftime('%Y-%m-%dT%H:%M:%S.%f')
            if 'actions' in date:
                for timestamp in date['actions']:
                    timestamp['timestamp'] = timestamp['timestamp'].strftime('%Y-%m-%dT%H:%M:%S.%f')
        # new_json_data = json.dumps(data)
        new_json_data = json.dumps(data, indent=4, sort_keys=False)
        fileobj = open(ALL_USER_JOURNEY_FILE_PATH, 'w')
        fileobj.write(new_json_data)  # write json in file

        fileobj.close()
        # Download file
        file_path = ALL_USER_JOURNEY_FILE_PATH
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/vnd.json")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path) + '.json'
                response['message'] = "file downloaded"
                return response
        raise Http404

    # return Response(data=newdata)
    except ObjectDoesNotExist as e:
        return Response(data={"Error": "invalid username"})


@csrf_exempt
@user_passes_test(lambda u: u.is_authenticated)
def password_set(request):
    if request.user.is_superuser:
        if request.POST:
            email = request.POST.get("email").lower()
            password = request.POST["password"]
            if email and password:
                try:
                    user = Profile.objects.get(email=email)
                    user.set_password(password)
                    user.save()
                    return render(
                        request,
                        "success.html",
                    )
                except:
                    return render(
                        request,
                        "404.html",
                        {"message": "<code>Email not found!</code>"}
                    )
        else:
            if not DEBUG:
                url = '/api/analytics/password_set/'
            else:
                url = '/analytics/password_set/'
            url = '/analytics/password_set/'
            context = {
                "form": [
                    {"name": "email", "placeholder": "enter email", "type": "text", "label": "Email"},
                    {"name": "password", "placeholder": "", "type": "password", "label": "Password"},
                ],
                "title": "Set Password",
                "analytics_url": url
            }
            return render(
                request,
                "form.html",
                context
            )
    return redirect("https://gnr8r.xyz")


@csrf_exempt
def sci_html(request):
    form_data = [
        {"name": "id", "placeholder": "id", "type": "text", "label": "id"},
        {"name": "year", "placeholder": "year", "type": "text", "label": "year"},
        {"name": "make", "placeholder": "make", "type": "text", "label": "make"},
        {"name": "model", "placeholder": "model", "type": "text", "label": "model"},
        {"name": "vin", "placeholder": "vin", "type": "text", "label": "vin"},
        {"name": "trim", "placeholder": "trim", "type": "text", "label": "trim"},
        {"name": "price", "placeholder": "price", "type": "text", "label": "price"},
        {"name": "model_code", "placeholder": "model_code", "type": "text", "label": "model_code"},
        {"name": "body_style", "placeholder": "body_style", "type": "text", "label": "body_style"},
        {"name": "sms", "placeholder": "sms", "type": "text", "label": "sms"},
        {"name": "vehicle_id", "placeholder": "vehicle_id", "type": "text", "label": "vehicle_id"},
        {"name": "first_name", "placeholder": "", "type": "text", "label": ""},
        {"name": "last_name", "placeholder": "", "type": "text", "label": ""},
        {"name": "email", "placeholder": "", "type": "text", "label": ""},
        {"name": "contact_num", "placeholder": "", "type": "text", "label": ""},
        {"name": "street_line1", "placeholder": "", "type": "text", "label": ""},
        {"name": "street_line2", "placeholder": "", "type": "text", "label": ""},
        {"name": "city", "placeholder": "", "type": "text", "label": ""},
        {"name": "region_code", "placeholder": "", "type": "text", "label": ""},
        {"name": "postal_code", "placeholder": "", "type": "text", "label": ""},
        {"name": "country", "placeholder": "", "type": "text", "label": ""},
        {"name": "dealer_name", "placeholder": "", "type": "text", "label": ""},
        {"name": "dealer_id", "placeholder": "", "type": "text", "label": ""},
        {"name": "division", "placeholder": "", "type": "text", "label": ""},
    ]
    if request.POST:
        SCIXML(request.POST)
    else:
        return render(
            request,
            "form.html",
            {"form": form_data, "url": "/analytics/scilead/", "title": "SAMPLE REQUEST"}
        )


@user_passes_test(lambda u: u.is_superuser)
def clear_score(request, user_id):
    if request.user.is_superuser:
        try:
            user = Profile.objects.get(id=int(user_id))
            user.visited_content.clear()
            user.liked_content.clear()
        except:
            pass
        UserTagRelation.objects.filter(user_id=int(user_id)).delete()
        return HttpResponseRedirect(reverse('user journey', args=(int(user_id),)))


def sci_service(request):
    pass


def cbb_service(request):
    pass


class QuickSightAnalytics(APIView):
    """
	Give user analytics
	"""
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAdminUser,)

    def get(self, request):
        user_id = request.user
        if user_id.email == 'user@autolife.com':
            new_email = 'autolife_user'
        else:
            new_email = user_id.email
        dashboard_url = QuickSightUserAnalytics(new_email)
        url = dashboard_url.get_embeded_url()
        return Response(data={"url": url, "email": new_email})
