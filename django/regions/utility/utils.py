import json

from django.core.exceptions import ObjectDoesNotExist

from autolife.settings import BASE_DIR
from library.al_lib import Request
from marketplace.utility.marketplace_constants import GOOGLE_API_KEY
from regions.models import Country, State, City, PostalCodeMapper
from regions.utility.regions import CANADA_PROVINCE, CANADA_CITIES, US_STATE_CITIES


class CountryStates(object):
	"""
	Returns list of states according to country
	"""
	def __new__(cls, country_id, *args, **kwargs):
		try:
			state_list = [state.to_json for state in Country.objects.get(id=country_id).states.all()]
		except ObjectDoesNotExist as e:
			state_list = None
		return state_list


class StateCities(object):
	"""
	Returns list of cities according to state
	"""
	def __new__(cls, state_id, *args, **kwargs):
		try:
			cities_list = [city.to_json for city in State.objects.get(id=state_id).cities.all()]
		except ObjectDoesNotExist as e:
			cities_list = None
		return cities_list


class SaveRegion(object):
	"""
	Saving regions
	"""
	def __init__(self):
		self.countries = json.load(open(BASE_DIR+"/regions/utility/"+"countries.json", encoding="utf-8"))["countries"]
		self.states = json.load(open(BASE_DIR+"/regions/utility/"+"states.json", encoding="utf-8"))["states"]
		self.cities = json.load(open(BASE_DIR+"/regions/utility/"+"cities.json", encoding="utf-8"))["cities"]

	def save_countries(self):
		for country in self.countries:
			if country["name"] == "Canada" or country["name"] == "United States":
				Country.objects.get_or_create(
					name=country["name"],
					short_name=country["shortname"],
					source_id=country["id"]
				)

	def save_states(self):
		for state in self.states:
			obj , is_created = State.objects.get_or_create(
				name=state["name"],
				source_id=state["id"]
			)
			if is_created:
				try:
					country_obj = Country.objects.get(source_id=state["country_id"])
					country_obj.states.add(obj)
				except ObjectDoesNotExist as e:
					pass

	def save_cities(self):
		for city in self.cities:
			obj , is_created = City.objects.get_or_create(
				name=city["name"],
				source_id=city["id"]
			)
			if is_created:
				try:
					state_obj = State.objects.get(source_id=city["state_id"])
					state_obj.cities.add(obj)
				except ObjectDoesNotExist as e:
					pass


class CanadaRegions(object):
	"""
	Putting all data from canada.py to db
	"""
	def __init__(self):
		self.save()

	def save(self):
		country_obj, is_created = Country.objects.get_or_create(
			name="Canada",
			short_name="CA"
		)
		for short_name, state_name in CANADA_PROVINCE.items():
			state_obj, is_created = State.objects.get_or_create(
				short_name=short_name,
				name=state_name
			)
			for city in CANADA_CITIES:
				if short_name in city:
					city_obj, is_created = City.objects.get_or_create(name=city[0])
					state_obj.cities.add(city_obj)
			country_obj.states.add(state_obj)


class USRegions(object):
	"""
	Putting all data from regions of USA into db
	"""
	def __init__(self):
		self.save()

	def save(self):
		country_obj, is_created = Country.objects.get_or_create(name="United States")
		for state, cities in US_STATE_CITIES.items():
			state_obj, is_created = State.objects.get_or_create(
				name=state.strip()
			)
			for city in cities:
				city_obj, is_created = City.objects.get_or_create(
					name=city
				)
				state_obj.cities.add(city_obj)
			country_obj.states.add(state_obj)


class MapCoordinatesWithPostalCode(object):
	"""
	Mapping of coordinates with postal Code
	"""
	def __init__(self, postal_code):
		self.postal_code = postal_code
		self.google_map_url = "https://maps.googleapis.com/maps/api/geocode/json?address="+str(postal_code)
		self.google_map_url = self.google_map_url+"&key="+GOOGLE_API_KEY
		if PostalCodeMapper.objects.filter(postal_code=postal_code).exists():
			obj = PostalCodeMapper.objects.get(postal_code=postal_code)
			self.latitude = obj.latitude
			self.longitude = obj.longitude
		else:
			self.google_maps()
			pass

	def map_postal_code(self):
		pass

	def google_maps(self):
		res = json.loads(Request(self.google_map_url, method="get").text)
		try:
			self.latitude = res["results"][0]["geometry"]["location"]["lat"]
			self.longitude = res["results"][0]["geometry"]["location"]["lng"]
			PostalCodeMapper.objects.create(
				postal_code = self.postal_code,
				latitude = self.latitude,
				longitude = self.longitude
			)
		except :
			self.latitude = ""
			self.longitude = ""

	@property
	def lat_lng(self):
		return self.latitude, self.longitude


