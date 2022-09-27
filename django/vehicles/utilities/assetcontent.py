import json
import cgi

import datetime
import requests
from bs4 import BeautifulStoneSoup

from django.utils import timezone
from idna import unicode

from content_manager.models import AssetContent, Asset, AssetType, AssetAssociation, TemplateContent, PublishingState
from marketplace.utility.JATO import JatoAuthenticatedHeader
from vehicles.models import Vehicle, Source, VehicleCategory, Make, Model, Year, BodyStyle

import re
from distutils.command.clean import clean

from unidecode import unidecode
from urllib.parse import unquote
import unicodedata

l=[]
l2 = ['lexus-lf-1-limitless-concept', 'toyota-fine-comfort-ride-concept', '2019-chevrolet-bolt-ev', '2019-honda-clarity-sedan', '2019-honda-insight-sedan', '2019-hyundai-kona-ev-preferred-suv-crossover', '2020-jaguar-i-pace-ev400-s-suv-crossover', '2019-kia-niro-1.6-l-hatchback', '2019-lexus-es-300h-signature-sedan', '2019-lexus-ux-250h-suv-crossover', '2019-mitsubishi-outlander-phev-se-s-awc-suv-crossover', '2020-toyota-corolla-hybrid', '2019-toyota-rav4-hybrid-le-awd-suv-crossover', '2019-volvo-xc60-t5-awd-momentum-suv-crossover', '2019-bmw-3-series-330i-xdrive-sedan', '2019-cadillac-escalade-esv-awd-suv-crossover', '2019-chrysler-pacifica-l-minivan', '2019-dodge-charger-sxt-sedan', '2019-dodge-durango-sxt-awd-suv-crossover', '2019-dodge-grand-caravan-canada-value-package-minivan', '2019-ford-expedition-xlt-suv-crossover', '2019-ford-fusion-se-sedan', '2019-honda-accord-sedan-lx-cvt', '2019-honda-odyssey-lx-minivan', '2019-mini-clubman-all4-hatchback', '2019-nissan-altima-s-sedan', '2019-nissan-maxima-sl-sedan', '2019-subaru-ascent-convenience-cvt-suv-crossover', '2019-subaru-legacy-2.5i-sedan', '2019-volkswagen-atlas-2.0-tsi-trendline-tiptronic-suv-crossover', '2019-volvo-s60-t5-momentum-sedan', '2019-volvo-v60-cross-country-t5-awd-wagon', '2019-acura-tlx-sedan', '2019-alfa-romeo-giulia-sedan', '2019-alfa-romeo-stelvio-awd-suv-crossover', '2019-audi-a6-3.0-55-tfsi-quattro-progressiv-s-tronic-sedan', 'audi-e-tron', '2019-bmw-8-series-m850i-xdrive-coupe', '2019-cadillac-xt5-fwd-suv-crossover', '2019-cadillac-xt4-luxury-fwd-suv-crossover', '2019-genesis-g70-2.0t-advanced-awd-sedan', '2019-genesis-g80-3.8-technology-sedan', '2019-genesis-g90-3.3t-sedan', '2019-chrysler-300-touring-rwd-sedan', '2019-infiniti-q50-3.0t-luxe-awd-sedan', '2019-infiniti-q60-coupe-3.0t-luxe-awd', '2019-jaguar-xj-r-sport-swb-awd-sedan', 'maserati-ghibli', 'maserati-quattroporte', '2019-mercedes-benz-c-class-c-300-4matic-sedan', '2019-chevrolet-cruze-ls-sedan-6at', '2019-fiat-500-hatchback-pop', '2019-fiat-500l-sport-minivan', '2019-honda-civic-sedan-dx-6mt', '2019-hyundai-kona-essential-2.0-fwd-6at-suv-crossover', '2019-hyundai-veloster-2.0-n-6mt-coupe', '2019-hyundai-elantra-gt-preferred-6mt-hatchback', '2020-kia-soul-2.0-lx-ivt-hatchback', '2019-mazda-mazda3-gx-6mt-sedan', '2019-mercedes-benz-a-class-a-220-sedan', '2019-mini-cooper-hatchback', '2019-subaru-impreza-convenience-5mt-sedan', '2019-volkswagen-golf-1.4-tsi-comfortline-6mt-hatchback', '2019-volkswagen-jetta-1.4-tsi-comfortline-6mt-sedan', '2019-acura-nsx-coupe', '2019-alfa-romeo-4c-spider-coupe', '2020-bmw-3-series-m340i-xdrive-sedan', '2019-cadillac-ct6-3.6-luxury-awd-sedan', '2019-chevrolet-camaro-1ls-coupe', '2019-chevrolet-corvette-stingray-coupe', '2019-dodge-challenger-sxt-coupe', '2019-fiat-124-spider-classica-convertible', '2019-ford-mustang-ecoboost-coupe', '2020-jaguar-f-type-coupe-auto', '2019-kia-stinger-2.0-gdi-awd-gt-line-hatchback', 'maserati-granturismo-and-granturismo-convertible', '2019-mini-cooper-s-ice-blue-edition-hatchback', '2020-toyota-supra-coupe', '2019-acura-mdx-sh-awd-suv-crossover', '2019-acura-rdx-suv-crossover', 'audi-q3', '2019-audi-q8-3.0-s5-tfsi-quattro-progressiv-tiptronic-suv-crossover', '2019-bmw-x7-xdrive40i-suv-crossover', '2019-buick-enclave-essence-fwd-suv-crossover', '2019-buick-encore-preferred-fwd-suv-crossover', '2019-buick-envision-preferred-awd-suv-crossover', '2019-chevrolet-blazer-2.5l-fwd-suv-crossover', '2019-chevrolet-equinox-ls-1.5t-suv-crossover', '2019-fiat-500x-pop-4wd-suv-crossover', '2019-ford-ecosport-s-suv-crossover', '2019-ford-edge-se-awd-suv-crossover', '2019-ford-escape-s-fwd-suv-crossover', '2019-ford-explorer-xlt-4wd-suv-crossover', '2019-gmc-acadia-sle-1-fwd-suv-crossover', '2019-gmc-terrain-sle-fwd-suv-crossover', 'hyundai-palisade', '2019-honda-cr-v-lx-suv-crossover', '2019-honda-passport-sport-suv-crossover', '2019-hyundai-tucson-2.0-essential-fwd-6at-suv-crossover', '2019-hyundai-santa-fe-essential-2.4-fwd-suv-crossover', '2019-infiniti-qx50-luxe-suv-crossover', '2019-infiniti-qx60-pure-awd-cvt-suv-crossover', '2019-jaguar-f-pace-25t-premium-awd-suv-crossover', '2019-jeep-cherokee-sport-suv-crossover', '2019-jeep-grand-cherokee-laredo-suv-crossover', '2019-jeep-all-new-wrangler-unlimited-sport-suv-crossover', 'kia-telluride', '2019-land-rover-discovery-v6-se-suv-crossover', '2019-land-rover-discovery-sport-se-suv-crossover', '2019-lexus-rx-350-suv-crossover', 'lincoln-aviator', '2019-subaru-forester-2.5i-suv-crossover', '2019-volkswagen-tiguan-2.0-tsi-trendline-8at-tiptronic-suv-crossover', '2019-volvo-xc90-t5-awd-momentum-suv-crossover', '2019-volvo-xc40-t5-awd-momentum-suv-crossover', '2019-lincoln-mkc-select-awd-suv-crossover', '2019-lincoln-nautilus-select-awd-suv-crossover', '2019-lincoln-navigator-select-suv-crossover', 'maserati-levante', '2019-mazda-cx-5-gx-fwd-6at-suv-crossover', '2019-mazda-cx-9-gs-suv-crossover', '2020-mercedes-benz-gle-gle-350-4matic-suv-crossover', '2019-mercedes-benz-gla-gla-250-4matic-suv-crossover', '2019-mini-countryman-all4-hatchback', '2019-mitsubishi-eclipse-cross-es-s-awc-suv-crossover', '2019-mitsubishi-outlander-es-awc-cvt-suv-crossover', '2019-mitsubishi-rvr-es-fwd-cvt-suv-crossover', '2019-nissan-murano-s-suv-crossover', '2019-nissan-pathfinder-s-fwd-suv-crossover', '2020-land-rover-range-rover-evoque-s-suv-crossover', '2019.5-land-rover-range-rover-velar-s-suv-crossover', '2019-chevrolet-silverado-1500-wt-crew-cab-short-box-pickup', '2019-chevrolet-colorado-wt-crew-cab-short-box-pickup', '2019-chevrolet-silverado-2500hd-wt-double-cab-long-box-pickup', '2019-ford-f-150-4x4-xl-supercrew-145-in-pickup', '2019-ford-ranger-xl-4x4-supercab-pickup', '2019-gmc-canyon-sl-extended-cab-pickup', '2019-gmc-sierra-1500-base-crew-cab-short-box-pickup', 'jeep-gladiator', '2019-ram-ram-1500-tradesman-quad-cab', '2019-ram-ram-3500-laramie-mega-cab-4x4-pickup', '2019-ram-promaster-cargo-van-1500-118-wb-low-roof', '2019-ram-promaster-city-st-van-van']

data2={
    "Category": "ECO",
    "Slug": "2019-honda-insight-sedan",
    "Vehicle Name 1": "HONDA INSIGHT",
    "YEAR": 2019,
    "Vehicle Name 2": "2019 Honda Insight - Sedan",
    "JATO ID": 773426820190402,
    "SPECIFICATION DATA": "",
    "COMMENTS": "",
    "EDITORIAL BLURB (From AS GUIDE)": "The Insight is based on the Civic platform and gives Honda a triple-threat in the gasoline-electric category, alongside the Accord Hybrid and Clarity plug-in. The drivetrain consists of a four-cylinder gasoline engine and two electric motors. The drive motor generates 129-horsepower while the secondary electric motor acts as a starter as well as a generator. Net system output is 151-horsepower. In EV Drive mode, the electric motor operates solo, but only for a kilometre or two before the gasoline engine starts up and replenishes the batteries. EV Drive comes in handy for low-speed stop-and-go traffic. The Insight includes an assortment of active-safety technology bundled under the Honda Sensing brand. In addition, a dual-zone climate control 180-watt audio system and an eight-inch touchscreen with Apple CarPlay and Android connectivity are standard. The Touring adds a moonroof, navigation, leather seats and rear heated seats."
  },

vehciles = [774316720190301, 792040420190110, 773426820180802, 805542920181221, 800795420181214, 780616320180926, 712702720180814, 803296220181023, 789425520181029, 773617420190117, 785077620181105, 712241820190301, 52417520190301, 786235620190107, 703346120190205, 786592720190207, 63157520190107, 52407620190103, 727554420190103, 713543120181112, 796806320180521, 766356220180801, 58619720180928, 748112320181217, 795567420180901, 765540720180731, 779685020190130, 785076520181105, 744220720181206, 734603020190222, 777839220190116, 784213120190227, 765558520181017, 803584420190301, 52419220190301, 707120320190301, 798466420180419, 765550520180601, 788873520180601, 63187720190107, 63185720190109, 773239020181019, 16058620181121, 750213020181001, 767617320190123, 788877520181204, 720301620181022, 16056420181023, 794962720190103, 804276720190103, 711052520190103, 703609920190215, 705487420190116, 806768820190201, 52407220180701, 63187020180901, 50737920190130, 735919820190130, 766464020181112, 756587420190108, 712241720190301, 768971620190107, 777700920190301, 16014220190301, 749655120190207, 768932720181219, 731353020190103, 783260520181212, 793836120180809, 804085920181001, 807580120190301, 60093820190222, 735906620190222, 802087720180904, 805731420190316, 742573020190301, 757924920190301, 768644420190301, 805649320190301, 61464020190301, 800048920190228, 789205620190103, 744803420190103, 708261820190211, 796806020190103, 735919320190301, 768164920190301, 735907420181113, 806836120190205, 79805520190103, 50738720190103, 742002720180626, 707965720180618, 780669020181119, 720696720190107, 766567420190107, 735873720190107, 79803120181101, 740540220181101, 63178820180831, 780025020180731, 741999320190130, 768968620181002, 789282120181002, 727151220190103, 735894620190103, 60061020180917, 708297920181106, 735895620180810, 807532520190304, 737977420180809, 779012720180701, 791591820190109, 742001320180629, 760412520180817, 742002820181219, 715188620180918, 715603120190117, 773703320181101, 735878120190107, 738127720190301, 727413120190107, 793535720190301, 802354120180904, 738177420190301, 735918320190301, 728343320190108, 730613920190201, 726830020190204, 744391420190107]

vehicles_with_no_jato_ids= ['Lexus lF-1 Limitless Concept', 'Toyota Fine-Comfort Ride Concept', '2020 TOYOTA COROLLA HYBRID', 'AUDI E-TRON', 'MASERATI GHIBLI', 'MASERATI QUATTROPORTE', 'MASERATI GRANTURISMO AND GRANTURISMO CONVERTIBLE', 'AUDI Q3', 'HYUNDAI PALISADE', 'KIA TELLURIDE', 'LINCOLN AVIATOR', 'MASERATI LEVANTE', 'JEEP GLADIATOR']


slugs_with_no_jato_ids = ['lexus-lf-1-limitless-concept', 'toyota-fine-comfort-ride-concept', '2020-toyota-corolla-hybrid', 'audi-e-tron', 'maserati-ghibli', 'maserati-quattroporte', 'maserati-granturismo-and-granturismo-convertible', 'audi-q3', 'hyundai-palisade', 'kia-telluride', 'lincoln-aviator', 'maserati-levante', 'jeep-gladiator']



class ReadData(object):

    def __init__(self):

        with open("/home/ubuntu/autolife/vehicles/utilities/autolife-vehicles.json", encoding='utf8') as json_data:
        # with open("/home/aakash/Documents/projects/autolife-backend/vehicles/utilities/autolife-vehicles.json", encoding='ISO-8859-1') as json_data:
        # with open("/home/aakash/Documents/projects/autolife-backend/vehicles/utilities/autolife-vehicles.json", encoding='utf8') as json_data:
            self.data2 = json.load(json_data)


    def savecontent(self):
        i = 0

        for data in l2:
            content , is_created =AssetContent.objects.get_or_create(
                identifier=data,
                content = 'uploads/' + data + '.jpg',
                alternate_text = data


            )
            if is_created:
                i=i+1
            print("toatl records added = ",i)

    def saveasset(self):
            i = 0
            asset_type_obj=AssetType.objects.get(id=2)
            print(asset_type_obj)
            print(asset_type_obj.name)


            for data in l2:
                contentObj = AssetContent.objects.get(identifier=data)
                asset_obj, is_created = Asset.objects.get_or_create(
                    name = data,
                    asset_type_id=asset_type_obj.id,
                    thumbnail = 'uploads/thumbnails/' + data + '.jpg',
                )
                asset_obj.assets.add(contentObj),
                if is_created:
                    i = i + 1
                print("toatl records added = ", i)


    def saveassetassociation(self):

        i=0
        for data in l2:
            assetObj=Asset.objects.get(name=data)
            assetassociation, is_created =AssetAssociation.objects.get_or_create(

                asset=assetObj,
                template_location = 'spot_A'
            )

            if is_created:
                i = i + 1
            print("toatl records added = ", i)


    def savetemplatecontent(self):

        i=0
        for data in self.data2:
            newstring ='<p>'+data['EDITORIAL BLURB (From AS GUIDE)']+'</p>'

            associationObj = AssetAssociation.objects.get(asset__name=data['Slug'])

            template_configuration = {'spot_B': False, 'spot_A': True}



            tempObj,is_created=TemplateContent.objects.get_or_create(
                content_heading = data['Slug'],
                content_subheading = data['Slug'],
                content_body = newstring,
                content_received_date = timezone.now(),
                template = "Vehicle Editorial Template",
                slug = data['Slug'],
            )
            tempObj.asset_template_association.add(associationObj)
            t2 = TemplateContent.objects.get(content_heading = data['Slug'])

            t2.template_configuration = template_configuration
            t2.save()

            temp_obj_publish_state = PublishingState.objects.get(content_id=tempObj.id)
            temp_obj_publish_state.publish_state="Published"
            temp_obj_publish_state.unpublishing_on=timezone.now()
            temp_obj_publish_state.do_not_publish_until=timezone.now() - datetime.timedelta(days=3)
            temp_obj_publish_state.save()

            """
                    closing_date = (post_date + datetime.timedelta(days=31))

            """





            if is_created:
                i=i+1
            print("toatl records added = ", i)

    def savevehicles(self):
            i=0
            for data in self.data2:
                    headers = JatoAuthenticatedHeader()  # Picks from cache, if expired will pick from Jato.
                    base_url = "https://api.jatoflex.com"
                    url = "/api/{culture}/versions/{vehicle_id}".format(culture="en-ca", vehicle_id=data["JATO ID"])

                    # for data in vehciles:
                    #     print(data)
                    response = requests.get(base_url + url, headers=headers)
                    if response.status_code == 200:
                        i=i+1
                        print(i)
                        # result = json.loads(response.text)
                        #
                        # makename = result['makeName']
                        # modelname = result['modelName']
                        #
                        # if len(result['makeName']) <= 3:
                        #     makename = makename.upper()
                        # else:
                        #     makename = makename.title()
                        #
                        # if len(result['modelName']) <= 3:
                        #     modelname = modelname.upper()
                        # else:
                        #     modelname = modelname.title()
                        #
                        #
                        #
                        #
                        # make_obj = Make.objects.get(
                        #     name=makename)
                        #
                        # model_obj=Model.objects.filter(name=modelname,
                        #                         make_id=make_obj.id)
                        #
                        # print(result['modelName'])
                        #
                        # model_obj.update(name = result['modelName'])
                        #
                        # i=i+1
                        # print("model name changed ",i)



                    else:
                        print("resposne code is 400 for id =",data["JATO ID"])
                        # result = json.loads(response.text)
                        # modelname = result['modelName'].title()
                        #
                        # makename = result['makeName'].title()
                        # print("modelname ",modelname)
                        # print("makename ",makename)
                        # sourceobj = Source.objects.get(name="JATO")
                        # articleobj = TemplateContent.objects.get(slug=data["Slug"])
                        # categoryobj = VehicleCategory.objects.get(category_name = data['Category'].lower())
                        # makeobj = Make.objects.get(name=result['makeName'])
                        # modelobj = Model.objects.filter(name=modelname).first()
                        # print(modelname)
                        # print(modelobj)
                        #
                        #
                        # yearobj = Year.objects.get(year_name=result['modelYear'])
                        #
                        #
                        #
                        # vehicleObj , is_created = Vehicle.objects.get_or_create(
                        #
                        #     make_id = makeobj.id,
                        #     model_id = modelobj.id,
                        #     year_id = yearobj.id,
                        #     source_name_id = sourceobj.id,
                        #     category_id = categoryobj.id,
                        #     source_id = result['vehicleId'],
                        #     trim_name =  result["versionName"],
                        #     body_style_id= result["bodyStyleId"],
                        #     price = result["msrp"],
                        #     article_id = articleobj.id,
                        #     vehicle_name = result["headerDescription"],
                        #     fuel_economy_city = result["fuelEconCity"],
                        #     fuel_economy_hwy = result["fuelEconHwy"],
                        #     transmission = result["transmissionType"],
                        #
                        # )
                        # if is_created:
                        #     i = i + 1
                        # print(i)

    def savevehicles2(self):

        try:


            i = 0

            # for data in self.data2:
            for data in data2:
                    print(data["JATO ID"])


                # if data["JATO ID"] == 773426820190402:

                    headers = JatoAuthenticatedHeader()  # Picks from cache, if expired will pick from Jato.
                    base_url = "https://api.jatoflex.com"
                    url = "/api/{culture}/versions/{vehicle_id}".format(culture="en-ca", vehicle_id=data["JATO ID"])

                    # for data in vehciles:
                    #     print(data)
                    response = requests.get(base_url + url, headers=headers)
                    print("response",response)
                    if response.status_code == 200:


                        result = json.loads(response.text)

                        # print(result)

                        sourceobj = Source.objects.get(name="JATO")
                        articleobj = TemplateContent.objects.get(slug=data["Slug"])
                        categoryobj = VehicleCategory.objects.get(category_name=data['Category'])



                        if len(result['makeName']) <= 3:
                            make_obj, is_created = Make.objects.get_or_create(
                                name=result['makeName'].upper())
                        else:
                            make_obj, is_created = Make.objects.get_or_create(
                                name=result['makeName'].title())
                        if Model.objects.filter(name=result['modelName'],
                                                make_id=make_obj.id).exists():
                            model_obj = Model.objects.filter(
                                name=result['modelName'],
                                make_id=make_obj.id
                            )[0]
                        else:
                            model_obj = Model.objects.create(
                                name=result['modelName'],
                                make_id=make_obj.id
                            )

                        year_obj, is_created = Year.objects.get_or_create(year_name=result["modelYear"])
                        body_style_obj, is_created = BodyStyle.objects.get_or_create(
                            body_style_name=result["bodyStyleName"],
                            body_style_id=result["bodyStyleId"]
                        )
                        vehicleObj, is_created = Vehicle.objects.get_or_create(

                            make_id=make_obj.id,
                            model_id=model_obj.id,
                            year_id=year_obj.id,
                            source_name_id=sourceobj.id,
                            category_id=categoryobj.id,
                            source_id=result['vehicleId'],
                            trim_name=result["versionName"],
                            body_style_id=body_style_obj.id,
                            article_id=articleobj.id,
                            vehicle_name=result["headerDescription"],
                            fuel_economy_city=result["fuelEconCity"],
                            fuel_economy_hwy=result["fuelEconHwy"],
                            transmission=result["transmissionType"],
                            image_url ='https://media-dev-autolife-ca.s3.amazonaws.com/media/uploads/'+data['Slug']+'.jpg'

                        )
                        if is_created:
                            i = i + 1
                            print("vehicless imported =",i)





        except Exception as e:
            print(str(e))
            pass

    def clearcategory(self):
        vehciles = Vehicle.objects.filter(category_id__isnull=False)
        print(len(vehciles))
        print(vehciles)
        vehciles.update(category=None)
        print("vehicle category is set to null")


    def clearprice(self):
        vehciles=Vehicle.objects.filter(source_id__isnull=False)
        print(vehciles)
        print(len(vehciles))
        vehciles.update(price=None)
        print("price cleared")


    def changeimageurlvehicles(self):
        """

        https://media-dev-autolife-ca.s3.amazonaws.com/media/uploads/2019-ram-promaster-city-st-van-van.jpg

        :return:
        """

        i=0
        for data in self.data2:
            articleoj = TemplateContent.objects.get(slug = data['Slug'])
            try:
                vehcileobj =Vehicle.objects.get(article_id=articleoj.id)
                vehcileobj.image_url='https://media-dev-autolife-ca.s3.amazonaws.com/media/uploads/'+data['Slug']+'.jpg'
                vehcileobj.save()
                i=i+1
                print("vehicles updated =", i)

            except:
                pass

    def savevehicleswithnojatoids(self):

            i = 0

            for data in self.data2:
                if data['JATO ID'] == "NA" or data['JATO ID'] == "NO JATO":

                    print(data['Category'])
                    articleobj = TemplateContent.objects.get(slug=data["Slug"])
                    categoryobj = VehicleCategory.objects.get(category_name=data['Category'])
                    year_obj, is_created = Year.objects.get_or_create(year_name=data["YEAR"])


                    vehicleObj, is_created = Vehicle.objects.get_or_create(


                        year_id=year_obj.id,
                        category_id=categoryobj.id,
                        article_id=articleobj.id,
                        vehicle_name=data["Vehicle Name 1"],

                        image_url='https://media-dev-autolife-ca.s3.amazonaws.com/media/uploads/' + data[
                            'Slug'] + '.jpg'

                    )
                    if is_created:
                        i = i + 1
                        print("vehicless imported =", i)



    def change_articlebody_to_HTML(self):

        i=0
        for data in self.data2:
            newstring = '<p>'+data['EDITORIAL BLURB (From AS GUIDE)']+'</p>'
            articleobj = TemplateContent.objects.get(slug=data['Slug'])
            articleobj.content_body=newstring
            articleobj.save()
            i=i+1
            print(i)

    def encode_to_html(self):


        text = 'Ram Truck’s new Heavy Duty models out-power, out-tow and out-haul all rival pickups. The new 6.7-litre Cummins High Output Turbo Diesel achieves a milestone 1,000 lb.-ft. of torque, meaning an industry-leading 35,100-lbs. towing capacity and 7,680-lb. of payload prowess. Ram Heavy Duty rides on a new, 98.5 per cent high-strength steel frames that is lighter and stiffer. The standard 6.4-litre HEMI® V-8 with cylinder deactivation, delivers a class-leading 410-horsepower and 429 lb.-ft. of torque. It’s mated to a new, class-exclusive TorqueFlite eight-speed automatic. Ram redesigned the Heavy Duty lineup to be the best riding, handling and towing ever with more than 100 safety and security features and an emphasis on comfort and confidence. Trailer hookup and maneuvering is easier thanks to a driver-activated Bed Lowering mode, 360-degree surround-view camera and an auxiliary camera for trailers. '

        def HTMLEntitiesToUnicode(text):
            """Converts HTML entities to unicode.  For example '&amp;' becomes '&'."""
            # text = unicode(BeautifulStoneSoup(text, convertEntities=BeautifulStoneSoup.HTML_ENTITIES))
            text = unicode(BeautifulStoneSoup(text, convertEntities=BeautifulStoneSoup.HTML_ENTITIES))
            return text

        def unicodeToHTMLEntities(text):
            """Converts unicode to HTML entities.  For example '&' becomes '&amp;'."""
            text = cgi.escape(text).encode('ascii', 'xmlcharrefreplace')
            return text

    # text = "&amp;, &reg;, &lt;, &gt;, &cent;, &pound;, &yen;, &euro;, &sect;, &copy;"

        uni = HTMLEntitiesToUnicode(text)
        # htmlent = unicodeToHTMLEntities(text)

        print("result =", uni)














def escapechar(string):
    try:
        try:
            string = unidecode(unquote(string))
        except:
            pass
        try:
            string = str(
                unicodedata.normalize('NFKD', clean.unicode(a)).encode('ascii', 'ignore').decode('utf-8'))
        except:
            pass
        try:
            string = re.sub(r'[^\x00-\x7F]+', ' ', string)
        except:
            pass
        string = string.replace("’", "'").replace("–", "-").replace("—", "-").replace('--', '-')
        # string = string.replace('®', '').replace('©', '').replace('™', '').strip()
    except:
        pass

    return string



from html import unescape

def unescape1(newstring):
    unescaped = unescape(newstring)
    return unescaped















