from django import forms
from django.contrib import admin

# Register your models here.
from content_manager.models import Asset, TemplateContent
from library.constants import DEFAULT_DB
from ui_controllers.models import ControllerCategory, ControllerTile


class ControllerTileForm(forms.ModelForm):
	"""
	Customized fields for controller tile
	"""
	tile_asset = forms.ModelChoiceField(queryset=Asset.objects.using(DEFAULT_DB).all().order_by('name'), required=False)
	tile_CTA_article = forms.ModelChoiceField(
		queryset=TemplateContent.objects.using(DEFAULT_DB).filter(available_in_trends=True).order_by('content_heading'), required=False
	)


class ControllerTileAdmin(admin.ModelAdmin):
	"""
	Admin for controller tile model
	"""
	form = ControllerTileForm
	exclude = ('order', )
	list_display = ('tile_headline', 'category','is_active','tile_name','tile_CTA_text','tile_CTA_link','sponsors', )
	search_fields = ('tile_headline', 'tile_CTA_article__content_heading', 'category__category_name','tile_name','tile_CTA_text','tile_CTA_link')

class ControllerCategoryAdmin(admin.ModelAdmin):
	list_display=('id','category_name',)
	search_fields = ('id','category_name',)



admin.site.register(ControllerCategory,ControllerCategoryAdmin)
admin.site.register(ControllerTile, ControllerTileAdmin)