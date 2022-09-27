

from tags.models import Tag, TagType



class GetTypeTag(object):
	"""
	Tags which has some type will be returned
	"""
	def __new__(cls, *args, **kwargs):
		tag_list = []
		for category in TagType.objects.all():
			if category.type_name != "lifestyle":
				cat_obj = {"label": category.type_name}
				cat_obj["children"] = [tag.to_json for tag in Tag.objects.filter(tag_type_id=category.id)]
				tag_list.append(cat_obj)
		return tag_list