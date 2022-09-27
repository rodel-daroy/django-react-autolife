from django.conf.urls import url

from ui_controllers.views import template_list, UpdateOrder, UITiles, UITiles2, OtherTiles, PollVote, AllCategories, \
    CreateTile, UpdateTile, DeleteTile, SetTileOrder, UnusedTiles, FetchTiles

urlpatterns = [
	url(r'^tiles/', template_list, name='tiles_list'),
	url(r'^update/', UpdateOrder.as_view(), name='tile_ordering'),
	url(r'^polls/(?P<answer_id>\w+)/$', PollVote.as_view(), name='poll_vote'),

	# API UI tiles
	url(r'^homepage_default_tiles/', UITiles.as_view(), name='homepage_default_tiles'),
    url(r'^new_homepage_default_tiles/', UITiles2.as_view(), name='new_homepage_default_tiles'),
    url(r'^all_categories/', AllCategories.as_view(), name='all_categories'),
    url(r'^create_tile/', CreateTile.as_view(), name='create_tile'),
    url(r'^update_tile/(?P<tile_id>\w+)/', UpdateTile.as_view(), name='update_tile'),
    url(r'^delete_tile/(?P<tile_id>\w+)/', DeleteTile.as_view(), name='delete_tile'),
    url(r'^set_tiles_order/', SetTileOrder.as_view(), name='set_tiles_order'),
    url(r'^unused_tiles/', UnusedTiles.as_view(), name='unused_tiles'),
    url(r'^fetch_tiles/', FetchTiles.as_view(), name='fetch_tiles_based_on_category'),
	url(r'^(?P<tile_category>\w+)/', OtherTiles.as_view(), name='other_ui_tiles'),

]