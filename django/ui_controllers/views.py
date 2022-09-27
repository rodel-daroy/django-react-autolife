import json

from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render

# Create your views here.
from django.template.context_processors import csrf
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from content_manager.utilities.news_utils import NewsListing
from content_manager.utilities.cms_utils import IsSuperUser
from library.al_lib import ALResponse
from marketplace.utility.polls import Polls
from ui_controllers.models import ControllerTile, ControllerCategory, HOME_1, HOME_2, FEATURED_HOME_1, FEATURED_HOME_2
from ui_controllers.serializers import UiTilesSerializer, RecentArticleSerializer
from ui_controllers.utility.utils import ArticleMightLike, OtherCategoryListing, ArticleRecent, OtherCategoryListing2, \
	NewArticleRecent, CreateUpdateTile


@user_passes_test(lambda u: u.is_superuser)
def template_list(request):
	categorized_tiles = []
	for category in ControllerCategory.objects.all():
		obj = {
			"name": category.category_name,
			"id": category.id,
			"tiles": ControllerTile.objects.filter(category_id=category.id).order_by("order")
		}
		categorized_tiles.append(obj)
	context = {"tiles": categorized_tiles}
	context.update(csrf(request))
	return render(request, "order_tiles.html", context)


class UpdateOrder(APIView):
	"""
	Updates Tile order
	ui_tile_order : required
	"""
	permission_classes = ()
	authentication_classes = ()

	def post(self, request):
		if request.unauthorized:
			return Response(data={"message": "Unauthorized"},  status=401)
		order = request.data.get("ui_tile_order")
		try:
			for each_order in order:
				tile = ControllerTile.objects.get(id=int(each_order))
				tile.order = order.index(each_order)
				tile.save()
			return Response(data={"message": "order updated"}, status=200)
		except Exception as e:
			return Response(data={"message": "error"}, status=404)


class UITiles(APIView):
	"""
	Homepage Default Tile Listing API.
	This API will list all Homepage tiles. Called First on Homepage load and after Login
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request):
		data = {}
		print(request.user)
		if not request.user.is_authenticated:
			data["others"] = ControllerCategory.objects.category_tiles(HOME_1)
			try:
				data["featured"] = ControllerCategory.objects.category_tiles(FEATURED_HOME_1)
			except ControllerCategory.DoesNotExist:
				data["featured"] = []
		else:
			default_tiles = ControllerCategory.objects.category_tiles(HOME_2)
			# data_obj = ArticleMightLike(user=request.user)
			data_obj = ArticleRecent(user=request.user)
			user_related = data_obj.parse()
			user_related += default_tiles
			data["others"] = user_related

			try:
				data["featured"] = ControllerCategory.objects.category_tiles(FEATURED_HOME_2)
			except ControllerCategory.DoesNotExist:
				data["featured"] = []
		return ALResponse(
			data=data, status=200, message="OK"
		).success()



class UITiles2(generics.ListAPIView):
	"""
	Optimized Homepage Default Tile Listing API.
	This API will list all Homepage tiles. Called First on Homepage load and after Login
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)
	serializer_class = UiTilesSerializer

	def get_queryset(self):
		return NewArticleRecent().homepage_queryset(self.param)

	def list(self, request, *args, **kwargs):
		self.param = HOME_1


		if request.user.is_authenticated:
			self.param = HOME_2
			recent_articles_queryset = NewArticleRecent().recent_articles_queryset()
			recent_serializer_data = RecentArticleSerializer(recent_articles_queryset, many=True)
			queryset = self.filter_queryset(self.get_queryset())
			serializer = self.get_serializer(queryset, many=True)

			# For Featured
			featured_queryset = NewArticleRecent().homepage_queryset(FEATURED_HOME_2)
			featured_serializer_data = UiTilesSerializer(featured_queryset, many=True)


		else:
			recent_serializer_data = None
			queryset = self.filter_queryset(self.get_queryset())
			serializer = self.get_serializer(queryset, many=True)

			# For Featured
			featured_queryset = NewArticleRecent().homepage_queryset(FEATURED_HOME_1)
			featured_serializer_data = UiTilesSerializer(featured_queryset, many=True)


		serialized_data = {}
		if recent_serializer_data:
			serialized_data['others'] = recent_serializer_data.data + serializer.data
		else:
			serialized_data["others"] = serializer.data

		serialized_data['featured'] = featured_serializer_data.data

		return ALResponse(data=serialized_data, status=200, message="OK").success()


class OtherTiles(APIView):
	"""
	Marketplace and Insurance tiles
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (AllowAny,)

	def get(self, request, tile_category):
		tile_category=tile_category.lower()

		if request.user.is_authenticated:
			data = OtherCategoryListing(tile_category)
			return ALResponse(
				data=data, status=200, message="OK"
			).success()

		else:
			data = OtherCategoryListing2(tile_category)
			return ALResponse(
				data=data, status=200, message="OK"
			).success()


class PollVote(APIView):
	"""
	Vote methods for
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request, answer_id):
		return ALResponse(data=Polls().vote_method(answer_code=answer_id,
												   email=request.data.get("email").lower(),
												   poll_id=request.data.get("poll_id")
												   ),
						  status=200).success()




class AllCategories(APIView):
	"""
	Fetch all tiles categories
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def get(self, request, ):
		data = ControllerCategory.objects.all()
		result =[category.to_json for category in data]
		return ALResponse(data=result,status=200).success()



class CreateTile(APIView):
	"""
    Api to create tile
    """
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def post(self,request):

		create_tile =CreateUpdateTile(request.data,request.user)

		return Response(data=create_tile,status=status.HTTP_200_OK)

class UpdateTile(APIView):
	"""
    Api to create tile
    """
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def post(self,request,tile_id):

		try:
			tileobj =ControllerTile.objects.get(id=tile_id)
		except:
			tileobj = None
		if tileobj:
			update_tile = CreateUpdateTile(request.data, request.user, tile_id=tile_id)
			return Response(data=update_tile, status=status.HTTP_200_OK)
		else:
			return Response(data={"Message": "Tile Not found"}, status=status.HTTP_400_BAD_REQUEST)




class DeleteTile(APIView):
	"""
    Api to create tile
    """
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def post(self,request,tile_id):

		try:
			tileobj =ControllerTile.objects.get(id=tile_id)
		except:
			tileobj = None
		if tileobj:
			tileobj.delete()
			return Response(data={"Message":"Tile deleted succesfully"}, status=status.HTTP_200_OK)
		else:
			return Response(data={"Message": "Tile Not found"}, status=status.HTTP_400_BAD_REQUEST)



class SetTileOrder(APIView):
	"""
    Set order of tile
    """
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def post(self,request):

		category = request.data.get("category")
		categoryobj =ControllerCategory.objects.get(id=category)
		tiles = ControllerTile.objects.filter(category__id=category)
		tiles.update(category=None)

		tiles =request.data.get('tiles')
		#
		for tile in range(len(tiles)):
			tileobj =ControllerTile.objects.get(id=tiles[tile])
			tileobj.order =tile
			tileobj.category =categoryobj
			tileobj.is_active = True
			tileobj.save()
		return Response(data={"Message": "Tile order and category has been updated"}, status=status.HTTP_200_OK)


class UnusedTiles(APIView):
	"""
    Api to fetch unused tiles
    """

	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def get(self, request):
		data = ControllerTile.objects.filter(category__isnull=True) | ControllerTile.objects.filter (is_active=False).order_by('-updated_on')
		if data:
			return Response(data=[tiles.to_json for tiles in data], status=status.HTTP_200_OK)
		else:
			return Response(data=[], status=status.HTTP_200_OK)

class FetchTiles(APIView):
	"""
    Api to fetch tiles as per category
    """
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsAdminUser,)

	def post(self, request, ):
		category = request.data.get("category",None)
		queryset =ControllerTile.objects.filter(category__id=category).order_by('order')
		return Response(data=[tiles.to_json for tiles in queryset],status=status.HTTP_200_OK)

