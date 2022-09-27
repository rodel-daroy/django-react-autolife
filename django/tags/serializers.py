"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework import serializers

from tags.models import Tag


class TagSerializer(serializers.ModelSerializer):
	"""
	Tag Model serializers
	"""

	class Meta:
		model = Tag
		fields = ('id', 'url', 'name')