import json

import requests

from library.al_lib import Request


class Unhaggle(object):
	"""
	Unhaggle authentication
	"""
	def __init__(self, params=None, check=False):
		self.params = params
		self.check = check
		self.utrim_id = str(params["uid"])+str(params["year"])[-2:] if params["uid"] else None
		self.base_url = "http://api.unhaggle.com/api"
		self.headers = {
			"Api-Key":"gnr8r:M_YH_QXnV4xOzqNPJwv62A-GO_o"
		}
		self.all_makers = []
		self.all_models = []
		self.all_years = []
		self.make_list = []
		self.results = []
		self.parsed_data = {"incentives": []}
		self.check_status = False
		if self.check:
			self.incentive()


	def request(self, url):
		response = requests.get(self.base_url + url, headers=self.headers)
		print(response)
		if response.status_code == 200:
			return json.loads(response.text)
		else:
			return self.request(url)

	def trim_id(self, make="Audi", model="A4"):
		url = "/api/vehicle/trims/%s/%s/" %(make, model)
		results = self.request(url)
		for key, value in results.items():
			for keys, values in value.items():
				for item, detail in values.items():
					return [(no["trim_unique_id"], no["trim_name"]) for no in detail]
		self.incentives_data = None
		self.incentive()

	def incentive(self):
		url = self.base_url+"/incentives/fetch/{trim_id}/by_postal_code/{postal_code}/".format(
			trim_id=self.utrim_id ,
			postal_code = self.params["postal_code"]
		)
		response = Request(url, method="get", headers=self.headers)
		self.response = json.loads(response.text)
		if not isinstance(self.response, dict):
			self.response = self.response[0]
			self.parsed_data["start_date"] = self.response.get("start_date")
			self.parsed_data["start_date"] = self.response.get("end_date")
			self.incentives_data = self.response.get("methods", None)
			if not self.check:
				self.finance()
				self.lease()
				self.cash()
			else:
				self.check_status = True

	def finance(self):
		obj = {}
		obj["incentive_type"] = "finance"
		if self.incentives_data:
			if self.incentives_data.get("finance"):
				obj["rebate_name"] = self.incentives_data["finance"]["rebate_name"]
				obj["rebate_pre_tax"] = self.incentives_data["finance"]["rebate_pre_tax"]
				obj["rebate_post_tax"] = self.incentives_data["finance"]["rebate_post_tax"]
				obj['rebate_note_fr'] = self.incentives_data["finance"]['rebate_note_fr']
				terms = self.incentives_data["finance"].get("terms")
				obj["terms"] = []
				for key, value in terms.items():
					if value.replace(".", "").isdigit():
						obj["terms"].append([key, value])
				obj["terms"].sort()
				obj["rebate_note"] = self.incentives_data["finance"].get("rebate_note")
			self.parsed_data["incentives"].extend([obj])

	def lease(self):
		obj = {}
		obj["incentive_type"] = "lease"
		if self.incentives_data:
			if self.incentives_data.get("lease"):
				obj["rebate_name"] = self.incentives_data["lease"]["rebate_name"]
				obj["rebate_pre_tax"] = self.incentives_data["lease"]["rebate_pre_tax"]
				obj["rebate_post_tax"] = self.incentives_data["lease"]["rebate_post_tax"]
				obj['rebate_note_fr'] = self.incentives_data["lease"]['rebate_note_fr']
				terms = self.incentives_data["lease"].get("terms")
				obj["terms"] = []
				for key, value in terms.items():
					if value.replace(".", "").isdigit():
						obj["terms"].append([key, value])
				obj["terms"].sort()
				obj["rebate_note"] = self.incentives_data["lease"].get("rebate_note")
			self.parsed_data["incentives"].extend([obj])

	def cash(self):
		obj={}
		obj["incentive_type"] = "cash"
		if self.incentives_data:
			if self.incentives_data.get("cash"):
				obj["rebate_name"] = self.incentives_data["cash"]["rebate_name"]
				obj["rebate_pre_tax"] = self.incentives_data["cash"]["rebate_pre_tax"]
				obj["rebate_post_tax"] = self.incentives_data["cash"]["rebate_post_tax"]
				obj['rebate_note_fr'] = self.incentives_data["cash"]['rebate_note_fr']
				terms = self.incentives_data["lease"].get("terms")
				obj["terms"] = []
				obj["rebate_note"] = self.incentives_data["cash"].get("rebate_note")
			self.parsed_data["incentives"].extend([obj])

	def get_incentive_for_trim(self, trim_id="CHE44915", geography="all"):
		url = "/api/incentives/fetch/%s/%s/" % (geography, str(trim_id))
		results = self.request(url)
		return results

	def check_mapping(self, make, model, year):
		unhaggle_make = None
		unhaggle_model = None
		status = False
		for each_make in self.make_list:
			if make.lower().strip() == each_make["lowercase"]:
				unhaggle_make = each_make["orig_name"]
				for each_model in each_make["models"]:
					if model.lower().strip() == each_model["lowercase"]:
						unhaggle_model = each_model["orig_name"]
						if year in each_model["years"]:
							status = True
			break
		return status, unhaggle_make, unhaggle_model

	def get_trim_id(self, make="Acura", model="A4"):
		url = "/api/vehicle/trims/%s/%s/" %(make, model)
		results = self.request(url)
		return results["years"]

