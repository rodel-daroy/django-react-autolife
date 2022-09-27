from django.core.exceptions import ObjectDoesNotExist
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
from django_resized import ResizedImageField

# from autolife.local_settings import  SERVER_PATH
from autolife.local_settings import AWS_S3_CUSTOM_DOMAIN, MEDIA_URL
from content_manager.managers import ContentModelManager, ContentPublishingManager
from content_manager.utilities.asset_utils import VideoThumbnailer, GenerateThumbnail
from content_manager.utilities.db_utils import TemplateConfiguration
from core.models import Core
from library.al_lib import GUID
from library.cache_store import UpdateCache
from library.constants import CONTENT_PUBLISH_STATE_STR, CONTENT_PUBLISH_STATES
from marketplace.models import Sponsor, Campaign, Partner
from regions.models import Country, State, City
from tags.models import Tag
from django.core.cache import cache


class AssetType(Core):
	"""
	Types of assets
	"""
	name = models.CharField("Asset Type", max_length=20)

	def __str__(self):
		return self.name


class AssetContent(Core):
	"""
	Content in assets
	"""
	identifier = models.CharField("Identifier", max_length=255)
	content = models.FileField("Asset Content", upload_to="uploads", blank=True, null=True, help_text="Video supported .mp4, .avi and .webm")
	alternate_text = models.CharField("alternate_text", max_length=255, blank=True, null=True)
	order = models.IntegerField(blank=True, null=True)
	start_time = models.IntegerField(default=0, help_text="In seconds not decimal values")
	duration = models.IntegerField(default=5, help_text="In seconds ")

	def save(self, *args, **kwargs):
		update = UpdateCache()
		update.article_cache()
		super(AssetContent, self).save(*args, **kwargs)

	class Meta:
		ordering = ('order',)

	def __str__(self):
		return self.identifier if self.identifier else "Identifier Not provided for Asset id "+str(self.id)

	@property
	def to_json(self):
		return {
			"id": self.id,
			"url": '' if not self.content else self.content.url,
			"identifier": self.identifier,
			"alternate_text": self.alternate_text,
			"thumbnail":'' if not self.content else self.content.url if self.content.url.endswith("jpg") or self.content.url.endswith("png") or self.content.url.endswith("jpeg") else "video",
			"video_thumbnail": None if not self.content else "https://" + AWS_S3_CUSTOM_DOMAIN +"thumbnails/"+ self.content.name.replace('uploads/','')
			if self.content.url.endswith("mp4") or self.content.url.endswith("webm") or self.content.url.endswith("avi") else
			None,
			"path":None if not self.content else self.content.url.replace("https://" + AWS_S3_CUSTOM_DOMAIN, ""),
			"order": self.order,
		}

	def image_img(self):
		if self.content:
			if self.content.url.endswith("mp4") or self.content.url.endswith("webm") or self.content.url.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.content.url
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.content.url
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True


class Asset(Core):
	"""
	Asset related to content
	"""
	name = models.CharField("Identifier", max_length=255)
	asset_type = models.ForeignKey(AssetType, blank=True, null=True)
	assets = models.ManyToManyField(AssetContent, blank=True, related_name="asset_contents")
	source = models.CharField(max_length=255, blank=True, null=True)
	content_attribution = models.CharField(max_length=255, blank=True, null=True)
	thumbnail = ResizedImageField(size=[300, 180], crop=['middle', 'center'], upload_to='uploads/thumbnails/', blank=True, null=True)

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		update = UpdateCache()
		update.article_cache()
		super(Asset, self).save(*args, **kwargs)

	@property
	def to_json(self):
		try:
			url = self.assets.first().to_json['path'].replace('/media/uploads/', '')
		except AttributeError:
			url = None
		return {
			"asset_id": self.id,
			"content_attribution": self.content_attribution,
			"id": self.id,
			"source":self.source if self.source else None,
			"name": None if not self.name else self.name,
			"asset_type": None if not self.asset_type else self.asset_type.name,
			"asset_content": [asset_content.to_json for asset_content in self.assets.all().order_by('order')],
			"thumbnail": None if not self.thumbnail else self.thumbnail.url,
			"video_thumbnail": [] if not self.asset_type else [
				{"1920":"https://" + AWS_S3_CUSTOM_DOMAIN +'/1920/'+ url},
				{"960":"https://" + AWS_S3_CUSTOM_DOMAIN +'/960/'+ url},
				{"640":"https://" + AWS_S3_CUSTOM_DOMAIN +'/640/'+ url}
			] if url and self.asset_type.name=="video" else [],
		}

	def image_img(self):
		if self.thumbnail:
			if self.thumbnail.url.endswith("mp4") or self.thumbnail.url.endswith("webm") or self.thumbnail.url.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.thumbnail.url
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.thumbnail.url
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True






class AssetAssociation(Core):
	"""
	Asset Association with template location
	"""
	asset = models.ForeignKey(Asset, blank=True, null=True, related_name="asset_assocaition")
	template_location = models.CharField(max_length=50, blank=True, null=True)

	def __str__(self):
		if self.template_location:
			return "At "+self.template_location+" asset "+self.asset.name
		else:
			return self.asset.name


	@property
	def to_json(self):
		# print(self.asset.assets.all().first().to_json['thumbnail'])
		return {
			"asset_id": self.asset.id,
			"name": None if not self.asset.name else self.asset.name,
			"asset_association_id": self.id,
			"content_attribution": self.asset.content_attribution,
			"template_location": self.template_location,
			"asset_type": None if not self.asset.asset_type else self.asset.asset_type.name,
			"Source": None if not self.asset.asset_type else self.asset.source,
			"asset_content": [asset_content.to_json for asset_content in self.asset.assets.all()],
			"thumbnail": None if not self.asset.assets.all() else self.asset.assets.all().first().to_json["thumbnail"] if self.asset.assets.all().first().to_json["thumbnail"] !="video" else self.asset.thumbnail.url if self.asset.thumbnail else ''
			 # "thumbnail": None if not self.asset.assets.all() else self.asset.assets.all().first().to_json["url"]

		}


class ContentProvider(Core):
	"""
	Content Provider
	"""
	name = models.CharField("Provider Name", max_length=255)
	url = models.URLField("Provider Link", blank=True, null=True)

	def __str__(self):
		return self.name


class AdSection(Core):
	"""
	Ad information container
	"""
	name = models.CharField("Ad Name",  max_length=255)
	script = models.TextField("Ad Script", blank=True, null=True)
	location = models.CharField(max_length=50, blank=True, null=True)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"id": self.id,
			"name": self.name,
			"script": self.script,
			"location": self.location
		}


class TemplateContent(Core):
	"""
	Content according to template
	"""

	class Meta:
		verbose_name = "Content For Template"   # For django admin

	TEMPLATE_CHOICE = (
		("Editorial Template", "Editorial Template"),
		("Vehicle Editorial Template", "Vehicle Editorial Template"),
	)

	# Article Details
	content_heading = models.CharField("Article Heading", max_length=255)
	content_subheading = models.CharField("Article Sub Heading", max_length=255, blank=True,null=True)
	content_url = models.URLField("External URL", null =True, blank=True)
	content_byline = models.TextField("Article Byline", null =True, blank=True)
	content_byline_link = models.TextField("Article Byline Link", null =True, blank=True)
	content_body = models.TextField("Article Body", null =True, blank=True)
	content_synopsis = models.TextField("Article Synopsis", blank=True, null=True)
	content_publish_date = models.DateTimeField("Article Publish Date", auto_now_add=True)
	secondary_navigation = models.ManyToManyField('self', blank=True, related_name="secondary_related_articles", symmetrical=False)
	related_articles = models.ManyToManyField('self', blank=True, related_name="article_similar", symmetrical=False)
	content_provider = models.ForeignKey(ContentProvider, blank=True, null=True, related_name="provided_by")
	asset_template_association = models.ManyToManyField(AssetAssociation, related_name="associated_asset", blank=True)
	# Advertisements
	related_ads = models.ManyToManyField(AdSection, related_name="ads_related", blank=True)
	disable_ads = models.BooleanField(default=False)
	# Article Source
	content_partners = models.ForeignKey(Partner, blank=True, null=True)
	content_received_date = models.DateTimeField("Article Received Date ", blank=True, null=True)
	# Search Area
	search_keywords = models.TextField("Search Keywords", blank=True, null=True)
	search_boost = models.IntegerField(default=0, blank=True, null=True)
	include_in_search = models.BooleanField(default=False)
	# SEO Related Fields
	guid = models.CharField("Canonical Link", max_length=255, blank=True, null=True)
	seo_meta_name = models.CharField("Seo Meta Name", max_length=100, blank=True, null=True)
	seo_keywords = models.TextField("Seo Keyword", blank=True, null=True)
	seo_meta_description = models.TextField("Meta Description", blank=True, null=True)
	# Template Choiceasset_content.to_json
	template = models.CharField(max_length=255, choices=TEMPLATE_CHOICE, default="", blank=True, null=True)
	preview_path = models.CharField(max_length=20, blank=True, null=True)
	# Article Tagging
	country = models.ForeignKey(Country, related_name="countries_available", blank=True, null=True)
	state = models.ForeignKey(State, related_name="states_available", blank=True, null=True)
	city = models.ForeignKey(City, related_name="cities_available", blank=True, null=True)
	sponsor = models.ForeignKey(Sponsor, blank=True, null=True)
	is_timely_content = models.BooleanField("Timely Content",default=False)
	available_in_trends = models.BooleanField("Available In Trends",default=False)
	disable_personalization = models.BooleanField("Disable Personalisation", default=False)
	is_promoted_content = models.BooleanField("Promoted Content", default=False)
	homepage_availability = models.BooleanField("Available On Homepage", default=False)
	campaign = models.ManyToManyField(Campaign, related_name="campaign_related", blank=True)
	year = models.TextField(blank=True, null=True)
	manufacturer = models.TextField(blank=True, null=True)
	make = models.TextField(blank=True, null=True)
	make_model = models.TextField(blank=True, null=True)
	likes = models.IntegerField(default=0, blank=True, null=True)
	views = models.IntegerField(default=0, blank=True, null=True)
	slug = models.SlugField(max_length=255, blank=True, null=True)
	is_featured = models.BooleanField(default=False)

	# Configuration
	template_configuration = models.TextField(blank=True, null=True)

	objects = ContentModelManager()


	__previous_views = None

	def __init__(self, *args, **kwargs):
		super(TemplateContent, self).__init__(*args, **kwargs)
		self.__previous_views = self.views

	def __str__(self):
		return self.content_heading if self.content_heading else "Content "+str(self.id)

	def save(self, *args, **kwargs):

		# cache.clear()
		update = UpdateCache()
		# if self.views == self.__previous_views:
		# 	# Clear Cache Only When Views are not changed
		# 	UpdateCache().remove_old_news_related()

		if not self.slug:


			if self.content_heading and self.guid:
				self.slug = slugify(self.content_heading)


				if TemplateContent.objects.filter(slug=self.slug).exists():
					#this was recentely added
					#update.article_cache()
					self.slug = slugify(self.content_heading+"-"+self.guid)
					#print('99 update.article_cache()' )

		if not self.pk:     # If its a new entry update cache
			update.article_cache()
		# else:
		# 	update.clear_individual_article(self.slug)

		if self.disable_ads:
			self.template_configuration = TemplateConfiguration(self.template_configuration)
		else:
			self.template_configuration = TemplateConfiguration(self.template_configuration, "enable")
		# update.homepage_deafult_tiles_update()
		# update.article_cache()

		super(TemplateContent, self).save(*args, **kwargs)

	@property
	def content_score(self):
		total_score = 0
		try:
			for content_tw in ContentTagRelation.objects.filter(content_id=self.id):
				total_score += sum([weight.weight for weight in content_tw.tag_weightage.filter()])
		except ContentTagRelation.DoesNotExist as e:
			pass
		return total_score

	@property
	def to_json(self):

		return {
			"id": self.id,
			"headline": self.content_heading,
			"subheading": self.content_subheading,
			"url": self.content_url,
			"byline": self.content_byline,
			"byline_link": self.content_byline_link,
			"body": self.content_body,
			"synopsis": self.content_synopsis,
			"article_received_date": self.content_received_date,
			"article_publish_date": self.content_publish_date,
			"content_partner": None if not self.content_partners else self.content_partners.to_json,
			"search_keywords": self.search_keywords,
			"search_boost": self.search_boost,
			"include_in_search": self.include_in_search,
			"canonical_link": self.guid,
			"seo_meta_name": self.seo_meta_name,
			"seo_keywords": self.seo_keywords,
			"seo_meta_description": self.seo_meta_description,
			"template": self.template,
			"country": None if not self.country else self.country.to_json,
			"state": None if not self.state else self.state.to_json,
			"city": None if not self.city else self.city.to_json,
			"sponsor": None if not self.sponsor else self.sponsor.to_json,
			"guid": self.guid,
			"is_timely_content": self.is_timely_content,
			"available_in_trends": self.available_in_trends,
			"disable_personalization": self.disable_personalization,
			"is_promoted_content": self.is_promoted_content,
			"is_featured": self.is_featured,
			"homepage_availability": self.homepage_availability,
			"campaigns": [campaign.to_json for campaign in self.campaign.all()],
			"years": [] if not self.year else[{"name": yr} for yr in eval(self.year)],
			"manufacturers": [] if not self.manufacturer else [{"name": man} for man in eval(self.manufacturer)],
			"makes": [] if not self.make else[{"name": mk} for mk in eval(self.make)],
			"models": [] if not self.make_model else [{"name": mdl} for mdl in eval(self.make_model)],
			"tag": self.get_tag_weight,
			"publishing_state": self.get_publish_state,
			"related_articles": [article.id for article in self.related_articles.all()],
			"assets": [asset.to_json for asset in self.asset_template_association.all()],
			"secondary_navigation": [article.id for article in self.secondary_navigation.all()],
			"template_configuration": None if not self.template_configuration else eval(self.template_configuration),
			"ads": [ad.to_json for ad in self.related_ads.all()],
			"preview_path": self.preview_path,
		}

	@property
	def view_json(self):
		return {
			"id": self.id,
			"slug": self.slug,
			"headline": self.content_heading,
			"subheading": self.content_subheading,
			"url": self.content_url,
			"byline": self.content_byline,
			"byline_link": self.content_byline_link,
			"body": self.content_body,
			"seo_keywords": self.seo_keywords,
			"seo_meta_description": self.seo_meta_description,
			"seo_meta_name": self.seo_meta_name,
			"synopsis": self.content_synopsis,
			"preview_path": self.preview_path,
			"content_partner": None if not self.content_partners else self.content_partners.to_json,
			"secondary_navigation": [
				{
					"content_id": article.id,
					'slug': article.slug,
					"heading": article.content_heading,
					"assets": None if not article.get_assets else article.get_assets["assets"],
					"synopsis": article.content_synopsis
				} for article in self.secondary_navigation.all()
			],
			"template_configuration": None if not self.template_configuration else eval(self.template_configuration),
			"sponsor": None if not self.sponsor else self.sponsor.to_json,
			"related_articles": [
				{
					"content_id": article.id,
					'slug': article.slug,
					"heading": article.content_heading,
					"assets": None if not article.get_assets else article.get_assets["assets"],
					"synopsis": article.content_synopsis
				} for article in self.related_articles.all()
			],
			"ads": [ad.to_json for ad in self.related_ads.all()],
			"assets": [asset.to_json for asset in self.asset_template_association.all()],
			"content_provider": {"name": "Autolife", "url": "http://gnr8r.xyz/"},
			"article_publish_date": self.content_publish_date,
			"thumbnail": None if not self.get_assets['assets']
			else self.get_assets["assets"][0].get('thumbnail') if self.get_assets["assets"][0].get('thumbnail') else ''
			# "thumbnail": None if not self.asset_template_association.all().first() else self.asset_template_association.all().first().to_json["thumbnail"]
			# "thumbnail": None if not self.assets.all().first() else self.assets.all().first().assets.all().first().to_json["thumbnail"]
			# "thumbnail": None if not self.asset.assets.all() else self.asset.assets.all().first().to_json["thumbnail"] if self.asset.assets.all().first().to_json["thumbnail"] !="video" else self.asset.thumbnail.url if self.asset.thumbnail else ''
		}

	@property
	def get_assets(self):
		return {
			# "assets": [asset.to_json for asset in self.asset_template_association.filter(template_location='spot_A')]
			"assets": [asset.to_json for asset in self.asset_template_association.all()]
		}

	@property
	def get_tag_weight(self):
		try:
			Obj = ContentTagRelation.objects.get(content_id=self.id)
			return [{tw.tag_id: tw.weight} for tw in Obj.tag_weightage.all()]
		except ObjectDoesNotExist:
			return []

	@property
	def get_publish_state(self):
		try:
			return PublishingState.objects.get(content_id=self.id).to_json
		except ObjectDoesNotExist:
			return {}

	def content_publish_state(self):
		# for admin to show status of the content
		try:
			return CONTENT_PUBLISH_STATES[PublishingState.objects.get(content_id=self.id).to_json["publish_state"]]
		except ObjectDoesNotExist or KeyError:
			return '-'

	@property
	def short_publish_state(self):
		try:
			return PublishingState.objects.get(content_id=self.id).publish_state
		except ObjectDoesNotExist:
			return None

	@property
	def unpublish_date(self):
		try:
			return PublishingState.objects.get(content_id=self.id).unpublish_date
		except ObjectDoesNotExist:
			return None

	@property
	def check_status(self):
		return True if self.content_heading else False

	@property
	def meta_json(self):
		return{
			"id": self.id,
			"slug": self.slug,
			"content_name":self.content_heading,
			"publish_state": self.short_publish_state,
			"created_on": self.created_on,
			"completed": self.check_status,
			"template": self.template,
			"unpublish_date" : self.unpublish_date,
		}

	@property
	def video_thumbnails(self):
		try:
			return self.asset_template_association.get(template_location='spot_A').asset.to_json["video_thumbnail"]
		except Exception:
			return []

	@property
	def meta_details(self):

		return {


			"slug": self.slug,
			"date":self.content_publish_date,
			"content_id": self.id,
			"heading": self.content_heading,
			"sub_heading": self.content_subheading,
			"asset_type":None if not self.get_assets
			else "" if not self.get_assets["assets"]
			else "" if not self.get_assets["assets"][0]["asset_type"]
			else self.get_assets["assets"][0]["asset_type"],
			# "thumbnail": self.get_assets["thumbnail"],
			"thumbnail": None if not self.get_assets['assets']
			else self.get_assets["assets"][0].get('thumbnail') if self.get_assets["assets"][0].get('thumbnail') else '',
			"video_thumbnail": self.video_thumbnails,
			"image_url": None if not self.get_assets
			else "" if not self.get_assets["assets"]
			else "" if not self.get_assets["assets"][0]["asset_content"]
			else self.get_assets["assets"][0]["asset_content"][0]["url"],
			# "image_url": None if not self.get_assets['assets']
			# else self.get_assets["assets"][0].get('thumbnail') if self.get_assets["assets"][0].get('thumbnail')!="video" else self.get_assets["assets"][0]["thumbnail"],

			"synopsis": self.content_synopsis,
			"path": None if not self.get_assets
			else "" if not self.get_assets["assets"]
			else "" if not self.get_assets["assets"][0]["asset_content"]
			else self.get_assets["assets"][0]["asset_content"][0]["path"],
			"template": self.template,
			"vehicle": None if not self.vehicle_set.filter().exists() else
			self.vehicle_set.filter()[0].search_json,
			"source":None if not self.get_assets
			else "" if not self.get_assets["assets"]
			# else "B" if not self.get_assets["assets"][0]["asset_content"]
			else self.get_assets["assets"][0]["Source"],

		}


class ContentTagWeight(Core):
	"""
	Tag Weight according to content
	"""
	tag = models.ForeignKey(Tag)
	weight= models.IntegerField(blank=True, null=True)

	def __str__(self):
		return self.tag.name


class ContentTagRelation(Core):
	"""
	Content and tag relation
	"""
	content = models.ForeignKey(TemplateContent)
	tag_weightage = models.ManyToManyField(ContentTagWeight, blank=True, related_name="tagged_weight")

	def __str__(self):
		return self.content.content_heading

	@property
	def to_json(self):
		return {
			"id": self.id,
			"content": self.content,
			"tag_weightage": [tw.to_json for tw in self.tag_weightage.all()]
		}


class PublishingState(Core):
	"""
	publishing state and publish restrictions of any content
	"""
	publish_state_choices = (
		("Draft","Draft"),
		("Ready To Approve", "Ready To Approve"),
		("Published","Published"),
	)

	content = models.OneToOneField(TemplateContent)
	publish_state = models.CharField(max_length=20, choices=publish_state_choices, blank=True, null=True)
	unpublishing_on = models.DateTimeField(blank=True, null=True)
	do_not_publish_until = models.DateTimeField("Do Not Publish Until", blank=True, null=True)
	not_for_external_use = models.BooleanField("Not For External Use", default=False)

	objects = ContentPublishingManager()

	def __str__(self):
		return self.content.content_heading

	def save(self, *args, **kwargs):
		if not self.pk:
			UpdateCache().published_content()   # updates cache store on new entry
			UpdateCache().recent_content()  # updates cache store on new entry
		else:
			try:
				obj = PublishingState.objects.get(id=self.pk)
				if self.publish_state != obj.publish_state:
					UpdateCache().published_content()  # updates cache store on state change
					UpdateCache().recent_content()
				else:
					UpdateCache().published_content()  # updates cache store on state change
					UpdateCache().recent_content()
			except PublishingState.DoesNotExist:
				pass
		super(PublishingState, self).save(*args, **kwargs)

	@property
	def to_json(self):
		return {
			"content": self.content_id,
			"publish_state": None if not self.publish_state else CONTENT_PUBLISH_STATE_STR[self.publish_state],
			"unpublishing_on": self.unpublishing_on,
			"do_not_publish_until": self.do_not_publish_until,
			"article_publish_date": self.content.content_publish_date,
		}

	@property
	def unpublish_date(self):
		return self.unpublishing_on


# Signal to generate and save random value in cononical link

@receiver(post_save, sender=TemplateContent, dispatch_uid="update_guid")
def generate_uid(sender, instance, **kwargs):
	"""
	Signal to generate GUID after freshly created Instance Object
	:param sender:
	:param instance:
	:param kwargs:
	:return: None
	"""
	if not instance.guid:
		instance.guid = GUID(instance.id, encrypt=True)
		PublishingState.objects.get_or_create(content_id=instance.id)
		instance.save()


@receiver(post_save, sender=PublishingState, dispatch_uid="update_publish_date")
def update_publish_date(sender, instance, **kwargs):
	"""
	Updates publish date of content on publish state change
	:param sender:
	:param instance:
	:param kwargs:
	:return:
	"""
	if instance.content.content_publish_date != instance.do_not_publish_until and instance.do_not_publish_until != None:
		instance.content.content_publish_date = instance.do_not_publish_until
		instance.content.save()


@receiver(post_save, sender=AssetContent, dispatch_uid="update_thumbnail")
def generate_thumbnail(sender, instance, **kwargs):
	"""
	Updates publish date of content on publish state change
	:param sender:
	:param instance:
	:param kwargs:
	:return:
	"""
	if instance.content:
		print(instance.content.url)
		if ".mp4" in instance.content.url or ".avi" in instance.content.url or  ".webm" in instance.content.url:
			VideoThumbnailer(path=instance.content.url, start=instance.start_time, end=instance.start_time+instance.duration).start()
			print("updated")
