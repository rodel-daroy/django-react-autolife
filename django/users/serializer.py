"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework.serializers import ModelSerializer

from users.models import Picture


class UploadImageSerializer(ModelSerializer):
    """
    Serializer for the UPloadedImage Model
    Provides the pk, image, thumbnail, title and description
    """

    class Meta:
        model = Picture
        fields = ('pk', 'image')
        read_only_fields = ('thumbnail',)
