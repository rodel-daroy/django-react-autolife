from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.utils import timezone
from django.utils.text import slugify

from autolife.local_settings import AWS_S3_CUSTOM_DOMAIN, IMAGE_SOURCE
from content_manager.models import TemplateContent
from core.models import Core
from library.cache_store import UpdateCache
from marketplace.utility.JATO import VehicleDetails, VehicleBasicDetails, JatoDetails
from marketplace.utility.utils import get_evox_url


class Year(Core):
	"""
	Year of Vehicle
	"""
	year_name = models.CharField(max_length=10, unique=True)

	def __str__(self):
		return str(self.year_name)

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.year_name
		}


class BodyStyle(Core):
	"""
	Body styles of car
	"""
	body_style_name = models.CharField(max_length=50, unique=True)
	body_style_id = models.CharField(max_length=50, blank=True, null=True)

	def __str__(self):
		return self.body_style_name


class Manufacturer(Core):
	"""
	Manufacturers of the vehicles
	"""
	name = models.CharField(max_length=100)
	logo = models.URLField(blank=True, null=True)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return  {
			"name": self.name,
			"id": self.id,
			"logo": self.logo,
		}


class Make(Core):
	"""
	Make of the vehicles
	"""
	name = models.CharField(max_length=100, unique=True)
	logo = models.FileField("Make Logo", upload_to="uploads", blank=True, null=True)
	website = models.URLField("Web Url", blank=True, null=True)
	manufacturer = models.ForeignKey(Manufacturer, blank=True, null=True, on_delete=models.CASCADE)

	def __str__(self):
		return self.name

	def image_img(self):
		if self.logo:
			return u'<img src="%s" width="150" height="150"/>' %self.logo.url
		else:
			return 'Thumbnail Not Available for asset'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True

	def save(self, *args, **kwargs):
		UpdateCache().db_makes()
		if len(self.name) <= 3:
			self.name = self.name.upper()
		else:
			self.name = self.name.title()
		super(Make, self).save(*args, **kwargs)

	@property
	def to_json(self):
		return {
			"name": self.name,
			"id": self.id,
			"logo":  None if not self.logo else self.logo.url,
		}


class Model(Core):
	"""
	Model of the Vehicle
	"""
	name = models.CharField(max_length=100)
	make = models.ForeignKey(Make, blank=True, null=True, on_delete=models.CASCADE)

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		if len(self.name) <= 3:
			self.name = self.name
		else:
			self.name = self.name
		super(Model, self).save(*args, **kwargs)

	@property
	def to_json(self):
		return {
			"name": self.name,
			"id": self.id,
		}


class Source(Core):
	"""
	Source of getting Information
	"""
	name = models.CharField(max_length=255)
	source_url = models.URLField()
	source_logo = models.URLField(blank=True, null=True)

	def __str__(self):
		return self.name


class VehicleCategory(Core):
	"""
	Categories of vehicle
	"""
	category_name = models.CharField(max_length=255)
	slug = models.CharField(max_length=255 ,blank=True, null=True)
	image_url = models.FileField("Image", upload_to='uploads', blank=True, null=True)
	order = models.IntegerField(blank=True, null=True)


	class Meta:
		verbose_name_plural ='Vehicle Categories'

	def __str__(self):
		return self.category_name

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.category_name.lower())
		if len(self.category_name) <= 3:
			self.category_name = self.category_name.upper().strip()
			super(VehicleCategory, self).save(*args, **kwargs)
		else:
			self.category_name = self.category_name.title().strip()
			super(VehicleCategory, self).save(*args, **kwargs)

	@property
	def to_json(self):
		return {
			"category_id": self.id,
			"name": self.category_name,
			"image_url": None if not self.image_url else self.image_url.url,
			"slug": self.slug,
			"order":self.order
		}

	def image_img(self):
		if self.image_url:
			if self.image_url.url.endswith("mp4") or self.image_url.url.endswith("webm") or self.image_url.url.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.image_url
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.image_url.url
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True


class Vehicle(Core):
	"""
	Keeps record of third party API
	"""
	make = models.ForeignKey(Make, related_name="vehicle_make", blank=True, null=True)
	model = models.ForeignKey(Model, related_name="vehicle_model", blank=True, null=True)
	year = models.ForeignKey(Year, related_name="vehicle_year", blank=True, null=True)
	source_name = models.ForeignKey(Source, related_name="vehicle_source", blank=True, null=True, on_delete=models.CASCADE)
	category = models.ForeignKey(VehicleCategory, blank=True, null=True, on_delete=models.CASCADE)
	source_id = models.CharField(max_length=255, blank=True, null=True,
	                             help_text="While adding car, image and other values "
	                                       "are fetched from Jato if Jato id is provided. "
	                                       "But once any value is overwritten then it does "
	                                       "not fetch again from Jato.")
	trim_name = models.CharField(max_length=50, blank=True, null=True)
	body_style = models.ForeignKey(BodyStyle, blank=True, null=True, on_delete=models.CASCADE)
	price = models.CharField(max_length=20, blank=True, null=True)
	article = models.ForeignKey(TemplateContent, blank=True, null=True, on_delete=models.CASCADE)
	image_url = models.CharField(max_length=500, blank=True, null=True)
	vehicle_name = models.CharField(max_length=255, blank=True, null=True)
	fuel_economy_city = models.CharField(max_length=10, blank=True, null=True)
	fuel_economy_hwy = models.CharField(max_length=10, blank=True, null=True)
	engine = models.CharField(max_length=20, blank=True, null=True)
	transmission = models.CharField(max_length=10, blank=True, null=True)
	horse_power = models.CharField(max_length=10, blank=True, null=True)


	def __str__(self):
		return str(self.id)

	@property
	def related_makes(self):
		return

	@property
	def saved_cars(self):
		obj= {
			"source_id": self.source_id,
			"vehicle_id": self.source_id,
			"id": self.id,
			"name": self.vehicle_name,
			"image_url": self.image_url,
			"price": self.price,
			"make": None if not self.make else self.make.name,
			"make_url": None if not self.make else self.make.website,
			"model": None if not self.model else self.model.name,
			"year": None if not self.year else self.year.year_name,
			"article_text": None if not self.article else self.article.content_body,
			"trim_name": self.trim_name,
			"body_style_id": None if not self.body_style_id else self.body_style.body_style_id,
			"body_style": None if not self.body_style_id else self.body_style.body_style_name,
			"category": None if not self.category_id else self.category.category_name,
			"category_slug": None if not self.category_id else self.category.slug,
		}

		if obj["image_url"]:
			if not "http" in obj["image_url"]:
				obj["image_url"] = "https://" + AWS_S3_CUSTOM_DOMAIN + self.image_url
		return obj

	@property
	def search_json(self):
		return {
			"make": None if not self.make else self.make.name,
			"model": None if not self.model else self.model.name,
			"id": self.id,
			"category": None if not self.category else {
				"id": self.category_id,
				"slug": self.category.slug,
				"category_name": self.category.category_name,
			}
		}

	def image_img(self):
		if self.image_url:
			if self.image_url.endswith("mp4") or self.image_url.endswith("webm") or self.image_url.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.image_url
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.image_url
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True


	@property
	def to_json(self):
		obj = {
			"source_id": self.source_id,
			"vehicle_id": self.id,
			"id": self.id,
			"name": self.vehicle_name,
			"image_url": self.image_url,
			"price": self.price,
			"make": None if not self.make else self.make.name,
			"make_url": None if not self.make else self.make.website,
			"model": None if not self.model else self.model.name,
			"year": None if not self.year else self.year.year_name,
			"article_text": None if not self.article else self.article.content_body,
			"seo_meta_name": None if not self.article else self.article.seo_meta_name,
			"seo_keywords": None if not self.article else  self.article.seo_keywords,
			"seo_meta_description": None if not self.article else  self.article.seo_meta_description,
			"trim_name": self.trim_name,
			"body_style_id": None if not self.body_style_id else self.body_style.body_style_id,
			"body_style": None if not self.body_style_id else self.body_style.body_style_name,
			"category": None if not self.category_id else self.category.category_name,
			"category_slug": None if not self.category_id else self.category.slug,
			"fuel_economy_city": self.fuel_economy_city,
			"fuel_economy_hwy": self.fuel_economy_hwy,
			"transmission": self.transmission,
			"engine_type": self.engine,
			"horse_power": self.horse_power,
			"is_liked":False
		}
		if obj["image_url"]:
			if not "http" in obj["image_url"]:
				obj["image_url"] = "https://"+AWS_S3_CUSTOM_DOMAIN+self.image_url

		if self.source_id and not self.price:
			obj.update(VehicleBasicDetails().price({"vehicle_id": self.source_id}, get_value=True))
		if IMAGE_SOURCE == 'EVOX':
			if self.source_id:
				if 'jato' in obj["image_url"]:
					evox_image_url = get_evox_url(self.source_id)
					obj["image_url"] =evox_image_url[0] if evox_image_url else None
		return obj

	@property
	def vehicle_meta_info(self):
		obj = {
			"source_id": self.source_id,
			"vehicle_id": self.id,
			"id": self.id,
			"name": self.vehicle_name,
			"image_url": self.image_url,
			"price": self.price,
			"make": None if not self.make else self.make.name,
			"model": None if not self.model else self.model.name,
			"year": None if not self.year else self.year.year_name,
			"trim_name": self.trim_name,
			"category_name": self.category.category_name,
			"body_style": None if not self.body_style_id else self.body_style.body_style_name,
			"category_slug": None if not self.category_id else self.category.slug,
			"fuel_economy_city": self.fuel_economy_city,
			"fuel_economy_hwy": self.fuel_economy_hwy,
			"transmission": self.transmission,
			"engine_type": self.engine,
			"horse_power": self.horse_power
		}
		if obj["image_url"]:
			if not "http" in obj["image_url"]:
				obj["image_url"] = "https://"+AWS_S3_CUSTOM_DOMAIN+self.image_url
			# if self.source_id and not self.price:
			# 	obj.update(VehicleBasicDetails().price({"vehicle_id": self.source_id}, get_value=True))
			# 	return obj

		return obj

	def save(self, *args, **kwargs):
		if not self.pk:
			if self.source_id :
				vehicle_obj = VehicleDetails(vehicle_id=self.source_id, description=True, save=True)
				if vehicle_obj.specs.get("make") or vehicle_obj.specs.get("price"):
					try:
						if len(vehicle_obj.specs["make"])<=3:
							make_obj , is_created = Make.objects.get_or_create(name=vehicle_obj.specs["make"].upper())
						else:
							make_obj, is_created = Make.objects.get_or_create(name=vehicle_obj.specs["make"].title())
						self.make_id = make_obj.id
						if Model.objects.filter(name=vehicle_obj.specs["model"],
							make_id=make_obj.id).exists():
							model_obj = Model.objects.filter(
								name=vehicle_obj.specs["model"],
								make_id=make_obj.id
							)[0]
						else:
							model_obj = Model.objects.create(
								name=vehicle_obj.specs["model"],
								make_id=make_obj.id
							)
						if self.category_id:
							temp_obj = {"vehicleId": self.source_id}
							self.fuel_economy_city = vehicle_obj.specs["fuel_economy_city"]
							self.fuel_economy_hwy = vehicle_obj.specs["fuel_economy_hwy"]
							self.transmission = vehicle_obj.specs["transmission"]
							vehicle_obj.shop_engine(obj=temp_obj)
							vehicle_obj.shop_horse_power(obj=temp_obj)
							self.engine = temp_obj.get("engine_type")
							self.horse_power = temp_obj.get("horse_power")
						self.image_url = vehicle_obj.specs["image_url"] if not vehicle_obj.specs.get("images") else vehicle_obj.specs.get("images")["images"][0]
						self.vehicle_name = self.vehicle_name if  self.vehicle_name else vehicle_obj.specs.get("name")
						self.trim_name = vehicle_obj.specs.get("")
						self.model_id = model_obj.id
						year_obj, is_created = Year.objects.get_or_create(year_name=vehicle_obj.specs["year"])
						self.year_id = year_obj.id
						self.trim_name = vehicle_obj.specs["trim_name"]
						body_style_obj, is_created = BodyStyle.objects.get_or_create(
							body_style_name=vehicle_obj.specs["body_style"],
							body_style_id=vehicle_obj.specs["body_style_id"]
						)
						self.body_style_id = body_style_obj.id
						if Vehicle.objects.filter(
								source_id=self.source_id,
								category_id=self.category_id,
						).exists():
							raise ValidationError("Vehicle already available in the database")
					except KeyError:
						pass
				else:
					raise ValidationError("Vehicle Not found on Jato Server")
		try:
			category_slug = VehicleCategory.objects.get(id=self.category_id).slug
			UpdateCache().browse_section(category_slug)
		except VehicleCategory.DoesNotExist as e:
			pass
		super(Vehicle, self).save(*args, **kwargs)


@receiver(pre_delete, sender=Vehicle, dispatch_uid='vehicle delete signal')
def vehicle_deleted(sender, **kwargs):
	instance = kwargs["instance"]
	if instance.category_id:
		category_slug = VehicleCategory.objects.get(id=instance.category_id).slug
		UpdateCache().browse_section(category_slug)


