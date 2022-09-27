from django.shortcuts import render
from rest_framework.views import APIView

from library.al_lib import ALResponse
from tags.models import TagType, Tag


class LifestyleAPI(APIView):
	"""
	API to get all lifestyles
	"""
	authentication_classes = ()
	permission_classes = ()

	def get(self, request):
		try:
			interest = TagType.objects.get(type_name="interests").id
		except:
			interest = None
		return ALResponse(data=[lifestyle.to_json for lifestyle in Tag.objects.filter(tag_type_id=interest)], status=200).success()












