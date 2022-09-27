from collections import OrderedDict, defaultdict
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
from django.db.models import Q
from rest_framework import status, generics
from rest_framework.exceptions import APIException

from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from content_manager.utilities.asset_utils import filterCheck
from content_manager.models import AssetContent, TemplateContent, PublishingState, Asset, AdSection, AssetType
from content_manager.serializers import TemplateContentSerializer, ArticleContentSerializer
from content_manager.utilities.cms_utils import SaveTagging, SaveContent, IsSuperUser, SavePublishState, AdCreate, \
    RawManufacturersList, RawMakeList, RawModelsList, RawYearsList, PublishFilter, AddNewContent
from content_manager.utilities.news_utils import NewsListing, SearchWithKeyWord, ARTICLE_MAPPING, NewsListing2, \
    NewSearchWithKeyWord, NewNewsListing, checkarticlefilter
from library.al_lib import ALResponse
from library.cache_store import GetValuesFromCache, SetValuesInCache, UpdateCache
from library.constants import RESPONSE, JSON_CONTENT_PUBLISH_STATE, CONTENT_PUBLISH_STATES
from library.decorators import content_visited
from marketplace.models import Sponsor, Campaign, Partner
from regions.models import Country
from regions.utility.utils import CountryStates, StateCities
from tags.models import Tag
from tags.utility.utils import GetTypeTag
from rest_framework.response import Response

"""
Super User APIs only available to superuser of autolife.
"""


# CMS Editorial APIs accessible by admin only
class TagsList(APIView):
    """
    Tags list for the Interests
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=GetTypeTag(), status=200).success()


class SponsorsList(APIView):
    """
    List of sponsors
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=[sponsor.to_json for sponsor in Sponsor.objects.all()], status=200).success()


class CreateSponsor(APIView):
    """
    Creating Sponsors for Tagging page
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request):
        try:
            sponsor_obj, is_created = Sponsor.objects.get_or_create(name=request.data["name"],
                                                                    logo=request.data.get("logo", ""))
            return ALResponse(data=sponsor_obj.to_json, status=200).success()
        except KeyError as e:
            return ALResponse(message=str(e) + " parameter missing", status=406).server_error()


class PartnersList(APIView):
    """
    List of sponsors
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=[partner.to_json for partner in Partner.objects.all()], status=200).success()


class CountryList(APIView):
    """
    List of countries
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=[country.to_json for country in Country.objects.all()], status=200).success()


class StateList(APIView):
    """
    List of states according to country
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request, country_id):
        return ALResponse(data=CountryStates(country_id), status=200).success()


class CityList(APIView):
    """
    List of cities according to state
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request, state_id):
        return ALResponse(data=StateCities(state_id), status=200).success()


class YearList(APIView):
    """
    Vehicle Year List
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=RawYearsList(), status=200).success()


class ManufacturerList(APIView):
    """
    List of Manufacturer
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=RawManufacturersList(),
                          status=200).success()


class MakeList(APIView):
    """
    List of makers according to the Manufacturer
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request, manufacturer_id):
        return ALResponse(data=RawMakeList(int(manufacturer_id)),
                          status=200).success()


class ModelList(APIView):
    """
    List of models according to the make
    """

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, make_id):
        return ALResponse(data=RawModelsList(int(make_id)), status=200).success()


class CampaignList(APIView):
    """
    Campaign list API
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=[campaign.to_json for campaign in Campaign.objects.all()], status=200).success()


class SubmitTagging(APIView):
    """
    Saving Tagging of content tab
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request, content_id=None):
        save_status = SaveTagging(request.data, content_id)
        return ALResponse(data=save_status, status=save_status["status"], message=save_status["msg"]).success()


class PublishStates(APIView):
    """
    Sending Publish States
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=JSON_CONTENT_PUBLISH_STATE, status=200, message=RESPONSE[200]).success()


class SubmitPublishState(APIView):
    """
    Editing the publish State
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request, content_id):
        sps_object = SavePublishState(content_id, request.data)
        if not sps_object.get('error'):
            return ALResponse(data=sps_object, status=sps_object["status"], message=sps_object["msg"]).success()
        else:
            return Response(data=sps_object, status=status.HTTP_400_BAD_REQUEST)


class SubmitContent(APIView):
    """
    Updating Content values/Submiting Content
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request, content_id):
        save_status = SaveContent(content_id, request.data)
        UpdateCache().article_cache()
        if save_status.get("error"):
            return Response(data={"data": save_status, "status": "400"},
                            status=status.HTTP_400_BAD_REQUEST)

        return ALResponse(data=save_status, status=save_status["status"], message=save_status["msg"]).success()


class AddContent(APIView):
    """
    	Add New Content
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request):
        save_status = AddNewContent(request.data)
        # UpdateCache().article_cache()
        if save_status.get("error"):
            return Response(data={"data": save_status, "status": "400"},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(data=save_status, status=status.HTTP_200_OK)


class FileUpload(APIView):
    """
    Uploading files
    """
    parser_classes = (FileUploadParser,)
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request, filename):
        file_obj = request.FILES['file']
        asset_object = AssetContent.objects.create()
        asset_object.content.save(filename, File(file_obj), True)
        # do some stuff with uploaded file
        return ALResponse(status=204, message="success", data={"created_id": asset_object.id}).success()


class TemplateList(APIView):
    """
    Listing of templates
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request):
        if request.data.get("filter"):
            return ALResponse(data=PublishFilter(
                request.data.get("filter")
            ).results(), status=200).success()

    def get(self, request):
        return ALResponse(data=[template.meta_json for template in TemplateContent.objects.all().order_by("-id")],
                          status=200).success()


class ContentDetailsByID(APIView):
    """
    Content details by ID
    """
    authentication_classes = ()
    permission_classes = ( )

    def get(self, request, content_id):
        try:
            return ALResponse(data=TemplateContent.objects.get(id=int(content_id)).to_json, status=200).success()
        except ObjectDoesNotExist:
            return ALResponse(status=404, message="Not Found").server_error()


class DeleteContent(APIView):
    """
    Deleting Templates
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request, content_id):
        try:
            # Clear Cached Article Keys
            TemplateContent.objects.get(id=int(content_id)).delete()
            UpdateCache().article_cache()

            return ALResponse(data=[template.meta_json for template in TemplateContent.objects.all().order_by("-id")],
                              status=200, message="Deleted Successfully").success()
        except ObjectDoesNotExist:
            return ALResponse(status=404, message="Not Found").server_error()


# API for SLUG check
class CheckSlug(APIView):
    """
    Check if slug is unique or not
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        slug = None if not request.GET.get("slug") else request.GET.get("slug").strip().lower()
        exist, msg = (True, "Value Exists") if slug and TemplateContent.objects.filter(guid=slug).exists() else (
        False, "Not Exists")
        return ALResponse(
            data={"exist": exist},
            status=200,
            message=msg
        ).success()


class PublishedContentList(APIView):
    """
    List of published articles
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request, content_id=None):
        return ALResponse(
            data=[state.content.meta_json for state in
                  PublishingState.objects.filter(~Q(publish_state=CONTENT_PUBLISH_STATES[1]),
                                                 content__template="Editorial Template")],  # Exclude Drafts
            status=200,
            message="OK"
        ).success()


class AssetsList(APIView):
    """
    List of Assets
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        return ALResponse(data=[asset.to_json for asset in Asset.objects.all().order_by("-id")], status=200,
                          message="OK").success()


class AdList(APIView):
    """
    List Of ADS
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request):
        return ALResponse(data=[ads.to_json for ads in AdSection.objects.all()], status=200).success()


class CreateAd(APIView):
    """
    Creating ADS
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request, content_id):
        ca_object = AdCreate(content_id, request.data)
        return ALResponse(data=ca_object["created"], status=ca_object["status"], message=ca_object["message"]).success()


class Preview(APIView):
    """
    Preview API, to see the results
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def get(self, request, content_id):
        try:
            return ALResponse(data=TemplateContent.objects.get(id=int(content_id)).view_json, status=200).success()
        except ObjectDoesNotExist:
            return ALResponse(status=404, message="Not Found").server_error()


class DeleteAd(APIView):
    """
    Delete ADS, to remove ads from list
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request, ad_id):
        try:
            AdSection.objects.get(id=int(ad_id)).delete()
            return ALResponse(data=[], message="Deleted", status=200).success()
        except ObjectDoesNotExist or ValueError:
            return ALResponse(data=[], message="Ad not Found", status=404).server_error()


"""
Content API's for All users
"""


class NewsContentList(APIView):
    """
    News Content for News Tab , consists of article
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        if not request.user.is_authenticated:
            return ALResponse(status=200, data=NewsListing().get_news).success()
        else:
            return ALResponse(status=200, data=NewsListing(user=request.user).get_news).success()


class UserRelated(APIView):
    """
    User related Content
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return ALResponse(status=200, data=NewsListing(request.user).get_user_related).success()


class NewsSectionListing(APIView):
    """
    Particular section listing
    """

    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        map_id = int(request.GET.get('mapping_id'))
        user_related = request.GET.get("user_related", None)
        if request.user.is_authenticated:
            obj = NewsListing(
                user=request.user,
                mapping_id=map_id,
                user_related=user_related
            )
            if user_related:
                data = self.get_data_for_user_related(obj, map_id)
            else:
                data = self.get_data_for_respective_articles(obj, map_id)
        else:
            obj = NewsListing(
                user=None,
                mapping_id=map_id,
                user_related=user_related
            )
            data = self.get_data_for_guest_user(obj, map_id)

        return ALResponse(status=200, data=data).success()

    def get_data_for_user_related(self, obj, map_id):
        articles = GetValuesFromCache().get_old_news_related_perticular_interest(map_id)
        if not articles:
            articles = obj.particular_interest()
            SetValuesInCache().set_old_news_related_perticular_interest(articles, map_id)
        return articles

    def get_data_for_respective_articles(self, obj, map_id):
        articles = GetValuesFromCache().get_old_news_related_respective_articles(map_id)
        if not articles:
            articles = obj.respective_article()
            SetValuesInCache().set_old_news_related_respective_articles(articles, map_id)
        return articles

    def get_data_for_guest_user(self, obj, map_id):
        articles = GetValuesFromCache().get_old_news_related_respective_articles_no_user(map_id)
        if not articles:
            articles = obj.respective_article()
            SetValuesInCache().set_old_news_related_respective_articles_no_user(articles, map_id)
        return articles


class ContentDetailsByGuid(APIView):
    """
    Content details by matching guid
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    @content_visited
    def get(self, request, guid):
        try:
            content_obj = GetValuesFromCache().content_details(guid)

            if not content_obj:
                content_obj = TemplateContent.objects.get(slug=guid)
                SetValuesInCache().content_details(guid, content_obj)
            temp_obj = content_obj.view_json
            if request.user.is_authenticated:
                user_likes = GetValuesFromCache().user_likes(request.user.username)
                if not user_likes:
                    user_likes = request.user.liked_content.all()
                    SetValuesInCache().user_likes(request.user.username, user_likes)
                if content_obj in user_likes:
                    temp_obj.update({"is_liked": True})
                else:
                    temp_obj.update({"is_liked": False})
                if content_obj in request.user.blacklist.all():
                    temp_obj.update({"is_disliked": True})
                else:
                    temp_obj.update({"is_disliked": False})
        except ObjectDoesNotExist as e:
            temp_obj = None
        return ALResponse(data=temp_obj, status=200).success()


class LikeContent(APIView):
    """
    Content Likes
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            content = TemplateContent.objects.get(id=request.data.get("content_id"))
        except:
            content = None
        if content:
            if content in request.user.liked_content.all():
                request.user.liked_content.remove(content)
                msg = "removed from likes"
            else:
                try:
                    request.user.liked_content.add(content)
                except:
                    pass
                msg = "added into likes"
                request.user.blacklist.remove(content)
            return ALResponse(message=msg, status=200).success()
        else:
            return ALResponse(message="Content Not Found", status=404).server_error()


class DislikeContent(APIView):
    """
    Content Dislike
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            content = TemplateContent.objects.get(id=request.data.get("content_id"))
        except:
            content = None
        if content:
            if content in request.user.blacklist.all():
                request.user.blacklist.remove(content)
                msg = "removed from dislikes"
            else:
                msg = "added into dislikes"
                request.user.liked_content.remove(content)
                try:
                    request.user.blacklist.add(content)
                except:
                    pass
            return ALResponse(message=msg, status=200).success()
        else:
            return ALResponse(message="Content Not Found", status=404).server_error()


class ArticleSearch(APIView):
    """
    Searching article
    """
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        keyword = request.GET.get('keyword')
        search_obj = SearchWithKeyWord(keyword)
        return ALResponse(data=search_obj.search(), status=200, message="OK").success()


class NewSearchView(generics.ListAPIView):
    """
    Keyword Search for an article
    """
    serializer_class = TemplateContentSerializer
    authentication_classes = ()
    permission_classes = ()

    def get_queryset(self):
        keyword = self.request.GET.get('keyword')
        return NewSearchWithKeyWord(keyword).search()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return ALResponse(data=serializer.data, status=200, message="OK").success()


class FeaturedArticles(APIView):
    """
    List of Featured Articles
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        if not request.user.is_authenticated:
            return ALResponse(status=200, data=NewsListing2().get_featured).success()
        else:
            return ALResponse(status=200, data=NewsListing2(user=request.user).get_featured).success()


class MappingIds(APIView):
    """
    List of Valid Mapping Ids
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        data = {}
        if request.user.is_authenticated:
            tag = request.user.interests.all()
            score_data = request.user.user_score_interest_based
            data['user_related_mapping_ids'] = {x.name: x.id for x in tag}
            item = [item for item in score_data if item['weight'] >= 50]
            data['score_user_related_mapping_ids'] = {}
            for map_item in item:
                if not map_item['tag'].pk in data['user_related_mapping_ids'].values():
                    data['score_user_related_mapping_ids'].update({map_item['tag'].name: map_item['tag'].pk})

        data['mapping_ids'] = {art: ARTICLE_MAPPING[art] for art in ARTICLE_MAPPING}
        return ALResponse(status=200, data=data).success()


class ArticleSection(APIView):
    """
    Article Listing API
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        map_id = int(request.GET.get('mapping_id'))
        user_related = request.GET.get("user_related", None)
        start_index = int(request.GET.get("start_index", 0))
        end_index = int(request.GET.get("end_index", 10))

        if request.user.is_authenticated:
            obj = NewsListing2(
                user=request.user,
                mapping_id=map_id,
                user_related=user_related,
                start_index=start_index,
                end_index=end_index
            )
            if user_related:
                data = obj.particular_interest()
            else:
                data = obj.respective_article()

        else:
            obj = NewsListing2(
                user=None,
                mapping_id=map_id,
                user_related=user_related,
                start_index=start_index,
                end_index=end_index
            )
            data = obj.respective_article()

        if data['articles']:
            data['count'] = len(data['articles'])
        data["start_index"] = start_index
        data["end_index"] = end_index
        data["mapping_id"] = map_id
        # data["total_count"] = obj.all_published.count()

        return ALResponse(status=200, data=data).success()


class NewArticleView(generics.ListAPIView):
    """
    Optimized Article Listing API
    """
    serializer_class = ArticleContentSerializer
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def get_queryset(self):
        mapping_id = self.request.GET.get('mapping_id', None)
        score = int(self.request.GET.get('score', 0))
        if not isinstance(score, int):
            raise APIException("Invalid Score type")

        if mapping_id is None:
            raise APIException("Missing Mapping Id")

        user = None
        if self.request.user.is_authenticated:
            user = self.request.user

            if self.user_related:
                obj = NewNewsListing(mapping_id, user=user, user_related=self.user_related)
                if score:
                    score_queryset = obj.score_data()
                    return score_queryset

                a = obj.particular_interest()
                return a

        obj = NewNewsListing(mapping_id, user=user).get_map_func()
        return obj

    def list(self, request, *args, **kwargs):
        map_id = int(request.GET.get('mapping_id'))
        self.user_related = request.GET.get("user_related", None)
        start_index = int(request.GET.get("start_index", 0))
        end_index = int(request.GET.get("end_index", 10))
        response_data = OrderedDict()
        name = {
            ARTICLE_MAPPING["POPULAR"]: "most popular",
            ARTICLE_MAPPING["MIGHT_LIKE"]: "articles you might like",
            ARTICLE_MAPPING["LIKED"]: "articles you've liked in past",  # 6
            ARTICLE_MAPPING["RECENT"]: "recently added articles"  # 2
        }
        if self.user_related:
            interest = Tag.objects.get(id=int(map_id))
            name_fuct = lambda: "because you like {interest}".format(interest=interest.name)
            name = defaultdict(name_fuct)

        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)
        response_data["name"] = name[map_id]
        response_data["start_index"] = start_index

        response_data["end_index"] = end_index

        response_data["mapping_id"] = map_id

        response_data["total_count"] = queryset.count()

        response_data["articles"] = serializer.data

        if map_id == 4 and not self.user_related:
            response_data["articles"] = sorted(response_data["articles"], key=lambda k: k.get('score'), reverse=True)

        response_data['articles'] = response_data['articles'][start_index:end_index]

        response_data["count"] = len(response_data["articles"])

        return ALResponse(data=response_data, status=200, message="OK").success()


class AllAssets(APIView):
    """
    List all assets
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (IsSuperUser,)

    def post(self, request):
        start_index = request.data.get("startIndex")
        count = request.data.get("count")
        filterBody = request.data.get("filter")
        if filterCheck(filterBody):
            assets = Asset.objects.all().order_by('-updated_on')
            data = assets[start_index:count + start_index]
            return Response(data={"assets": [asset.to_json for asset in data], "total_count": len(assets)},
                            status=status.HTTP_200_OK)
        elif not filterCheck(filterBody):
            asset_filter = request.data.get("filter")['name']
            assets = Asset.objects.filter(name__icontains=asset_filter)
            data = assets[start_index:count + start_index]
            return Response(data={"assets": [asset.to_json for asset in data], "total_count": len(assets)},
                            status=status.HTTP_200_OK)
        else:
            return Response(data={"Message": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)


class CreateAsset(APIView):
	"""
	Create Asset
	"""
	authentication_classes = (JSONWebTokenAuthentication,)
	permission_classes = (IsSuperUser,)

	def post(self,request):
		file_obj = request.data['file']
		name = request.data['name']

		if AssetContent.objects.filter(identifier=name).exists():

			Already_exist =True
		else:
			Already_exist =False

		if not Already_exist:

			contentobj, is_created = AssetContent.objects.get_or_create(
				identifier =name,
				content = file_obj)

			if contentobj.content.url.endswith("mp4") or contentobj.content.url.endswith("webm") or contentobj.content.url.endswith('swf'):
				asset_type= "video"
			else:
				asset_type = "image"
			asset_type =AssetType.objects.get(name=asset_type)
			print(asset_type.id)
			assetobj,is_created =Asset.objects.get_or_create(
			name =name,
			asset_type_id =asset_type.id
			)
			assetobj.assets.add(contentobj)

			if is_created:
				return Response(data=[assetobj.to_json], status=status.HTTP_200_OK)
		else:
			return Response(data={"Message": "Asset With this name already exist."},status=status.HTTP_409_CONFLICT)



class AllPublishedArtciles(APIView):
    """
    List all Artciles except vehicles
    """
    authentication_classes = (JSONWebTokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        start_index = request.data.get("startIndex", 0)
        count = request.data.get("count", 1000)
        article_filter = request.data.get("filter")
        if checkarticlefilter(article_filter):
            articles = TemplateContent.objects.all()
            data = articles[int(start_index):int(start_index) + int(count)]
        else:
            articles = TemplateContent.objects.filter(
                content_heading__icontains=article_filter) | TemplateContent.objects.filter(
                content_subheading__icontains=article_filter)
            data = articles[int(start_index):int(start_index) + int(count)]

        serializer = TemplateContentSerializer(data, many=True)

        return Response(data={"articles": serializer.data, "totalCount": len(articles)}, status=status.HTTP_200_OK)
