from django.contrib import admin

# Register your models here.
from django.contrib.admin import ModelAdmin
from django.forms import ModelForm
from suit.widgets import EnclosedInput, LinkedSelect, SuitDateWidget

from regions.models import Country, State, City, PostalCodeMapper


class CountryForm(ModelForm):
    """
    Country form for widgets
    """
    class Meta:
        model = Country
        widgets = {
            'name' : EnclosedInput(prepend='icon-globe')
        }
        fields = ('name', 'short_name', 'states', 'source_id')
        exclude = ()


class CountryAdmin(ModelAdmin):
    form = CountryForm
    list_display = (
        'id',
        'name',
        'short_name'
    )
    search_fields = ('id','name', )


class StateForm(ModelForm):
    """
    State form for widgets
    """
    class Meta:
        model = State
        widgets = {
            'name' : EnclosedInput(prepend='icon-globe')
        }
        fields = ('name', 'short_name', 'timezone', 'cities', 'source_id')
        exclude = ()


class StateAdmin(ModelAdmin):
    form = StateForm
    list_display = ('id', 'name')
    search_fields = ('id','name', )


class CityForm(ModelForm):
    """
    City form for widgets
    """
    class Meta:
        model = City
        widgets = {
            'name' : EnclosedInput(prepend='icon-globe')
        }
        fields = ('name', 'source_id')


class CityAdmin(ModelAdmin):
    form = CityForm
    list_display = ('id', 'name',)
    exclude = ()
    search_fields = ('id','name',)


class PostalCodeMapperAdmin(ModelAdmin):
    list_display = ('id','postal_code',)
    search_fields = ('id','postal_code',)

admin.site.register(Country, CountryAdmin)
admin.site.register(State, StateAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(PostalCodeMapper,PostalCodeMapperAdmin)