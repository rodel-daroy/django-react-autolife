"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.db import models
from django.db.models import QuerySet

from library.cache_store import GetValuesFromCache, SetValuesInCache


class TileQuerySet(QuerySet):

	def active_only(self):
		tiles = GetValuesFromCache().homepage_active_tiles()
		if not tiles:
			tiles = self.filter(is_active=True)
			SetValuesInCache().set_homepage_active_tiles(tiles)
		return tiles


class TileManager(models.Manager):
	"""
	Manager to handle Tiles
	"""

	def get_queryset(self):
		return TileQuerySet(model=self.model, using=self._db)

	def active_tiles(self):
		return self.get_queryset().active_only()


class TileCategoryQuerySet(QuerySet):

	def active_tiles(self, category):

		return self.get(category_name=category).controllertile_set.filter(is_active=True).order_by('order')

	def active_tiles_without_poll_id(self, category):
		return self.get(category_name=category).controllertile_set.filter(is_active=True,poll_id=None).order_by('order')


class TileCategoryManager(models.Manager):
	"""
	Model manager for Tiles Category
	"""
	def get_queryset(self):
		return TileCategoryQuerySet(self.model, using=self._db)

	def category_tiles(self, category):
		return [tile.to_json for tile in self.get_queryset().active_tiles(category)]

	def category_tiles_exclude_poll_tiles(self,category):
		return [tile.to_json for tile in self.get_queryset().active_tiles_without_poll_id(category)]

	def active_tiles(self, category):
		return self.get_queryset().active_tiles(category)



