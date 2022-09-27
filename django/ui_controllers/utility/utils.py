"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from random import choice

from content_manager.models import TemplateContent, Asset
from content_manager.utilities.news_utils import NewsListing
from marketplace.models import Sponsor, Campaign
from ui_controllers.models import ControllerCategory, INS, MKTPLC_ARTICLES, MKTPLC_CONCEPT_CARS, AUTO_SHOW, Sirius_XM, \
	HOME_2, ControllerTile

COLUMN_TOTAL_WIDTH = 4


class ArticleRecent(object):
	"""
	Articles you might like
	"""

	def __init__(self, user):
		self.all_articles = NewsListing(mapping_id=5, user=user, limit=4).recent()
		self.last_width = 0


	def parse(self):
		response = []
		if isinstance(self.all_articles, dict):
			self.all_articles = self.all_articles["articles"]

		for article in self.all_articles:
			# if self.last_width == 0:
			# 	column_size = choice([1, 2, 3])
			# 	self.last_width = column_size
			# else:
			# 	column_size = COLUMN_TOTAL_WIDTH - self.last_width
			# 	self.last_width = 0
			try:
				heading = article["heading"]
				obj = {
					"order": self.all_articles.index(article),
					"name": heading,
					"category": article.get("sub_heading"),
					"columns": 1,
					"tile_headline": article.get("heading"),
					"tile_subheading": article.get("sub_heading"),
					"tile_asset": [
						{
							"asset_type": article.get("asset_type"),
							"asset_url": article.get("image_url"),
							"relative_path": article.get("path"),
						}
					],
					"source": article.get('source'),
					"asset_type": article.get("asset_type"),
					"tile_cta_text": "READ MORE",
					"tile_cta_link": None,
					"tile_cta_article": article.get("slug"),
					"linked_outside": False,
					"sponsor": None,
				}
				response.append(obj)
			except KeyError as e:
				pass

		return response[:4]

class ArticleMightLike(object):
	"""
	Articles you might like
	"""
	def __init__(self, user):
		self.all_articles = NewsListing(mapping_id=5, user=user, limit=10).respective_article()
		self.last_width = 0

	def parse(self):
		response = []
		if isinstance(self.all_articles, dict):
			self.all_articles = self.all_articles["articles"]

		for article in self.all_articles:
			# if self.last_width == 0:
			# 	column_size = choice([1, 2, 3])
			# 	self.last_width = column_size
			# else:
			# 	column_size = COLUMN_TOTAL_WIDTH - self.last_width
			# 	self.last_width = 0
				try:
					heading = article["heading"]
					obj = {
						"order": self.all_articles.index(article),
						"name": heading,
						"category": article.get("sub_heading"),
						"columns": 1,
						"tile_headline": article.get("heading"),
						"tile_subheading": article.get("sub_heading"),
						"tile_asset": [
							{
								"asset_type": article.get("asset_type"),
								"asset_url": article.get("image_url"),
								"relative_path": article.get("path"),
							}
						],
						"source": article.get('source'),
						"asset_type": article.get("asset_type"),
						"tile_cta_text": "READ MORE",
						"tile_cta_link": None ,
						"tile_cta_article": article.get("slug"),
						"linked_outside": False,
						"sponsor": None
					}
					response.append(obj)
				except KeyError as e:
					pass

		return response[:4]

class ArticleRecent(object):
	"""
	Articles you might like
	"""
	def __init__(self, user):
		self.all_articles = NewsListing(mapping_id=5, user=user, limit=4).recent()
		self.last_width = 0

	def parse(self):
		response = []
		if isinstance(self.all_articles, dict):
			self.all_articles = self.all_articles["articles"]

		for article in self.all_articles:
			# if self.last_width == 0:
			# 	column_size = choice([1, 2, 3])
			# 	self.last_width = column_size
			# else:
			# 	column_size = COLUMN_TOTAL_WIDTH - self.last_width
			# 	self.last_width = 0
				try:
					heading = article["heading"]
					obj = {
						"order": self.all_articles.index(article),
						"name": heading,
						"category": article.get("sub_heading"),
						"columns": 1,
						"tile_headline": article.get("heading"),
						"tile_subheading": article.get("sub_heading"),
						"tile_asset": [
							{
								"asset_type": article.get("asset_type"),
								"asset_url": article.get("image_url"),
								"relative_path": article.get("path"),
							}
						],
						"source": article.get('source'),
						"asset_type": article.get("asset_type"),
						"tile_cta_text": "READ MORE",
						"tile_cta_link": None ,
						"tile_cta_article": article.get("slug"),
						"linked_outside": False,
						"sponsor": None,
					}
					response.append(obj)
				except KeyError as e:
					pass

		return response[:4]

class NewArticleRecent(object):
	"""
	Homepage Default Tiles
	"""

	def homepage_queryset(self, param):
		default_tiles = ControllerCategory.objects.active_tiles(param)
		return default_tiles

	def recent_articles_queryset(self):
		return TemplateContent.objects.all_published2()[:4]


class OtherCategoryListing(object):
	"""
	Returns list of articles for separate sections
	"""
	def __new__(cls, tile_category, *args, **kwargs):
		tile_dict = {
			"insurance": ControllerCategory.objects.category_tiles,
			"marketplace_articles": ControllerCategory.objects.category_tiles,
			"marketplace_concept_cars": ControllerCategory.objects.category_tiles,
			"autoshow": ControllerCategory.objects.category_tiles,
			"siriusxm": ControllerCategory.objects.category_tiles,
		}
		tile_dict_values = {
			"insurance": INS,
			"marketplace_articles": MKTPLC_ARTICLES,
			"marketplace_concept_cars": MKTPLC_CONCEPT_CARS,
			"autoshow": AUTO_SHOW,
			"siriusxm": Sirius_XM,
		}
		try:
			return tile_dict[tile_category](tile_dict_values[tile_category])
		except (KeyError, ControllerCategory.DoesNotExist):
			return []

class OtherCategoryListing2(object):
	"""
	Returns list of articles for separate sections
	"""
	def __new__(cls, tile_category, *args, **kwargs):
		tile_dict = {
			"insurance": ControllerCategory.objects.category_tiles_exclude_poll_tiles,
			"marketplace_articles": ControllerCategory.objects.category_tiles_exclude_poll_tiles,
			"marketplace_concept_cars": ControllerCategory.objects.category_tiles_exclude_poll_tiles,
			"autoshow": ControllerCategory.objects.category_tiles_exclude_poll_tiles,
			"siriusxm": ControllerCategory.objects.category_tiles_exclude_poll_tiles,
		}
		tile_dict_values = {
			"insurance": INS,
			"marketplace_articles": MKTPLC_ARTICLES,
			"marketplace_concept_cars": MKTPLC_CONCEPT_CARS,
			"autoshow": AUTO_SHOW,
			"siriusxm": Sirius_XM,
		}
		try:
			return tile_dict[tile_category](tile_dict_values[tile_category])
		except (KeyError, ControllerCategory.DoesNotExist):
			return []

class CreateUpdateTile(object):
	"""
    create a tile
    """
	def __new__(cls,data,user,tile_id=None, *args, **kwargs):

		category = ControllerCategory.objects.get(id=data.get('category')) if data.get('category') else None
		asset = Asset.objects.get(id=data.get('tile_asset')) if data.get('tile_asset') else None
		article = TemplateContent.objects.get(id=data.get('tile_cta_article')) if data.get('tile_cta_article') else None
		sponsor = Sponsor.objects.get(id=data.get('sponsor')) if data.get('sponsor') else None
		campaign = Campaign.objects.get(id=data.get('campaign')) if data.get('campaign') else None

		validated_data = {
			"tile_name":data.get('name') if data.get('name')!=None else "",
			"order":data.get('order') if data.get('order')!="" else 0,
			"columns":data.get('columns') if data.get('columns')!="" and data.get('columns')!=None else 1,
			"campaign":campaign,
			"category":category,
			"poll_id":data.get('poll_id'),
			"tile_headline":data.get('tile_headline'),
			"tile_subheadline":data.get('tile_subheadline'),
			"tile_asset":asset,
			"tile_CTA_text":data.get('tile_cta_text') if data.get('tile_cta_text')!=None else " " ,
			"tile_CTA_link":data.get('tile_cta_link'),
			"tile_CTA_article":article,
			"is_active":data.get('active')if data.get('active')!=None else True,
			"sponsors":sponsor,
		}

		# New Record
		if not tile_id:
			created_tile, is_created = ControllerTile.objects.get_or_create(**validated_data)

			if is_created:
				data =created_tile.to_json

				return data
			else:
				data = created_tile.to_json
				return data
		# Update Record
		else:

			tileobj = ControllerTile.objects.get(id=tile_id)

			category = ControllerCategory.objects.get(id=data.get('category')) if data.get('category') else None
			asset = Asset.objects.get(id=data.get('tile_asset')) if data.get('tile_asset') else None
			article = TemplateContent.objects.get(id=data.get('tile_cta_article')) if data.get('tile_cta_article') else None
			sponsor = Sponsor.objects.get(id=data.get('sponsor')) if data.get('sponsor') else None
			campaign = Campaign.objects.get(id=data.get('campaign')) if data.get('campaign') else None

			validated_data = {
				"tile_name": data.get('name') if data.get('name') != None else tileobj.tile_name,
				"order": data.get('order') if data.get('order') != "" and data.get('order')!= None else tileobj.order,
				"columns":data.get('columns') if data.get('columns')!="" and data.get('columns')!=None else tileobj.columns,
				"category": category if category!=None else tileobj.category,
				"campaign": campaign if campaign!=None else tileobj.campaign,
				"poll_id": data.get('poll_id') if data.get('poll_id')!=None else tileobj.poll_id,
				"tile_headline": data.get('tile_headline') if data.get('tile_headline')!=None else tileobj.tile_headline,
				"tile_subheadline": data.get('tile_subheadline') if data.get('tile_subheadline')!=None else tileobj.tile_subheadline ,
				"tile_asset": asset if asset !=None else tileobj.tile_asset,
				"tile_CTA_text": data.get('tile_cta_text') if data.get('tile_cta_text') != None else tileobj.tile_CTA_text,
				"tile_CTA_link": data.get('tile_cta_link') if data.get('tile_cta_link')!=None else tileobj.tile_CTA_link,
				"tile_CTA_article": article if article !=None else tileobj.tile_CTA_article,
				"is_active": data.get('active') if data.get('active') != None and data.get('active') !="" else True,
				"sponsors": sponsor if sponsor!=None else tileobj.sponsors,
			}

			ControllerTile.objects.filter(id=tile_id).update(**validated_data)

			data = ControllerTile.objects.get(id=tile_id).to_json

			return data
