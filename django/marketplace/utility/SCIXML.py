"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import concurrent.futures
import json
from math import radians, sin, atan2, sqrt, cos

import requests
from django.utils import timezone

from library.al_lib import XMLTODict, Request
from library.constants import SCI_GET_DEALER
from marketplace.utility.marketplace_constants import SCI_LEAD_URL, SCI_DEALER_XML, PARTNER_TOKEN, \
	SCI_ADF_XML, TORONTO_LAT, TORONTO_LONG
from regions.utility.utils import MapCoordinatesWithPostalCode


class SCIPayload(object):
	def __new__(cls, data, *args, **kwargs):
		all_payloads = []
		obj = {}
		obj["first_name"] = data.get("first_name")
		obj["last_name"] = data.get("last_name")
		obj["email"] = data.get("email")
		obj["contact_num"] = data.get("contact_num")
		obj["city"] = data.get("city")
		obj["postal_code"] = data.get("postal_code")
		obj["year"] = data.get("year")
		obj["make"] = data.get("make")
		obj["model"] = data.get("model")
		obj["trim"] = data.get("trim")
		obj["price"] = data.get("price")
		obj["body_stye"] = data.get("body_style")
		obj["vehicle_id"] = data.get("vehicle_id")
		try:
			for dealer in data["dealer_details"]:
				obj["dealer_name"]= dealer["dealer_name"]
				obj["dealer_id"]= dealer["dealer_id"]
				obj["division"]= dealer["division"]
				obj["dealer_address"]= dealer["address"]
				obj["dealer_postal_code"]= dealer["postal_code"]
				obj["dealer_city"]= dealer["city"]
				obj["dealer_state_code"]=dealer["state_code"]
				obj["dealer_phone"]=dealer.get("phone")
				obj["dealer_state"] = dealer["state"]
				obj["country"] = dealer["country"]
				all_payloads.append(obj)
		except KeyError:
			pass

		return all_payloads


class SCIXML(object):
	"""
	formats all details and sends
	"""
	def __new__(cls, payload, *args, **kwargs):
		headers = {
			"Content-type": "text/xml;charset=UTF-8",
			"Accept-Encoding": "gzip,deflate",
			"Connection": "Keep-Alive"
		}
		# rendered_xml = SCI_LEAD_XML.format(
		rendered_xml = SCI_ADF_XML.format(
			year = payload.get("year"),
			make = payload.get("make"),
			model = payload.get("model"),
			trim = payload.get("trim"),
			price = payload.get("price"),
			body_style = payload.get("body_style"),
			vehicle_id = payload.get("vehicle_id"),
			first_name = payload.get("first_name"),
			last_name = payload.get("last_name"),
			email = payload.get("email"),
			mobile_num = payload.get("contact_num"),
			city = payload.get("city"),
			postal_code = payload.get("postal_code"),
			dealer_name = payload.get("dealer_name"),     # for production
			# dealer_name = "AutoLife",   # testing
			dealer_id = payload.get("dealer_id"),
			division = payload.get("division"),
			request_date = str(timezone.datetime.now()),
			received_date = str(timezone.datetime.now()),
			country = payload.get("country", "Canada"),
			dealer_phone= payload.get("dealer_phone"),
			dealer_city = payload.get("dealer_city"),
			dealer_state = payload.get("dealer_state"),
			dealer_state_code = payload.get("dealer_state_code"),
			dealer_postal_code = payload.get("dealer_postal_code"),  # for production
			# dealer_postal_code = 'M5V2Y2',  # for testing
			dealer_address = payload.get("dealer_address"),
		)
		response = requests.post(SCI_LEAD_URL, headers=headers, data=rendered_xml)
		return XMLTODict(response.text)


class GetDealersFromSCI(object):
	"""
	Getting results from sci api
	"""
	def __init__(self, params={}):
		self.params = params
		self.radius = "50"
		self.headers = {
			"content-type": "text/xml;charset=UTF-8",
			"Accept-Encoding":"gzip,deflate",
			"SOAPAction": "http://tempuri.org/IDealerExternal/SearchDealerByDealerGroup",
			"Host": "api.scimarketview.com",
			"Connection": "Keep-Alive"
		}
		self.response = []
		self.status = False
		self.dealer_list = []

	def get_dealer(self, radius=50):
		self.radius = radius
		if self.params.get("postal_code"):
			xml_data = SCI_DEALER_XML.format(
				partner_token = PARTNER_TOKEN,
				postal_code = self.params.get("postal_code").strip().replace(" ", ""),
				search_radius = radius,
				division = self.params.get("division", "Dodge").title(),
				dealer_group = "Auto Life",
			)
			self.response = Request(SCI_GET_DEALER, method="post", headers=self.headers, data=xml_data).text
			self.response = XMLTODict(
				self.response
			)
			try:
				self.response = self.response["s:Envelope"]["s:Body"]["SearchDealerByDealerGroupResponse"]["SearchDealerByDealerGroupResult"]["a:DealerList"]
				self.status = True
			except KeyError:
				self.response = self.get_dealer()
				self.response = self.response
			self.parse_response()
		else:
			self.dealer_list = {"status": 404, "message": "No Dealer Found", "radius": self.radius}

	def distance_between_lat_lng(self, lat, lng, lat1, lng1):
		R = 6373.0

		lat1 = radians(lat)
		lon1 = radians(lng)
		lat2 = radians(lat1)
		lon2 = radians(lng1)
		dlon = lon2 - lon1
		dlat = lat2 - lat1
		a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
		c = 2 * atan2(sqrt(a), sqrt(1 - a))
		distance = R * c
		return distance

	def parse_response(self):
		if self.status:
			try:
				for dealer in self.response["a:Dealer"]:
					try:
						dealer_contact = dealer["a:DealerContactList"]
						distance_from_origin = dealer.get('a:DistanceFromOrigin')
						obj = {
							"dealer_id": dealer["a:DealerID"],
							"dealer_name": dealer["a:DealerName"],
							"dealer_status": dealer["a:DealerStatus"],
							"phone": dealer["a:Phone"],
							"distance": distance_from_origin
						}
						if isinstance(dealer.get("a:Address"), dict):
							obj["latitude"] = dealer["a:Address"]["a:Zip"]["a:Latitude"]
							obj["longitude"] = dealer["a:Address"]["a:Zip"]["a:Longitude"]
						try:
							if isinstance(dealer_contact.get("a:Contact"), list):
								for details in dealer_contact.get("a:Contact"):
									try:
										if not isinstance(details.get("a:AddressLine1"), dict):
											obj["address"]= details["a:AddressLine1"]
											obj["city"] = details["a:City"]
											obj["postal_code"]= details["a:PostCode"]
											obj["state"]= details["a:State"]
											obj["state_code"]= details["a:StateCode"]
											obj["first_name"]= details["a:FirstName"]
											obj["last_name"]= details["a:LastName"]
											obj["country"]= details["a:Country"]
										if isinstance(details.get("a:Email"), str):
											obj["email"]= details["a:Email"]
										if isinstance(details.get("a:Website"), str):
											obj["website"] = details["a:Website"]
									except AttributeError as e:
										pass
							elif isinstance(dealer_contact.get("a:Contact"), dict):
								details = dealer_contact.get("a:Contact")
								obj["address"] = details["a:AddressLine1"]
								obj["city"] = details["a:City"]
								obj["postal_code"] = details["a:PostCode"]
								obj["state"] = details["a:State"]
								obj["state_code"] = details["a:StateCode"]
								obj["first_name"] = details["a:FirstName"]
								obj["last_name"] = details["a:LastName"]
								obj["country"] = details["a:Country"]
								obj["dealer_name"] = details["a:DealerName"],
								if isinstance(details.get("a:Email"), str):
									obj["email"] = details["a:Email"]
								if isinstance(details.get("a:Website"), str):
									obj["website"] = details["a:Website"]


							obj["division"] = ""
							try:
								if isinstance(dealer.get("a:Division").get("b:string"), list):
									for division in dealer["a:Division"]["b:string"]:
										obj["division"] += division + ", "
									self.dealer_list.append(obj)
								else:
									obj["division"] = dealer.get("a:Division").get("b:string")
									self.dealer_list.append(obj)
							except AttributeError as e:
								pass
						except:
							pass

					except TypeError as e:
						if self.dealer_list:
							pass
						else:
							self.dealer_list = {"status": 404, "message": "No Dealer Found", "radius": self.radius}
							break
				# self.dealer_list = sorted(self.dealer_list, key = lambda i: i['distance'])

			except (AttributeError, TypeError):
				self.dealer_list = {"status": 404, "message": "No Dealer avalable for this postal code", "radius": self.radius}
		else:
			self.dealer_list = {"status": 404, "message": "No Dealer Found", "radius": self.radius}


class SCIThread(object):

	def __new__(cls, payload_list, *args, **kwargs):
		response = []
		with concurrent.futures.ThreadPoolExecutor() as executor:
			results = executor.map(SCIXML, payload_list)
		for result in results:
			print(result)
			try:
				response.append(
					{
						"status":result.get("adfresponse").get("adfstatus").get("#text"),
						"tracking_id": result.get("adfresponse").get("prospectstatus").get("@trackingid")
					}
				)
			except:
				response.append({"status": "Error", "transaction_id": None})
		return response