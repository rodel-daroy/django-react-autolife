"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.utils import timezone
from rest_framework import serializers

from autolife import settings
from content_manager.models import TemplateContent, AssetAssociation, Asset, AssetType, AssetContent, PublishingState
from operator import mul


class AssetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetType
        fields = ('name',)


class AssetSerializer(serializers.ModelSerializer):
    asset_type = AssetTypeSerializer()
    class Meta:
        model = Asset
        fields = ('thumbnail','asset_type', 'assets','source', )
        depth = 1

    def to_representation(self, obj):
        """Move fields from profile to user representation."""
        representation = super().to_representation(obj)
        asset_content = representation.pop('assets')
        if asset_content != []:

            for data in asset_content:
                for key in data:
                    if key=='content':
                        representation["asset_url"] = asset_content[0][key]
                        representation["path"]= None if not asset_content[0][key] else asset_content[0][key].replace("https://" + settings.AWS_S3_CUSTOM_DOMAIN, "")
        else:
            representation["asset_url"] = ''
            representation["path"] = ''
        try:
            url = representation["path"].replace('/media/uploads/', '')
            asset_type = representation.pop('asset_type')

            representation["video_thumbnail"]= [] if not asset_type else [
                {"1920": "https://" + settings.AWS_S3_CUSTOM_DOMAIN + '/1920/' + url},
                {"960": "https://" + settings.AWS_S3_CUSTOM_DOMAIN + '/960/' + url},
                {"640": "https://" + settings.AWS_S3_CUSTOM_DOMAIN + '/640/' + url}
            ] if url and asset_type['name'] == "video" else []

            representation['asset_type'] = asset_type['name']
        except:
            pass
        return representation


class AssetAssociationSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(many=False)
    class Meta:
        model = AssetAssociation
        fields = ('asset',)
        depth = 2



class TemplateContentSerializer(serializers.ModelSerializer):
    """
    TemplateContent model serializer class
    """
    date = serializers.DateTimeField(source='content_publish_date')
    synopsis = serializers.CharField(source='content_synopsis')
    sub_heading = serializers.CharField(source='content_subheading')
    content_id = serializers.IntegerField(source='id')
    heading = serializers.CharField(source='content_heading')

    asset_template_association = AssetAssociationSerializer(many=True)
    class Meta:
        model = TemplateContent
        fields = (
            'slug',
            'date',
            'content_id',
            'heading',
            'sub_heading',
            'asset_template_association',
            'synopsis',
            'template',
        )


    def get_publish_state(self,obj):
        try:
            a= PublishingState.objects.get(content=obj.id).to_json
            publish_state =a['publish_state']
            unpublishing_on =a['unpublishing_on']
            do_not_publish_until =a['do_not_publish_until']
            article_publish_date =a['article_publish_date']

            if obj.available_in_trends and publish_state==3 and article_publish_date <= timezone.now():
                if unpublishing_on == None and do_not_publish_until==None :
                    status = True
                    a['status'] = status
                elif unpublishing_on >= timezone.now() and do_not_publish_until <= timezone.now() :
                    status = True
                    a['status'] = status
                else:
                    status = False
                    a['status'] = status
            else:
                status = False
                a['status'] = status

        except:
            a= None
        return a




    def to_representation(self, obj):
        """Move fields from assets to template content."""
        representation = super().to_representation(obj)
        asset_template_association = representation.pop('asset_template_association')
        for data in asset_template_association:
            for item in data['asset']:
                representation[item] = asset_template_association[0] ['asset'][item]

        representation['vehicle'] =  None if not obj.vehicle_set.filter().exists() else obj.vehicle_set.filter()[0].search_json
        representation['publishing_state'] =  self.get_publish_state(obj)
        representation['status'] =  self.get_publish_state(obj)['status'] if self.get_publish_state(obj) else False

        allowed_keys = ['source', 'video_thumbnail', 'date', 'asset_type', 'asset_url', 'sub_heading', 'synopsis', 'thumbnail']
        allowed_keys += ['heading', 'vehicle', 'content_id', 'slug', 'template', 'path']
        for key in allowed_keys:
            try:
                _ = representation[key]
            except KeyError:
                representation[key] = ''
                if key == 'thumbnail':
                    representation[key] = None
                if key == 'video_thumbnail':
                    representation[key] = []
        representation['image_url'] = representation.pop('asset_url')
        return representation


class ArticleContentSerializer(serializers.ModelSerializer):
    """
    TemplateContent model serializer class
    """
    date = serializers.DateTimeField(source='content_publish_date')
    synopsis = serializers.CharField(source='content_synopsis')
    sub_heading = serializers.CharField(source='content_subheading')
    content_id = serializers.IntegerField(source='id')
    heading = serializers.CharField(source='content_heading')
    score = serializers.SerializerMethodField('calulate_score')
    asset_template_association = AssetAssociationSerializer(many=True)


    class Meta:
        model = TemplateContent
        fields = (
            'slug',
            'score',
            'date',
            'content_id',
            'heading',
            'sub_heading',
            'asset_template_association',
            'synopsis',
            'template',
        )


    def calulate_score(self, obj):
        likes = obj.likes
        views = obj.views
        likes = likes if likes else 0
        views = views if views else 0
        return sum([(mul(int(likes), 0.8)), (mul(int(views), 0.2))])


    def to_representation(self, obj):
        """Move fields from assets to template content."""
        representation = super().to_representation(obj)
        asset_template_association = representation.pop('asset_template_association')
        for data in asset_template_association:
            for item in data['asset']:
                representation[item] = asset_template_association[0] ['asset'][item]

        representation['vehicle'] =  None if not obj.vehicle_set.filter().exists() else obj.vehicle_set.filter()[0].search_json
        allowed_keys = ['source', 'video_thumbnail', 'date', 'asset_type', 'asset_url', 'sub_heading', 'synopsis', 'thumbnail']
        allowed_keys += ['heading', 'vehicle', 'content_id', 'slug', 'template', 'path']
        for key in allowed_keys:
            try:
                _ = representation[key]
            except KeyError:
                representation[key] = ''
                if key == 'thumbnail':
                    representation[key] = None
                if key == 'video_thumbnail':
                    representation[key] = []

        representation['image_url'] = representation.pop('asset_url')
        return representation


