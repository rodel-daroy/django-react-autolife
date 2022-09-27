from django.contrib import admin

# Register your models here.
from marketplace.models import Sponsor, Partner, Campaign, Offers


class SponsorAdmin(admin.ModelAdmin):
	"""
	Sponsor's admin class
	"""
	list_display = ('id', 'name','external_link','image_img')
	search_fields = ('id','name','external_link',)


class PartnerAdmin(admin.ModelAdmin):
	"""
	Sponsor's admin class
	"""
	list_display = ('id', 'name','description','image_img',)
	search_fields = ('id','name','description',)


class CampaignAdmin(admin.ModelAdmin):
	"""
	Sponsor's admin class
	"""
	list_display = ('id', 'name',)
	search_fields = ('id', 'name',)
class OffersAdmin(admin.ModelAdmin):
	list_display = ('id','name','image_img',)
	search_fields = ('id','name',)


admin.site.register(Sponsor, SponsorAdmin)
admin.site.register(Partner, PartnerAdmin)
admin.site.register(Campaign, CampaignAdmin)
admin.site.register(Offers,OffersAdmin)
