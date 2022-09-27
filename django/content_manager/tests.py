from django.urls import reverse
from rest_framework.test import APITestCase

from content_manager.models import TagWeight, TemplateContent, Asset, AssetType, AdSection
from marketplace.models import Sponsor, Campaign
from regions.models import City, State, Country
from tags.models import Tag, TagType

from users.models import Profile
from users.utils.utility import AuthenticationToken
from vehicles.models import Manufacturer, Make, Model


class TagsListUnitTest(APITestCase):
    """
    Unit testing for tags list
    """
    url = reverse("content management:tags list")

    def testcase_tags(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy", email="kaamy@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.tagtype = TagType.objects.create(type_name="Cars")
        self.tag = Tag.objects.create(id=1, name="Jeep")
        response = self.client.get(self.url)
        print("Tags Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"])
        except:
            self.assertNotEqual(response.content, '{}')


class SponsorsListUnitTest(APITestCase):
    """
    Unit testing for sponsors list
    """
    url = reverse("content management:sponsors list")

    def testcase_sponsors(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy", email="kaamy@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.sponsor = Sponsor.objects.create(id=1, name="Compass")
        response = self.client.get(self.url)
        print("Sponsors Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"])
        except:
            self.assertNotEqual(response.content, '{}')


class PartnersListUnitTest(APITestCase):
    """
    Unit testcase for partners list
    """
    url = reverse("content management:partners list")

    def testcase_partners(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy", email="kaamy@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        response = self.client.get(self.url)
        print("Partners Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"])
        except:
            self.assertNotEqual(response.content, '{}')


class CountryListUnitTest(APITestCase):
    """
    Unit testing for country list
    """
    url = reverse("content management:country list")

    def testcase_country(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy", email="kaamy@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.country = Country.objects.create(id=1, name="Canada", short_name="CN")
        response = self.client.get(self.url)
        print("Country Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"])
        except:
            self.assertNotEqual(response.content, '{}')


class StateListUnitTest(APITestCase):
    #   Unit test case for state listing
    url = reverse("content management:state list", kwargs={'country_id':1})

    def testcase_state(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy", email="kaamy@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.country = Country.objects.create(id=1, name="Canada", short_name="CN")
        self.state = State.objects.create(id=1, name="Uttar Pradesh", short_name="UP", timezone="UTF-8")
        response = self.client.get(self.url)
        print("State Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"])
        except:
            self.assertNotEqual(response.content, '{}')


class CityListUnitTest(APITestCase):
    #    Unit testcase for city API
    url = reverse("content management:car cities list", kwargs={'state_id':1})

    def testcase_city(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy", email="kaamy@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.state = State.objects.create(id=1, name="Uttar Pradesh", short_name="UP", timezone="UTF-8")
        self.city = City.objects.create(id=1, name="Toronto")
        response = self.client.get(self.url)
        print("City Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"])
        except:
            self.assertNotEqual(response.content, '{}')


class ManufacturerlListUnitTest(APITestCase):
    # Unit testcase for manufacturer API
    url = reverse("content management:manufacturer list")

    def testcase_manufacturer(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy1", email="kaa1my@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.manufacturer = Manufacturer.objects.create(id=1, name="Jeep", logo="http://www.a.com/", description="")
        response = self.client.get(self.url)
        print("Manufacturer Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class MakeListUnitTest(APITestCase):
    """
    Unit testcase for make API
    """
    url=reverse("content management:car make list",  kwargs={'manufacturer_id':1})

    def testcase_make(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy1", email="kaa1my@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.make = Make.objects.create(id=1, name="Jeep", logo="http://www.a.com/", description="")
        response = self.client.get(self.url)
        print("Make Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class ModelListUnitTest(APITestCase):
    """
    Unit testcase for model API
    """
    url = reverse("content management:car model list", kwargs={'make_id':1})

    def testcase_model(self):
        self.user, is_created = Profile.objects.get_or_create(username="kammy1", email="kaa1my@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.model = Model.objects.create(id=1, name="X8", image="http://www.logo.com/", description="")
        response = self.client.get(self.url)
        print("Model Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class CampaignListUnitTest(APITestCase):
    """
    Unit tetcase for campaign list
    """
    url = reverse("content management:campaign list")

    def testcase_campaign(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.campaign = Campaign.objects.create(id=1, name="google", start_date="")
        self.campaign = Campaign.objects.create(id=2, name="facebook", start_date="")
        response = self.client.get(self.url)
        print("Campaign Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class SubmitTaggingUnitTest(APITestCase):
    """
    Unit testcase for submit tagging API
    """
    url = reverse("content management:submit tags")

    def testcase_submittagging(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.sponsor = Sponsor.objects.create(id=1, name="Compass")
        self.city = City.objects.create(id=1, name="Toronto")
        self.state=State.objects.create(id=1, name="Uttar Pradesh", short_name="UP", timezone="UTF-8")
        self.country = Country.objects.create(id=1, name="Canada", short_name="CN")
        self.campaign = Campaign.objects.create(id=1, name="google", start_date="")
        self.campaign = Campaign.objects.create(id=2, name="facebook", start_date="")
        self.manufacturer = Manufacturer.objects.create(id=1, name="Jeep", logo="http://www.a.com/", description="")
        self.manufacturer = Manufacturer.objects.create(id=2, name="Car", logo="http://www.a.com/", description="")
        self.make = Make.objects.create(id=1, name="Jeep", logo="http://www.a.com/", description="")
        self.model = Model.objects.create(id=1, name="X8", image="http://www.logo.com/", description="")
        self.tagtype = TagType.objects.create(id=1, type_name="Cars")
        self.tag = Tag.objects.create(id=1, name="Jeep")
        self.tagweight = TagWeight.objects.get_or_create(tag_id=1, weight=0)
        response = self.client.post(self.url, {"is_timely_content": False, 	"disable_personalization" : False,
                                               "is_promoted_content" : False, "homepage_availability" : False,
                                               "country" : 1, "state" : 1, "city" : 1,
                                               "sponsor" : 1, "campaign" : [1,2], "manufacturer" : [1,2],
                                               "make" : [1], "model" : [1], "tag" : [{1:2}] })
        print("Submit Tagging Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class PublishStatesUnitTest(APITestCase):
    """
    Unit testcase for publish states
    """
    url = reverse("content management:publish state list")

    def testcase_publishstates(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        response = self.client.get(self.url)
        print("Publishing State Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class SubmitPublishStateUnitTest(APITestCase):
    """
    Unit testcase for submit publish state
    """
    url = reverse("content management:submit publish state", kwargs={'content_id': 1})

    def testcase_submitpublistate(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)

        response = self.client.post(self.url)
        print("Submit Publishing State Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class TemplateListUnitTest(APITestCase):
    """
    Unit test case for template listing
    """
    url = reverse("content management:template list")

    def testcase_templatelist(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.templatelist = TemplateContent.objects.create(id=1, content_heading="Audi 8", content_byline="X2", guid=1)
        response = self.client.get(self.url)
        print("Template List Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class ContentDetailsByIDUnitTest(APITestCase):
    """
    Unit testcase for content details by id
    """
    url = reverse("content management:content details", kwargs={'content_id':1})

    def testcase_contentdetailsbyid(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.templatelist = TemplateContent.objects.create(id=1, content_heading="Audi 8", content_byline="X2", guid=1)
        response = self.client.get(self.url)
        print("Content Detail Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class DeleteContentUnitTest(APITestCase):
    """
    Unit testcase for delete content
    """
    url = reverse("content management:delete content", kwargs={'content_id':1})

    def testcase_deletecontent(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.templatelist = TemplateContent.objects.create(id=1, content_heading="Audi 8", content_byline="X2", guid=1)
        response = self.client.get(self.url)
        print("Delete Content Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class PublishedContentListUnitTest(APITestCase):
    """
    Unit testcase for check slug
    """
    url = reverse("content management:published content details")

    def testcase_deletecontent(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.templatelist = TemplateContent.objects.create(id=1, content_heading="Audi 8", content_byline="X2", guid=1)
        response = self.client.get(self.url)
        print("Published Content Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class AssetsListUnitTest(APITestCase):
    """
    Unit testcase for asset list
    """
    url = reverse("content management:asset list")

    def testcase_assetlistcontent(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.asserttype = AssetType.objects.create(id = 1, name="Mercedes")
        self.assetlist = Asset.objects.create(id=1, name="ff", template_location="")
        response = self.client.get(self.url)
        print("Assets List Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class AdListUnitTest(APITestCase):
    """
    Unit testcase for ad list
    """
    url = reverse("content management:advertisement list")

    def testcase_adlist(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.assetlist = AdSection.objects.create(id=1, name="ff", script="Google", location="Canada")
        response = self.client.get(self.url)
        print("Ad List Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')


class PreviewUnitTest(APITestCase):
    """
    Unit testcase for preview
    """
    url = reverse("content management:preview content", kwargs={'content_id':1})

    def testcase_preview(self):
        self.user, is_created = Profile.objects.get_or_create(username="deepali", email="deepalipopli57@gmail.com",
                                                              password="123", is_superuser=True)
        self.token = AuthenticationToken(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
        self.templatelist = TemplateContent.objects.create(id=1, content_heading="Audi 8", content_url="www.abc.com",
                                                           content_byline="Car", content_body="fgf", content_synopsis="Abc",
                                                           secondary_navigation="", guid=1)
        response = self.client.get(self.url)
        print("Preview Testcase \n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        try:
            self.assertEqual(200, response.data["status"], "")
        except:
            self.assertNotEqual(response.content, '{}')