from django.db import models

# Create your models here.
from content_manager.models import Asset, TemplateContent
from core.models import Core
from library.cache_store import UpdateCache
from marketplace.models import Campaign, Sponsor
from marketplace.utility.polls import Polls
from ui_controllers.managers import TileManager, TileCategoryManager

HOME_1 = "Homepage Default"
HOME_2 = "Homepage Logged In User"
FEATURED_HOME_1 = "Homepage Featured Default"
FEATURED_HOME_2 = "Homepage Featured Logged In User"
INS = "Insurance"
MKTPLC_ARTICLES = "Marketplace Articles"
MKTPLC_CONCEPT_CARS = "Marketplace Concept Cars"
CAR_WORTH = "Car Worth"
AUTO_SHOW="AutoShow"
Sirius_XM="SiriusXM"


class ControllerCategory(Core):
	"""
	Categories of the UI , e.g : Homepage Default, Insurance etc.
	"""
	category_choices = (
		(HOME_1, HOME_1),
		(HOME_2, HOME_2),
		(FEATURED_HOME_1, FEATURED_HOME_1),
		(FEATURED_HOME_2, FEATURED_HOME_2),
		(INS, INS),
		(MKTPLC_ARTICLES, MKTPLC_ARTICLES),
		(MKTPLC_CONCEPT_CARS, MKTPLC_CONCEPT_CARS),
		(CAR_WORTH, CAR_WORTH),
		(AUTO_SHOW,AUTO_SHOW),
		(Sirius_XM,Sirius_XM),
	)
	category_name = models.CharField(max_length=100, choices=category_choices)

	objects = TileCategoryManager()

	def __str__(self):
		return self.category_name

	class Meta:
		verbose_name = 'Controller Category'
		verbose_name_plural = 'Controller Categories'

	def save(self, *args, **kwargs):
		UpdateCache().homepage_deafult_tiles_update()
		super(ControllerCategory, self).save(*args, **kwargs)

	@property
	def to_json(self):
		return {
			"name":self.category_name,
			"id":self.id
		}


class ControllerTile(Core):
	"""
	Tiles of the UI, e.g : Sirus tile, etc.
	"""
	order = models.IntegerField(blank=True, null=True)
	tile_name = models.CharField(max_length=100)
	category = models.ForeignKey(ControllerCategory, on_delete=models.CASCADE,null=True,blank=True)
	columns = models.IntegerField(choices=((1,1),(2,2),(3,3),(4,4)), default=1)
	campaign = models.ForeignKey(Campaign, blank=True, null=True, on_delete=models.CASCADE)
	poll_id = models.CharField(max_length=100, blank=True, null=True)
	tile_headline = models.CharField(max_length=100,blank=True,null=True)
	tile_subheadline = models.CharField(max_length=500, blank=True, null=True)
	tile_asset = models.ForeignKey(Asset, blank=True, null=True, on_delete=models.CASCADE)
	tile_CTA_text = models.CharField(max_length=50, blank=True)
	tile_CTA_link = models.CharField(max_length=255,blank=True, null=True)
	tile_CTA_article = models.ForeignKey(TemplateContent, blank=True, null=True, on_delete=models.CASCADE)
	linked_outside = models.BooleanField("Open link in new tab", default=True)
	is_active = models.BooleanField("Active", default=False, help_text="If not selected, Preview value will be True")
	sponsors = models.ForeignKey(Sponsor, blank=True, null=True)

	objects = TileManager()

	def __str__(self):
		return self.tile_name

	def save(self, *args, **kwargs):
		UpdateCache().homepage_deafult_tiles_update()
		super(ControllerTile, self).save(*args, **kwargs)

	@property
	def preview(self):
		return not self.is_active

	@property
	def to_json(self):
		return {
			"id":self.id,
			"order": self.order,
			"name": self.tile_name,
			"category": self.category.category_name if self.category else None,
			"columns": 4 if self.category and self.category.category_name==FEATURED_HOME_1 or  self.category and self.category.category_name==FEATURED_HOME_2 else self.columns,
			"tile_headline": self.tile_headline,
			"tile_subheadline": self.tile_subheadline,
			"tile_asset": [
				{
					"asset_id": self.tile_asset.id,
					"asset_type": self.tile_asset.asset_type.name,
					"asset_url": asset.to_json.get("url"),
					"relative_path": asset.to_json.get("path"),
					"video_thumbnail": self.tile_asset.to_json.get('video_thumbnail'),
					"thumbnail": self.tile_asset.to_json.get('thumbnail'),
					"alternate_text": self.tile_asset.to_json.get('asset_content')[0]['alternate_text'],
				} for asset in self.tile_asset.assets.all()[:1]
			] if self.tile_asset else None,
			"source": self.tile_asset.to_json.get('source') if self.tile_asset else None,
			"asset_type": self.tile_asset.asset_type.name if self.tile_asset else None,
			"tile_cta_text": self.tile_CTA_text,
			"tile_cta_link": self.tile_CTA_link,
			"tile_cta_article": None if not self.tile_CTA_article else self.tile_CTA_article.slug,
			"linked_outside": self.linked_outside,
			"sponsor": None if not self.sponsors else self.sponsors.to_json,
			"poll_tile": False if not self.poll_id else Polls().poll_details(self.poll_id),
			"active":self.is_active,
			"campaign":self.campaign.name if self.campaign else None

		}








