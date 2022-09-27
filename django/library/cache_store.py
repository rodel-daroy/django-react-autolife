"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.core.cache import cache

from autolife.settings import CACHE_TIMEOUT

USER_RELATED = "{username}_user_related"
USER_INTEREST_BASED = "{username}_user_interest_based"
INTEREST_BASED_ARTICLES = "published_articles_interest_{interest}_based"
USER_LIKED_CONTENT = "{username}_liked_content"
USER_INTERESTS = "{username}_interests"
USER_LIKES = "{username}_likes"
USER_VISITS = "{username}_visits"
USER_TAG_RELATIONS = "{username}_all_user_tag_relations"
FEATURED = "featured"
MOST_POPULAR = "most_popular"
PUBLISHED = "published_content"
ARTICLES_MIGHT_LIKE = "{username}_articles_might_like"
RECENT_ARTICLES = "recent_articles"
RECENT_ARTICLES2 = "recent_articles2"
VEHICLES_UNCATEGORIZED = "uncategorized"
SHOPPING_MAKES = "shopping_makes"
SHOPPING_MODELS = "shopping_models"
INCENTIVE_SEARCH = "incentives_search"
VEHICLE_SPECS = "{vehicle_id}specs"
VEHICLE_INFO = "{vehicle_id}info"
VEHICLE_WARRANTY = "{vehicle_id}warranty"
VEHICLE_INCENTIVES = "{vehicle_id}incentives"
VEHICLE_META_INFO = "vehicle_meta_info"
DEALERS = "dealers"
JATO_HEADERS = "jato_headers"
SIMILAR_VEHICLES = "similar_vehicles"
DB_MAKES = "db_makes"
SELECTED_CONTENT = "selected_content"
INTERESTS_TAG = "interests_tag"
TAGGED_CONTENT = "tagged_content{content_id}"
HOMEPAGE_ACTIVE_TILES = "homepage_active_tiles"
CONTENT_PREFERENCES = "_content_preferences"
USER_INFO = "_user_info"
INSURANCE_AUTHORIZATION_HEADERS = "authorizaton_headers"

OLD_NEWS_RELATED_PERTICULAR_INTEREST = "old_news_related_perticular_interest_{map_id}"
OLD_NEWS_RELATED_RESPECTIVE_ARTICLES = "old_news_related_respective_articles_{map_id}"
OLD_NEWS_RELATED_RESPECTIVE_ARTICLES_NO_USER = "old_news_respective_articles_no_user_{map_id}"


class GetValuesFromCache(object):
	"""
	Getting values from redis-cache
	"""
	def __init__(self):
		pass

	def get_insurance_headers(self):
		return cache.get(INSURANCE_AUTHORIZATION_HEADERS)

	def get_user_info(self, username):
		return cache.get(username+USER_INFO)

	def user_content_preferences(self, username):
		return cache.get(username+CONTENT_PREFERENCES)

	def search(self, model, year):
		return cache.get(model+year)

	def search_with_incentives(self, model, year, postal_code):
		return cache.get(model+year+postal_code)

	def jato_vehicle_details(self, vehicle_id):
		return cache.get(vehicle_id)

	def jato_vehicle_specs(self, vehicle_id):
		return cache.get(VEHICLE_SPECS.format(vehicle_id=vehicle_id))

	def vehicle_info(self, vehicle_id):
		return cache.get(VEHICLE_INFO.format(vehicle_id=vehicle_id))


	def vehicle_warranty(self, vehicle_id):
		return cache.get(VEHICLE_WARRANTY.format(vehicle_id=vehicle_id))


	def vehicle_incentive(self, vehicle_id):
		return cache.get(VEHICLE_INCENTIVES.format(vehicle_id=vehicle_id))

	def dealers(self, postal_code, division):
		try:
			return cache.get(DEALERS).get(postal_code).get(division)
		except AttributeError as e:
			return None

	def vehicle_meta_info(self, vehicle_id):
		try:
			return cache.get(VEHICLE_META_INFO).get(vehicle_id)
		except :
			return None

	def jato_authorised_header(self):
		return cache.get(JATO_HEADERS)

	def get_browse_vehicle_list(self, category_slug):
		return cache.get(category_slug)

	def published_content(self):
		return cache.get(PUBLISHED)

	def recently_added_articles(self):
		return cache.get(RECENT_ARTICLES)

	def recently_added_articles2(self):
		return cache.get(RECENT_ARTICLES2)

	def articles_might_like(self, username):
		return cache.get(ARTICLES_MIGHT_LIKE.format(username=username))

	def get_user_related(self, username):
		return cache.get(USER_RELATED.format(username=username))

	def get_user_interest_based(self, username):
		return cache.get(USER_INTEREST_BASED.format(username=username))

	def liked_articles(self, username):
		return cache.get(USER_LIKED_CONTENT.format(username=username))

	def featured_article(self):
		return cache.get(FEATURED)

	def most_popular(self):
		return cache.get(MOST_POPULAR)

	def shopping_makes(self):
		return cache.get(SHOPPING_MAKES)

	def get_uncategorized(self):
		return cache.get(VEHICLES_UNCATEGORIZED)

	def shopping_models(self, make):
		return  cache.get(SHOPPING_MODELS+make)

	def shopping_similar_vehicle(self, vehicle_id):
		return None if not cache.get(SIMILAR_VEHICLES) else cache.get(SIMILAR_VEHICLES).get(vehicle_id)

	def get_db_makes(self):
		return cache.get(DB_MAKES)

	def get_interest_tags(self):
		return cache.get(INTERESTS_TAG)

	def content_details(self, slug):
		return cache.get(slug)

	def selected_content(self):
		return cache.get(SELECTED_CONTENT)

	def tagged_content(self, content_id):
		return cache.get(TAGGED_CONTENT.format(content_id=content_id))

	def user_likes(self, username):
		return cache.get(USER_LIKES.format(username=username))

	def user_visited(self, username):
		return cache.get(USER_VISITS.format(username=username))

	def user_interests(self, username):
		return cache.get(USER_INTERESTS.format(username=username))

	def all_user_tag_relations(self, username):
		return cache.get(USER_TAG_RELATIONS.format(username=username))

	def homepage_active_tiles(self):
		return cache.get(HOMEPAGE_ACTIVE_TILES)

	def articles_interest_based(self, interest):
		return cache.get(INTEREST_BASED_ARTICLES.format(interest=interest))

	#TODO: Remove after moving /news_section/ data to serializers
	def get_old_news_related_perticular_interest(self, map_id):
		return cache.get(OLD_NEWS_RELATED_PERTICULAR_INTEREST.format(map_id=map_id))

	def get_old_news_related_respective_articles(self, map_id):
		return cache.get(OLD_NEWS_RELATED_RESPECTIVE_ARTICLES.format(map_id=map_id))

	def get_old_news_related_respective_articles_no_user(self, map_id):
		return cache.get(OLD_NEWS_RELATED_RESPECTIVE_ARTICLES_NO_USER.format(map_id=map_id))


class SetValuesInCache(object):
	"""
	Setting Velues in redis-cache
	"""
	def __init__(self):
		pass

	def set(self, key, value):
		cache.set(key, value, timeout=CACHE_TIMEOUT)

	def set_insurance_headers(self, headers):
		cache.set(INSURANCE_AUTHORIZATION_HEADERS, headers, timeout=CACHE_TIMEOUT/3)

	def set_user_info(self, username, data):
		self.set(username+USER_INFO, data)

	def set_content_preferences(self, username, data):
		self.set(username+CONTENT_PREFERENCES, data)

	def search(self, model, year, results, culture="en-ca"):
		self.set(model+year, results)

	def jato_vehicle_details(self, vehicle_id, results):
		self.set(vehicle_id, results)

	def jato_vehicle_specs(self, vehicle_id, results):
		self.set(VEHICLE_SPECS.format(vehicle_id=vehicle_id), results)

	def search_with_incentives(self, model, year, postal_code, results):
		self.set(model+year+postal_code, results)

	def vehicle_info(self, vehicle_id, results):
		self.set(VEHICLE_INFO.format(vehicle_id=vehicle_id), results)

	def vehicle_warranty(self, vehicle_id, results):
		self.set(VEHICLE_WARRANTY.format(vehicle_id=vehicle_id), results)

	def vehicle_incentive(self, vehicle_id, results):
		self.set(VEHICLE_INCENTIVES.format(vehicle_id=vehicle_id), results)

	def vehicle_dealers(self,  division, postal_code, results):
		pre_val = original_val = cache.get(DEALERS)
		if pre_val:
			if not pre_val.get(division):
				original_val.update({division:{postal_code: {"results": results}}})
			elif not pre_val.get(division).get(postal_code):
				original_val.get(division).update({postal_code:{"results": results}})
			self.set(DEALERS, original_val)
		else:
			self.set(DEALERS, {division:{postal_code:{"results": results}}})

	def vehicle_meta_info(self, vehicle_id, results):
		pre_val = original_val = cache.get(VEHICLE_META_INFO)
		if pre_val:
			if not pre_val.get(vehicle_id):
				original_val.update({vehicle_id: results})
				self.set(VEHICLE_META_INFO, original_val)
		else:
			self.set(VEHICLE_META_INFO, {vehicle_id: results})

	def jato_authorised_header(self, headers):
		self.set(JATO_HEADERS, headers)

	def set_uncategorized(self,  results):
		self.set(VEHICLES_UNCATEGORIZED, results)

	def set_browse_vehicle_list(self, category_slug, results):
		self.set(category_slug, results)

	def set_published_content(self, published_content):
		self.set(PUBLISHED, published_content)

	def set_recent_articles(self, recent_articles):
		self.set(RECENT_ARTICLES, recent_articles)

	def set_recent_articles2(self, recent_articles):
		self.set(RECENT_ARTICLES2, recent_articles)

	def set_articles_might_like(self, username, results):
		self.set(ARTICLES_MIGHT_LIKE.format(username=username), results)

	def set_user_related(self, username, results):
		self.set(USER_RELATED.format(username=username), results)

	def set_user_interest_based(self, username, results):
		self.set(USER_INTEREST_BASED.format(username=username), results)

	def set_user_liked_content(self, username, results):
		self.set(USER_LIKED_CONTENT.format(username=username), results)

	def set_featured(self, data):
		self.set(FEATURED, data)

	def set_most_popular(self, results):
		self.set(MOST_POPULAR, results)

	def set_shopping_makes(self, result):
		self.set(SHOPPING_MAKES, result)

	def set_shopping_models(self, make, result):
		self.set(SHOPPING_MODELS+make, result)

	def set_shopping_similar(self, vehicle_id, results):
		prev_val = cache.get(SIMILAR_VEHICLES)
		if not prev_val:        # first time case
			prev_val = {vehicle_id: results}
		else:   # if values are already there for siilar vehicles
			prev_val.update({vehicle_id: results})
		cache.set(SIMILAR_VEHICLES, prev_val)

	def set_makes(self, results):
		cache.set(DB_MAKES, results, timeout=CACHE_TIMEOUT*2)

	def set_interests_tags(self, results):
		cache.set(INTERESTS_TAG, results, timeout=CACHE_TIMEOUT*2)

	def content_details(self, slug, details):
		cache.set(slug, details, timeout=CACHE_TIMEOUT*2)

	def selected_content(self, results):
		cache.set(SELECTED_CONTENT, results)

	def tagged_content(self, content_id, results):
		cache.set(TAGGED_CONTENT.format(content_id=content_id),  results)

	def user_likes(self, username, likes):
		cache.set(USER_LIKES.format(username=username), likes)

	def user_visited(self, username, visits):
		cache.set(USER_VISITS.format(username=username), visits)

	def user_interests(self, username, results):
		cache.set(USER_INTERESTS.format(username=username), results)

	def all_user_tag_relations(self, username, results):
		cache.set(USER_TAG_RELATIONS.format(username=username), results)

	def set_homepage_active_tiles(self, data):
		cache.set(HOMEPAGE_ACTIVE_TILES, data)

	def set_article_interest_based(self, interest, results):
		self.set(INTEREST_BASED_ARTICLES.format(interest=interest), results)

	# TODO: Remove after moving /news_section/ data to serializers
	def set_old_news_related_perticular_interest(self, data, map_id):
		return self.set(OLD_NEWS_RELATED_PERTICULAR_INTEREST.format(map_id=map_id), data)

	def set_old_news_related_respective_articles(self, data, map_id):
		return self.set(OLD_NEWS_RELATED_RESPECTIVE_ARTICLES.format(map_id=map_id), data)

	def set_old_news_related_respective_articles_no_user(self, data, map_id):
		return self.set(OLD_NEWS_RELATED_RESPECTIVE_ARTICLES_NO_USER.format(map_id=map_id), data)


class UpdateCache(SetValuesInCache):
	"""
	Update cache
	"""
	def __init__(self):
		super().__init__()

	def update_insurance_headers(self):
		cache.delete(INSURANCE_AUTHORIZATION_HEADERS)

	def update_user_info(self, username):
		cache.delete(username+USER_INFO)

	def update_content_preferences(self, username):
		cache.delete(username+CONTENT_PREFERENCES)

	def browse_section(self, category_slug):
		self.set(category_slug, None)

	def clear_all(self):
		cache.clear()

	def clear_individual_article(self, slug):
		cache.delete(slug)

	def published_content(self):
		cache.delete(PUBLISHED)

	def recent_content(self):
		cache.delete(RECENT_ARTICLES)

	def article_cache(self):
		cache.delete(PUBLISHED)
		cache.delete(FEATURED)
		cache.delete(RECENT_ARTICLES)
		cache.delete(RECENT_ARTICLES2)

	def update_likes(self, username):
		cache.delete(username)

	def db_makes(self):
		cache.delete(DB_MAKES)

	def interests_tag(self):
		cache.delete(INTERESTS_TAG)

	def update_user_likes(self, username):
		cache.delete(USER_LIKES.format(username=username))

	def update_articles_might_like(self, username):
		cache.delete(ARTICLES_MIGHT_LIKE.format(username=username))

	def update_user_related(self, username):
		cache.delete(USER_RELATED.format(username=username))
		for key in cache.keys("{}_*".format(username)):
			cache.delete(key)

	def update_user_interest_based(self, username):
		cache.delete(USER_INTEREST_BASED.format(username=username))

	def update_interests(self, username):
		cache.delete(USER_INTERESTS.format(username=username))

	def update_visits(self, username):
		cache.delete(USER_VISITS.format(username=username))

	def update_user_tag_relations(self, username):
		cache.delete(USER_TAG_RELATIONS.format(username=username))

	def homepage_deafult_tiles_update(self):
		cache.delete(HOMEPAGE_ACTIVE_TILES)

	def jato_cache(self):
		cache.delete(JATO_HEADERS)
		cache.delete(SHOPPING_MAKES)

	def update_article_interest_based(self, interest_id):
		str = INTEREST_BASED_ARTICLES.format(interest=interest_id)
		cache.delete(str)

	# TODO: Remove after moving /news_section/ data to serializers
	def remove_old_news_related(self):
		for key in cache.keys("old_*"):
			cache.delete(key)










