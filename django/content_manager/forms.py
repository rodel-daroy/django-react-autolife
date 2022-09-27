"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from PIL import Image
from django import forms
from django.core.files.base import ContentFile

from content_manager.models import Asset, AssetContent, AssetType

from multiupload.fields import MultiFileField, MultiMediaField


class AssetForm(forms.ModelForm):
	"""
	Uploading Assets
	"""
	class Meta:
		model = Asset
		fields = ['asset_type', 'name', 'content_attribution', ]

	content = MultiFileField(min_num=1, max_num=10, max_file_size=1024 * 1024 * 500, help_text="PNGs are not supported in multi-upload")
	thumb = MultiMediaField(min_num=1, max_num=1, max_file_size=1024 * 1024 * 500, required=False)

	def save(self, commit=False):
		instance = super(AssetForm, self).save(commit)
		if self.cleaned_data["thumb"]:
			for each in self.cleaned_data['thumb']:
				instance.thumbnail = each
		else:
			if self.cleaned_data.get("asset_type").name == 'image' or self.cleaned_data.get("asset_type").name == 'carousel':
				for each in self.cleaned_data['content'][:1]:
					instance.thumbnail = each
		instance.save()

		for each in self.cleaned_data['content']:
			data = self.data.get("content_count").split(",")
			asset = AssetContent.objects.create(content=each, identifier=self.cleaned_data['name'], order=data.index(each.name))
			instance.assets.add(asset)
		return instance


class SimpleForm(forms.Form):
	"""
	Simple Form
	"""
	name = forms.CharField(label="Identifier")
	asset_type = forms.ModelChoiceField(queryset=AssetType.objects.all())

	attachments = MultiFileField(min_num=1, max_num=3, max_file_size=1024 * 1024 * 5)

	def save(self, commit=False):
		instance = Asset.objects.create(
			name=self.cleaned_data.get("name"),
			asset_type_id=self.cleaned_data.get("asset_type").id
		)

		pass


class AssetContentForm(forms.ModelForm):
	"""
	Asset Content Form to generate subclips of the video
	"""

	class Meta:
		model = AssetContent
		exclude = ('order',)