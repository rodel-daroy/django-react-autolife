from django.contrib import admin

from core.models import Version

class VersionAdmin(admin.ModelAdmin):
    list_display = ('frontend_version','backend_version','enabled')


admin.site.register(Version,VersionAdmin)

