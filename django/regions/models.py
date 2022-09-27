from django.db import models

from core.models import Core


class City(Core):
	"""
	Cities of the state
	"""
	name = models.CharField(max_length=100, blank=True, null=True)
	source_id = models.CharField(max_length=10, blank=True, null=True)

	class Meta:
		verbose_name_plural='Cities'

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name
		}


class State(Core):
	"""
	States of the country
	"""
	name = models.CharField(max_length=100, blank=True, null=True)
	short_name = models.CharField(max_length=5, blank=True, null=True)
	timezone = models.CharField(max_length=100, blank=True, null=True)
	cities = models.ManyToManyField(City, related_name="included_cities", blank=True)
	source_id = models.CharField(max_length=10, blank=True, null=True)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"short_name": self.short_name,
			"timezone": self.timezone
		}


class Country(Core):
	"""
	Countries in the world
	"""
	name = models.CharField("country_name", max_length=100, blank=True, null=True)
	short_name = models.CharField(max_length=5, blank=True, null=True)
	states = models.ManyToManyField(State, related_name="included_states", blank=True)
	source_id = models.CharField(max_length=10, blank=True, null=True)

	class Meta:
		verbose_name_plural ='Countries'

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"short_name": self.short_name,
		}


class PostalCodeMapper(Core):
	"""
	Lat Long Mapper
	"""
	postal_code = models.CharField(max_length=255)
	latitude = models.CharField(max_length=255, blank=True, null=True)
	longitude = models.CharField(max_length=255, blank=True, null=True)

	def __str__(self):
		return self.postal_code