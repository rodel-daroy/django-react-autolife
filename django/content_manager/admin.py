from datetime import datetime

from dateutil.parser import parse
from django.contrib import admin
from django.core.exceptions import ValidationError
from django import forms

from content_manager.models import TemplateContent, AssetType, Asset, ContentProvider, AdSection, \
	PublishingState, AssetContent, AssetAssociation, ContentTagRelation, ContentTagWeight
from library.constants import ASSET_CSS, DEFAULT_DB

# Content related admin classes
from marketplace.models import Sponsor, Campaign
from regions.models import Country, City, State
from tags.models import Tag


class TemplateContentForm(forms.ModelForm):
	secondary_navigation = forms.ModelMultipleChoiceField(queryset=TemplateContent.objects.using(DEFAULT_DB).filter().order_by('content_heading'), required=False)
	related_articles = forms.ModelMultipleChoiceField(queryset=TemplateContent.objects.using(DEFAULT_DB).filter().order_by('content_heading'),  required=False)
	asset_template_association = forms.ModelMultipleChoiceField(queryset=AssetAssociation.objects.using(DEFAULT_DB).filter().order_by('asset__name'),  required=False)
	content_provider = forms.ModelChoiceField(queryset=ContentProvider.objects.using(DEFAULT_DB).all().order_by('name') , required=False)
	related_ads = forms.ModelMultipleChoiceField(queryset=AdSection.objects.using(DEFAULT_DB).order_by('name'), required=False)
	campaign = forms.ModelMultipleChoiceField(queryset=Campaign.objects.using(DEFAULT_DB).order_by('name'), required=False)
	country = forms.ModelChoiceField(queryset=Country.objects.using(DEFAULT_DB).all().order_by('name'), required=False)
	state = forms.ModelChoiceField(queryset=State.objects.using(DEFAULT_DB).all().order_by('name'), required=False)
	city = forms.ModelChoiceField(queryset=City.objects.using(DEFAULT_DB).all().order_by('name'), required=False)
	sponsor = forms.ModelChoiceField(queryset=Sponsor.objects.using(DEFAULT_DB).all().order_by('name'), required=False)
	likes = forms.IntegerField(required=False)
	views = forms.IntegerField(required=False)
	search_boost = forms.IntegerField(required=False)


class TemplateContentAdmin(admin.ModelAdmin):
	"""
	Django administration UI customization
	"""

	list_display = (
		'slug',
		'id',
		'content_heading',
		'content_publish_date',
		'is_featured',
		'content_provider',
		'sponsor',
		'template',
		'available_in_trends',
)
	form = TemplateContentForm
	search_fields = ('id','content_heading','template','content_subheading','slug','content_body',)
	exclude = ('make', 'models', 'year', 'manufacturer', 'template_configuration', 'make_model')


# Tag weight related admin classes "
class TagWeightForm(forms.ModelForm):
	tag = forms.ModelChoiceField(queryset=Tag.objects.using(DEFAULT_DB).all().order_by('name'))


class TagWeightAdmin(admin.ModelAdmin):
	"""
	Customized view for the table
	"""
	form = TagWeightForm
	list_display = (
		'id',
		'tag',
		'weight',
	)
	search_fields = ('id','tag__name','weight',)


# Publishing state related admin classes
class PublishingStateForm(forms.ModelForm):
	content = forms.ModelChoiceField(queryset=TemplateContent.objects.using(DEFAULT_DB).all().order_by('content_heading'))


	class Meta:
		model = PublishingState
		fields = '__all__'

	def clean(self):
		time_now = datetime.now().date()

		input_time1 = self.cleaned_data.get("do_not_publish_until")
		input_time2 = self.cleaned_data.get("unpublishing_on")
		try:
			if input_time1.date() < time_now or input_time2.date() < time_now:
				raise ValidationError(" Dates should not be less than today!")
		except Exception as e:
			pass
		return self.cleaned_data


class PublishingStateAdmin(admin.ModelAdmin):
	"""
	Customized view for the publishing state
	"""

	list_display = (
		'id',
		'content',
		'content_id',
		'publish_state',
		'unpublishing_on',
		'do_not_publish_until',
	)
	form = PublishingStateForm
	search_fields = ('id',"publish_state", "content__content_heading",'unpublishing_on',
		'do_not_publish_until',)


# Assets related admin classes
class AssetForm(forms.ModelForm):
	assets = forms.ModelMultipleChoiceField(queryset=AssetContent.objects.using(DEFAULT_DB).order_by("identifier"), required=False)
	thumbnail = forms.ImageField(required=False)

	class Meta:
		model = Asset
		fields = '__all__'
		exclude = ()
		widgets = {
			'assets': forms.SelectMultiple(attrs={'height': 200})
		}

class ContentInline(admin.StackedInline):
	model = Asset.assets.through
	extra = 0


class AssetAdmin(admin.ModelAdmin):
	"""
	Asset Admin
	"""
	form = AssetForm
	# formfield_overrides = {models.ManyToManyField: {'widget': forms.SelectMultiple(attrs={'size': '100'})}, }
	list_display = (
		'id', 'name', 'asset_type','content_attribution','image_img',
	)
	search_fields = ('id','name', 'asset_type__name')
	inlines = [
		ContentInline,
	]
	class Media:
		css = {
			"all": (ASSET_CSS)
		}


class AssetTypeAdmin(admin.ModelAdmin):
	"""
	Asset Type Admin
	"""
	list_display = (
		"id", "name"
	)
	search_fields = ('id','name', )


class AssetContentAdmin(admin.ModelAdmin):
	"""
	Asset content admin
	"""

	def get_queryset(self, request):
		qs = super(AssetContentAdmin, self).get_queryset(request)
		if request.user.is_superuser:
			return qs
		return qs.order_by("-id")

	list_display = (
		'id','identifier', 'image_img','alternate_text','order','start_time','duration',
	)
	exclude = ('thumbnail', 'thumbnail_url',)
	search_fields = ('id','identifier','alternate_text', )


class AdSectionAdmin(admin.ModelAdmin):
	"""
	Ad section Admin
	"""
	list_display = (
		'id', 'name',
	)
	exclude = ('location',)
	search_fields = ('id','name', 'location',)


# Content Tag relation related admin classes
class ContentTagRelationForm(forms.ModelForm):
	content = forms.ModelChoiceField(queryset=TemplateContent.objects.using(DEFAULT_DB).all().order_by('content_heading'))
	tag_weightage = forms.ModelMultipleChoiceField(queryset=ContentTagWeight.objects.using(DEFAULT_DB).order_by('tag__name'))


class ContentTagRelationAdmin(admin.ModelAdmin):
	form = ContentTagRelationForm
	list_display = (
		'id','content',
	)
	search_fields = ('content__content_heading','id',)

class AssetAssociationAdmin(admin.ModelAdmin):
	list_display = ('id','asset','template_location')
	search_fields = ('id','asset__name','template_location')


admin.site.register(TemplateContent, TemplateContentAdmin)
admin.site.register(AssetContent, AssetContentAdmin)
admin.site.register(AssetAssociation,AssetAssociationAdmin)
admin.site.register(AssetType, AssetTypeAdmin)
admin.site.register(Asset, AssetAdmin)
admin.site.register(AdSection, AdSectionAdmin)
# admin.site.register(ContentProvider)
admin.site.register(ContentTagRelation, ContentTagRelationAdmin)
admin.site.register(ContentTagWeight, TagWeightAdmin)
admin.site.register(PublishingState, PublishingStateAdmin)
