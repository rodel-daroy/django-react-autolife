"""
Fetch mongo data
"""
import boto3
from multiprocessing import Process
from threading import Thread

import pymongo
from jsonpickle import json
from pymongo import MongoClient
from django.utils import timezone
from rest_framework.renderers import JSONRenderer

from autolife.local_settings import MONGODB_DATABASE, MONGODB_HOST, AWS_ACCOUNT_ID, AWS_IAM_ARN, QUICKSIGHT_DASHBOARD_ID


class PrettyJsonRenderer(JSONRenderer):
    """
    To give pretty output
    """

    def get_indent(self, accepted_media_type, renderer_context):
        return 2


class DatabaseConnection(object):
    """
    Connecting mongo remote instance
    Deprecate this because making connection on separate thread will produce warnings
    """

    def __new__(cls, *args, **kwargs):
        client = MongoClient(MONGODB_HOST, connect=False)
        return client[MONGODB_DATABASE]


class MongoUserMapping(Process):
    """
    Mapping Django User in Mongo Database
    """

    def __init__(self, user, action=False):
        super(MongoUserMapping, self).__init__()
        self.db = MongoClient(MONGODB_HOST)[MONGODB_DATABASE]
        self.user = user
        self.action = action
        self.col = self.db.userJourney

    def run(self):
        if self.col.find({"id": self.user["id"]}).count() > 1:
            pass
        else:
            self.col.insert_one(self.user)
        if self.action:
            self.col.update_one(
                {"id": self.user["id"]},
                {"$addToSet": {"visits": self.action}}
            )


class RecordRequest(Process):
    """
    Record incoming request on mongo db server
    """

    def __init__(self, user, payload):
        super(RecordRequest, self).__init__()
        self.username = user.username
        self.payload = payload
        self.db = DatabaseConnection()
        self.record = self.db.userJourney.find({"username": self.username})
        if not list(self.record):
            self.record = self.db.userJourney.insert_one(user.analytics_json)

    def run(self):
        self.db.userJourney.update_one(
            {'username': self.username},
            {

                "$addToSet": {"user_access_history": {

                    "ip_address": self.payload["ip_address"],
                    "accessed_at": timezone.now(),
                    "device_info": self.payload["device_info"]
                }
                }
            }, upsert=True
        )


class GetUserInfo(object):
    def __new__(cls, user_id, *args, **kwargs):
        db = DatabaseConnection()
        # try:
        try:
            data = {
                k: v for k, v in dict(
                    db.userJourney.find_one({'id': user_id})
                    # db.userJourney.find_one({'id': user_id})
                ).items()
                if k != '_id'
            }
        except:
            data = {}
        # if data:
        try:
            data["actions"] = sorted(data["actions"][:50], key=lambda k: k["timestamp"], reverse=True)
            data["visits"] = sorted(data["visits"][:50], key=lambda k: k["timestamp"], reverse=True)
        except KeyError as e:
            pass

        return data


class GetAllUserInfo(object):
    def __new__(cls, *args, **kwargs):
        journey = []
        db = DatabaseConnection()
        try:
            for document in db.userJourney.find({}, {"_id": 0}):
                journey.append(document)
        except:
            journey = {}

        if journey:
            try:
                for i in range(0, len(journey)):  # fetch only first 50 records from data
                    journey[i]["actions"] = sorted(journey[i]["actions"][:50], key=lambda k: k["timestamp"],
                                                   reverse=True)
                    journey[i]["visits"] = sorted(journey[i]["visits"][:50], key=lambda k: k["timestamp"], reverse=True)


            except KeyError as e:
                pass

            return journey


class SaveInfo(Process):
    def __init__(self, user_dict):
        super(SaveInfo, self).__init__()
        self.user = user_dict

    def run(self):
        db = DatabaseConnection()
        db.userJourney.update_one(
            {"username": self.user["username"]},
            {"$set": dict(self.user)}
        )


class AnonymousUserActions(Process):
    """
    Records anonymous records by IP Address and with accessed url,
    Records already contains timestamp
    """

    def __init__(self, payload):
        super(AnonymousUserActions, self).__init__()
        self.payload = payload
        self.db = MongoClient(MONGODB_HOST)[MONGODB_DATABASE]

    def run(self):
        if self.db.userJourney.find({"ip_address": self.payload["ip_address"], "username": None}).count() < 1:
            # If record exists update Anonymous User Actions
            self.db.userJourney.update_one(
                {"ip_address": self.payload["ip_address"]},
                {
                    "$addToSet": {"visits": self.payload["visits"]}
                }
            )
        else:
            # If user doesnot exists, create new anonymous user
            self.db.userJourney.insert_one(
                {
                    "ip_address": self.payload["ip_address"],
                    "username": None,
                    "visits": [self.payload["visits"]]
                }
            )


class AutolifeUserActions(Process):
    """
    Records Autolife User's actions
    Records already have timestamp in payload
    """

    def __init__(self, payload, user):
        super(AutolifeUserActions, self).__init__()
        self.payload = payload
        self.db = MongoClient(MONGODB_HOST)[MONGODB_DATABASE]

    def run(self):
        if self.db.userJourney.find({"id": self.payload["user"]["id"]}).count() >= 1:
            self.db.userJourney.update_one(
                {"id": self.payload["user"]["id"]},
                {"$addToSet": {"visits": self.payload["visits"]}}
            )


        else:
            MongoUserMapping(self.payload['user'], action=self.payload["visits"]).start()


class MongoUpdate(Process):
    """
    When there is a db call update the database
    """

    def __init__(self, user_json):
        super(MongoUpdate, self).__init__()
        self.user = user_json
        self.col = MongoClient(MONGODB_HOST)[MONGODB_DATABASE].userJourney

    def run(self):
        self.col.update_one(
            {"username": self.user["id"]},
            {"$set": dict(self.user)}
        )


class UserUpdated(Thread):
    """
    If content Visited record the tags into user profile
    """

    def __init__(self, changes, user_id, change_type=None):
        super(UserUpdated, self).__init__()
        self.changes = changes
        self.user_id = user_id
        self.col = MongoClient(MONGODB_HOST)[MONGODB_DATABASE].userJourney

    def run(self):
        if self.changes:
            self.col.update_one(
                {"id": int(self.user_id)},
                {
                    "$addToSet": {
                        "actions": {
                            "timestamp": timezone.now(),
                            "changes": self.changes
                        }
                    }
                }
            )


class QuickSightUserAnalytics(object):
    """
    Create/Get user related information from quicksight
    """

    def __init__(self, user):
        self.user = user

    def listUsers(self):

        quicksight_client = boto3.client('quicksight')
        quicksight_response = quicksight_client.list_users(
            AwsAccountId=AWS_ACCOUNT_ID,
            Namespace='default'
        )
        registered_users = []
        for i in range(0, len(quicksight_response['UserList'])):
            registered_users.append(
                dict(Email=quicksight_response['UserList'][i]['Email'], Arn=quicksight_response['UserList'][i]['Arn']))
        return registered_users

    def assume_user_role(self):
        sts_client = boto3.client('sts')
        response = sts_client.assume_role(
            RoleArn=AWS_IAM_ARN,
            RoleSessionName=self.user,
            DurationSeconds=3600,
        )
        return response

    def register_user(self):
        self.assume_user_role()
        quicksight_client = boto3.client('quicksight')
        all_user = self.listUsers()
        new_user = self.user
        for i in range(0, len(all_user)):
            if new_user == all_user[i]['Email']:
                return all_user[i]
        response = quicksight_client.register_user(
                    IdentityType='IAM',
                    Email=self.user,
                    UserRole='READER',
                    IamArn=AWS_IAM_ARN,
                    SessionName=self.user,
                    AwsAccountId=AWS_ACCOUNT_ID,
                    Namespace='default'
                )
        return response['User']

    def get_embeded_url(self):
        quicksight_client = boto3.client('quicksight')
        user_arn = self.register_user()
        response = quicksight_client.get_dashboard_embed_url(
            AwsAccountId=AWS_ACCOUNT_ID,
            DashboardId=QUICKSIGHT_DASHBOARD_ID,
            IdentityType='QUICKSIGHT',
            UndoRedoDisabled=False,
            ResetDisabled=False,
            UserArn=user_arn['Arn']
        )
        return response['EmbedUrl']
