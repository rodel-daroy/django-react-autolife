"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.conf.urls import url

from content_manager.views import SponsorsList, CountryList, StateList, CityList, TagsList, ManufacturerList, MakeList, \
    PartnersList, CampaignList, ModelList, TemplateList, SubmitTagging, SubmitContent, FileUpload, \
    ContentDetailsByGuid, ContentDetailsByID, SubmitPublishState, PublishStates, DeleteContent, CheckSlug, \
    PublishedContentList, AssetsList, AdList, Preview, CreateAd, DeleteAd, CreateSponsor, YearList, NewsContentList, \
    NewsSectionListing, LikeContent, DislikeContent, UserRelated, ArticleSearch, FeaturedArticles, MappingIds, \
    ArticleSection, NewSearchView, NewArticleView, AllPublishedArtciles, AddContent

urlpatterns = [
	# listings
	url(r'^tags/$', TagsList.as_view(), name="tags list"),
	url(r'^sponsors/$', SponsorsList.as_view(), name="sponsors list"),
	url(r'^partners/$', PartnersList.as_view(), name="partners list"),
	url(r'^campaigns/$', CampaignList.as_view(), name="campaign list"),
	url(r'^countries/$', CountryList.as_view(), name="country list"),
	url(r'^years/$', YearList.as_view(), name="Year list"),
	url(r'^manufacturer/$', ManufacturerList.as_view(), name="manufacturer list"),
	url(r'^states/(?P<country_id>\d+)/$', StateList.as_view(), name="state list"),
	url(r'^cities/(?P<state_id>\d+)/$', CityList.as_view(), name="car cities list"),
	url(r'^make/(?P<manufacturer_id>\d+)/$', MakeList.as_view(), name="car make list"),
	url(r'^model/(?P<make_id>\d+)/$', ModelList.as_view(), name="car model list"),
	url(r'^template_list/$', TemplateList.as_view(), name="template list"),
	url(r'^assets_list/$', AssetsList.as_view(), name="asset list"),
	url(r'^ad_list/$', AdList.as_view(), name="advertisement list"),
	url(r'^publish_states/$', PublishStates.as_view(), name="publish state list"),

	# details
	url(r'^content_by_guid/(?P<guid>[\w -]+)/$', ContentDetailsByGuid.as_view(), name="content details"),
	url(r'^content_by_id/(?P<content_id>\d+)/$', ContentDetailsByID.as_view(), name="content details"),
	url(r'^published_content/$', PublishedContentList.as_view(), name="published content details"),
	url(r'^preview/(?P<content_id>\d+)/$', Preview.as_view(), name="preview content"),
	url(r'^create_ad/(?P<content_id>\d+)/$', CreateAd.as_view(), name="create ad"),

	# creation and updation
	url(r'^tagging/$', SubmitTagging.as_view(), name="submit tags"),
	url(r'^tagging/(?P<content_id>\d+)/$', SubmitTagging.as_view(), name="edit tags"),
	url(r'^save_publish_state/(?P<content_id>\d+)/$', SubmitPublishState.as_view(), name="submit publish state"),
	url(r'^save_content/(?P<content_id>\d+)/$', SubmitContent.as_view(), name="submit content"),
	url(r'^add_content/$', AddContent.as_view(), name="add content"),
	url(r'^upload/(?P<filename>[^/]+)/$', FileUpload.as_view(), name="file upload"),
	url(r'^create_sponsor/$', CreateSponsor.as_view(), name="create sponsor"),

	# Delete
	url(r'^delete_content/(?P<content_id>\d+)/$', DeleteContent.as_view(), name="delete content"),
	url(r'^delete_ad/(?P<ad_id>\d+)/$', DeleteAd.as_view(), name="delete ad"),

	# Check Slug Uniqueness
	url(r'^check_slug/', CheckSlug.as_view(), name="Check Slug"),

	# News Section
	url(r'^news/$', NewsContentList.as_view(), name="news landing"),
	url(r'^user_related/$', UserRelated.as_view(), name="user related"),
	url(r'^news_section/', NewsSectionListing.as_view(), name="news section listings"),
	url(r'^content_like/$', LikeContent.as_view(), name="like content"),
	url(r'^content_dislike/$', DislikeContent.as_view(), name="dislike content"),
	url(r'^search/', ArticleSearch.as_view(), name="search content"),
	url(r'^newsearch/', NewSearchView.as_view(), name="search content"),
	url(r'^featured/', FeaturedArticles.as_view(), name="featured articles"),
	url(r'^mapping_ids/', MappingIds.as_view(), name="mapping id"),
	url(r'^article_section/', ArticleSection.as_view(), name="article section"),
	url(r'^new_article_section/', NewArticleView.as_view(), name="new_article section"),
	url(r'^all_published_articles/', AllPublishedArtciles.as_view(), name="all_published _articles"),

]