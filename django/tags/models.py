from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Core
from library.al_lib import GUID
from library.cache_store import UpdateCache


class TagType(Core):
	"""
	Type of tags
	"""
	type_name = models.CharField(max_length=100)

	def __str__(self):
		return self.type_name

	def save(self, *args , **kwargs):
		self.type_name = self.type_name.lower().strip()
		super(TagType, self).save(*args, **kwargs)


class Tag(Core):
	name = models.CharField("tag name", max_length=255)
	tag_line = models.CharField("Tag line", max_length=100, blank=True, null=True)
	image = models.FileField(upload_to='uploads/', blank=True, null=True)
	guid = models.CharField("GUID (Leave Empty)", max_length=255, blank=True, null=True)
	tag_type = models.ForeignKey(TagType, blank=True, null=True,
	                             help_text='If tag type available', on_delete=models.CASCADE)

	def save(self, *args, **kwargs):
		self.name = self.name.strip().lower()   # saving tags in lower case.
		if not self.pk:
			if not self.tag_type:
				try:
					Tag.objects.get(name=self.name)
				except ObjectDoesNotExist:
					super(Tag, self).save(*args, **kwargs)
			elif self.tag_type:
				UpdateCache().interests_tag()
				try:
					Tag.objects.get(name=self.name, tag_type=self.tag_type)
				except ObjectDoesNotExist:
					super(Tag, self).save(*args, **kwargs)
		else:
			super(Tag, self).save(*args, **kwargs)
		# Clear Interest Based Article Cache
		UpdateCache().update_article_interest_based(self.pk)

	def __str__(self):
		return self.name

	@property
	def to_json(self):
		return {
			"label": self.name,
			"image": None if not self.image else self.image.url,
			"tag_line": self.tag_line,
			"id": self.id,
			"name": self.name
		}

	def image_img(self):
		if self.image:
			if self.image.url.endswith("mp4") or self.image.url.endswith("webm") or self.image.url.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.image
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.image
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True


@receiver(post_save, sender=Tag, dispatch_uid="update_guid")
def generate_uid(sender, instance, **kwargs):
	if not instance.guid:
		instance.guid = GUID(instance.id, encrypt=True)
		instance.save()


