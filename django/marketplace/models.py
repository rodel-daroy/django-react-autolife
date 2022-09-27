from django.db import models

# Create your models here.
from core.models import Core


class Sponsor(Core):
	"""
	Sponsors models
	"""
	name = models.CharField(max_length=255)
	logo  = models.FileField(upload_to='uploads/sponsors/',blank=True, null=True)
	external_link = models.URLField(blank=True, null=True)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"logo": None if not self.logo else self.logo.url
		}

	def image_img(self):
		if self.logo:
			if self.logo.url.endswith("mp4") or self.logo.url.endswith("webm") or self.logo.url.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.logo.url
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.logo.url
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True



class Partner(Core):
	"""
	Partners Model
	"""
	name = models.CharField(max_length=100)
	logo = models.URLField(blank=True, null=True)
	description = models.TextField(blank=True)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"description": self.description
		}

	def image_img(self):
		if self.logo:
			if self.logo.endswith("mp4") or self.logo.endswith("webm") or self.logo.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.logo
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.logo
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True







class Campaign(Core):
	"""
	Campaigns Model
	"""
	name = models.CharField(max_length=100)
	start_date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"start_date": self.start_date
		}


class Offers(Core):
	"""
	Offers related to user
	"""
	name = models.CharField(max_length=255)
	image_url = models.URLField(blank=True, null=True)


	class Meta:
		verbose_name_plural ='Offers'

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"image_url": self.image_url
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




class InsuranceYear(Core):
	"""
	Insurance related vehicle year
	"""
	year_name = models.CharField(max_length=255, blank=True, null=True)

	@property
	def to_json(self):
		return {
			"name": self.year_name,
			"id": self.id
		}


class InsuranceMake(Core):
	"""
	Insurance related vehicle make
	"""
	make_name = models.CharField(max_length=255, blank=True, null=True)
	year = models.ForeignKey(InsuranceYear)

	@property
	def to_json(self):
		return {
			"name": self.make_name,
			"id": self.id
		}


class InsuranceModel(Core):
	"""
	Insurance related vehicle models
	"""
	model_name = models.CharField(max_length=255, blank=True, null=True)
	vicc_code = models.CharField(max_length=50, blank=True, null=True)
	ex_vcc = models.CharField(max_length=50, blank=True, null=True)
	make = models.ForeignKey(InsuranceMake)

	@property
	def to_json(self):
		return {
			"name": self.model_name,
			"id": self.id
		}

class MappingModel(Core):
	"""
	Jato Evox Mapping Model
	"""
	uid = models.CharField("Unhaggle ID",max_length=255, blank=True, null=True, help_text="Unhaggle Id")
	jid = models.CharField("Jato Id", max_length=50, blank=True, null=True, help_text="Jato Id")
	evox_id = models.CharField("Evox Id", max_length=50, blank=True, null=True, help_text="Evox vifnum")

