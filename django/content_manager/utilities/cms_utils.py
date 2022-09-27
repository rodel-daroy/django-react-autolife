"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import datetime
import random

from dateutil.parser import parse
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework.permissions import BasePermission

from content_manager.models import TemplateContent, ContentTagRelation, PublishingState, AdSection, Asset, \
    AssetAssociation, ContentTagWeight
from library.al_lib import RawQuery
from library.constants import CONTENT_PUBLISH_STATES, READ_ONLY_DB, DEFAULT_DB
from marketplace.models import Sponsor, Campaign, Partner
from regions.models import Country, State, City
from tags.models import Tag


class IsSuperUser(BasePermission):
    """
    Allows access only to superusers.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class SaveTagging(object):
    """
    Saving Tagging Information of the CMS content
    parameters required:
    is_timely_content (BOOL)
    disable_personalization (BOOL)
    is_promoted_content (BOOL)
    homepage_availability (BOOL)
    country (INT)
    state (INT)
    city (INT)
    sponsor (INT)
    campaign (List(int))
    manufacturer(List(int))
    make(List(int))
    model(List(int))
    tag (List({tag_id:weight_value}))
    """

    def __new__(cls, data, content_id=None, *args, **kwargs):
        save_status = {"status": 200, "msg": "", "created": None}
        if not content_id:
            tc_object = TemplateContent.objects.create(
                is_timely_content=data.get("is_timely_content", False),
                disable_personalization=data.get("disable_personalization", False),
                is_promoted_content=data.get("is_promoted_content", False),
                homepage_availability=data.get("homepage_availability", False),
                available_in_trends=data.get("available_in_trends", False),
                is_featured=data.get("is_featured", False)
            )
        else:
            try:
                tc_object = TemplateContent.objects.get(id=int(content_id))
                tc_object.is_timely_content = data.get("is_timely_content", False)
                tc_object.disable_personalization = data.get("disable_personalization", False)
                tc_object.is_promoted_content = data.get("is_promoted_content", False)
                tc_object.homepage_availability = data.get("homepage_availability", False)
                tc_object.available_in_trends = data.get("available_in_trends", False)
                tc_object.is_featured = data.get("is_featured", False)
            except:
                return {
                    "status": 404,
                    "msg": "content not found",
                    "created": None
                }
        # Regionalization
        # Country Tagging
        try:
            if data.get("country"):
                tc_object.country_id = Country.objects.get(id=int(data.get("country"))).id
            else:
                tc_object.country = None
        except :
            pass
        # State Tagging
        try:
            if data.get("state"):
                tc_object.state_id = State.objects.get(id=int(data.get("state"))).id
            else:
                tc_object.state = None
        except :
            pass
        # City Tagging
        try:
            if data.get("city"):
                tc_object.city_id = City.objects.get(id=int(data.get("city")))
            else:
                tc_object.city = None
        except Exception:
            pass

        # Sponsor Tagging
        try:
            if data.get("sponsor"):
                tc_object.sponsor_id = Sponsor.objects.get(id=int(data.get("sponsor")))
            else:
                tc_object.sponsor = None
        except:
            pass
        # Manufacturer Tagging
        if isinstance(data.get("manufacturer"), list):
            tc_object.manufacturer = data.get('manufacturer')
        # Make Tagging
        if isinstance(data.get("make"), list):
            tc_object.make = data.get("make")
        # Model Tagging
        if isinstance(data.get("model"), list):
            tc_object.make_model = data.get("model")
        # Year Association
        if isinstance(data.get("years"), list):
            tc_object.year = data.get("years")
        tc_object.save()
        # Campaign Tagging
        try:
            if data.get("campaign"):
                tc_object.campaign.clear()
                for campaign_id in data.get("campaign"):
                    tc_object.campaign.add(Campaign.objects.get(id=int(campaign_id)))
        except :
            pass

        # Save the object relations if everything successfully linked
        save_status["created"] = tc_object.id
        save_status["msg"] = "Successfully Done!"

        # Adding Weights of the Tag
        # Get or create The content_tag_relation schema first to input weights of tag's
        ct_objects, is_created = ContentTagRelation.objects.get_or_create(content_id=tc_object.id)
        if isinstance(data.get("tag"), list):
            ct_objects.tag_weightage.clear()
            for field in data["tag"]:
                for tag_id, weight in field.items():
                    try:
                        tag_obj = Tag.objects.get(id=int(tag_id))
                        # Now create tag_weight object to assign values to ct_object
                        tw_object, is_created = ContentTagWeight.objects.get_or_create(tag_id=tag_obj.id, weight=int(weight))
                        ct_objects.tag_weightage.add(tw_object)
                    except:
                        save_status["status"] = 406
                        save_status["msg"] = "Object created But Linking Invalid Tag Id"
                        return save_status
        return save_status


class SaveContent(object):

    """
    Saving content and associating it with its tagged table
    params required:
    headline(str)
    url(str)
    byline(str)
    publish_date(str_date)
    synopsis(str)
    body(str)
    search_keywords(STR)
    search_boost(INT)
    include_in_search(BOOL)
    seo_meta_name(str)
    seo_meta_description(str)
    seo_keywords(str)
    canonical_link(slug(str))
    template(Not needed for now(default=Editorial Template))
    ads(List({ad_id, template_location}))
    assets(List({asset_id, template_location}))
    configuration(Dictionary Format)
    """
    asset_id = None

    def __new__(cls, content_id, data, *args, **kwargs):
        save_status = {"status": 200, "msg": "", "created": None}
        try:
            content_obj = TemplateContent.objects.using(DEFAULT_DB).get(id=int(content_id))
            if data.get("headline")!=content_obj.content_heading and data.get("headline") != "":
                heading =data.get("headline")
            elif not data.get("headline") and content_obj.content_heading != "":
                heading = content_obj.content_heading
            elif data.get("headline")==content_obj.content_heading and content_obj.content_heading != "":
                heading = data.get("headline")
            else:
                return {"error":"Article headline cannot be null"}
            content_obj.content_heading =heading
            # content_obj.content_heading = data.get("headline") if data.get("headline") else content_obj.content_heading
            content_obj.content_subheading = data.get("subheading") if data.get("subheading") else content_obj.content_subheading
            content_obj.content_url = data.get("url") if data.get("url") else content_obj.content_url
            content_obj.content_byline = data.get("byline")
            content_obj.content_byline_link = data.get("byline_link")

            content_obj.content_publish_date = parse(data.get("article_publish_date")) if data.get(
                "article_publish_date")   else content_obj.content_publish_date

            content_obj.content_received_date = parse(data.get("article_received_date")) if data.get(
                "article_received_date") else content_obj.content_received_date
            content_obj.content_synopsis = data.get("synopsis") if data.get(
                "synopsis") else content_obj.content_synopsis
            content_obj.content_body = data.get("body") if data.get("body") else content_obj.content_body
            content_obj.search_keywords = data.get("search_keywords") if data.get(
                "search_keywords") else content_obj.search_keywords

            # Updating Time to show in Recent Articles
            # content_obj.content_publish_date = timezone.now()
            try:
                # If search boost value is not an integer value, then handle the exception
                content_obj.search_boost = int(data.get("search_boost")) if data.get(
                    "search_boost") else content_obj.search_boost
            except ValueError:
                pass
            content_obj.include_in_search = data.get("include_in_search") if data.get(
                "include_in_search") else content_obj.include_in_search
            content_obj.seo_meta_name = data.get("seo_meta_name") if data.get(
                "seo_meta_name") else content_obj.seo_meta_name
            content_obj.seo_meta_description = data.get("seo_meta_description") if data.get(
                "seo_meta_description") else content_obj.seo_meta_description
            content_obj.seo_keywords = data.get("seo_keywords") if data.get(
                "seo_keywords") else content_obj.seo_keywords
            content_obj.guid = data.get("canonical_link") if data.get("canonical_link") else content_obj.guid
            content_obj.template = data.get("template") if data.get("template") else "Editorial Template"  # For Now Only Editorial Template
            content_obj.preview_path = data.get("preview_path") if data.get("preview_path") else content_obj.preview_path  # For Now Only Editorial Template

            if isinstance(data.get("assets"), list):
                content_obj.asset_template_association.all().delete()   # permanently deleting old entries

                # is_valid, response_message = cls.check_spot_validation(content_obj, data)
                if data.get("template_configuration")['spot_A']:
                    is_valid, response = cls.check_spot_validation(content_obj=content_obj, assets=data.get('assets'), spot='spot_A')
                    if not is_valid:
                        return response

                if data.get("template_configuration")['spot_B']:
                    is_valid, response = cls.check_spot_validation(content_obj=content_obj, assets=data.get('assets'), spot='spot_B')
                    if not is_valid:
                        return response


            # Saving Template Config
            if isinstance(data.get("template_configuration"), dict):
                content_obj.template_configuration = data.get("template_configuration")
                content_obj.save()


            # Partner Linking
            try:
                if data.get("partner"):
                    content_obj.content_partners = Partner.objects.using(DEFAULT_DB).get(id=int(data.get("partner")))
                    # Saving
                    content_obj.save()
            except Exception as e:
                save_status["status"] = 406
                save_status["msg"] = str(e)
                save_status["created"] = content_obj.id
                return save_status

            save_status["msg"] = "Saved Successfully"
            save_status["created"] = content_obj.id
            # Ad Linking
            if isinstance(data.get("ads"), list):
                content_obj.related_ads.clear()     # Deleting old Records
                for ad in data.get("ads"):
                    try:
                        content_obj.related_ads.add(AdSection.objects.using(DEFAULT_DB).get(id=int(ad)))
                    except ObjectDoesNotExist:
                        pass

            # Related article relation
            if isinstance(data.get("related_articles"), list):
                content_obj.related_articles.clear()    # Deleting old Records
                for article in data.get('related_articles'):
                    try:
                        if int(article) != content_obj.id:
                            content_obj.related_articles.add(TemplateContent.objects.using(DEFAULT_DB).get(id=int(article)))
                    except ObjectDoesNotExist:
                        pass
            # Secondary Navigation
            if isinstance(data.get("secondary_navigation"), list):
                content_obj.secondary_navigation.clear()  # Deleting old records
                for article in data.get('secondary_navigation'):
                    try:
                        if int(article) != content_obj.id:
                            content_obj.secondary_navigation.add(TemplateContent.objects.using(DEFAULT_DB).get(id=int(article)))
                    except ObjectDoesNotExist:
                        pass
            # Return Response
            return save_status
        except ObjectDoesNotExist and Exception as e:
            save_status["status"] = 404
            save_status["msg"] = str(e)
            return save_status

    @classmethod
    def check_asset_content_association(cls, asset_id, spot):
        if spot == 'spot_A' or spot == 'spot_B':
            cls.asset_id = None
            asset_contents = Asset.objects.get(id=asset_id).assets.all()
            asset = Asset.objects.get(id=asset_id)

            if len(asset_contents) > 0 or asset.asset_type.name=="Ad-VeuHub" or asset.asset_type.name=="Ad-Internal":
                cls.asset_id = asset_id
                return True
        return False


    @classmethod
    def check_spot_validation(cls, content_obj, assets, spot):
        humanised = spot.replace('_', ' ').title()
        error_obj = {"error" : "{spot} is missing or associated asset has no content".format(spot=humanised)}
        spot_assets = list(filter(lambda x: x.get('template_location') == spot, assets))
        print("spot assets",spot_assets)
        if not len(spot_assets):
            return False, error_obj

        asset = spot_assets[0]
        if not cls.check_asset_content_association(asset_id=asset['asset_id'], spot=asset["template_location"]):
            return False, error_obj

        asset_associate_obj = AssetAssociation.objects.using(DEFAULT_DB).create(
            template_location=spot,
            asset_id=cls.asset_id
        )
        asset_associate_obj.save()
        content_obj.save()  # For db routers save() should be invoked before creating many to many relation
        content_obj.asset_template_association.add(asset_associate_obj)

        return True, {"success": "success validating and saving assets"}

class AddNewContent(object):

    """
    Saving New content and associating it with its tagged table
    params required:
    headline(str)
    url(str)
    byline(str)
    publish_date(str_date)
    synopsis(str)
    body(str)
    search_keywords(STR)
    search_boost(INT)
    include_in_search(BOOL)
    seo_meta_name(str)
    seo_meta_description(str)
    seo_keywords(str)
    canonical_link(slug(str))
    template(Not needed for now(default=Editorial Template))
    ads(List({ad_id, template_location}))
    assets(List({asset_id, template_location}))
    configuration(Dictionary Format)
    """
    asset_id = None

    def __new__(cls, data, *args, **kwargs):
        if not data.get("headline") or data.get("headline") == "" :
                return {"error":"Article headline cannot be null"}

        if data.get("publishing_state") and data.get("publishing_state")["unpublishing_on"] and data.get("publishing_state")["do_not_publish_until"]:
            if not data.get("publishing_state")["unpublishing_on"]>data.get("publishing_state")["do_not_publish_until"]:
                return {"error":"Article unpublishing_on date  should be greater than do_not_publish_until date"}


        validate_data ={
            "content_heading":data.get('headline'),
            "content_subheading":data.get('subheading'),
            "content_url":data.get("url"),
            "content_byline" : data.get("byline"),
            "content_byline_link" : data.get("byline_link"),
            "content_publish_date" : parse(data.get("article_publish_date")) if data.get("article_publish_date") !="" and data.get("article_publish_date")!=None else timezone.now(),
            "content_received_date" : parse(data.get("article_received_date")) if data.get("article_received_date") !="" and data.get("article_received_date")!=None else None,
            "content_synopsis" : data.get("synopsis") ,
            "content_body" : data.get("body"),
            "search_keywords" : data.get("search_keywords"),
            "include_in_search" : data.get("include_in_search") ,
            "seo_meta_name" : data.get("seo_meta_name"),
            "seo_meta_description" : data.get("seo_meta_description"),
            "seo_keywords" : data.get("seo_keywords") ,
            "guid" : data.get("canonical_link") ,
            "template" : data.get("template") if data.get("template") else "Editorial Template",  # For Now Only Editorial Template
            "preview_path" : data.get("preview_path"),
            "country":data.get("country"),
            "state":data.get("state"),
            "city":data.get("city"),
            "is_timely_content":data.get("is_timely_content") if data.get("is_timely_content") else False,
            "available_in_trends":data.get("available_in_trends") if data.get("available_in_trends") else False,
            "disable_personalization":data.get("disable_personalization") if data.get("disable_personalization") else False,
            "is_promoted_content":data.get("is_promoted_content"),
            "homepage_availability":data.get("homepage_availability"),
            "year":data.get("year"),
            "manufacturer":data.get("manufacturer"),
            "make":data.get("make"),
            "make_model":data.get("make_model"),
            "is_featured":data.get("is_featured"),
            "slug":data.get('headline').lower().replace(" ","-")+"-"+str(random.randint(111111 , 999999))


        }


        content_obj , is_created = TemplateContent.objects.get_or_create(**validate_data)
        if data.get("campaign"):
                content_obj.campaign.clear()
                for campaign_id in data.get("campaign"):
                    content_obj.campaign.add(Campaign.objects.get(id=int(campaign_id)))

        if data.get("assets"):
            # print(data.get("assets"))
            for asset in data.get("assets"):
                content_obj.asset_template_association.all().delete()  # permanently deleting old entries
                asset_associate_obj = AssetAssociation.objects.using(DEFAULT_DB).create(
                    template_location = asset['template_location'],
                    asset_id = asset['asset_id']
                )
                asset_associate_obj.save()
                content_obj.save()  # For db routers save() should be invoked before creating many to many relation
                content_obj.asset_template_association.add(asset_associate_obj)

        if data.get("publishing_state"):

            state = data.get("publishing_state")


            pub_obj,is_created =PublishingState.objects.get_or_create(
                content_id=content_obj.id,
                unpublishing_on = state["unpublishing_on"] if state["unpublishing_on"] else None,
                do_not_publish_until = state["do_not_publish_until"] if state["do_not_publish_until"] else None,
                publish_state = CONTENT_PUBLISH_STATES[int(state["publish_state"])]
            )

        if isinstance(data.get("template_configuration"), dict):
            content_obj.template_configuration = str(data.get("template_configuration"))
            content_obj.save()


        if data.get("partner"):
            content_obj.content_partners = Partner.objects.using(DEFAULT_DB).get(id=int(data.get("partner")))
            # Saving
            content_obj.save()


        # Ad Linking
        if isinstance(data.get("ads"), list):
            content_obj.related_ads.clear()  # Deleting old Records
            for ad in data.get("ads"):
                try:
                    content_obj.related_ads.add(AdSection.objects.using(DEFAULT_DB).get(id=int(ad)))
                except ObjectDoesNotExist:
                    pass

        # Related article relation
        if isinstance(data.get("related_articles"), list):
            content_obj.related_articles.clear()  # Deleting old Records
            for article in data.get('related_articles'):
                try:
                    if int(article) != content_obj.id:
                        content_obj.related_articles.add(TemplateContent.objects.using(DEFAULT_DB).get(id=int(article)))
                except ObjectDoesNotExist:
                    pass
        # Secondary Navigation
        if isinstance(data.get("secondary_navigation"), list):
            content_obj.secondary_navigation.clear()  # Deleting old records
            for article in data.get('secondary_navigation'):
                try:
                    if int(article) != content_obj.id:
                        content_obj.secondary_navigation.add(
                            TemplateContent.objects.using(DEFAULT_DB).get(id=int(article)))
                except ObjectDoesNotExist:
                    pass
        # Add sponsors
        if data.get("sponsor"):
            content_obj.sponsor_id = Sponsor.objects.get(id=int(data.get("sponsor"))).id
        else:
            content_obj.sponsor = None

        return content_obj.view_json


    #         content_obj.content_heading =heading
    #         # content_obj.content_heading = data.get("headline") if data.get("headline") else content_obj.content_heading
    #         content_obj.content_subheading = data.get("subheading") if data.get("subheading") else content_obj.content_subheading
    #         content_obj.content_url = data.get("url") if data.get("url") else content_obj.content_url
    #         content_obj.content_byline = data.get("byline")
    #         content_obj.content_byline_link = data.get("byline_link")
    #
    #         content_obj.content_publish_date = parse(data.get("article_publish_date")) if data.get(
    #             "article_publish_date")   else content_obj.content_publish_date
    #
    #         content_obj.content_received_date = parse(data.get("article_received_date")) if data.get(
    #             "article_received_date") else content_obj.content_received_date
    #         content_obj.content_synopsis = data.get("synopsis") if data.get(
    #             "synopsis") else content_obj.content_synopsis
    #         content_obj.content_body = data.get("body") if data.get("body") else content_obj.content_body
    #         content_obj.search_keywords = data.get("search_keywords") if data.get(
    #             "search_keywords") else content_obj.search_keywords
    #
    #         # Updating Time to show in Recent Articles
    #         # content_obj.content_publish_date = timezone.now()
    #         try:
    #             # If search boost value is not an integer value, then handle the exception
    #             content_obj.search_boost = int(data.get("search_boost")) if data.get(
    #                 "search_boost") else content_obj.search_boost
    #         except ValueError:
    #             pass
    #         content_obj.include_in_search = data.get("include_in_search") if data.get(
    #             "include_in_search") else content_obj.include_in_search
    #         content_obj.seo_meta_name = data.get("seo_meta_name") if data.get(
    #             "seo_meta_name") else content_obj.seo_meta_name
    #         content_obj.seo_meta_description = data.get("seo_meta_description") if data.get(
    #             "seo_meta_description") else content_obj.seo_meta_description
    #         content_obj.seo_keywords = data.get("seo_keywords") if data.get(
    #             "seo_keywords") else content_obj.seo_keywords
    #         content_obj.guid = data.get("canonical_link") if data.get("canonical_link") else content_obj.guid
    #         content_obj.template = data.get("template") if data.get("template") else "Editorial Template"  # For Now Only Editorial Template
    #         content_obj.preview_path = data.get("preview_path") if data.get("preview_path") else content_obj.preview_path  # For Now Only Editorial Template
    #
    #         if isinstance(data.get("assets"), list):
    #             content_obj.asset_template_association.all().delete()   # permanently deleting old entries
    #
    #             # is_valid, response_message = cls.check_spot_validation(content_obj, data)
    #             if data.get("template_configuration")['spot_A']:
    #                 is_valid, response = cls.check_spot_validation(content_obj=content_obj, assets=data.get('assets'), spot='spot_A')
    #                 if not is_valid:
    #                     return response
    #
    #             if data.get("template_configuration")['spot_B']:
    #                 is_valid, response = cls.check_spot_validation(content_obj=content_obj, assets=data.get('assets'), spot='spot_B')
    #                 if not is_valid:
    #                     return response
    #
    #
    #         # Saving Template Config
    #         if isinstance(data.get("template_configuration"), dict):
    #             content_obj.template_configuration = data.get("template_configuration")
    #             content_obj.save()
    #
    #
    #         # Partner Linking
    #         try:
    #             if data.get("partner"):
    #                 content_obj.content_partners = Partner.objects.using(DEFAULT_DB).get(id=int(data.get("partner")))
    #                 # Saving
    #                 content_obj.save()
    #         except Exception as e:
    #             save_status["status"] = 406
    #             save_status["msg"] = str(e)
    #             save_status["created"] = content_obj.id
    #             return save_status
    #
    #         save_status["msg"] = "Saved Successfully"
    #         save_status["created"] = content_obj.id
    #         # Ad Linking
    #         if isinstance(data.get("ads"), list):
    #             content_obj.related_ads.clear()     # Deleting old Records
    #             for ad in data.get("ads"):
    #                 try:
    #                     content_obj.related_ads.add(AdSection.objects.using(DEFAULT_DB).get(id=int(ad)))
    #                 except ObjectDoesNotExist:
    #                     pass
    #
    #         # Related article relation
    #         if isinstance(data.get("related_articles"), list):
    #             content_obj.related_articles.clear()    # Deleting old Records
    #             for article in data.get('related_articles'):
    #                 try:
    #                     if int(article) != content_obj.id:
    #                         content_obj.related_articles.add(TemplateContent.objects.using(DEFAULT_DB).get(id=int(article)))
    #                 except ObjectDoesNotExist:
    #                     pass
    #         # Secondary Navigation
    #         if isinstance(data.get("secondary_navigation"), list):
    #             content_obj.secondary_navigation.clear()  # Deleting old records
    #             for article in data.get('secondary_navigation'):
    #                 try:
    #                     if int(article) != content_obj.id:
    #                         content_obj.secondary_navigation.add(TemplateContent.objects.using(DEFAULT_DB).get(id=int(article)))
    #                 except ObjectDoesNotExist:
    #                     pass
    #         # Return Response
    #         return save_status
    #     except ObjectDoesNotExist and Exception as e:
    #         save_status["status"] = 404
    #         save_status["msg"] = str(e)
    #         return save_status
    #
    # @classmethod
    # def check_asset_content_association(cls, asset_id, spot):
    #     if spot == 'spot_A' or spot == 'spot_B':
    #         cls.asset_id = None
    #         asset_contents = Asset.objects.get(id=asset_id).assets.all()
    #         asset = Asset.objects.get(id=asset_id)
    #         print("asset",asset)
    #         print("asset-type",asset.asset_type.name)
    #         print("asset content",asset_contents)
    #
    #         if len(asset_contents) > 0 or asset.asset_type.name=="Ad-VeuHub" or asset.asset_type.name=="Ad-Internal":
    #             cls.asset_id = asset_id
    #             return True
    #     return False
    #
    #
    # @classmethod
    # def check_spot_validation(cls, content_obj, assets, spot):
    #     humanised = spot.replace('_', ' ').title()
    #     error_obj = {"error" : "{spot} is missing or associated asset has no content".format(spot=humanised)}
    #     spot_assets = list(filter(lambda x: x.get('template_location') == spot, assets))
    #     print("spot assets",spot_assets)
    #     if not len(spot_assets):
    #         return False, error_obj
    #
    #     asset = spot_assets[0]
    #     print("asset",asset)
    #     if not cls.check_asset_content_association(asset_id=asset['asset_id'], spot=asset["template_location"]):
    #         return False, error_obj
    #
    #     asset_associate_obj = AssetAssociation.objects.using(DEFAULT_DB).create(
    #         template_location=spot,
    #         asset_id=cls.asset_id
    #     )
    #     asset_associate_obj.save()
    #     content_obj.save()  # For db routers save() should be invoked before creating many to many relation
    #     content_obj.asset_template_association.add(asset_associate_obj)
    #
    #     return True, {"success": "success validating and saving assets"}



class SavePublishState(object):
    """
    Publishing State will be saved here
    params required:
    unpublishing_on(DATETIME)
    do_not_publish_until(DATETIME)
    pusblish_state(INT(id of the state))
    """

    def __new__(cls, content_id, data, *args, **kwargs):
        save_status = {"msg": "", "status": 200, "created": None}

        # Get Publishing state of the content

        # if int(data.get("publish_state"))==1:
        #
        #     try:
        #         pub_object = PublishingState.objects.using(DEFAULT_DB).get(content_id=int(content_id))
        #         # Update the current record with new data
        #         pub_object.unpublishing_on = parse(data.get("unpublishing_on"))
        #         pub_object.do_not_publish_until = parse(data.get("do_not_publish_until"))
        #         pub_object.publish_state = CONTENT_PUBLISH_STATES[int(data.get("publish_state", 1))]
        #         pub_object.save()
        #         save_status["message"] = "Successfully Updated!"
        #         save_status["created"] = content_id
        #     except Exception as e:
        #         save_status["message"] = str(e)
        #         save_status["status"] = 301
        #     return save_status
        # else:
        try:
            if  int(data.get("publish_state"))==3 and not data.get('article_publish_date'):
                return {"error":"article publish date cannot be null if publish state is Published"}

            pub_object = PublishingState.objects.using(DEFAULT_DB).get(content_id=int(content_id))
            # Update the current record with new data
            pub_object.unpublishing_on =data.get("unpublishing_on") if data.get("unpublishing_on") else None
            pub_object.do_not_publish_until = data.get("do_not_publish_until") if data.get("do_not_publish_until") else None
            pub_object.publish_state = CONTENT_PUBLISH_STATES[int(data.get("publish_state"))]
            pub_object.save()
            content_obj =TemplateContent.objects.using(DEFAULT_DB).get(id=int(content_id))
            content_obj.content_publish_date=parse(data.get('article_publish_date')) if data.get('article_publish_date') else timezone.now()
            content_obj.save()
            save_status["message"] = "Successfully Updated!"
            save_status["created"] = content_id
        except Exception as e:
            save_status["message"] = str(e)
            save_status["status"] = 301
        return save_status



class ValidateTemplateConfiguration(object):
    """
    Validates Template Configuration and returns the status
    """
    def __new__(cls, config, *args, **kwargs):
        return True


class AdCreate(object):
    """
    Creating Ads for particular content
    """
    def __new__(cls, content_id, data, *args, **kwargs):
        save_status = {"status": 200, "message": "", "created": None}
        try:
            content_obj = TemplateContent.objects.get(id=int(content_id))
            ad_obj, is_created =AdSection.objects.get_or_create(
                name=data.get("name", ""),
                script=data.get("script", ""),
                location=data.get("location", "")
            )
            content_obj.related_ads.add(ad_obj)
            save_status["message"] = "OK"
            save_status["created"] = [ad.to_json for ad in content_obj.related_ads.all()]
        except ObjectDoesNotExist:
            save_status["message"] = "Content Not Found"
            save_status["status"] = 404
        return save_status


class RawMakeList(object):
    """
    Raw sql query for returning Make list
    """
    def __new__(cls, manufacturer_id, *args, **kwargs):
        results = RawQuery("select name, id from vehicles_make where manufacturer_id=%d;" %manufacturer_id)
        all_make = []
        for each in results:
            all_make.extend([{"name": each[0], "id": each[1]}])
        return all_make


class RawManufacturersList(object):
    """
    Raw sql query for returning Manufacturers list
    """
    def __new__(cls, *args, **kwargs):
        results = RawQuery("select name, id from vehicles_manufacturer;")
        all_manufactures = []
        for each in results:
            all_manufactures.extend([{"name": each[0], "id": each[1]}])
        return all_manufactures


class RawModelsList(object):
    """
    Raw sql query for returning Models list
    """
    def __new__(cls, make_id, *args, **kwargs):
        results = RawQuery("select name, id from vehicles_model where make_id=%d;"%make_id)
        all_models = []
        for each in results:
            all_models.extend([{"name": each[0], "id": each[1]}])
        return all_models


class RawYearsList(object):
    """
    Raw sql query for returning Manufacturers list
    """
    def __new__(cls, *args, **kwargs):
        results = RawQuery("select year_name, id from vehicles_year;")
        all_years = []
        for each in results:
            all_years.extend([{"name": each[0], "id": each[1]}])
        return all_years


class PublishFilter(object):
    """
    Publishing filter
    """
    def __init__(self, list_filter):
        self.list_filter = list_filter

    def results(self):
        response = []
        state = {
            "ready_to_approve": self.ready_to_approve,
            "published": self.published,
            "draft": self.draft,
            "expired": self.expired,
            "to_be_published": self.to_be_published,
            "published_by_date": self.published_by_date,
        }
        try:
            for each_filter in self.list_filter:
                response.extend(state[each_filter]())
            data = list(set(response))
            return [content.meta_json for content in data]
        except KeyError as e:
            return []

    def ready_to_approve(self):
        articles = [data.content for data in
                    PublishingState.objects.filter(publish_state=CONTENT_PUBLISH_STATES[2])]
        return articles

    def draft(self):
        articles = [data.content for data in
                    PublishingState.objects.filter(publish_state=CONTENT_PUBLISH_STATES[1])]
        return articles

    def expired(self):
        articles = [data.content for data in
                    PublishingState.objects.filter(unpublishing_on__lt=timezone.now())]
        return articles

    def published(self):
        articles = [data.content for data in
                    PublishingState.objects.filter(publish_state=CONTENT_PUBLISH_STATES[3])]
        return articles

    def published_by_date(self):
        articles = [content for content in
                    TemplateContent.objects.filter(
                        content_publish_date__gte=timezone.now()
                    )]
        return articles

    def to_be_published(self):
        articles = [data.content for data in
                    PublishingState.objects.filter(do_not_publish_until__gte=timezone.now())]
        return articles









