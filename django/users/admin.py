from django.contrib import admin
from django import forms
from import_export import resources

from autolife.local_settings import DEBUG
from content_manager.models import TemplateContent
from library.constants import DEFAULT_DB
from tags.models import Tag, TagType
from users.models import Profile, Picture, UserTagRelation, ContactAction, EmailConfirmation, Score, Visit, Action, \
	RecallCheckHistory, TradeInValueHistory, FuturevalueHistory, AverageAskingPriceHistory, InsuranceHistory
from import_export.admin import ImportExportModelAdmin

# if not DEBUG:
# 	url = '/api/analytics/password_set/'
# else:
# 	url = '/analytics/password_set/'

url = '/analytics/password_set/'
try:
	interest = TagType.objects.using(DEFAULT_DB).get(type_name="interests").id
except:
	interest = None
	


class ProfileForm(forms.ModelForm):

	password = forms.CharField(help_text=("Raw passwords are not stored, so there is no way to see "
	                                      +	                                                "this user's password, but you can change the password "
	                                      +	                                                "using <a href=\"{url}\" target='_blank'>this form</a>.".format(url=url)))
	interests = forms.ModelMultipleChoiceField(queryset=Tag.objects.using(DEFAULT_DB).filter(tag_type_id=interest).order_by('name'), required=False)
	liked_content = forms.ModelMultipleChoiceField(queryset=TemplateContent.objects.using(DEFAULT_DB).filter().order_by('content_heading'), required=False)

	def __init__(self, *args, **kwargs):
		super(ProfileForm, self).__init__(*args, **kwargs)
		self.fields['password'].disabled = True


class ProfileAdmin(admin.ModelAdmin):
	"""
	Fields exclude at admin panel
	"""
	form = ProfileForm
	exclude = ('tags', 'shared_content', 'postal_code',
	           'blacklist', 'fb_profile', 'gp_profile', 'twitter_profile', 'user_permissions',
	            'lifestyle','score','actions','visits','visit_insurance','tools_avg_asking_price','tools_trade_in_value','tools_future_value','tools_recall_check',)

	list_display = ('username', 'first_name','last_name','email', 'is_verified', 'is_superuser','is_active',)
	search_fields = ('username', 'first_name','last_name','email',)


class PictureAdmin(admin.ModelAdmin):
	list_display = ("id", "created_on", 'image_img',)


class UserTagRelationAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "tag", "weight")
	search_fields = ("id", "user__email", "tag__name", "weight")


class LocalResourceImportExport(resources.ModelResource):
	class Meta:
		model = ContactAction

class ContactAdmin(ImportExportModelAdmin):
	resource_class = LocalResourceImportExport
	search_fields = ('name', 'email','text')
	list_display = ('name', 'email','short_description','created_on')
	readonly_fields = ('created_on',)

class ConfirmEmailAdmin(admin.ModelAdmin):
	list_display = ('id', 'user')
	search_fields = ('id', 'user__email')


class VisitAdmin(admin.ModelAdmin):
	list_display = ('id','ip_address',)


class ActionAdmin(admin.ModelAdmin):
	list_display = ('id','change',)


class InsuranceHistoryAdmin(admin.ModelAdmin):
	list_display = ('make','model','year',)


class AverageAskingPriceHistoryAdmin(admin.ModelAdmin):
	list_display = ('make','model','year',)


class FutureValueHistoryAdmin(admin.ModelAdmin):
	list_display = ('make','model','year',)


class TradeINValueHistoryAdmin(admin.ModelAdmin):
	list_display = ('make','model','year',)


class RecallCheckHistoryAdmin(admin.ModelAdmin):
	list_display = ('make','model','year',)


admin.site.register(Profile, ProfileAdmin)
admin.site.register(Picture, PictureAdmin)
admin.site.register(ContactAction, ContactAdmin)
admin.site.register(UserTagRelation, UserTagRelationAdmin)
admin.site.register(EmailConfirmation, ConfirmEmailAdmin)
# admin.site.register(Visit, VisitAdmin)
# admin.site.register(Action, ActionAdmin)
# admin.site.register(RecallCheckHistory, RecallCheckHistoryAdmin)
# admin.site.register(TradeInValueHistory, TradeINValueHistoryAdmin)
# admin.site.register(FuturevalueHistory, FutureValueHistoryAdmin)
# admin.site.register(AverageAskingPriceHistory, AverageAskingPriceHistoryAdmin)
# admin.site.register(InsuranceHistory, InsuranceHistoryAdmin)
