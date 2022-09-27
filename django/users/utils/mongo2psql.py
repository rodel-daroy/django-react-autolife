import json
import cgi

import datetime
import requests
from bs4 import BeautifulStoneSoup
from dateutil.parser import parse

from django.utils import timezone
from idna import unicode

from content_manager.models import AssetContent, Asset, AssetType, AssetAssociation, TemplateContent, PublishingState
from marketplace.utility.JATO import JatoAuthenticatedHeader
from users.models import Score
from vehicles.models import Vehicle, Source, VehicleCategory, Make, Model, Year, BodyStyle

import re
from distutils.command.clean import clean

from unidecode import unidecode
from urllib.parse import unquote
import unicodedata
from users.models import Action, Visit, Score, Profile
from pymongo import MongoClient
import json
from datetime import datetime
class ReadData(object):

    def __init__(self):
        pass

    def create_database_connection(self):
        client = MongoClient("mongodb://{username}:{password}@18.216.198.59:27017/".format(username='autolifemaster1',
                                                                                           password='thiisautolifeprod'))
        db = client.autolife_user_journey
        database = db.userJourney.find()
        return database

    def savescore(self):
        start_time = datetime.now()
        database = self.create_database_connection()

        count = 0
        for result in database:
            userId = result['id']
            count += 1
            if 'user_score' in result:
                user_score = result['user_score']
                get_keys = list(user_score.keys())
                for user_score_keys in get_keys:
                    for m in range(0, len(user_score[user_score_keys])):
                        tag_weight = user_score[user_score_keys][m]['tag_weight']
                        tag = user_score[user_score_keys][m]['tag']
                        tag_type = user_score[user_score_keys][m]['tag_type']
                        so = Score.objects.create(
                            tag_weight=tag_weight,
                            tag_name=tag,
                            tag_type=tag_type
                        )

                        try:
                            userobj = Profile.objects.get(id=userId)
                        except:
                            userobj = None
                        if userobj is not None:
                            userobj.score.add(so)
                            print("scores added for user {userId}".format(userId=userId))
                        else:
                            pass
        print("total user added", count)
        end_time = (datetime.now() - start_time)
        print("toatl time taken = ",end_time)

    def savevisit(self):
        start_time = datetime.now()
        database = self.create_database_connection()

        count = 0
        for result in database:
            userId = result['id']
            count += 1
            if 'visits' in result:
                visits = result['visits']
                for j in range(0,len(visits)):
                    ip_address = visits[j]['ip_address']
                    url_accessed = visits[j]['url_accessed']
                    timestamp = str(visits[j]['timestamp'])
                    country = visits[j]['geo_location']['country']
                    city = visits[j]['geo_location']['city']
                    visitobj = Visit.objects.create(
                                        ip_address = ip_address,
                                        url_accessed = url_accessed,
                                        city=city,
                                        country =country,
                                        # created_on=parse(timestamp)
                                    )
                    visitobj.created_on = parse(timestamp)
                    visitobj.save()

                    try:
                        userobj = Profile.objects.get(id=userId)
                    except:
                        userobj = None
                    if userobj is not None:
                        userobj.visits.add(visitobj)
                        print("Visites added for user {userId}".format(userId=userId))
                    else:
                        pass
        print("total user added",count)
        end_time = (datetime.now()-start_time)
        print("total time taken =",end_time)


    def saveactions(self):
        start_time = datetime.now()
        database = self.create_database_connection()

        count = 0
        for result in database:
            userId = result['id']
            count += 1
            if 'actions' in result:
                action = result['actions']
                for k in range(0,len(action)):
                        created_on = str(action[k]['timestamp'])
                        actions = action[k]['changes']
                        for i in range(0, len(actions)):
                            change_type = actions[i]['change_type']
                            change = actions[i]['change']
                            actionobj = Action.objects.create(
                                change_type = change_type,
                                change = change[0:250]

                            )
                            actionobj.created_on = parse(created_on)
                            actionobj.save()
                            try:
                                userobj = Profile.objects.get(id=userId)
                            except:
                                userobj = None
                            if userobj is not None:
                                userobj.actions.add(actionobj)
                                print("Actions added for user {userId}".format(userId=userId))
                            else:
                                pass
        print("total user added", count)
        end_time = (datetime.now() - start_time)
        print("toatl time taken = ", end_time)
























