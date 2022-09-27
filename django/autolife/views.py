"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import json

import datetime

from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.cache import cache
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt
from fabric.operations import local
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from autolife.local_settings import IMAGE_SOURCE
from content_manager.forms import AssetForm
from content_manager.models import Asset, AssetContent
from content_manager.utilities.asset_utils import VideoThumbnailer, LambdaThumbnailer
from content_manager.utilities.cms_utils import IsSuperUser
from core.models import Version
from library.al_lib import ALResponse, GetIp
from library.cache_store import UpdateCache


def index(request):
	"""
	Base view of index page.
	:param request:
	:return:
	"""
	data = {
		"server": "Autolife Backend",
		"description": "To access the APIs follow the Autolife API Documention.",
		"purpose": "To provide APIs for Frontend apps"
	}
	return HttpResponse(
		content=json.dumps(data, indent=4), content_type="application/json"
	)


@csrf_exempt
def version_number(request):
	if request.method == 'POST':
		obj = Version.objects.create(
			frontend_version = datetime.datetime.now().strftime("%s"),
			backend_version = datetime.datetime.now().strftime("%s")
		)    # Create version number
	else:
		obj = Version.objects.latest("id")
	return HttpResponse(
		content=json.dumps(obj.to_json), content_type="application/json"

	)


@csrf_exempt
def add_assets(request):
	"""
	Add assets separately
	:param request:
	:return:
	"""
	if request.POST:
		form = AssetForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			return HttpResponseRedirect(reverse('all_assets'))
		else:
			return render(
				request,
				"asset_template.html",
				{
					"form": AssetForm,
					"errors": form.errors
				}
			)
	else:
		return render(
			request,
			"asset_template.html",
			{
				"form": AssetForm,
			}
		)


@csrf_exempt
def edit_asset(request, asset_id):
	"""
	Add assets separately
	:param request:
	:return:
	"""
	if asset_id:
		try:
			instance = Asset.objects.get(id=asset_id)
		except Asset.DoesNotExist as e:
			instance = None
		if instance:
			form = AssetForm(instance=instance)
			return render(
				request,
				"asset_template.html",
				{
					"form": form,
					"errors": form.errors
				}
			)
	return HttpResponseRedirect(reverse('all_assets'))


@user_passes_test(lambda u : u.is_superuser)
def generate_thumbnail(request, asset_id):
	"""
	Generating thumbnails for old articles
	:param request:
	:return:
	"""
	try:
		for each_asset in Asset.objects.get(id=int(asset_id)).assets.all():
			VideoThumbnailer(each_asset.content.url).start()
	except Asset.DoesNotExist:
		pass
	return HttpResponseRedirect(reverse('all_assets'))




def all_assets_list(request):
	order = request.GET.get("sort", None)
	sort_name = "name"
	sort_id = "id"
	if not order:
		all_assets = Asset.objects.filter().order_by("-id")
	else:
		if order == "id":
			all_assets = Asset.objects.filter().order_by("id")
			sort_id= "-id"
		elif order == "-name":
			all_assets = Asset.objects.filter().order_by("-name")
			sort_name = "name"
		elif order == "name":
			all_assets = Asset.objects.filter().order_by("name")
			sort_name = "-name"
		elif sort_id == "-id":
			all_assets = Asset.objects.filter().order_by("id")
			sort_id = "-id"
		else:
			all_assets = Asset.objects.filter().order_by("-id")[:30]
	return render(
		request,
		"asset_list.html",
		{"assets": all_assets, "sort_name": sort_name, "sort_id": sort_id}
	)


def asset_details(request, asset_id=None):
	try:
		asset = Asset.objects.get(id=asset_id)
	except ObjectDoesNotExist as e:
		asset = None
	return render(
		request,
		"asset_details.html",
		{"asset": asset}
	)


@user_passes_test(lambda u: u.is_superuser)
def clear_cache(request):
	cache.clear()
	return HttpResponse(
		content_type="application/json",
		content=json.dumps({"message": "OK", "status": 200})
	)

def services(request):
	return render(
		request,
		'3rd_party.html',
		{}
	)



class UpdateOrder(APIView):
	"""
	updates order
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request, asset_id):
		order = request.data['order']
		for each in order:
			obj = AssetContent.objects.get(id=int(each))
			obj.order = order.index(each)
			obj.save()
		return ALResponse(message="Asset's order updated successFully", status=200).success()

# @user_passes_test(lambda u:u.is_superuser)
def jato_cache_clear(request):
	UpdateCache().jato_cache()
	return HttpResponse(
		content_type="application/json",
		content=json.dumps({"message": "OK", "status": 200})
	)

# @user_passes_test(lambda u:u.is_superuser)
def gunicorn_restart(request):
	local("sudo systemctl restart gunicorn")
	return HttpResponse(
		content_type="application/json",
		content=json.dumps({"message": "OK", "status": 200})
	)


# @user_passes_test(lambda u:u.is_superuser)
def nginx_restart(request):
	local("sudo systemctl restart nginx")
	return HttpResponse(
		content_type="application/json",
		content=json.dumps({"message": "OK", "status": 200})
	)

# @user_passes_test(lambda u: u.is_superuser)
def easy_insure_cache_clear(request):
	UpdateCache().update_insurance_headers()
	return HttpResponse(
		content_type="application/json",
		content=json.dumps({"message": "OK", "status": 200})
	)


class StaticAPI(APIView):

	def post(self, request):
		pass

	def get(self, request):
		pass



class GetIP(APIView):
	"""
	Get Ip address
	"""
	authentication_classes = ()
	permission_classes = ()

	def get(self, request):
		ip_address = GetIp(request.META)
		return ALResponse(status=200, data={"ip": ip_address}).success()


class GenerateClip(APIView):
	"""
	Generate clip for
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		try:
			dimensions = request.data['dimensions']
			clip_time = request.data['clip_time']
			path = request.data['path']
			file = request.data["path"].split('/')[-1]
			LambdaThumbnailer(dimensions=dimensions, clip_time=clip_time, path=path, file=file).run()
			return ALResponse(message="Clip generating......", status=200).success()
		except KeyError as e:
			return ALResponse(message="Request Could Not be completed", status=406).server_error()


class GetImageSource(APIView):
	authentication_classes = ()
	permission_classes = ()
	def get(self,request):
		return ALResponse(status=200, data={"Image_source": IMAGE_SOURCE}).success()
