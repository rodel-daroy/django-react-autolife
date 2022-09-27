import concurrent.futures
from threading import Thread

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

# Create your views here.
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from autolife.settings import RECALL_ENDPOINT
from library.al_lib import ALResponse
from library.cache_store import GetValuesFromCache, SetValuesInCache
from library.decorators import vehicle_content_seen
from marketplace.utility.JATO import VehicleBasicDetails
from users.models import RecallCheckHistory, VehicleVisitHistory
from vehicles.models import Make, VehicleCategory, Vehicle
from django.conf import settings
import requests
from rest_framework.exceptions import ValidationError

class MakeAPI(APIView):
	"""
	API to get all makes
	"""
	authentication_classes = ()
	permission_classes = ()

	def get(self, request):
		return ALResponse(data=[make.to_json for make in Make.objects.all()], status=200).success()


class AllVehicleCategory(APIView):
	"""
	Categories of vehicles
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny, )

	def get(self, request):
		return ALResponse(data=[category.to_json for category in VehicleCategory.objects.all().order_by('order')], status=200).success()


class SubCategories(APIView):
	"""
	Subcategories of vehicle
	"""
	authentication_classes = ()
	permission_classes = ()

	def get(self, request):
		all_categories = [category.to_json for category in VehicleCategory.objects.all().order_by('order')]
		for category in all_categories:
			check_repeat = []
			category["sub_categories"] = []
			for vehicle in Vehicle.objects.filter(category_id=category["category_id"]):
				if vehicle.make_id not in check_repeat:
					category["sub_categories"].append({"name": vehicle.make.name, "sub_category_id": vehicle.make_id})
					check_repeat.append(vehicle.make_id)
				# category["sub_categories"] = [
				# 	{"name":sub_cat.name, "sub_category_id": sub_cat.id} for sub_cat in Make.objects.filter().distinct("name")
				# ]

		return ALResponse(data=all_categories, status=200).success()


class UncategorizedVehicle(APIView):
	"""
	All categories vehicles will be displayed here
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny, )

	def get(self, request):
		data =  GetValuesFromCache().get_uncategorized()
		if not data:
			data = [vehicle.vehicle_meta_info for vehicle in Vehicle.objects.filter(~Q(category_id=None))[:12]]
			basic_details_obj = VehicleBasicDetails()
			with concurrent.futures.ThreadPoolExecutor() as executor:
				executor.map(basic_details_obj.price, data)
			SetValuesInCache().set_uncategorized(data)
		if request.user.is_authenticated:
			for vehicle in data:
				if vehicle.get("id") in [vehicle.id for vehicle in request.user.saved_cars.all()]:
					vehicle.update({"is_liked": True})
				else:
					vehicle.update({"is_liked": False})
		return ALResponse(
			data=data,
			status=200,
		).success()


class CategorizedVehicle(APIView):
	"""
	Vehicle List According to Category
	"""
	authentication_classes = (JSONWebTokenAuthentication, )
	permission_classes = (AllowAny, )

	def get(self, request, category_name):
		sub_category_id = request.GET.get("sub_category_id", None)
		try:
			category = VehicleCategory.objects.get(slug=category_name)
			if not sub_category_id:
				data = GetValuesFromCache().get_browse_vehicle_list(category_name)  # fetch cached Values
				if not data:
					data = [vehicle.vehicle_meta_info for vehicle in Vehicle.objects.filter(category_id=category.id)]
					basic_details_obj = VehicleBasicDetails()
					with concurrent.futures.ThreadPoolExecutor() as executor:
						executor.map(basic_details_obj.price, data)
					SetValuesInCache().set_browse_vehicle_list(category_name, data)  # Set Cached Values
			else:
				data = [vehicle.vehicle_meta_info for vehicle in
						Vehicle.objects.filter(category_id=category.id, make_id=int(sub_category_id))]
				basic_details_obj = VehicleBasicDetails()
				with concurrent.futures.ThreadPoolExecutor() as executor:
					executor.map(basic_details_obj.price, data)
			if request.user.is_authenticated:
				for vehicle in data:
					if vehicle.get("id") in [car.id for car in request.user.saved_cars.all()]:
						vehicle.update({"is_liked": True})
					else:
						vehicle.update({"is_liked": False})
			return ALResponse(
				data=data,
				status=200
			).success()

		except ObjectDoesNotExist as e:
			return ALResponse(status=404, message="Category not found").server_error()


class VehicleDetails(APIView):
	"""
	Details by vehicle ID
	"""
	authentication_classes = (JSONWebTokenAuthentication, )
	permission_classes = (AllowAny,)

	@vehicle_content_seen
	def get(self, request, vehicle_id):
		try:
			asset_data = {}
			vehicle_obj = Vehicle.objects.get(id=int(vehicle_id))
			if vehicle_obj.article:
				for asset in vehicle_obj.article.asset_template_association.filter(template_location='spot_A'):
					if asset.asset:
						asset_data = {
							"asset_type": asset.asset.asset_type.name,
							"assets": [each_asset.to_json for each_asset in asset.asset.assets.all()]
						}
						break
			response = vehicle_obj.to_json
			basic_details_obj = VehicleBasicDetails()
			with concurrent.futures.ThreadPoolExecutor() as executor:
				executor.map(basic_details_obj.price, [response])
			if response:
				if request.user.is_authenticated:
					if response.get("id") in [vehicle.id for vehicle in request.user.saved_cars.all()]:
						response.update({"is_liked": True})
					else:
						response.update({"is_liked": False})
				else:
					response.update({"is_liked": False})
				response["assets"] = asset_data
				return ALResponse(data=response, status=200).success()
			else:
				return ALResponse(data=response, status=404).server_error()
		except ObjectDoesNotExist as e:
			return ALResponse(message="Vehicle does not Exists", status=404).server_error()


class SimilarVehicles(APIView):
	"""
	Similar Vehicles for Browse- VDP
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, vehicle_id):
		try:
			vehicle_obj = Vehicle.objects.get(id=int(vehicle_id))
			similar_vehicles=[vehicle.to_json for vehicle in Vehicle.objects.filter(category_id=vehicle_obj.category_id)[:3]]
			similar_brands = [vehicle.to_json for vehicle in Vehicle.objects.filter(make_id=vehicle_obj.make_id)[:3]]
			if request.user.is_authenticated:
				vehicle_ids=[vehicle['vehicle_id'] for vehicle in similar_vehicles]
				user_vehicles_ids = [vehicle.source_id for vehicle in request.user.saved_cars.all()]

				for id in vehicle_ids:
					if id in user_vehicles_ids:
						for i in similar_vehicles:
							if i['vehicle_id'] == id:
								i['is_liked'] = True


				vehicle_ids = [vehicle['vehicle_id'] for vehicle in similar_brands]

				for id in vehicle_ids:
					if id in user_vehicles_ids:
						for i in similar_brands:
							if i['vehicle_id'] == id:
								i['is_liked'] = True



			response ={
				"similar_brands":similar_brands ,
				"similar_vehicles" : similar_vehicles
			}
			return ALResponse(data=response, status=200).success()
		except Vehicle.DoesNotExist:
			return ALResponse(message="Vehicle does not Exists", status=404).server_error()


class RecallCars(APIView):
	"""
	Recall cars API
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request):
		user =request.user
		make = request.GET.get('make')
		model = request.GET.get('model')
		year = request.GET.get('year')
		if request.user.is_authenticated:
			recallObj = RecallCheckHistory.objects.create(
					make = make,
					model = model,
					year = year
				)
			user.tools_recall_check.add(recallObj)

		if not make or not model or not year:
			raise ValidationError("Year, Make and Model are required queryset parameters")

		url = RECALL_ENDPOINT + '/recall/make-name/{make}/' \
			  'model-name/{model}/year-range/{year}-{year}?format=json'.format(make=make, model=model, year=year)
		response = requests.get(url=url, verify=False).json()['ResultSet']
		response = list(map(self.filter_recall, response))
		return ALResponse(message="OK", data=response, status=200).success()

	def filter_recall(self, entity):
		if entity[0]['Name'] == 'Recall number':
			return {'recall-number' : entity[0]['Value']['Literal']}
		return None


class RecallSummary(APIView):
	"""
	Recall Summary cars API
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, recall_number):
		print('data ',request.data)
		url = RECALL_ENDPOINT + '/recall-summary/recall-number/{recall_number}?format=json'\
            .format(recall_number = recall_number)
		response = requests.get(url=url,verify =False).json()['ResultSet']
		response = list(map(self.filter_recall, response))
		return ALResponse(message="OK", data=response, status=200).success()


	def filter_recall(self, entity):
		my_data = {}
		for e in entity:
			if e['Name'] == 'MODEL_NAME_NM':
				my_data['model']= e['Value']['Literal']

			if e['Name'] == 'MAKE_NAME_NM':
				my_data['make']= e['Value']['Literal']

			if e['Name'] == 'DATE_YEAR_CD':
				my_data['year']= e['Value']['Literal']

			if e['Name'] == 'COMMENT_ETXT':
				my_data['summary']= e['Value']['Literal']

			if e['Name'] == 'RECALL_DATE_DTE':
				my_data['recall_date']= e['Value']['Literal']

		return my_data

