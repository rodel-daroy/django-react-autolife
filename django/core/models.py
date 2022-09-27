from django.db import models

# Create your models here.


class Core(models.Model):
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class Version(Core):
	"""
	Stores latest version number of the frontend and backend code
	"""
	frontend_version = models.CharField(max_length=255)
	backend_version = models.CharField(max_length=255)
	enabled = models.BooleanField(default=True)

	def save(self, *args, **kwargs):
		try:
			Version.objects.latest("id").delete()   # For first time
		except Version.DoesNotExist:
			pass
		super(Version, self).save(*args, **kwargs)

	@property
	def to_json(self):
		return {
			"frontend_version": self.frontend_version,
			"backend_version": self.backend_version,
			"created_at": str(self.created_on),
			"enabled": self.enabled
		}
