from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from django.contrib.admin.forms import forms

from content_manager.models import TemplateContent
from library.constants import DEFAULT_DB
from vehicles.models import Manufacturer, Make, Model, Year, Vehicle, VehicleCategory, Source, BodyStyle


# Make Related Admin classes
class MakeForm(ModelForm):

	class Meta:
		model = Make
		fields = '__all__'

	# def clean(self):
	# 	if self.cleaned_data.get('name'):
	# 		if Make.objects.using(DEFAULT_DB).filter(name=self.cleaned_data.get("name").title()).exists() or Make.objects.using(DEFAULT_DB).filter(name=self.cleaned_data.get("name")) and not self.instance.pk:
	# 			raise ValidationError("Make Name Should be unique")
	# 		return self.cleaned_data


class MakeAdmin(admin.ModelAdmin):
	list_display = ("name", "manufacturer", 'image_img',)   # display for listing
	form = MakeForm     # Custom validation added for make name unique value
	search_fields = ('name',)

	def image_img(self, obj):
		if obj.logo:
			return u'<img src="%s" width="150" height="150"/>' % obj.logo.url if obj.logo else ''
		else:
			return 'Thumbnail Not Available for asset'


class VehicleModelForm(ModelForm):

	class Meta:
		model = Model
		fields = '__all__'

	def clean(self):
		if self.cleaned_data.get('name'):
			if Model.objects.using(DEFAULT_DB).filter(name=self.cleaned_data.get("name").title()).exists() and not self.instance.pk or Model.objects.using(DEFAULT_DB).filter(name=self.cleaned_data.get("name")) and not self.instance.pk:
				raise ValidationError("Model Name Should be unique")
			return self.cleaned_data

	# article_field = forms.CharField()
	def __init__(self, *args, **kwargs):
		super(VehicleModelForm, self).__init__(*args, **kwargs)
		self.fields['make'] = forms.ModelChoiceField(
			queryset=Make.objects.using(DEFAULT_DB).all().order_by('name'),
			required=False
		)


class ModelAdmin(admin.ModelAdmin):
	list_display = ("id", "name", "make",)
	search_fields = ('id','name','make__name' )
	form = VehicleModelForm


# Manufacturer related admn classes
class ManufacturerForm(ModelForm):

	class Meta:
		model = Manufacturer
		fields = '__all__'

	def clean(self):
		if self.cleaned_data.get("name"):
			if Manufacturer.objects.using(DEFAULT_DB).filter(name=self.cleaned_data.get("name").title()).exists() and not self.instance.pk or Manufacturer.objects.using(DEFAULT_DB).filter(name=self.cleaned_data.get("name")) and not self.instance.pk:
				raise ValidationError("Manufacturer name should be unique")
			return self.cleaned_data


class ManufacturerAdmin(admin.ModelAdmin):
	list_display = ('id', 'name',)
	form = ManufacturerForm
	search_fields = ('id','name', )


# Vehicle Related admin classes
class VehicleForm(ModelForm):

	# article_field = forms.CharField()
	def __init__(self, *args, **kwargs):
		super(VehicleForm, self).__init__(*args, **kwargs)
		self.fields['article'] = forms.ModelChoiceField(
			queryset=TemplateContent.objects.using(DEFAULT_DB).filter(template="Vehicle Editorial Template").order_by(
				'content_heading'
			),
			required=False
		)
		self.fields['make'] = forms.ModelChoiceField(
			queryset=Make.objects.using(DEFAULT_DB).all().order_by('name'),
			required=False
		)
		self.fields["model"] = forms.ModelChoiceField(
			queryset=Model.objects.using(DEFAULT_DB).all().order_by('name'),
			required=False
		)
		self.fields["year"] = forms.ModelChoiceField(
			queryset=Year.objects.using(DEFAULT_DB).all().order_by('year_name'),
			required=False
		)
		self.fields["category"] = forms.ModelChoiceField(
			queryset=VehicleCategory.objects.using(DEFAULT_DB).all().order_by('category_name'),
			required=False
		)
		self.fields["body_style"] = forms.ModelChoiceField(
			queryset=BodyStyle.objects.using(DEFAULT_DB).all().order_by('body_style_name'),
			required=False
		)


	def save(self, commit=True):
		return super(VehicleForm, self).save(commit=commit)

	def clean(self):
		pass


class VehicleAdmin(admin.ModelAdmin):
	list_display = ('vehicle_name','year','body_style','category', 'article','source_id','image_img',)
	exclude = ('cached_results', )
	form = VehicleForm
	list_filter = ('category_id',)
	# search_fields = ('year__year_name', 'source_id','body_style__body_style_name','vehicle_name','article__content_heading','category__category_name',)
	search_fields = ('category__category_name','year__year_name', 'source_id','body_style__body_style_name','vehicle_name','article__content_heading',)

	def save_model(self, request, obj, form, change):
		try:
			super(VehicleAdmin, self).save_model(request, obj, form, change)
		except ValidationError as e:
			messages.add_message(request, messages.ERROR, str(e).replace('[','').replace(']', ''))


# Year realated admin classes
class YearForm(ModelForm):

	class Meta:
		model = Model
		fields = '__all__'

	def clean(self):
		if self.cleaned_data.get("year_name"):
			if self.cleaned_data.get("year_name").replace(".",'').isdigit():
				if Year.objects.using(DEFAULT_DB).filter(year_name=self.cleaned_data.get("year_name")).exists() and not self.instance.pk:
					raise ValidationError("Year name should be unique")
				return self.cleaned_data
			else:
				raise ValidationError("Year name must be a floating or integer value")


class YearAdmin(admin.ModelAdmin):
	list_display = ('id', 'year_name',)
	form = YearForm


# Vehicle category related admin classes
class VehicleCategoryForm(ModelForm):
	class Meta:
		model = VehicleCategory
		fields = '__all__'

	def clean(self):
		if self.cleaned_data.get("category_name"):
			if VehicleCategory.objects.using(DEFAULT_DB).filter(category_name=self.cleaned_data.get("category_name").lower()).exists() and not self.instance.pk or VehicleCategory.objects.using(DEFAULT_DB).filter(category_name=self.cleaned_data.get("category_name")) and not self.instance.pk:
				raise ValidationError("Category name should be unique")
			return self.cleaned_data


class VehicleCategoryAdmin(admin.ModelAdmin):
	list_display = ("category_name", "created_on", 'slug','order','image_img',)
	# exclude = ("slug", )
	form = VehicleCategoryForm
	search_fields = ('slug','category_name', )


# Bodystyle related admin classes
class BodyStyleAdmin(admin.ModelAdmin):
	list_display = ('id', 'body_style_name')
	search_fields = ('id', 'body_style_name',)


# Source related admin classes
class SourceAdmin(admin.ModelAdmin):
	list_display = ('id', 'name')


admin.site.register(Manufacturer, ManufacturerAdmin)
admin.site.register(Make, MakeAdmin)
admin.site.register(Model, ModelAdmin)
admin.site.register(Year, YearAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(VehicleCategory, VehicleCategoryAdmin)
admin.site.register(Source, SourceAdmin)
admin.site.register(BodyStyle, BodyStyleAdmin)
