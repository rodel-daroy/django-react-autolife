import concurrent.futures
import datetime

import requests
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from autolife.local_settings import IMAGE_SOURCE
from autolife.settings import EVOX_X_API_KEY, EVOX_BASE_URL
from library.al_lib import ALResponse
from library.cache_store import GetValuesFromCache, SetValuesInCache
from marketplace.models import Offers, InsuranceModel, InsuranceMake, InsuranceYear, MappingModel
from marketplace.utility.SCIXML import GetDealersFromSCI, SCIPayload, SCIThread
from marketplace.utility.CBB import CBB, AverageAskingPrice, TradeInValue, FutureValue
from marketplace.utility.JATO import JatoDetails, AutolifeSpecsFromJato, VehicleDetails, VehicleBasicDetails
from marketplace.utility.UNHAGGLE import Unhaggle
from marketplace.utility.insurance import AutolifeInsurance
from marketplace.utility.jato_evox import FetchData
from marketplace.utility.utils import CheckSavedCars, ContactConfirm, Evox, updatedJatoIdWithYear, updatedJatoId, \
    get_evox_url
from vehicles.models import VehicleCategory
from rest_framework.exceptions import APIException
from users.models import Profile, InsuranceHistory, AverageAskingPriceHistory, TradeInValueHistory, FuturevalueHistory, \
	VehicleVisitHistory
from users.models import Profile
from rest_framework import status, generics


class CbbDropdownLists(APIView):
    """
    CBB Homepage Dropdown lists
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        params = {
            "make": request.GET.get("make", None),
            "year": request.GET.get("year", None),
        }
        cbb = CBB(params)
        return ALResponse(data={"years": cbb.years, "makes": cbb.makes, "models": cbb.models}, status=200).success()


class CbbSearch(APIView):
    """
    CBB Search results on the basis of year, model and make
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        params = {
            "make": request.GET.get("make", None),
            "year": request.GET.get("year", None),
            "model": request.GET.get("model", None)
        }
        return ALResponse(data=CBB(params).search, status=200).success()


class OffersAPI(APIView):
    """
    Fetch list of users
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        return ALResponse(data=[offers.to_json for offers in Offers.objects.all()], status=200).success()


class JatoMakes(APIView):
    """
    Fetch all lists of jato makes
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        print(request.user)
        jato = JatoDetails()
        return ALResponse(
            data=[{"name": make} for make in jato.vehicle_makes()],
            status=200
        ).success()


class JatoModelByMakes(APIView):
    """
    Fetch list of model by makes
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, make):
        print(request.user)
        jato = JatoDetails()
        jato_models_by_make = jato.model_by_makes(make=make.lower().strip().replace(" ", "-"))
        return ALResponse(data=[{"name": jato_models_by_make} for jato_models_by_make in jato_models_by_make],
                          status=200).success()


class JatoBodyStyles(APIView):
    """
    Fetch list of jato trims
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, make):
        jato = JatoDetails()
        jato_trim = jato.trim(make=make)
        if jato_trim:
            return ALResponse(
                data=[{"name": trim} for trim in jato_trim],
                status=200
            ).success()
        else:
            return ALResponse(data=[], status=200).success()


class JatoSearch(APIView):

    """
    Search by model name & year
    Required Parameters: make, model, year, and postal_code(optional)
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        try:
            make = request.GET.get("make").replace('+', '-')
            model = request.GET.get("model").lower().strip().replace(' ', '-').replace('+',
                                                                                       '-')  # We can fetch exact model name from API
            year = request.GET.get("year")
            postal_code = None if not request.GET.get("postal_code") else request.GET.get("postal_code").replace(' ',
                                                                                                                 '').strip()
        except:
            make = None
            model = None
            year = None
            postal_code = None
        if make and model and year:
            # Get values from cache
            if not postal_code:
                data = GetValuesFromCache().search(model, year)
            else:
                data = GetValuesFromCache().search_with_incentives(model, year, postal_code)
            if not data:
                obj = JatoDetails()
                data = obj.search(
                    make=make, model=model, year=year, postal_code=postal_code)
                color_code = 0
                if IMAGE_SOURCE == 'EVOX':
                    if 'results' in data:
                        for i in range(0, len(data['results'])):
                            for j in range(0, len(data['results'][i]['vehicles'])):
                                evox_image = get_evox_url(data['results'][i]['vehicles'][j]['vehicle_id'])
                                # Append Evox Id into list
                                vid = updatedJatoId(data['results'][i]['vehicles'][j]['vehicle_id'])
                                mapped = MappingModel.objects.filter(jid=vid)
                                # Adding Key
                                evox_id = None
                                if mapped.exists():
                                    mapped = mapped.first()
                                    evox_id = mapped.evox_id
                                data['results'][i]['vehicles'][j]['evox_id'] = evox_id
                                if evox_image is not None:
                                    # Set color code unique  every time

                                    if  color_code >= len(evox_image):
                                        color_code = 0
                                    data['results'][i]['vehicles'][j]['image_url'] = evox_image[color_code]
                                    data['results'][i]['vehicles'][j]['izmo'] = None
                                    color_code += 1
                                    # Append car color code into list
                                    car_color = data['results'][i]['vehicles'][j]['image_url'].split('_')[-1].split('.')[0]
                                    data['results'][i]['vehicles'][j]['color_code'] = car_color

                                else:
                                    data['results'][i]['vehicles'][j]['image_url'] = evox_image
                                    data['results'][i]['vehicles'][j]['izmo'] = None
                                    data['results'][i]['vehicles'][j]['color_code'] = None

                        if not postal_code:
                            del data['postal_code']
                            SetValuesInCache().search(model, year, data)
                        else:
                            SetValuesInCache().search_with_incentives(model, year, postal_code, data)

                if isinstance(data, dict):
                    if request.user.is_authenticated:
                        all_saved_cars = [vehicle.source_id for vehicle in request.user.saved_cars.all()]
                        data = CheckSavedCars(all_saved_cars, data)
                    else:
                        for cars in data.get('results'):
                            for each_car in cars["vehicles"]:
                                each_car.update({"is_liked": False})

                return ALResponse(status=200, data=data
                                  ).success()
            else:
                return ALResponse(status=200, data=data
                                  ).success()
        else:
            return ALResponse(status=406, data=[], message="Provide Make, Model & Year").success()


class JatoVehicleDetails(APIView):
    """
    Jato Vehicle Details
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request, vehicle_id):
        j_details = JatoDetails()
        if vehicle_id:
            data = j_details.get_vehicle_by_id(vehicle_id=vehicle_id)
            if request.user.is_authenticated:
                if data.get("vehicle_id") in [vehicle.id for vehicle in request.user.saved_cars.all()]:
                    data.update({"is_liked": True})
                else:
                    data.update({"is_liked": False})
            else:
                data.update({"is_liked": False})
            return ALResponse(status=200, data=data).success()
        else:
            return ALResponse(status=406, data=[], message="Provide vehicle Id as url Parameter").success()


class JatoModelTrims(APIView):
    """
    Contains list of Trims
    """

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, model_id):
        j_details = JatoDetails()
        if model_id:
            return ALResponse(status=200, data=j_details.get_trims(model_id=model_id)).success()
        else:
            return ALResponse(status=406, data=[], message="Please provide Model Id").success()


class JatoFeatureByTrim(APIView):
    """
    Returns feature by trim name
    """

    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        trim_name = request.data.get("trim_name")
        model_id = request.data.get("model_id")
        j_details = JatoDetails()
        if trim_name:
            return ALResponse(status=200, data=j_details.get_feature_by_trim(
                model_id=model_id, trim_name=trim_name
            )).success()
        else:
            return ALResponse(status=406, data=[], message="Please provide Model Id").success()


class DetailsByVehicleID(APIView):
    """Vehicle Details by vehicle ID"""

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request, vehicle_id):
        code = request.GET.get('color_code') if request.GET.get('color_code') else None
        obj = VehicleDetails(vehicle_id).specs
        if obj.get('make'):

            if request.user.is_authenticated:
                make = obj.get('make') if 'make' in obj else None
                model = obj.get('model') if 'model' in obj else None
                year = obj.get('year') if 'year' in obj else None
                trim_name = obj.get('trim_name') if 'trim_name' in obj else None
                body_style = obj.get('body_style') if 'body_style' in obj else None

                vehicleobj = VehicleVisitHistory.objects.create(
                    make=make,
                    model=model,
                    year=year,
                    trim=trim_name,
                    body_style=body_style
                )
                request.user.visit_vehicles.add(vehicleobj)
                if str(obj.get("vehicle_id")) in [vehicle.source_id for vehicle in request.user.saved_cars.all()]:
                    obj.update({"is_liked": True})
                else:
                    obj.update({"is_liked": False})
            else:
                obj.update({"is_liked": False})
            if IMAGE_SOURCE == 'EVOX':
                vid = updatedJatoId(vehicle_id)
                mapped = MappingModel.objects.filter(jid=vid)

                # Adding Key
                evox_id = None
                if mapped.exists():
                    mapped = mapped.first()
                    evox_id = mapped.evox_id

                obj['evox_id'] = evox_id
                # Deleting Images Array
                obj.pop('image_url', None)

                headers = {
                    'x-api-key': EVOX_X_API_KEY
                }
                result = requests.get(
                    url=EVOX_BASE_URL+'/vehicles/{evox_id}/products/2?typeId=36+38+40'.format(
                        evox_id=evox_id), headers=headers)
                images = []
                result = result.json()
                if 'error' not in result:

                    for i in range(0, len(result['data']['resources'])):
                        result_keys = list(result['data']['resources'][i].keys())
                        if code:
                            for m in range(0,len(result['data']['resources'][i][result_keys[0]])):
                               if code in result['data']['resources'][i][result_keys[0]][m]:
                                    images.append(
                                        {'angle': i + 1,
                                         'order':result['data']['resources'][i][result_keys[0]][m].split('_')[4],
                                         'images': [result['data']['resources'][i][result_keys[0]][m]]})
                                    images = sorted(images, key=lambda i: i['order'], reverse=True)
                                    obj['images'] = images
                        else:
                           images.append(
                               {'angle': (i + 1),
                                'order': result['data']['resources'][i][result_keys[0]][0].split('_')[4],
                                'images': [result['data']['resources'][i][result_keys[0]][0]]})
                           images = sorted(images, key=lambda i: i['order'], reverse=True)
                           obj['images'] = images








                else:
                    obj['images'] = None

            return ALResponse(status=200, data=obj).success()
        return ALResponse(status=404, message="Not Found", data=[]).success()


class SpecsByVehicleID(APIView):
    """
    Vehicle Details by vehicle ID
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, vehicle_id):
        obj = GetValuesFromCache().jato_vehicle_specs(vehicle_id)
        if not obj:
            obj = AutolifeSpecsFromJato(vehicle_id=vehicle_id, meta_info=True).specs
            SetValuesInCache().jato_vehicle_specs(vehicle_id, obj)
        return ALResponse(status=200, data=obj).success()


class SimilarVehicles(APIView):
    """
    Similar_vehicles
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request, vehicle_id):
        results ={}
        similar_vehicles = GetValuesFromCache().shopping_similar_vehicle(vehicle_id=vehicle_id)
        if not similar_vehicles:
            similar_vehicles = JatoDetails().similar_vehicle(vehicle_id=vehicle_id)
            try:
                vids = [vehicle.source_id for vehicle in request.user.saved_cars.all()]
            except:
                vids=[]
            if 'similar' in similar_vehicles:
                results['similar']=[]
                for vehicle in similar_vehicles['similar']:
                    obj = {
                        "image_url": vehicle["photoPath"],
                        "name": vehicle["headerDescription"],
                        "vehicle_id": vehicle["vehicleId"],
                        "make": vehicle["makeName"],
                        "model": vehicle["modelName"],
                        "year": vehicle["modelYear"],
                        "trim_name": vehicle["versionName"],
                        "body_style": vehicle["bodyStyleName"],
                        "body_style_id": vehicle["bodyStyleId"],
                        "price": str(vehicle["msrp"]),
                        "transmission": vehicle["transmissionType"],
                        "engine_type": vehicle.get("engine_type"),
                        "horse_power": vehicle.get("horse_power"),
                        "fuel_economy_hwy": vehicle.get("fuel_economy_hwy"),
                        "fuel_economy_city": vehicle.get("fuel_economy_city"),
                        "is_liked": True if vehicle["vehicleId"] in vids else False,
                        "evox_id": vehicle["evox_id"] if "evox_id" in vehicle else None,
                        "color_code": vehicle["photoPath"].split('_')[-1].split('.')[0] if vehicle[
                                                                                               "photoPath"] and IMAGE_SOURCE == "EVOX" else None
                    }
                    obj.update(VehicleBasicDetails().price({"vehicle_id": obj["vehicle_id"]}, get_value=True))
                    results['similar'].append(obj)

            if 'competitor' in similar_vehicles:
                results['competitor'] = []
                for vehicle in similar_vehicles['competitor']:
                    obj = {
                        "image_url": vehicle["photoPath"],
                        "name": vehicle["headerDescription"],
                        "vehicle_id": vehicle["vehicleId"],
                        "make": vehicle["makeName"],
                        "model": vehicle["modelName"],
                        "year": vehicle["modelYear"],
                        "trim_name": vehicle["versionName"],
                        "body_style": vehicle["bodyStyleName"],
                        "body_style_id": vehicle["bodyStyleId"],
                        "price": str(vehicle["msrp"]),
                        "transmission": vehicle["transmissionType"],
                        "engine_type": vehicle.get("engine_type"),
                        "horse_power": vehicle.get("horse_power"),
                        "fuel_economy_hwy": vehicle.get("fuel_economy_hwy"),
                        "fuel_economy_city": vehicle.get("fuel_economy_city"),
                        "is_liked": True if vehicle["vehicleId"] in vids else False,
                        "evox_id": vehicle["evox_id"] if "evox_id" in vehicle else None,
                        "color_code": vehicle["photoPath"].split('_')[-1].split('.')[0] if vehicle[
                                                                                               "photoPath"] and IMAGE_SOURCE == "EVOX" else None
                    }
                    obj.update(VehicleBasicDetails().price({"vehicle_id": obj["vehicle_id"]}, get_value=True))
                    results['competitor'].append(obj)


            SetValuesInCache().set_shopping_similar(vehicle_id, results)
        return ALResponse(status=200, data=results).success()


class UnhaggleIncentive(APIView):
    """
    Fetch finance details from unhaggle
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        uid = request.GET.get("uid")
        year = request.GET.get("year")
        postal_code = request.GET.get("postal_code").strip().replace(" ", "") if request.GET.get(
            "postal_code") else None
        if postal_code:
            unhaggle_obj = Unhaggle({"uid": uid, "year": year, "postal_code": postal_code})
            unhaggle_obj.incentive()
            return ALResponse(status=200, data=unhaggle_obj.parsed_data).success()
        else:
            return ALResponse(status=406, data=[], message="enter valid postal code").server_error()


class BrowseCategories(APIView):
    """
    Categories of Browse categories
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        return ALResponse(data=[category.name for category in VehicleCategory.objects.all()], status=200).success()


class GetDealers(APIView):
    """
    Dealers from SCI
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        sci_obj = GetDealersFromSCI(params=request.data)
        sci_obj.get_dealer()
        if isinstance(sci_obj.dealer_list, list):
            return ALResponse(data=sci_obj.dealer_list, status=200, message="Upto radius %s" % sci_obj.radius).success()
        else:
            for radius in range(50, 501, 50):
                sci_obj.dealer_list = []
                sci_obj.get_dealer(radius=str(radius))
                if isinstance(sci_obj.dealer_list, list) and sci_obj.dealer_list:
                    return ALResponse(data=sci_obj.dealer_list, status=200).success()
                else:
                    pass
            return ALResponse(status=404, message=sci_obj.dealer_list["message"], data=[]).server_error(
                details=sci_obj.dealer_list)


class SCILeadPost(APIView):
    """
    Dealer and and information of vehicle
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        response = SCIThread(SCIPayload(request.data))
        if request.data.get("monthly_newsletter_subscription") and request.user.is_authenticated:
            request.user.monthly_newsletter_subscription = True
            request.user.save()  # Update newsletter field
        return ALResponse(status=200, message="Data successfully sent", data=response).success()


class CBBAvgAskingPrice(APIView):
    """
    Average asking price , Makes , models and year
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        avg_price_obj = AverageAskingPrice()
        if request.GET.get("year") and request.GET.get("make") and request.GET.get("model") and request.GET.get("trim"):
            return ALResponse(
                data=avg_price_obj.body_style(request.GET["year"], request.GET["make"], request.GET["model"],
                                              request.GET.get("trim")),
                status=200
            ).success()
        elif request.GET.get("year") and request.GET.get("make") and request.GET.get("model"):
            return ALResponse(
                data=avg_price_obj.trims(request.GET["year"], request.GET["make"], request.GET["model"]),
                status=200
            ).success()
        elif request.GET.get("year") and request.GET.get("make"):
            return ALResponse(
                data=avg_price_obj.models(request.GET["year"], request.GET["make"]),
                status=200
            ).success()
        elif request.GET.get("year"):
            return ALResponse(
                data=avg_price_obj.makes(request.GET["year"]),
                status=200
            ).success()
        else:
            return ALResponse(
                data=avg_price_obj.year(),
                status=200
            ).success()


class AveragePrice(APIView):
	"""
	Results of average price
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def post(self, request):
		user = request.user
		data = request.data
		body_style = data['body_style']
		trim = data['trim']
		make = data['make']
		year = data['year']
		model = data['model']
		if request.user.is_authenticated:
			avgobj = AverageAskingPriceHistory.objects.create(
				body_style=body_style,
				trim=trim,
				make=make,
				year=year,
				model=model
			)
			user.tools_avg_asking_price.add(avgobj)
		avg_obj = AverageAskingPrice()
		data = avg_obj.avg_asking_price(
			request.data.get("year"),
			request.data.get("make"),
			request.data.get("model"),
			request.data.get("trim"),
			request.data.get("body_style"),
			request.data.get("postal_code"),
			add_on=request.data.get("add_on")
		),
		if data:
			return ALResponse(data=data, status=200).success()
		else:
			return ALResponse(status=404, message="Not Found",  data=[]).server_error()



class GetTradeInValues(APIView):
    """
    Initial Values for trade in calculations
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        year = request.GET.get('year')
        make = request.GET.get('make')
        model = request.GET.get('model')
        trim = request.GET.get('trim')
        style = request.GET.get("body_style")
        if year and make and model and trim and style:
            data = TradeInValue().selected_options(year, make, model, trim, style)
        elif year and make and model and trim:
            data = TradeInValue().style(year, make, model, trim)
        elif year and make and model:
            data = TradeInValue().trim(year, make, model)
        elif year and make:
            data = TradeInValue().model(year, make)
        elif year:
            data = TradeInValue().make(year)
        else:
            data = TradeInValue().year()
        return ALResponse(status=200, data=data).success()


class TradeInValueResults(APIView):
	"""
	Trade in value Results for particular vehicles
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def post(self, request):
		user =request.user
		year = request.data.get('year')
		make = request.data.get('make')
		model = request.data.get('model')
		trim = request.data.get('trim')
		style = request.data.get('body_style')
		kilometers = request.data.get('current_kilometers')
		annual_kms = request.data.get('annual_kilometers', '')
		selected_option = request.data.get("option")
		postal_code = request.data.get("postal_code")
		if request.user.is_authenticated:
			tradeobj = TradeInValueHistory.objects.create(
				body_style=style,
				trim=trim,
				make=make,
				year=year,
				model=model
			)
			user.tools_trade_in_value.add(tradeobj)



		data = TradeInValue().trade_in_value(
			year=year,make=make,model=model,trim=trim,
			style=style,kilometers=kilometers, annual_kilometers=annual_kms, selected_option=selected_option, postal_code=postal_code)
		return ALResponse(status=200, data=data).success()


class GetFutureValues(APIView):
    """
    Parameters required for future values
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        year = request.GET.get('year')
        make = request.GET.get('make')
        model = request.GET.get('model')
        trim = request.GET.get('trim')

        if year and make and model and trim:
            data = FutureValue().style(year, make, model, trim)
        elif year and make and model:
            data = FutureValue().trim(year, make, model)
        elif year and make:
            data = FutureValue().model(year, make)
        elif year:
            data = FutureValue().make(year)
        else:
            data = FutureValue().year()
        return ALResponse(status=200, data=data).success()


class FutureValueResults(APIView):
	"""
	Future Value results
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def post(self, request):
		user =request.user
		year = request.data.get('year')
		make = request.data.get('make')
		model = request.data.get('model')
		trim = request.data.get('trim')
		style = request.data.get('body_style')
		kilometers = request.data.get('current_kilometers')
		annual_kms = request.data.get('annual_kilometers')
		postal_code = request.data.get("postal_code")
		if request.user.is_authenticated:
			futurevalueobj = FuturevalueHistory.objects.create(
				body_style=style,
				trim=trim,
				make=make,
				year=year,
				model=model
			)
			user.tools_future_value.add(futurevalueobj)

		data = FutureValue().future_value(
			year=year, make=make, model=model, trim=trim,
			style=style, kilometers=kilometers, annual_kilometers=annual_kms, postal_code=postal_code
		)
		return ALResponse(status=200, data=data).success()


class InsuranceVehicles(APIView):
    """
    Insurance_related make
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        if request.GET.get('make'):
            data = [vehicle.to_json for vehicle in
                    InsuranceModel.objects.filter(make__make_name=request.GET.get('make')).order_by('model_name')]
        elif request.GET.get('year'):
            data = [vehicle.to_json for vehicle in
                    InsuranceMake.objects.filter(year__year_name=request.GET.get('year')).order_by('make_name')]
        else:
            data = [vehicle.to_json for vehicle in InsuranceYear.objects.all()]
        return ALResponse(data=data, status=200, message="Ok").success()


class GetInsuranceQuote(APIView):
	"""
	Insurance quote
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def post(self, request):

		data = request.data
		if request.user.is_authenticated:
			user =request.user
			make =data['VehicleInfo'][0]['Make']
			year =data['VehicleInfo'][0]['Year']
			model =data['VehicleInfo'][0]['Model']
			insuranceobj = InsuranceHistory.objects.create(
				make = make,
				model = model,
				year= year
			)
			user.visit_insurance.add(insuranceobj)
		autolife_insurance = AutolifeInsurance(data)
		insurance_quote = autolife_insurance.get_quote()
		if autolife_insurance.status and len(insurance_quote['price']['Prices'])>0:
			return ALResponse(status=200, message="OK", data=insurance_quote).success()
		else:
			fileobj =open("/home/ubuntu/autolife/autolife/Logs/Insuranceerror.log","a")
			fileobj.write("Time ="+str(datetime.datetime.now()) +" "+ str(data)+"\n")
			fileobj.close()
			return ALResponse(status=200, message="OK", data=insurance_quote).success()
			# return ALResponse(status=500, message="No Insurance Packages Found", data={}).success()

	# return ALResponse(status=200, message="OK", data=insurance_quote).success()
	def get(self, request):
		try:
			status = request.GET["status"]
			autolife_insurance = AutolifeInsurance(data=None)
			insurance_quote = autolife_insurance.get_quote()
			if autolife_insurance.status:
				return ALResponse(status=200, message="OK", data=insurance_quote).success()
			else:
				return ALResponse(status=500, message=insurance_quote["message"], data={}).success()
		except:
			return ALResponse(status=500, message="Not Ok", data={}).server_error()



class ContactConfirmationView(APIView):
    """
    Sends Email Confirmation to User after vehicle Search, If user Opts to Contact Dealer
    """
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        model = request.data.get('model', None).strip()
        first_name = request.data.get('first_name', None).strip()
        last_name = request.data.get('last_name', '').strip()
        make = request.data.get('make', None).strip()
        year = int(request.data.get('year', 0))
        dealers = request.data.get('dealers', [])
        receipient_email = request.data.get('receipient_email', None).strip()
        user = self.is_user_exists(receipient_email)

        if (not model) or (not make) or (not year) or (not dealers) or (not first_name):
            raise APIException(
                "{} are Required Parameters".format("make, model, year, first_name, dealers, receipient_email"))

        if not isinstance(dealers, list):
            raise APIException("Dealers should be in List Format")

        full_name = first_name + ' ' + last_name
        contact_confirm = ContactConfirm().send_email(
            dealers=dealers, make=make, model=model, year=year, recipient_email=receipient_email,
            full_name=full_name, user=user)

        if contact_confirm['status'] == 200:
            return ALResponse(status=contact_confirm['status'], message=contact_confirm['message'], data={}).success()
        else:
            return ALResponse(status=contact_confirm['status'], message=contact_confirm['message'],
                              data={}).server_error()

    def is_user_exists(self, email):
        return Profile.objects.filter(email=email).exists()


class SearchEvoxView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        jato_ids = request.data.get('jato-id', None)

        if not isinstance(jato_ids, list):
            raise APIException("Invalid/Missing Jato Ids. Jato Id should be in Array format only.")
        data = FetchData().get_data(jato_ids)
        return ALResponse(data).success()


class EvoxImagesView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        evox_id = request.data.get('evox-id', None)

        if evox_id is None:
            raise APIException("Invalid evox_id")

        evox_data = Evox().get_color_images(evox_id)
        data = {
            'evox_id': evox_id,
            'urls': evox_data['data']
        }
        if evox_data['status'] == 200:
            return ALResponse(status=evox_data['status'], message=evox_data['message'], data=data).success()
        else:
            return ALResponse(status=evox_data['status'], message=evox_data['message'], data={}).server_error()


class VehicleImagesView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        evox_id = request.data.get('evox-id', None)
        color_code = request.data.get('color-code', None)

        if evox_id is None:
            raise APIException("Invalid evox_id")

        evox_data = Evox().evox_color_images(evox_id, color_code)
        data = {
            'evox_id': evox_id,
            'images': evox_data['data']
        }
        if evox_data['status'] == 200:
            return ALResponse(status=evox_data['status'], message=evox_data['message'], data=data).success()
        else:
            return ALResponse(status=evox_data['status'], message=evox_data['message'], data={}).server_error()


class VehicleColorsView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        evox_id = request.data.get('evox-id', None)

        if evox_id is None:
            raise APIException("Invalid evox_id")

        evox_data = Evox().evox_vehicle_colors(evox_id)
        data = {
            'evox_id': evox_id,
            'colors': evox_data['data']
        }
        if evox_data['status'] == 200:
            return ALResponse(status=evox_data['status'], message=evox_data['message'], data=data).success()
        else:
            return ALResponse(status=evox_data['status'], message=evox_data['message'], data={}).server_error()


class VehicleAllImages(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        evox_id = request.data.get('evox-id', None)

        if evox_id is None:
            raise APIException("Invalid evox_id")

        evox_data = Evox().vehicle_all_images(evox_id)
        data = {
            'evox_id': evox_id,
            'images': evox_data
        }
        if 'urls' in evox_data:
            return ALResponse(status=status.HTTP_200_OK, data=data).success()
        else:
            return ALResponse(status=status.HTTP_400_BAD_REQUEST, data=[], message="BAD Request").success()
        # return ALResponse(status=evox_data['status'], message=evox_data['message'], data={}).server_error()
