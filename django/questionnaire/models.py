from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from autolife.local_settings import AWS_S3_CUSTOM_DOMAIN
from core.models import Core
from library.al_lib import GUID
from tags.models import Tag


class Option(models.Model):
	text = models.CharField(max_length=255)
	image = models.CharField(max_length=500, blank=True, null=True, help_text=(
	"if providing s3 path, provide relative path(e.g /media/uploads/image.jpg) and make sure the url exists"))
	tags = models.ManyToManyField(Tag, blank=True, related_name="answer_tags")
	guid = models.CharField("GUID (Leave Empty)", max_length=255, blank=True, null=True)

	def __str__(self):
		return self.text

	@property
	def to_json(self):
		obj = {
			"text": self.text,
			"image": self.image,
			"option_id": self.id
		}
		if obj["image"]:
			if not "http" in obj["image"]:
				obj["image"] = "https://" + AWS_S3_CUSTOM_DOMAIN + self.image
		return obj

	def image_img(self):
		if self.image:
			if self.image.endswith("mp4") or self.image.endswith("webm") or self.image.endswith('swf'):
				return u'<video width="200" height="150" poster="https://s3media.247sports.com/Uploads/Video/0/14_0.jpg" controls>' \
				       u'<source src="%s" type="video/mp4"></video>' %self.image
			else:
				return u'<img src="%s" width="200" height="150"/>' % self.image
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True


class Question(models.Model):
	"""
	Question model to save questions of soft registration.
	"""
	QUESTION_TYPE = (
		('MULTIPLE_CHOICE', 'MULTIPLE_CHOICE'),
		('SINGLE_CHOICE', 'SINGLE_CHOICE'),
	)

	parent_option = models.ForeignKey(Option, related_name="related_option", blank=True, null=True, on_delete=models.CASCADE)
	question_text = models.CharField(max_length=255)
	question_type = models.CharField(max_length=20, choices=QUESTION_TYPE, default='SINGLE_CHOICE')
	options = models.ManyToManyField(Option, related_name="options_available", blank=True)
	guid = models.CharField("GUID (Leave Empty)", max_length=255, blank=True, null=True)
	last_question = models.BooleanField(default=False)
	next_question = models.ForeignKey('self', blank=True, null=True)
	is_first_question = models.BooleanField(default=False)

	def __str__(self):
		return self.question_text

	@property
	def to_json(self):
		return {
			"text": self.question_text,
			"type": self.question_type,
			"options": [option.to_json for option in self.options.all()],
			"is_last_question": self.last_question,
			"next_question": None if not self.next_question else self.next_question.to_json
		}


@receiver(post_save, sender=Option, dispatch_uid="update_guid")
def generate_uid(sender, instance, **kwargs):
	if not instance.guid:
		instance.guid = GUID(instance.id, encrypt=True)
		print(instance.guid)
		instance.save()


@receiver(post_save, sender=Question, dispatch_uid="update_guid")
def generate_uid(sender, instance, **kwargs):
	if not instance.guid:
		instance.guid = GUID(instance.id, encrypt=True)
		print(instance.guid)
		instance.save()
