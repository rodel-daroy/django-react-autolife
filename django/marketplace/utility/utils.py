"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

# from marketplace.utility.JATO import AutolifeSpecsFromJato
import concurrent.futures

import requests
from django.conf import settings

from autolife.settings import EVOX_X_API_KEY, EVOX_BASE_URL
from library.al_lib import SendMail, SendMailWithTemplate
from library.cache_store import SetValuesInCache
from marketplace.models import MappingModel
from marketplace.utility.UNHAGGLE import Unhaggle
from django.template import Context
from django.template.loader import get_template

# from users.models import Profile


class ParseResults(object):
    """
    Parses full search results
    """

    def parse(self, result):
        if isinstance(result, list):
            pass
        elif isinstance(result, dict):
            pass


class JatoSearchResults(object):
    """
    This API returns the Search results into parsed form
    """

    def __new__(cls, results, *args, **kwargs):
        response_obj = {
            "make": kwargs["make"],
            "model": kwargs["model"],
            "year": kwargs["year"],
            "results": [],  # {'trim': 'sedan', 'vehicles': []}
            "postal_code": kwargs["postal_code"]
        }
        base_cdn_url = 'https://sslphotos.jato.com/PHOTO300'
        for record in results:
            try:
                body_style_id = record["bodyStyleId"]
                body_style_name = record["bodyStyleName"]
            except KeyError as e:
                body_style_id = None
            # if record["isCurrent"]:
            data = {
                "image_url": record["photoPath"],
                "izmo": record.get("izmo"),
                "name": record["headerDescription"],
                "vehicle_id": record["vehicleId"],
                "price": record["msrp"],
                "model_id": record["modelId"],
                "trim_name": record["versionName"],
                "make": record["makeName"],
                "model": record["modelName"],
                "transmission": record["transmissionType"],
                "fuel_economy_city": record["fuelEconCity"],
                "fuel_economy_hwy": record["fuelEconHwy"],
                "uid": record["uid"],
                "year": record["modelYear"],
                "freight": str(record.get("delivery")),
                "engine_type": record.get("engine_type"),
                "horse_power": record.get("horse_power"),
                "air_tax": record.get("air_tax"),
                "incentive": record.get("incentive", False),
            }
            # if kwargs["postal_code"]:
            # 	data["incentive"] = cls.incentives(cls, {"uid": record["uid"], "year": record["modelYear"], "postal_code": kwargs["postal_code"]})
            # else:
            # 	data["incentive"] = False
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
                response_obj["results"].extend([{"body_style": "", "body_style_id": body_style_id, "vehicles": [data]}])
        return response_obj

    def incentives(self, record):
        try:
            un_obj = Unhaggle(
                params={"uid": record["uid"], "year": record["year"], "postal_code": record['postal_code']}, check=True)
            return un_obj.check_status
        except:
            return False


class JatoVehicles(object):
    """
    Parsing jato vehicles
    """

    def __new__(cls, result, *args, **kwargs):
        base_cdn_url = 'https://sslphotos.jato.com/PHOTO300'
        return {
            "name": result["headerDescription"],
            "year": ''.join(result["modelYear"]),
            "model": result["modelName"],
            "trim": result["trimName"],
            "version": result["versionName"],
            "fuel_economy_highway": result["fuelEconHwy"],
            "fuel_economy_city": result["fuelEconCity"],
            "image_url": base_cdn_url + result["photoPath"],
            "body_style": result["bodyStyleName"],
            "overview": result["modelOverview"],
            "price": result["msrp"],
            "transmission": result["transmissionType"],
            "driven_wheels": result["drivenWheels"],
            "doors": result["numberOfDoors"],
            "is_current": result["isCurrent"],
            "freight": result["delivery"],
        }


class JatoVehicleTrims(object):
    """
    Jato Trims with specifications
    """

    def __new__(cls, result_obj, *args, **kwargs):
        all_trims = []
        trim_with_feature = []
        for trim in result_obj:
            if trim not in all_trims:
                all_trims.append(trim["name"])
                trim_obj = {"trim_name": trim["name"], "specifications": [], "price": trim["msrp"]}
                for feature in trim["mainFeatures"][:20]:
                    if ":" not in feature:
                        trim_obj["specifications"].extend([{feature: True}])
                    else:
                        splitted_value = feature.split(":")
                        trim_obj["specifications"].extend([{splitted_value[0]: splitted_value[1]}])
                trim_with_feature.extend([trim_obj])
        return {"all_trims": all_trims, "trims_with_feature": trim_with_feature}


class JatoFeatureByTrim(object):

    def __new__(cls, result_obj, trim_name, *args, **kwargs):
        for trim in result_obj:
            if trim_name == trim["name"]:
                trim_obj = {"trim_name": trim["name"], "specifications": [], "price": trim["msrp"]}
                for feature in trim["mainFeatures"][:20]:
                    if ":" not in feature:
                        trim_obj["specifications"].extend([{feature: True}])
                    else:
                        splitted_value = feature.split(":")
                        trim_obj["specifications"].extend([{splitted_value[0]: splitted_value[1]}])
                return trim_obj
            else:
                trim_obj = {}
        return trim_obj


class SpecificationBySchemaIdParser(object):

    def __init__(self, result):
        self.result = result
        self.full_specifications = {}

    def parse(self):
        pass


class CheckSavedCars(object):

    def __new__(cls, all_saved_cars, data, *args, **kwargs):
        for cars in data.get('results'):
            for each_car in cars["vehicles"]:
                if str(each_car["vehicle_id"]) in all_saved_cars:
                    each_car.update({"is_liked": True})
                else:
                    each_car.update({"is_liked": False})
        return data


class ContactConfirm(object):

    def send_email(self, year, make, model, recipient_email, dealers, full_name, user):
        subject = 'We\'ll be in touch soon'
        message = '''
		Thank you for your interest the {year}, {make}, {model}.
		A dealer representative will be in touch with you shortly
		'''.format(year=year, make=make, model=model)
        registration_url = settings.BASE_URL + '/softregistration'
        context = {'year': year, 'make': make, 'model': model,
                   'user': user, 'dealers': dealers, 'full_name': full_name,
                   'registration_url': registration_url}
        htmly = get_template('email/contact_confirmation2.html').render(context)

        html_content = htmly

        return SendMailWithTemplate(
            recipient_list=[recipient_email], subject=subject, message=message, html_message=html_content).send()


class Evox(object):

	def __init__(self):
		self.headers = {
			'x-api-key': settings.EVOX_X_API_KEY
		}
		self.base2 = settings.EVOX_BASE_URL

	def get_color_images(self, evox_id):
		url =  settings.EVOX_BASE_URL+'/vehicles/{evox_id}/products/23/172'.format(evox_id=evox_id)
		print("url =",url)
		data = requests.get(url=url, headers=self.headers)
		return self.organize_images_data(data)

	@staticmethod
	def organize_images_data(data):
		status = data.status_code
		response = data.json()
		return {'status': status,'data': response['urls'], 'message': response['status']}


	def evox_color_images(self, evox_id, color_code):
		url = settings.EVOX_BASE_URL+ '/vehicles/{evox_id}/products/2/?typeId=42+43+44'.format(evox_id =evox_id)
		data = requests.get(url=url, headers=self.headers)
		return self.organize_evox_images(data, color_code)

	@staticmethod
	def organize_evox_images(data, color_code):
		status = data.status_code
		response = data.json()
		resources = response['data']['resources']
		data = []
		for each in resources:
			data += list(each.values())[0]

		info = [word for word in data if word.find(color_code) > 0]

		return {'status': status, 'data': info, 'message': "OK"}


	def evox_vehicle_colors(self, evox_id):
		url = self.base2 + '/vehicles/{evox_id}/colors'.format(evox_id=evox_id)
		data = requests.get(url=url, headers=self.headers)
		return self.organize_vehicle_colors(data)


	@staticmethod
	def organize_vehicle_colors(data):
		status = data.status_code
		response = data.json()
		colors = response['data']['colors']
		data = []
		for each in colors:
			ss={}
			ss['code']=each['code']
			ss['title']=each['title']
			ss['rgb1']=each['rgb1']
			ss['simpletitle']=each['simpletitle']
			data.append(ss)

		return {'status': status, 'data': data, 'message': "OK"}



	def vehicle_all_images(self,evox_id):
		res =requests.get(
			url=self.base2 + "/vehicles/" + str(evox_id) + "/products/23/172",

			headers = self.headers
		)
		if res.status_code==200:
			data =res.json()
		else:
			data ={"Message":"BAD REQUEST"}
		return data



def updatedJatoIdWithYear(jato_ids):
    jato_id_year = []
    for ids in jato_ids:
        if len(str(ids)) == 15:
            id = str(ids)[0:7]
            year = str(ids)[9:11]
            new_jato_id = int(id + year)
            jato_id_year.append(new_jato_id)
        else:
            id = str(ids)[0:6]
            year = str(ids)[8:10]
            new_jato_id = int(id + year)
            jato_id_year.append(new_jato_id)
    return jato_id_year


def updatedJatoId(jato_id):
    if len(str(jato_id)) == 15:
        id = str(jato_id)[0:7]
        year = str(jato_id)[9:11]
        new_jato_id = int(id + year)
        return new_jato_id
    else:
        id = str(jato_id)[0:6]
        year = str(jato_id)[8:10]
        new_jato_id = int(id + year)
        return new_jato_id


from random import random, randint


def get_evox_url(jato_id):
    newjatoid = updatedJatoId(jato_id)
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
            return images
    else:
        return None
