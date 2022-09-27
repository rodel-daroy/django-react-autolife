"""
This file handles the CBB API calls and provide relevant information according to the request
from the frontend.
"""
import json, xmltodict

import requests
from django.utils import timezone

from autolife.settings import base_url2
from library.al_lib import XMLTODict, Request
from regions.utility.region_constants import  REGION_WITH_POSTAL_CODE_PREFIX

CBB_CONSTANTS = {
	"account": "example3",
	"key": "InternalDevelopQAS3",
	"schema_version": "3.0",
	"years": "years",
	"makes": "makes",
	"models": "models",
	"trims": "trims"

}


class CBB(object):
	"""
	This class will make requests to the CBB source,
	and will return appropriate response
	"""
	def __init__(self, params=None):
		self.year = params["year"]
		self.make = params["make"]
		self.model = params["model"]

	def request(self, url, method=None):
		if method == 'GET':
			return requests.get(url).text
		elif method == 'POST':
			return requests.post(url).text
		else:
			return requests.get(url).text

	@property
	def years(self):
		"""
		Fetching years list from CBB source
		:return: list of years
		"""
		url = "http://xml.canadianblackbook.com/XMLWebServices/service?command=%s&account=%s&key=%s&schemaVersion=%s" % (
			CBB_CONSTANTS["years"], CBB_CONSTANTS["account"], CBB_CONSTANTS["key"], CBB_CONSTANTS["schema_version"]
		)
		# try and except code will go here:
		return dict(XMLTODict(self.request(url)))["cbb"]["response"]["years"]

	@property
	def makes(self):
		"""
		Fetching make list from CBB Source
		:return: list of makes
		"""
		if self.year:
			url = "http://xml.canadianblackbook.com/XMLWebServices/service?command=%s&year=%s&account=%s&key=%s&schemaVersion=%s" % (
				CBB_CONSTANTS["makes"], self.year, CBB_CONSTANTS["account"], CBB_CONSTANTS["key"],
				CBB_CONSTANTS["schema_version"]
			)
			try:
				return dict(XMLTODict(self.request(url)))["cbb"]["response"]["makes"]
			except KeyError as e:
				return {}
		else:
			# try and except code will go here:
			return {}

	@property
	def models(self):
		"""
		Fetching make list from CBB Source
		:return: list of makes
		"""
		if self.year and self.make:
			url = "http://xml.canadianblackbook.com/XMLWebServices/service?command=%s&year=%s&make=%s&account=%s&key=%s&schemaVersion=%s" % (
				CBB_CONSTANTS["models"], self.year, self.make, CBB_CONSTANTS["account"], CBB_CONSTANTS["key"],
				CBB_CONSTANTS["schema_version"]
			)
			# try and except code will go here:
			try:
				return dict(XMLTODict(self.request(url)))["cbb"]["response"]["models"]
			except KeyError as e:
				return {}
		else:
			return {}

	@property
	def trim(self):
		"""
		Fetch all list of trims from cbb
		:return: list oftrims
		"""
		if self.year and self.make and self.model:
			url = "http://canadianblackbook.com/ajax/bbv/year/%s/make/%s/model/%s/trim" % (
				CBB_CONSTANTS["years"], CBB_CONSTANTS["makes"], CBB_CONSTANTS["models"])
			try:
				res = dict(XMLTODict(self.request(url)))["cbb"]["response"]["trims"]
				print(res)
			except KeyError as e:
				return {"error"}
		else:
			return {}


class AverageAskingPrice(object):
	"""
	Average Asking Price of a vehicle
	"""

	def __init__(self):
		self.base_url = "http://canadianblackbook.com/ajax/bbv"



	def year(self):
		url = self.base_url + "/year"
		response = json.loads(Request(url, method="get").text)
		return [{"name": year["year"]} for year in response["items"][1:]]

	def makes(self, year):
		#url = self.base_url + "/year/{year}/make".format(year=year)
		url = base_url2 + "command=makes&year={year}" \
              "&account={account}&key={key}&schemaVersion=3.0".format(
                    year=year,
                    key="UqCfCahLYH",
                    account="autolife_consumer_xml"
        )
		res = Request(url, method="get").text
		o = xmltodict.parse(res)['cbb']['response']["makes"]
		return [{"name": item["#text"]} for item in o["make"]]

	def models(self, year, make):
		#url = self.base_url + "/year/{year}/make/{make}/model".format(year=year, make=make)
		url = base_url2 + "command=models&year={year}" \
			  "&make={make}&account={account}&key={key}&schemaVersion=3.0".format(
			year=year,
			make= make,
			key="UqCfCahLYH",
			account="autolife_consumer_xml"
		)
		res = Request(url, method="get").text
		o = xmltodict.parse(res)['cbb']['response']["models"]
		if not isinstance(o["model"], list):
			return [{"name": o["model"]["#text"]}]
		return [{"name": item["#text"]} for item in o["model"]]

	def trims(self, year, make, model):
		#url = self.base_url + "/year/{year}/make/{make}/model/{model}/trim".format(year=year, make=make, model=model)
		url = base_url2+"command=trims" \
              "&year={year}&make={make}&model={model}&account={account}&key={key}&schemaVersion=3.0".format(
			year=year,
			make=make,
            model=model,
			key="UqCfCahLYH",
			account="autolife_consumer_xml"
		)
		res = Request(url, method="get").text
		o = xmltodict.parse(res)['cbb']['response']['trims']
		return [{"name": item["#text"]} for item in o["trim"]]

	def body_style(self, year, make, model, trim):
		#url = self.base_url + "/year/{year}/make/{make}/model/{model}/trim/{trim}/style".format(year=year, make=make,
		#																						model=model, trim=trim)
		url = base_url2+"command=styles&" \
			  "year={year}&make={make}&model={model}&trim={trim}&account={account}&key={key}&schemaVersion=3.0".format(
			year=year,
			make=make,
			model=model,
			trim=trim,
			key="UqCfCahLYH",
			account="autolife_consumer_xml"
		)
		res = Request(url, method="get").text
		o = xmltodict.parse(res)['cbb']['response']['styles']

		if not isinstance(o["style"], list):
			return [{"name": o["style"]["#text"]}]

		return [{"name": item["#text"]} for item in o["style"]]


	def avg_asking_price(self, year, make, model, trim, body_style, postal_code, add_on='S-Line Package'):
		url = "http://www.canadianblackbook.com/ajax/aap/{year}/{make}/{model}/{trim}/{body_style}/{postal_code}".format(
			year=year, make=make, model=model, trim=trim, body_style=body_style, postal_code=postal_code
		)
		results = {"make": make, "year": year, "trim": trim, "postal_code": postal_code,
				   "body_Style": body_style, "add_on": add_on}
		try:
			response = json.loads(Request(url, method="get").text)
			print(response)
			results.update({'values': response})
		except:
			results.update({'values': {}})
		return results


class TradeInValue(object):
	"""
	Trade in value of a car
	"""

	def __init__(self):
		self.base_url = "http://xml.canadianblackbook.com/XMLWebServices/service?command={command}&account=autolife_consumer_xml&key=UqCfCahLYH&schemaVersion=3.0"

	def year(self):
		url = self.base_url.format(command="years")
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": year.get("#text")} for year in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('years').get('year') if year.get("#text")]
		except:
			return []

	def make(self, year=2018):
		url = self.base_url.format(command="makes&year={year}".format(year=year))
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": name.get("#text")} for name in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('makes').get('make') if name.get("#text")]
		except:
			return []

	def model(self, year=2018, make='GMC'):
		url = self.base_url.format(command="models&year={year}&make={make}".format(year=year, make=make))
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": name.get("#text")} for name in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('models').get('model') if name.get("#text")]
		except:
			return []

	def trim(self, year=2018, make='GMC', model='Canyon'):
		url = self.base_url.format(command="trims&year={year}&make={make}&model={model}".format(
			year=year, make=make, model=model)
		)
		response = XMLTODict(Request(url).text)
		response = json.loads(json.dumps(response))
		try:
			return [{"name": name.get("#text")} for name in response.get('cbb').get('response').get('trims').get('trim')
			        if name.get("#text")]
		except:
			return []

	def style(self, year=2018, make='GMC', model='Canyon', trim='Base'):
		url = self.base_url.format(command="styles&year={year}&make={make}&model={model}&trim={trim}".format(
			year=year, make=make, model=model, trim=trim)
		)
		response = XMLTODict(Request(url).text)
		response = json.loads(json.dumps(response))
		try:
			if isinstance(response.get('cbb').get('response').get('styles').get('style'), list):
				return [{"name": name.get("#text")} for name in
				        response.get('cbb').get('response').get('styles').get('style') if name.get("#text")]
			else:
				if response.get('cbb').get('response').get('styles').get('style'):
					return [{"name": response.get('cbb').get('response').get('styles').get('style').get('#text')}]
				else:
					return []
		except:
			return []

	def selected_options(self, year=2018, make='GMC', model='Canyon', trim='Base', style='Ext Cab 2WD'):
		url = self.base_url.format(
			command="vehicles&year={year}&make={make}&model={model}&trim={trim}&style={style}".format(
				year=year, make=make, model=model, trim=trim, style=style)
		)
		response = XMLTODict(Request(url).text)
		response = json.loads(json.dumps(response))
		print(response)
		try:
			if isinstance(
					response.get('cbb').get('response').get('vehicles').get('vehicle').get('options').get('option'),
					list):
				return [{"name": name.get('description'), "option_code": name.get("@optionCode"),
				         "add_or_deduct": name.get('addOrDeduct')} for name in
				        response.get('cbb').get('response').get('vehicles').get('vehicle').get('options').get('option')
				        if name.get('description')]
			else:
				if response.get('cbb').get('response').get('vehicles').get('vehicle').get('options').get('option'):
					val = response.get('cbb').get('vehicles').get('vehicle').get('options').get('option')
					return [{"name": val.get('description'), "option_code": val.get('@optionCode'),
					         "add_or_deduct": val.get('addOrDeduct')}]
				else:
					return []
		except:
			return []

	def trade_in_value(
			self,
			year=2018,
			make='GMC',
			model='Canyon',
			trim='base',
			style='Ext Cab 2WD',
			selected_option='',
			kilometers='2500',
			annual_kilometers='30000',
			postal_code='m3m4r1',
			region_name=""
	):
		if postal_code:
			if len(postal_code) == 6:
				region_name = REGION_WITH_POSTAL_CODE_PREFIX.get(postal_code.upper()[0])
		if selected_option:
			if ',' in selected_option:
				str_val = ''
				for val in selected_option.split(','):
					str_val += "selectedOptions={selected_options}&".format(selected_options=val)
			else:
				str_val = "selectedOptions={selected_options}&".format(selected_options=selected_option)
		else:
			str_val = "selectedOptions=&"
		url = self.base_url.format(
			command="priceVehicle&year={year}&make={make}&model={model}&trim={trim}&style"
			        "={style}&{selected_options}kilometers={kms}&annualKilometers={a_kms}&regionName={region_name}".format(
				year=year, make=make, model=model, trim=trim, style=style,
				selected_options=str_val, kms=kilometers, a_kms=annual_kilometers,
				region_name=region_name
			)
		)
		response = XMLTODict(Request(url).text)
		results = {"make": make, "model": model, "year": year, "add_on": selected_option,
		           "style": style, "trim": trim, "kms": kilometers, "annual_kilometers": annual_kilometers,
		           "postal_code": postal_code, "region_name": region_name
		           }
		try:

			values = json.loads(json.dumps(response)).get('cbb').get('response').get(
				'vehicles').get('vehicle').get('values')
			results.update({
				'values': {
					"msrp": values.get("msrp"),
					"trade_in_high": values.get("tradeInHigh"),
					"trade_in_low": values.get("tradeInLow")
				}
			})
		except:
			results.update({'values': {}})
		return results


class FutureValue(object):
	"""
	Future Values of car
	"""
	def __init__(self):
		self.base_url = "http://xml.canadianblackbook.com/XMLWebServices/service?command={command}&account=autolife_residual_xml&key=nVvf7bLHUa&schemaVersion=3.0"

	def year(self):
		url = self.base_url.format(command="years")
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": year.get("#text")} for year in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('years').get('year') if year.get("#text")]
		except:
			return []

	def make(self, year=2018):
		url = self.base_url.format(command="makes&year={year}".format(year=year))
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": name.get("#text")} for name in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('makes').get('make') if name.get("#text")]
		except:
			return []

	def model(self, year=2018, make='GMC'):
		url = self.base_url.format(command="models&year={year}&make={make}".format(year=year, make=make))
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": name.get("#text")} for name in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('models').get('model') if name.get("#text")]
		except:
			return []

	def trim(self, year=2018, make='GMC', model='Canyon'):
		url = self.base_url.format(command="trims&year={year}&make={make}&model={model}".format(
			year=year, make=make, model=model)
		)
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": name.get("#text")} for name in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('trims').get('trim') if name.get("#text")]
		except:
			return []

	def style(self, year=2018, make='GMC', model='Canyon', trim='Base'):
		url = self.base_url.format(command="styles&year={year}&make={make}&model={model}&trim={trim}".format(
			year=year, make=make, model=model, trim=trim)
		)
		response = XMLTODict(Request(url).text)
		try:
			return [{"name": name.get("#text")} for name in json.loads(
				json.dumps(response)
			).get('cbb').get('response').get('styles').get('style') if name.get("#text")]
		except:
			return []

	def future_value(
			self,
			year=2018,
			make='Jeep',
			model='Compass',
			trim='North',
			style='4D Utility 2WD',
			kilometers='2500',
			annual_kilometers='30000',
			postal_code='L3R2N7',
			region_name=""
	):
		if postal_code:
			if len(postal_code) == 6:
				region_name = REGION_WITH_POSTAL_CODE_PREFIX.get(postal_code.upper()[0])
		url = self.base_url.format(
			command="priceVehicle&year={year}&make={make}&model={model}&trim={trim}&style"
			        "={style}&kilometers={kms}&annualKilometers={a_kms}&postal_code={postal_code}&regionName={region_name}".format(
				year=year, make=make, model=model, trim=trim, style=style,
				kms=kilometers, a_kms=annual_kilometers, postal_code=postal_code,
				region_name=region_name
			)
		)
		response = XMLTODict(Request(url).text)
		results = {"make": make, "model": model, "year": year,
		           "style": style, "trim": trim, "kms": kilometers, "annual_kilometers": annual_kilometers}
		try:
			values = json.loads(json.dumps(response)).get('cbb').get('response').get(
				'vehicles').get('vehicle').get('values')
			print(values)
			residual_prices = values.get("residualPrices").get('baseResidual')
			residual_kms = values.get("residualPrices").get('kilometerAdjustmentResidual')
			results.update({
				'values': {
					"msrp": values.get("msrp"),
					"trade_in_high": values.get("tradeInHigh"),
					"trade_in_low": values.get("tradeInLow"),
					"future_values": []
				}
			})
			current_year = timezone.now()
			for k, v in residual_prices.items():
				print(k)
				val = ''.join(e for e in k if e.isdigit())
				print(val)
				results.get("values").get("future_values").append(
					{
						"year": (current_year + timezone.timedelta(days=int(int(val) * (365 / 12)))).year,
						"price": int(v)
						         - abs(int(residual_kms["residual" + val + "Adjustment"]))
					}
				)
		except:
			results.update({'values': {}})
		return results
