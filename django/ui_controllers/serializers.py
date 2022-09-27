from rest_framework import serializers

from autolife import settings
from content_manager.models import TemplateContent, AssetAssociation, Asset, AssetType, AssetContent
from content_manager.serializers import AssetAssociationSerializer
from ui_controllers.models import ControllerTile, ControllerCategory


class AssetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetType
        fields = ('name',)


class AssetSerializer(serializers.ModelSerializer):
    asset_type = AssetTypeSerializer()
    # assets = AssetContentSerializer()
    class Meta:
        model = Asset
        fields = ('thumbnail','asset_type', 'assets' )
        depth = 1

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        asset_content = representation.pop('assets')
        for data in asset_content:
            for key in data:
                if key=='content':
                    representation["asset_url"] = asset_content[0][key]
                    representation["relative_path"]= None if not asset_content[0][key] else asset_content[0][key].replace("https://" + settings.AWS_S3_CUSTOM_DOMAIN, "")

                if key == 'alternate_text':
                    representation[key] = data[key]
        try:
            url = representation["relative_path"].replace('/media/uploads/', '')
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



class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='category_name')

    class Meta:
        model = ControllerCategory
        fields = ('name',)


class TemplateContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TemplateContent
        fields = ('slug',)


class UiTilesSerializer(serializers.ModelSerializer):
    tile_asset = AssetSerializer()
    category = CategorySerializer()
    tile_cta_article = TemplateContentSerializer(source='tile_CTA_article')
    tile_cta_link = serializers.CharField(source='tile_CTA_link')
    tile_cta_text = serializers.CharField(source='tile_CTA_text')
    name = serializers.CharField(source='tile_name')

    class Meta:
        model = ControllerTile
        fields = ('category','order','name','columns', 'tile_headline',
                  'tile_subheadline','tile_asset','tile_cta_text', 'tile_cta_link','tile_cta_article',
                  'sponsors', 'poll_id','linked_outside')
        depth = 1

    def to_representation(self, obj):
        representation = super().to_representation(obj)
        category = representation.pop('category')
        representation['category'] = category['name']

        if representation.get('tile_cta_article', None) is not None:
            tile_CTA_article = representation.pop('tile_cta_article')
            representation['tile_cta_article'] = tile_CTA_article['slug']

        if (representation.get('tile_asset', None) is not None):
            if (representation['tile_asset'].get('asset_type') is not None):
                asset_type = representation['tile_asset']['asset_type']
                representation['asset_type'] = asset_type

            representation['tile_asset'] = [representation['tile_asset']]

        return representation


# class AssetAssociationSerializer(serializers.ModelSerializer):
#     asset = AssetSerializer(many=False)
#     class Meta:
#         model = AssetAssociation
#         fields = ('asset',)
#         depth = 2



class RecentArticleSerializer(serializers.ModelSerializer):
    """
    TemplateContent model serializer class
    """
    order = 0
    name = serializers.CharField(source='content_heading')
    category = serializers.CharField(source='content_subheading')
    tile_headline = serializers.CharField(source='content_heading')
    tile_subheading = serializers.CharField(source='content_subheading')
    tile_cta_article = serializers.CharField(source='slug')

    tile_asset = AssetAssociationSerializer(many=True, source='asset_template_association')
    class Meta:
        model = TemplateContent
        fields = (
            'name',
            'category',
            'tile_headline',
            'tile_subheading',
            'tile_cta_article',
            'tile_asset',
        )
        depth=2

    def to_representation(self, obj):
        representation = super().to_representation(obj)

        representation['columns'] =  1
        try:
            representation['tile_asset'] =  [representation['tile_asset'][0]['asset']]
            representation['source'] =  representation['tile_asset'][0]['source']
            representation['asset_type'] =  representation['tile_asset'][0]['asset_type']

        except:
            pass

        representation['tile_cta_text'] = "READ MORE"
        representation['tile_cta_link'] = None
        representation['linked_outside'] = False
        representation['sponsor'] = None
        representation['order'] = self.order
        representation['tile_subheadline'] = representation.pop('tile_subheading')
        self.order +=1

        return representation