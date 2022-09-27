import json

from django.utils.text import slugify

from content_manager.models import TemplateContent, AssetContent, Asset, AssetType, PublishingState, ContentProvider, \
	ContentTagRelation, TagWeight
from tags.models import Tag


class GetContent(object):
	"""
	Feeding Database with the content from JSON file
	"""
	def __init__(self):
		self.content = json.load(open('content_manager/third_party_content/wcm.json', encoding='utf-8'))
		self.save_content()

	def save_content(self):
		for content in self.content:
			body_text = ""
			for text in content["content_elements"]:
				try:
					body_text += ''.join(text["content"])
				except Exception as e:
					print(str(e))
			try:
				article_byline = content["excerpt"]
			except Exception as e:
				article_byline = content["content_elements"][0]["content"]
			try:
				temp_obj, is_created = TemplateContent.objects.get_or_create(
					updated_on = content["modified_on"],
					created_on = content["imported_on"],
					guid = content["origin_slug"],
					content_heading = content["titles"]["main"],
					content_byline = article_byline,
					seo_meta_name = content["titles"]["seo"],
					seo_meta_description = content["titles"]["seo"],
					content_body = body_text,
					content_publish_date = content["published_on"],
					content_url = content["origin_url"]
				)
				try:
					image = content["featured_media"]["image"]["url"]
					asset_type_obj, is_created = AssetType.objects.get_or_create(name="image")
					asset_cnt, is_created = AssetContent.objects.get_or_create(content_url=image, identifier=temp_obj.content_heading)
					asset_obj, is_created = Asset.objects.get_or_create(asset_type_id=asset_type_obj.id, name=asset_cnt.identifier, template_location="spot_A")
					asset_obj.assets.add(asset_cnt)
					temp_obj.assets.add(asset_obj)
				except Exception as e:
					print(str(e))
					pass
				try:
					PublishingState.objects.get_or_create(
						content_id=temp_obj.id,
						publish_state="Ready To Approve"
					)
				except Exception as e:
					print(str(e))
					pass

				try:
					data_provider_name = content["credits"]["authors"][0]["name"]
					data_provider_url = content["credits"]["authors"][0]["url"]
					cp_obj, is_created = ContentProvider.objects.get_or_create(
						name=data_provider_name,
						url=data_provider_url
					)
					temp_obj.content_provider = cp_obj
					temp_obj.save()
				except Exception as e:
					print(str(e))
					pass
				try:
					for tag in content["tags"]:
						tag_obj, is_created = Tag.objects.get_or_create(
							name = tag["name"]
						)
						tag_wt_obj, is_created = TagWeight.objects.get_or_create(tag_id=tag_obj.id, weight=10)
						ctr_obj, is_created = ContentTagRelation.objects.get_or_create(
							content_id=temp_obj.id,
						)
						ctr_obj.tag_weightage.add(tag_wt_obj)
				except Exception as e:
					print(str(e))
					pass
			except Exception as e:
				print(str(e))
				pass