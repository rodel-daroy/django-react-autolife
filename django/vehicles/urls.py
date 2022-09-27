from django.conf.urls import url

from vehicles.views import MakeAPI, AllVehicleCategory, VehicleDetails, CategorizedVehicle, SubCategories, \
    UncategorizedVehicle, SimilarVehicles, RecallCars, RecallSummary

urlpatterns = [
    url(r'^make/', MakeAPI.as_view(), name='make'),
    url(r'^categories/', AllVehicleCategory.as_view(), name='vehicle category'),
    url(r'^uncategorized/', UncategorizedVehicle.as_view(), name='vehicle uncategorized'),
    url(r'^category/(?P<category_name>[\w -]+)/', CategorizedVehicle.as_view(), name='categorized vehicle'),
    url(r'^sub_categories/', SubCategories.as_view(), name='sub-categories'),
    url(r'^details/(?P<vehicle_id>\w+)/', VehicleDetails.as_view(), name='vehicle details'),
    url(r'^similar/(?P<vehicle_id>\w+)/', SimilarVehicles.as_view(), name='similar vehicle'),
    url(r'^get_list/$', RecallCars.as_view(), name="get_list"),
    url(r'^summary/(?P<recall_number>\d+)/$', RecallSummary.as_view(), name="summary"),
]