import concurrent.futures
import json, requests

from dicttoxml import dicttoxml
from django.core.cache import cache
from django.utils import timezone

from autolife.local_settings import JATO_USERNAME, JATO_PASSWORD, JATO_GRANT_TYPE, JATO_SUBSCRIPTION_KEY, IMAGE_SOURCE
from autolife.settings import BASE_DIR, EVOX_X_API_KEY, EVOX_BASE_URL
from library.cache_store import GetValuesFromCache, SetValuesInCache
from marketplace.models import MappingModel
from marketplace.utility.UNHAGGLE import Unhaggle
from marketplace.utility.marketplace_constants import TEMP_ACCESS_TOKEN
from marketplace.utility.utils import JatoSearchResults, JatoVehicles, JatoVehicleTrims, JatoFeatureByTrim, \
    get_evox_url, updatedJatoId
from random import randint


class JatoAuth(object):
    """
    Authentication from Jato auth
    """

    def __new__(cls, *args, **kwargs):
        # cached_token = get_cache()
        auth_url = "https://auth.jatoflex.com/oauth/token"
        data = {
            "username": JATO_USERNAME,
            "password": JATO_PASSWORD,
            "grant_type": JATO_GRANT_TYPE
        }
        try:
            response = requests.post(auth_url, data=data)
            if response.status_code == 200:
                return json.loads(response.text)
            else:
                return None
        except:
            return None


class JatoAuthenticatedHeader(object):
    """
    returns authenticated header
    """

    # first of all get token from redis-cache
    # if not present in redis-cache then make call to jato server
    # set headers and return the headers
    # if account expired then set temporary token
    # send the status of the token too
    def __new__(cls, force=False, *args, **kwargs):
        headers = GetValuesFromCache().jato_authorised_header()
        if not headers or not force:
            auth = JatoAuth()
            if auth:
                try:
                    headers = {
                        "Authorization": auth['token_type'] + ' ' + auth["access_token"],
                        "Subscription-Key": JATO_SUBSCRIPTION_KEY,
                    }
                except KeyError:
                    headers = {
                        "Authorization": TEMP_ACCESS_TOKEN,
                        "Subscription-Key": JATO_SUBSCRIPTION_KEY,
                    }
            else:
                headers = {
                    "Authorization": TEMP_ACCESS_TOKEN,
                    "Subscription-Key": JATO_SUBSCRIPTION_KEY,
                }
            SetValuesInCache().jato_authorised_header(headers)

        return headers


class JatoTrimByBodyStyle(object):
    """
    Class to show the trims according to body style
    """

    def __init__(self, result_obj):
        self.result_obj = result_obj

    def get_all_trims(self):
        response_obj = {"results": []}
        for record in self.result_obj:
            try:
                body_style_id = record["bodyStyleId"]
                body_style_name = record["bodyStyleName"]
            except KeyError as e:
                body_style_id = None
            data = {
                "vehicle_id": record["vehicleId"],
                "trim_name": record["versionName"]
            }
            if body_style_id:
                if response_obj['results']:
                    for x in response_obj['results']:
                        # In case if body style already presents in the response object
                        if x["body_style_id"] == body_style_id:
                            x['vehicles'].extend([data])
                            status = True
                            break
                        else:
                            status = False
                    if not status:
                        # In case if body style not present in the reesponse project
                        response_obj["results"].extend(
                            [
                                {
                                    "body_style": body_style_name,
                                    "body_style_id": body_style_id,
                                    "vehicles": [data]}
                            ]
                        )
                else:
                    response_obj["results"] = [{
                        "body_style": body_style_name,
                        "body_style_id": body_style_id,
                        "vehicles": [data]}]
            else:
                response_obj["results"].extend(
                    [{"body_style": "", "body_style_id": body_style_id, "vehicles": [data]}])
        return response_obj


class ParseVehicle(object):
    """
    Parsing vehicle object
    """

    def __init__(self, raw_vehicle):
        self.raw_vehicles = raw_vehicle
        self.result = []
        self.base_cdn = 'https://jatona.blob.core.windows.net/pix640'

    def parse(self):
        if isinstance(self.raw_vehicles, list):
            for vehicle in self.raw_vehicles:
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
                    "price": vehicle["msrp"],
                    "transmission": vehicle["transmissionType"],
                    "engine_type": vehicle.get("engine_type"),
                    "horse_power": vehicle.get("horse_power"),
                    "fuel_economy_hwy": vehicle.get("fuel_economy_hwy"),
                    "fuel_economy_city": vehicle.get("fuel_economy_city"),
                    "is_liked": False,
                    "evox_id":vehicle["evox_id"] if "evox_id" in vehicle else None,
                    "color_code":vehicle["photoPath"].split('_')[-1].split('.')[0] if vehicle["photoPath"] and IMAGE_SOURCE=="EVOX" else None
                }
                obj.update(VehicleBasicDetails().price({"vehicle_id": obj["vehicle_id"]}, get_value=True))
                self.result.extend(
                    [
                        obj
                    ]
                )
        else:
            obj = {
                "image_url": self.raw_vehicles["photoPath"],
                "name": self.raw_vehicles["headerDescription"],
                "vehicle_id": self.raw_vehicles["vehicleId"],
                "price": self.raw_vehicles["msrp"],
                "make": self.raw_vehicles["makeName"],
                "model": self.raw_vehicles["modelName"],
                "year": self.raw_vehicles["modelYear"],
                "trim_name": self.raw_vehicles["versionName"],
                "body_style": self.raw_vehicles["bodyStyleName"],
                "body_style_id": self.raw_vehicles["bodyStyleId"],
                "transmission": self.raw_vehicles["transmissionType"],
                "fuel_economy_hwy": self.raw_vehicles.get("fuel_economy_hwy"),
                "fuel_economy_city": self.raw_vehicles.get("fuel_economy_city")
            }
            obj.update(VehicleBasicDetails().price({"vehicle_id": obj["vehicle_id"]}, get_value=True))
            self.result.extend(
                [
                    obj
                ]
            )


class JatoDetails(object):
    """
    JATO Vehicle Details API.
    """

    def __init__(self, params=None):
        self.params = params
        self.status = True
        self.headers = JatoAuthenticatedHeader()  # Picks from cache, if expired will pick from Jato.
        self.base_url = "https://api.jatoflex.com"

    def request(self, url):
        response = requests.get(self.base_url + url, headers=self.headers)

        if response.status_code == 200:
            return json.loads(response.text)
        else:
            # Logging purpose
            fp = open(BASE_DIR + '/jato_access_log.txt', 'a')
            fp.write("response {response} at {time_now} with {status} to {url}\n".format(
                response=response.text,
                time_now=timezone.now(),
                url=self.base_url + url,
                status=response.status_code,
            )
            )
            fp.close()
            return {"results": None}
        # return None

    def vehicle_makes(self, culture="en-ca", retry=False):
        """
        Jato API Used: 03. Makes
        :param culture: by default 'en-ca'
        :param req_type: optional
        :param retry: If token expired, retry will forcefully try to update the token.
        :return: dict_type(make list or )
        """
        data = GetValuesFromCache().shopping_makes()
        if not data:
            url = "/api/%s/makes?page=1&pageSize=100" % culture
            results = self.request(url).get("results")
            if results:
                data = self.get_list(results, "make_list")
                SetValuesInCache().set_shopping_makes(data)
                return data
            else:
                if not retry:
                    self.headers = JatoAuthenticatedHeader(force=True)  # Update forcefully
                    return self.vehicle_makes(retry=True)
                return [{"message": "Data is not available from Jato API"}]
        return data

    def model_by_makes(self, culture="en-ca", make="honda", req_type="get_list", pageSize=50, page=1, retry=False):
        data = GetValuesFromCache().shopping_models(make)
        if not data:
            url = "/api/%s/makes/%s/models?pageSize=%s&page=%s" % (culture, make, str(pageSize), str(page))
            results = self.request(url).get("results")
            if results:
                if req_type == "get_list":
                    data = self.get_list(results, "model_list")
                    SetValuesInCache().set_shopping_models(make, data)
                    return self.get_list(results, "model_list")
            else:
                if not retry:
                    self.headers = JatoAuthenticatedHeader(force=True)  # Update forcefully
                    return self.vehicle_makes(retry=True)
                return {"message": "Data is not available from Jato API"}
        return data

    def search(self, culture="en-ca", model="Accord", year=2000, make="Honda", code_usage=False, postal_code=False):
        """
        API used :
        :param culture:
        :param model:
        :param year:
        :param make:
        :param code_usage:
        :param postal_code:
        :return:
        """
        url = "/api/%s/models/%s/%s/versions" % (culture, model, year)
        try:
            if not code_usage:
                results = self.request(url)["results"]  # search list
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    executor.map(self.update_images, results)
                    executor.map(self.shop_engine, results)

                with concurrent.futures.ThreadPoolExecutor() as executor:
                    executor.map(self.shop_horse_power, results)
                    executor.map(self.shop_price_air_tax, results)
                    if postal_code:
                        executor.map(self.unhaggle_incentives, results, [postal_code for i in range(0, len(results))])
                return JatoSearchResults(results, make=make, model=model, year=year, postal_code=postal_code,
                                         method=self.get_high_res_images)
            else:
                results = self.request(url)["results"]
                return JatoTrimByBodyStyle(results).get_all_trims()
        except Exception as e:
            print(e)
            return []

    def model_by_year(self, culture="en-ca", model="Mustang", year=2018):
        url = "/api/%s/models/%s/%s" % (culture, model, year)
        return self.request(url)["results"]

    def model_by_range(self, culture="en-ca", vehicle_id=63107519960306):
        url = "/api/%s/modelRange/%s" % (culture, vehicle_id)
        return self.request(url)

    def vehicle_details(self, culture="en-ca", vehicle_id=710075420170919):
        url = "/api/%s/vehicle/%s" % (culture, vehicle_id)
        return self.request(url)

    def trim(self, culture="en-ca", make="honda", req_type="get_list"):
        url = "/api/%s/makes/%s/models" % (culture, make)
        results = self.request(url)["results"]
        if req_type == "get_list":
            return self.get_list(results, "trim_list")

    def update_images(self, data, vehicle_id=""):
        if isinstance(data, dict):
            image = self.get_high_res_images(
                vehicle_id=data.get("vehicleId", vehicle_id), front_image=True
            )
            data.update(
                {
                    "izmo": None if not image else image.get("href"),
                    "photoPath": None
                }
            )

    # if not data.get("izmo"):
    # 	image = self.jato_photos(vehicle_id=data["vehicleId"], single=True)
    # 	data["izmo"] = None if not image else image
    # if vehicle_id:
    # 	return image

    def unhaggle_incentives(self, obj, postal_code):
        try:
            un_obj = Unhaggle(params={"uid": obj['uid'], "year": obj["modelYear"], "postal_code": postal_code},
                              check=True)
            # un_obj = Unhaggle(params={"uid":uid, "year": year, "postal_code": postal_code}, check=True)
            obj.update({"incentive": un_obj.check_status})
        except:
            obj.update({"incentive": False})

    def get_list(self, result_object, call="make_list"):
        if call == "make_list":
            return list(set([make["makeName"] for make in result_object if make["isCurrent"]]))
        elif call == "model_list":
            return [model["modelName"].strip().replace(" ", "-").lower() for model in result_object if
                    model["isCurrent"]]
        elif call == "trim_list":
            for body_style in result_object:
                if body_style.get("isCurrent"):
                    return [trim["bodyStyleName"] for trim in body_style["bodyStyles"]]
                else:
                    return []

    def get_vehicle_by_id(self, vehicle_id=61402019990901, culture="en-ca"):
        url = "/api/%s/vehicle/%s" % (culture, str(vehicle_id))
        results = self.request(url)
        if results:
            result = JatoVehicles(results)
            return result
        else:
            return []

    def get_trims(self, model_id=435, culture="en-ca"):
        url = "/api/%s/trimLineup?modelId=%s" % (culture, model_id)
        results = self.request(url)
        if results:
            return JatoVehicleTrims(results)
        else:
            return []

    def get_feature_by_trim(self, model_id=435, trim_name="VX", culture="en-ca"):
        url = "/api/%s/trimLineup?modelId=%s" % (culture, model_id)
        results = self.request(url)
        if results:
            return JatoFeatureByTrim(results, trim_name)
        else:
            return []

    def get_high_res_images(self, vehicle_id=710075420170919, culture="en-ca", front_image=False):
        url = "/api/{culture}/izmoPix/{vehicle_id}".format(culture=culture, vehicle_id=vehicle_id)
        try:
            results = self.request(url)["results"]
            all_images = [None for x in range(12)]
            if not front_image:
                for image in results:
                    obj = {"angle": image["angle"], "images": []}
                    obj["images"].extend([hr_imagr['href'] for hr_imagr in image["links"]])
                    if image.get("angle") == "angularfront":
                        all_images.insert(0, obj)
                    elif image.get("angle") == "angularrear":
                        all_images.insert(2, obj)
                    elif image.get("angle") == "doors":
                        all_images.insert(5, obj)
                    elif image.get("angle") == "rearview":
                        all_images.insert(4, obj)
                    elif image.get("angle") == "trunk":
                        all_images.insert(10, obj)
                    elif image.get("angle") == "sideview":
                        all_images.insert(1, obj)
                    elif image.get("angle") == "headlight":
                        all_images.insert(6, obj)
                    elif image.get("angle") == "grille":
                        all_images.insert(8, obj)
                    elif image.get("angle") == "frontview":
                        all_images.insert(3, obj)
                    elif image.get("angle") == "taillight":
                        all_images.insert(7, obj)
                    elif image.get("angle") == "engine":
                        all_images.insert(12, obj)
                    elif image.get("angle") == "doorhandle":
                        all_images.insert(11, obj)
                    elif image.get("angle") == "mirror":
                        all_images.insert(9, obj)
                    else:
                        all_images.append(obj)
                all_images = [image for image in all_images if image != None]
                return all_images
            else:
                for image in results:
                    if image.get("angle") == "angularfront":
                        return image["links"][0]
        except:
            return []

    def jato_photos(self, culture="en-ca", size=200, vehicle_id=728044920180101, single=False):
        url = "/api/{culture}/images/JATO/{size}/vehicle/{vehicleId}".format(culture=culture, size=size,
                                                                             vehicleId=vehicle_id)
        try:
            res = self.request(url)
            results = res["exteriorPhotos"]
            if single:
                val = None
                for angle in results:
                    if angle["angle"] == "angularfrontleft":
                        for href in angle["links"]:
                            if href["rel"] == "getJpg400":
                                val = href["href"]
                if not val:
                    return ""
                # return "https://sslphotos.jato.com/"+res["defaultPhoto"] if res.get("defaultPhoto") else None
                return val


        except:
            return None if single else []

    def vehicle_specification(self, culture="en-ca", vehicle_id=710075420170919, schema_id=7403):
        url = "/api/{culture}/equipment/{vehicleId}/schemaid/{schemaId}".format(
            culture=culture, vehicleId=vehicle_id, schemaId=schema_id
        )
        results = self.request(url)

        if results and not 'results' in results:
            return results
        else:
            return []

    def similar_vehicle(self, culture="en-ca", vehicle_id=710075420170919, number_of_pages=3):
        url = ["/api/{culture}/similar/{vehicle_id}/competitors?numberOf={number}".format(
            culture=culture,
            vehicle_id=vehicle_id,
            number=number_of_pages)
            ,
            "/api/{culture}/similar/{vehicle_id}/inmodel?numberOf={number}".format(
                culture=culture,
                vehicle_id=vehicle_id,
                number=number_of_pages
            )]
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results_competitors = executor.submit(self.request, url[0])
            results_similar = executor.submit(self.request, url[1])
        results = {}

        if results_competitors.result().get("results"):
            with concurrent.futures.ThreadPoolExecutor() as executor:
                executor.map(self.shop_engine, results_competitors.result()["results"])
                executor.map(self.shop_horse_power, results_competitors.result()["results"])
                executor.map(self.fuel_economy, results_competitors.result()["results"])
                executor.map(self.change_image_url, results_competitors.result()["results"])
            vehicle_obj = ParseVehicle(results_competitors.result()["results"])
            # vehicle_obj.parse()
            results["competitor"] = results_competitors.result()["results"]
        if results_similar.result().get("results"):
            with concurrent.futures.ThreadPoolExecutor() as executor:
                executor.map(self.shop_engine, results_similar.result()["results"])
                executor.map(self.shop_horse_power, results_similar.result()["results"])
                executor.map(self.fuel_economy, results_similar.result()["results"])
                executor.map(self.change_image_url, results_similar.result()["results"])
            vehicle_obj = ParseVehicle(results_similar.result()["results"])
            # vehicle_obj.parse()
            results["similar"] = results_similar.result()["results"]

        return results

    def shop_engine(self, obj, schema_id=7403):
        result = self.vehicle_specification(
            vehicle_id=obj['vehicleId'], schema_id=schema_id
        )
        if result:
            obj["engine_type"] = ""
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                obj["engine_type"] = str(each_spec["value"]) + "(L) "
                                break
                        for each_spec in spec["attributes"]:
                            if 7408 == each_spec["schemaId"]:
                                obj["engine_type"] += str(each_spec["value"]) + " "
                        for each_spec in spec["attributes"]:
                            if 7407 == each_spec["schemaId"]:
                                obj["engine_type"] += str(each_spec["value"])
                    except:
                        obj["engine_type"] = "N/A"

    def shop_horse_power(self, obj, schema_id=15304):
        result = self.vehicle_specification(vehicle_id=obj['vehicleId'], schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                obj["horse_power"] = str(each_spec["value"]) + " hp/PS"
                                return
                    except:
                        obj["horse_power"] = "N/A"
        else:
            obj["horse_power"] = "N/A"

    def shop_price_air_tax(self, obj, schema_id=3517):
        result = self.vehicle_specification(vehicle_id=obj['vehicleId'], schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                obj["air_tax"] = str(each_spec["value"])

                                return
                    except Exception as e:
                        obj["air_tax"] = "N/A"
        else:
            obj["air_tax"] = "N/A"

    def fuel_economy(self, obj, ca="ca", schema_id=42001):
        result = self.vehicle_specification(vehicle_id=obj['vehicleId'], schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if 42003 == each_spec["schemaId"]:
                                obj["fuel_economy_city"] = str(each_spec["value"])
                                pass
                            if 42004 == each_spec["schemaId"]:
                                obj["fuel_economy_hwy"] = str(each_spec["value"])
                                pass
                    except:
                        obj["fuel_economy_city"] = "N/A"
                        obj["fuel_economy_hwy"] = "N/A"
        else:
            obj["fuel_economy_city"] = "N/A"
            obj["fuel_economy_hwy"] = "N/A"

    def change_image_url(self, obj):
        if IMAGE_SOURCE == 'EVOX':
            obj["photoPath"] = None
            if len(str(obj['vehicleId'])) == 15:
                id = str(obj['vehicleId'])[0:7]
                year = str(obj['vehicleId'])[9:11]
                newjatoid = int(id + year)
            else:
                id = str(obj['vehicleId'])[0:6]
                year = str(obj['vehicleId'])[8:10]
                newjatoid = int(id + year)
            try:
                mapobj = MappingModel.objects.get(jid=newjatoid)
            except:
                mapobj = None
            if mapobj:
                evox_id = mapobj.evox_id
                headers = {
                    'x-api-key': EVOX_X_API_KEY
                }

                url = EVOX_BASE_URL + '/vehicles/{evox_id}/products/2/40'.format(
                    evox_id=evox_id)
                result = requests.get(url=url, headers=headers)
                if result.status_code == 200:
                    images = result.json()['urls']
                    obj["photoPath"] = images[randint(0,len(images))]
                    obj["evox_id"] = evox_id

                else:
                    obj["photoPath"] = None
                    obj["evox_id"] = evox_id


            else:
                obj["photoPath"] = None
                obj["evox_id"] =None

        else:
            pass


class VehicleDetails(JatoDetails):
    """
    Details of vehicle by ID
    """

    def __init__(self, vehicle_id, description=False, save=False, meta_info=False):
        super().__init__(vehicle_id)
        self.vehicle_id = vehicle_id
        if not meta_info:  # if want to call single details of the vehicle
            if not save:  # if this call not using in browse section
                self.description = description
                self.save = save
                cached_details = cache.get("vehicle_info")
                if cached_details:
                    if cached_details.get(vehicle_id):
                        self.specs = cached_details.get(vehicle_id)
                        warranty_obj = AutolifeSpecsFromJato(vehicle_id, warranty=True, meta_info=False)
                        self.specs["warranty"] = warranty_obj.warranty
                    else:
                        self.specs = {}
                        self.asynch_call()
                else:
                    self.specs = {}
                    self.asynch_call()
            else:
                self.specs = GetValuesFromCache().vehicle_meta_info(self.vehicle_id)
                self.save = save
                self.description = description
                if not self.specs:
                    self.specs = {}
                    self.meta_info()

    def get_warranty(self):
        warranty_obj = AutolifeSpecsFromJato(self.vehicle_id, warranty=True, meta_info=False)
        self.specs["warranty"] = warranty_obj.warranty

    def asynch_call(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.get_vehicle)

            if not self.save:
                executor.submit(self.get_images)
                executor.submit(self.get_warranty)
            if not self.specs.get("images"):
                self.specs["image_url"] = self.jato_photos(vehicle_id=self.vehicle_id, single=True)
        if not self.save:
            cache.set("vehicle_info", {self.vehicle_id: self.specs})

    def get_vehicle(self, culture="en-ca"):
        url = "/api/{culture}/versions/{vehicle_id}".format(culture=culture, vehicle_id=self.vehicle_id)
        result = self.request(url)
        base_cdn_url = 'https://sslphotos.jato.com/PHOTO300'
        if result:
            self.specs["trim_name"] = result["versionName"]
            self.specs["body_style_id"] = result["bodyStyleId"]
            self.specs["price"] = result["msrp"]
            self.specs["vehicle_id"] = result["vehicleId"]
            self.specs["uid"] = result["uid"]
            self.specs["name"] = result["headerDescription"]
            self.specs["year"] = result["modelYear"]
            self.specs["make"] = result["makeName"]
            self.specs["body_style"] = result["bodyStyleName"]
            self.specs["model"] = result["modelName"]
            self.specs["fuel_economy_city"] = result["fuelEconCity"]
            self.specs["fuel_economy_hwy"] = result["fuelEconHwy"]
            self.specs["transmission"] = result["transmissionType"]
            self.specs["freight"] = result.get("delivery", 0)
            if not self.save:
                self.specs["vehicle_list"] = self.search(
                    model=self.specs["model"].lower().replace(" ", "-"), year=self.specs["year"], code_usage=True
                )
            self.specs["image_url"] = result["photoPath"] if not self.save else base_cdn_url + result["photoPath"]
            if not self.specs.get("make") and not self.specs.get('model'):
                self.specs = None

    def get_vehicle2(self, culture="en-ca"):
        url = "/api/{culture}/versions/{vehicle_id}".format(culture=culture, vehicle_id=self.vehicle_id)
        result = self.request(url)
        return result

    # base_cdn_url = 'https://sslphotos.jato.com/PHOTO300'
    # if result:
    # 	self.specs["trim_name"] = result["versionName"]
    # 	self.specs["body_style_id"] = result["bodyStyleId"]
    # 	self.specs["price"] = result["msrp"]
    # 	self.specs["vehicle_id"] = result["vehicleId"]
    # 	self.specs["uid"] = result["uid"]
    # 	self.specs["name"] = result["headerDescription"]
    # 	self.specs["year"] = result["modelYear"]
    # 	self.specs["make"] = result["makeName"]
    # 	self.specs["body_style"] = result["bodyStyleName"]
    # 	self.specs["model"] = result["modelName"]
    # 	self.specs["fuel_economy_city"] = result["fuelEconCity"]
    # 	self.specs["fuel_economy_hwy"] = result["fuelEconHwy"]
    # 	self.specs["transmission"] = result["transmissionType"]
    # 	self.specs["freight"] = result.get("delivery", 0)
    # 	if not self.save:
    # 		self.specs["vehicle_list"] = self.search(
    # 			model=self.specs["model"].lower().replace(" ", "-"), year=self.specs["year"], code_usage=True
    # 		)
    # 	self.specs["image_url"] = result["photoPath"] if not self.save else base_cdn_url + result["photoPath"]
    # 	if not self.specs.get("make") and not self.specs.get('model'):
    # 		self.specs = None

    def get_images(self):
        self.specs["images"] = self.get_high_res_images(vehicle_id=self.vehicle_id)
        if self.save and self.specs.get("images"):
            self.specs["images"] = self.specs["images"][0]
            self.specs["image_url"] = self.specs["images"][0]["images"][0]

    def meta_info(self):
        try:
            with concurrent.futures.ThreadPoolExecutor() as e:
                e.submit(self.get_vehicle)
                e.submit(self.get_images())
            for image in self.specs["images"]:
                if image["angle"] == "angularfront":
                    self.specs["image_url"] = image["images"][0]
                    break
            if not self.specs.get("images"):
                self.specs["image_url"] = self.jato_photos(vehicle_id=self.vehicle_id, single=True)
            SetValuesInCache().vehicle_meta_info(self.vehicle_id, self.specs)
        except:
            pass


class AutolifeSpecsFromJato(JatoDetails):
    """
    Getting All Specification of vehicles
    """

    def __init__(self, vehicle_id, warranty=None, meta_info=False):
        super().__init__(vehicle_id)
        self.specs = {}
        self.vehicle_id = vehicle_id
        if vehicle_id:
            if not meta_info:
                self.warranty = {}
                if warranty:
                    cached_warranty = cache.get("vehicle_warranty")
                    if cached_warranty:
                        if cached_warranty.get(vehicle_id, None):
                            self.warranty = cached_warranty.get(vehicle_id, None)
                        else:
                            self.warranty_pool_executor()
                    else:
                        self.warranty_pool_executor()
                else:
                    self.specs = {
                        "engine_type": "",
                        "horse_power": "",
                        "torque": "",
                        "rpm_for_torque": "",
                        "speed": "",
                        "cargo_or_seating": "",
                        "fuel_type": "",
                        "height": "",
                        "width": "",
                        "length": "",
                        "vehicle_id": self.vehicle_id
                    }
                    if cache.get(vehicle_id, None):
                        self.specs = cache.get(vehicle_id)
                    else:
                        self.status = True
                        self.get_vehicle()
            else:
                self.specs = {}
                self.pool_executer()

    def engine(self, schema_id=7403, get_value=False, vehicle_id=None):
        result = self.vehicle_specification(
            vehicle_id=self.vehicle_id if not vehicle_id else vehicle_id, schema_id=schema_id
        )
        if result:
            self.specs["engine_type"] = ""
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["engine_type"] = str(each_spec["value"]) + "(L) "
                                break
                        for each_spec in spec["attributes"]:
                            if 7408 == each_spec["schemaId"]:
                                self.specs["engine_type"] += str(each_spec["value"]) + " "
                        for each_spec in spec["attributes"]:
                            if 7407 == each_spec["schemaId"]:
                                self.specs["engine_type"] += str(each_spec["value"])

                    except:
                        pass
            if self.specs.get("engine_type") and get_value:
                return {"engine_type": self.specs["engine_type"]}
            else:
                return None

    def price_freight(self, schema_id=3603, get_value=False, vehicle_id=None):
        vehicle_id = self.vehicle_id if self.vehicle_id else vehicle_id
        result = self.vehicle_specification(vehicle_id=vehicle_id, schema_id=schema_id)
        val = 0
        if not result:
            return {"freight": "NA"}

        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                val = each_spec["value"]
                                break
                    except Exception as e:
                        pass
        if get_value:
            return {"freight": val}

    # def msrp(self, schema_id=902, get_value=False, vehicle_id=None):
    # 	vehicle_id = self.vehicle_id if self.vehicle_id else vehicle_id
    # 	result = self.vehicle_specification(vehicle_id=vehicle_id, schema_id=schema_id)
    # 	val = 0
    # 	if not result:
    # 		return {"price": "NA"}
    #
    #
    #
    # 	if result:
    # 		for each_result in result:
    # 			if schema_id == each_result.get("schemaId"):
    # 				try:
    # 					val =each_result["value"]
    # 					self.specs["price"] = val
    # 				except:
    # 					pass
    # 				break
    # 	if get_value:
    # 		return {"price": val}
    def msrp(self, schema_id=902, get_value=False, vehicle_id=None):
        vehicle_id = self.vehicle_id if self.vehicle_id else vehicle_id
        result = self.vehicle_specification(vehicle_id=vehicle_id, schema_id=schema_id)
        val = 0
        if not result:
            #############STARTS########################
            # When schema_id function didn't get PRICE, below function will execute other request to vehicle to get PRICE
            from threading import Thread
            class getVehicleMSRP(Thread):
                def request(self, url):
                    response = requests.get("https://api.jatoflex.com" + url, headers=JatoAuthenticatedHeader())
                    if response.status_code == 200:
                        return json.loads(response.text)
                    else:
                        # Logging purpose
                        fp = open(BASE_DIR + '/jato_access_log.txt', 'a')
                        fp.write("response {response} at {time_now} with {status} to {url}\n".format(
                            response=response.text,
                            time_now=timezone.now(),
                            url="https://api.jatoflex.com" + url,
                            status=response.status_code,
                        )
                        )
                        fp.close()
                        return {"results": None}

                def run(self):
                    url = "/api/{culture}/vehicle/{vehicle_id}".format(culture='en-ca', vehicle_id=vehicle_id)
                    result = self.request(url)
                    newPrice = str(result['msrp']) if not 'results' in result else 'NA'
                    return newPrice

            a = getVehicleMSRP().run()
            return {'price': a}
        # return {'price': 'NA'}
        #############END########################

        if result:
            for each_result in result:
                if schema_id == each_result.get("schemaId"):
                    try:
                        val = each_result["value"]
                        self.specs["price"] = val
                    except:
                        pass
                    break
        if get_value:
            return {"price": val}

    def price_air_tax(self, schema_id=3517, get_value=False, vehicle_id=None):
        vehicle_id = self.vehicle_id if self.vehicle_id else vehicle_id
        result = self.vehicle_specification(vehicle_id=vehicle_id, schema_id=schema_id)
        val = 0
        if not result:
            return {"air_tax": "NA"}

        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                val = str(each_spec["value"])
                                self.specs["air_tax"] = val
                                break
                    except Exception as e:
                        pass
        if get_value:
            return {"air_tax": val}

    def horse_power(self, schema_id=15304, get_value=False):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["horse_power"] = str(each_spec["value"]) + " hp/PS"
                                break
                        for each_spec in spec["attributes"]:
                            if 15306 == each_spec["schemaId"]:
                                self.specs["torque"] = str(each_spec["value"]) + " Nm"
                                break
                        for each_spec in spec["attributes"]:
                            if 15308 == each_spec["schemaId"]:
                                self.specs["rpm_for_torque"] = str(each_spec["value"]) + " rpm"
                                break
                    except:
                        pass
            if self.specs.get("horse_power") and get_value:
                return {"horse_power": self.specs["horse_power"]}
            else:
                return None

    def speed(self, schema_id=20603):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["speed"] = each_spec["value"]
                                break
                    except:
                        pass

    def cargo_or_seating(self, schema_id=6005):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["cargo_or_seating"] = str(each_spec["value"]) + " L"
                                break
                    except:
                        pass

    def seating_capacity(self, schema_id=702):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        self.specs["seating_capacity"] = ""
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["seating_capacity"] = each_spec["value"]
                                break
                    except:
                        pass

    def fuel_type(self, schema_id=8702):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["fuel_type"] = each_spec["value"]
                                break
                    except:
                        pass

    def dimensions(self, schema_id=5802):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["length"] = str(each_spec["value"])
                                break
                        for each_spec in spec["attributes"]:
                            if 5802 == each_spec["schemaId"]:
                                self.specs["overall_length"] = str(each_spec["value"])
                        for each_spec in spec["attributes"]:
                            if 5803 == each_spec["schemaId"]:
                                self.specs["width"] = str(each_spec["value"])
                        for each_spec in spec["attributes"]:
                            if 5804 == each_spec["schemaId"]:
                                self.specs["height"] = str(each_spec["value"])
                        for each_spec in spec["attributes"]:
                            if 5806 == each_spec["schemaId"]:
                                self.specs["wheel_base"] = str(each_spec["value"])

                    except:
                        pass

    def curb_weight(self, schema_id=24103):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["curb_weight"] = str(each_spec["value"]) + " kgs"
                                break
                    except KeyError as e:
                        self.specs["curb_weight"] = ""

    def transmission(self, schema_id=20602):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            self.specs["transmission"] = ""
            self.specs["speed"] = ""
            for spec in result:
                if not self.specs["transmission"] or not self.specs["speed"]:
                    if isinstance(spec, dict):
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["transmission"] = str(each_spec["value"])
                                break
                        for each_spec in spec["attributes"]:
                            if 20603 == each_spec["schemaId"]:
                                self.specs["speed"] = str(each_spec["value"])
                                break
                else:
                    break

    def navigation(self, schema_id=25202):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["navigation"] = each_spec["value"]
                                break
                    except KeyError as e:
                        self.specs["navigation"] = ""

    def satellite_radio(self, schema_id=1330):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["satellite_radio"] = each_spec["value"]
                                break
                    except KeyError as e:
                        self.specs["satellite_radio"] = ""

    def collision_warning_system(self, schema_id=44101):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                self.specs["collision_warning_system"] = each_spec["value"]
                                break
                    except KeyError as e:
                        self.specs["collision_warning_system"] = ""

    def get_warranty(self, schema_id=23502):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                val1 = str(each_spec["value"])
                                val2 = ""
                                break
                        for each_spec in spec["attributes"]:
                            if each_spec["schemaId"] == 23503:
                                val2 = str(each_spec["value"])
                                if val2.isdigit():
                                    if int(val2) >= 999999:
                                        val2 = "unlimited"
                                break
                        self.warranty["warranty"] = val1 + "/" + val2 if val1 or val2 else None
                    except KeyError as e:
                        self.warranty["warranty"] = ""

    def warranty_powertrain(self, schema_id=23602):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                val1 = str(each_spec["value"])
                                val2 = ""
                        for each_spec in spec["attributes"]:
                            if each_spec["schemaId"] == 23603:
                                val2 = str(each_spec["value"])
                                if val2.isdigit():
                                    if int(val2) >= 999999:
                                        val2 = "unlimited"
                                break
                        self.warranty["warranty_powertrain"] = val1 + "/" + val2 if val1 or val2 else None
                    except KeyError as e:
                        self.warranty["warranty_powertrain"] = ""

    def warranty_anti_corrosion(self, schema_id=23702):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                val1 = str(each_spec["value"])
                                val2 = ""
                        for each_spec in spec["attributes"]:
                            if each_spec["schemaId"] == 23703:
                                val2 = str(each_spec["value"])
                                if val2.isdigit():
                                    if int(val2) >= 999999:
                                        val2 = "unlimited"
                                break
                        self.warranty["warranty_anti_corrosion"] = val1 + "/" + val2 if val2 else val1 + "/Unlimited"

                    except KeyError as e:
                        self.warranty["warranty_anti_corrosion"] = ""

    def roadside_assistance(self, schema_id=24002):
        result = self.vehicle_specification(vehicle_id=self.vehicle_id, schema_id=schema_id)
        if result:
            for spec in result:
                if isinstance(spec, dict):
                    try:
                        for each_spec in spec["attributes"]:
                            if schema_id == each_spec["schemaId"]:
                                val1 = str(each_spec["value"])
                                val2 = ""
                        for each_spec in spec["attributes"]:
                            if each_spec["schemaId"] == 24003:
                                val2 = str(each_spec["value"])
                                if val2.isdigit():
                                    if int(val2) >= 999999:
                                        val2 = "unlimited"
                                break
                        self.warranty["roadside_assistance"] = val1 + "/" + val2 if val2 else val1 + "/Unlimited"
                    except KeyError as e:
                        self.warranty["roadside_assistance"] = ""

    def get_vehicle(self, culture="en-ca"):
        url = "/api/{culture}/vehicle/{vehicle_id}".format(culture=culture, vehicle_id=self.vehicle_id)
        result = self.request(url)
        if result:
            self.specs["trim_name"] = result["versionName"]
            self.specs["year"] = result["modelYear"]
            self.specs["model"] = result["modelName"]
            self.specs["fuel_economy_city"] = result["fuelEconCity"]
            self.specs["fuel_economy_hwy"] = result["fuelEconHwy"]
            self.specs["drive"] = result["drivenWheels"]

    def pool_executer(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.engine)
            executor.submit(self.price_freight)
            executor.submit(self.price_air_tax)
            executor.submit(self.horse_power)
            executor.submit(self.speed)
            executor.submit(self.cargo_or_seating)
            executor.submit(self.fuel_type)
            executor.submit(self.dimensions)
            executor.submit(self.curb_weight)
            executor.submit(self.navigation)
            executor.submit(self.satellite_radio)
            executor.submit(self.collision_warning_system)
            executor.submit(self.transmission)
            executor.submit(self.get_vehicle)
            executor.submit(self.seating_capacity)
        cache.set(self.vehicle_id, self.specs)

    # VehicleCache.objects.get_or_create(parameter_one=self.vehicle_id, data=self.specs)

    def warranty_pool_executor(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.get_warranty)
            executor.submit(self.warranty_powertrain)
            executor.submit(self.warranty_anti_corrosion)
            executor.submit(self.roadside_assistance)
            executor.submit(self.price_air_tax)
            executor.submit(self.price_freight)
        cache.set("vehicle_warranty", {self.vehicle_id: self.warranty})

    def price_breakdown(self, vehicle_id, get_val=True):
        obj = {}
        with concurrent.futures.ThreadPoolExecutor() as executor:
            air_tax = executor.submit(self.price_air_tax, vehicle_id=vehicle_id, get_value=True)
            freight = executor.submit(self.price_freight, vehicle_id=vehicle_id, get_value=True)
            msrp = executor.submit(self.msrp, vehicle_id=vehicle_id, get_value=True)
        if get_val:
            obj.update(air_tax.result())
            obj.update(freight.result())
            obj.update(msrp.result())
            return obj


class GetSCILead(object):
    """
    SCI Lead for
    """

    def __new__(cls, payload, *args, **kwargs):
        headers = {
            "content-type": "text/xml"
        }
        requests.post(dicttoxml(payload))


class VehicleBasicDetails(AutolifeSpecsFromJato):
    """
    JATO Price breakdown
    """

    def __init__(self):
        super().__init__(None)

    def price(self, param_vehicle, get_value=False):
        if isinstance(param_vehicle, list):
            for vehicle in param_vehicle:
                self.price_breakdown(vehicle.get("source_id", vehicle.get("vehicle_id", None)))
                vehicle.update({
                    "freight": self.specs.get("freight", 0),
                    "air_tax": self.specs.get("air_tax", 0),
                    "price": self.specs.get("price", 0) if not vehicle.get("price") else vehicle.get("price"),
                })
                self.specs = {}
        elif isinstance(param_vehicle, (str, int)):
            self.price_breakdown(param_vehicle)  # Not list though either char or string
            return (self.specs.get("freight", 0), self.specs.get("air_tax", 0), self.specs.get("price", 0))

        else:
            obj = self.price_breakdown(param_vehicle.get(
                "source_id", param_vehicle.get("vehicle_id", None)
            ), get_val=True)
            if param_vehicle.get("price"):
                obj.update({"price": param_vehicle.get("price")})
            else:
                param_vehicle.update(obj)
        if get_value:
            return param_vehicle

    def price_and_images(self, vehicle_list):
        if isinstance(vehicle_list, list):
            for vehicle in vehicle_list:
                self.price_breakdown(vehicle["source_id"])
                img = self.get_high_res_images(vehicle["source_id"], front_image=True)
                vehicle.update({
                    "freight": self.specs.get("freight", 0),
                    "air_tax": self.specs.get("air_tax", 0),
                    "high_res_image": img
                })
        else:
            self.price_breakdown(vehicle_list["source_id"])
            img = self.get_high_res_images(vehicle_list["source_id"], front_image=True)
            vehicle_list.update({
                "freight": self.specs.get("freight", 0),
                "air_tax": self.specs.get("air_tax", 0),
                "high_res_image": img
            })
