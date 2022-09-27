from django.contrib import admin

# Register your models here.
from tags.models import Tag, TagType


class TagAdmin(admin.ModelAdmin):
	list_display = ('name', 'tag_type','tag_line','image_img', )
	exclude = ('guid',)
	search_fields = ('id','name','tag_type__type_name','tag_line')


class TagTypeAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'type_name',
	)
	search_fields = ('id','type_name',)




admin.site.register(Tag, TagAdmin)
admin.site.register(TagType, TagTypeAdmin)
# admin.site.register(Lifestyle)
# admin.site.register(LifestyleTagWeight, LifestyleTagRelationAdmin)
