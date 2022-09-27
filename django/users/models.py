import datetime
from random import randint

from dateutil.parser import parse
from django.contrib.auth.models import UserManager, AbstractUser, Group
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models import QuerySet
from django.db.models.signals import m2m_changed, pre_save
from django.dispatch import receiver
from django.template.defaultfilters import truncatechars

from analytics.utils.utility import MongoUpdate, UserUpdated
from autolife.local_settings import AWS_S3_CUSTOM_DOMAIN
from content_manager.models import TemplateContent, ContentTagRelation
from core.models import Core
from library.cache_store import UpdateCache, GetValuesFromCache, SetValuesInCache
from tags.models import Tag
from vehicles.models import Model, Make, Vehicle
from django.contrib.auth.hashers import check_password, is_password_usable

class Picture(Core):
	"""
	Image saving model for the app
	"""
	image = models.FileField(upload_to="uploads/", blank=True, null=True)
	thumbnail = models.URLField(blank=True, null=True)
	identifier = models.CharField(max_length=255, blank=True, null=True)

	def __str__(self):
		return self.identifier if self.identifier else str(id)

	def image_img(self):
		if self.image:
			return u'<img src="%s" width="100" height="100"/>' % self.image.url
		else:
			return 'Thumbnail Not Available'

	image_img.short_description = 'Thumb'
	image_img.allow_tags = True


class ProfileQuerySet(QuerySet):
	"""
	Queryset for custom model manager
	"""

	def create(self, **kwargs):
		print(kwargs)


class ProfileManger(UserManager):
	"""
	Custom Profile Manager
	"""

	def get_queryset(self):
		return ProfileQuerySet(self.model, using=self._db)

	def create_user(self, username, email=None, password=None, **extra_fields):
		print(email)



class Score(Core):
	"""
	Model to save user score
	"""
	tag_weight = models.IntegerField(blank=True, null=True)
	tag_name = models.CharField(blank=True,null=True,max_length=255)
	tag_type = models.CharField(blank=True,null=True,max_length=255)

	def __str__(self):
		return self.tag_name


class Action(Core):
	"""
	Model to save users actions
	"""
	change = models.CharField(blank=True,null=True,max_length=255)
	change_type = models.CharField(blank=True,null=True,max_length=255)

	def __str__(self):
		return self.change


class Visit(Core):
	"""Moodel to save users visits"""
	ip_address = models.GenericIPAddressField(blank=True,null=True)
	url_accessed=models.CharField(blank=True,null=True,max_length=255)
	city = models.CharField(blank=True,null=True,max_length=255)
	country = models.CharField(blank=True,null=True,max_length=255)

	def __str__(self):
		return self.ip_address


class AverageAskingPriceHistory(Core):
	"""
	Models to store the vehicle info for tool = Average asking price
	"""
	make = models.CharField(blank=True,null=True,max_length=255)
	model = models.CharField(blank=True,null=True,max_length=255)
	body_style = models.CharField(blank=True,null=True,max_length=255)
	trim = models.CharField(blank=True,null=True,max_length=255)
	year = models.IntegerField(blank=True,null=True)

	def __str__(self):
		return self.make


class InsuranceHistory(Core):
	#model to store vehicle info for Insurance visit
		make = models.CharField(blank=True, null=True, max_length=255)
		model = models.CharField(blank=True, null=True, max_length=255)
		body_style = models.CharField(blank=True, null=True, max_length=255)
		trim = models.CharField(blank=True, null=True, max_length=255)
		year = models.IntegerField(blank=True, null=True)

		def __str__(self):
			return self.make


class TradeInValueHistory(Core):
	#model to store vehicle info for Trade in value
		make = models.CharField(blank=True, null=True, max_length=255)
		model = models.CharField(blank=True, null=True, max_length=255)
		body_style = models.CharField(blank=True, null=True, max_length=255)
		trim = models.CharField(blank=True, null=True, max_length=255)
		year = models.IntegerField(blank=True, null=True)

		def __str__(self):
			return self.make


class FuturevalueHistory(Core):
	#model to store vehicle info for tools used Future value
		make = models.CharField(blank=True, null=True, max_length=255)
		model = models.CharField(blank=True, null=True, max_length=255)
		body_style = models.CharField(blank=True, null=True, max_length=255)
		trim = models.CharField(blank=True, null=True, max_length=255)
		year = models.IntegerField(blank=True, null=True)


		def __str__(self):
			return self.make


class RecallCheckHistory(Core):
	#model to store vehicle info for tools used Recall Check
		make = models.CharField(blank=True, null=True, max_length=255)
		model = models.CharField(blank=True, null=True, max_length=255)
		body_style = models.CharField(blank=True, null=True, max_length=255)
		trim = models.CharField(blank=True, null=True, max_length=255)
		year = models.IntegerField(blank=True, null=True)


		def __str__(self):
			return self.make

class VehicleVisitHistory(Core):
	"""
	model to save vehicle info user searched
	"""
	make = models.CharField(blank=True, null=True, max_length=255)
	model = models.CharField(blank=True, null=True, max_length=255)
	body_style = models.CharField(blank=True, null=True, max_length=255)
	trim = models.CharField(blank=True, null=True, max_length=255)
	year = models.IntegerField(blank=True, null=True)

	def __str__(self):
		return self.make+' '+str(self.model)

class Profile(AbstractUser):
	"""
	User profile models
	"""

	def get_short_name(self):
		pass



	last_modified = models.DateTimeField(auto_now=True)
	last_activity_on = models.DateTimeField(blank=True, null=True)
	last_visited_on = models.DateTimeField(blank=True, null=True)
	avatar_url = models.CharField(max_length=500, blank=True, null=True)
	contact = models.CharField(null=True, blank=True, max_length=255)
	blacklist = models.ManyToManyField(TemplateContent, blank=True, related_name="blocked_content")
	liked_content = models.ManyToManyField(TemplateContent, blank=True, related_name="content_liked")
	visited_content = models.ManyToManyField(TemplateContent, blank=True, related_name="content_visited")
	shared_content = models.ManyToManyField(TemplateContent, blank=True, related_name="content_shared")
	is_verified = models.BooleanField(default=False)
	is_subscribed = models.BooleanField(default=False)
	social_login = models.BooleanField(default=False)
	monthly_newsletter_subscription = models.BooleanField(default=False)
	postal_code = models.CharField(max_length=255, blank=True, null=True)
	saved_cars = models.ManyToManyField(Vehicle, related_name="my_cars", blank=True)
	brands = models.ManyToManyField(Make, related_name="brands_following", blank=True)
	interests = models.ManyToManyField(Tag, related_name="user_interests", blank=True)
	social_uid = models.CharField(null=True, blank=True, max_length=255)
	score = models.ManyToManyField(Score,blank=True,related_name='user_score')
	actions = models.ManyToManyField(Action,blank=True,related_name='user_actions')
	visits = models.ManyToManyField(Visit,blank=True,related_name='user_visits')
	visit_insurance = models.ManyToManyField(InsuranceHistory,blank=True,related_name='user_insurance_history')
	tools_avg_asking_price = models.ManyToManyField(AverageAskingPriceHistory,blank=True,related_name='user_prc_history')
	tools_trade_in_value = models.ManyToManyField(TradeInValueHistory,blank=True,related_name='user_trade_in_value_history')
	tools_future_value = models.ManyToManyField(FuturevalueHistory,blank=True,related_name='user_future_value_history')
	tools_recall_check = models.ManyToManyField(RecallCheckHistory,blank=True,related_name='user_recall_check_history')
	visit_vehicles = models.ManyToManyField(VehicleVisitHistory,blank=True,related_name='user_recall_check_history')

	objects = UserManager()

	USERNAME_FIELD = 'username'

	class Meta:
		db_table = "profile"

	def get_full_name(self):  # get user's full name
		return self.first_name.title() + " " + self.last_name.title()

	def save(self, *args, **kwargs):
		# SaveInfo(self.to_json).start()

		if not self.pk:
			# First time creation of user model/registeration of user model
			if self.email:
				self.email = self.email.strip().lower()
			if self.username:
				self.username = self.generate_username(self.username.strip().lower())

				if (Profile.objects.filter(email=self.email).exists()) and (self.email):  # Merge with old one
					# If user is already registered with email or social sign up then old details will be kept.
					# shallow copy of old object will be kept in the new object.
					old_user_dataa = Profile.objects.get(email=self.email)
					self.__dict__ = old_user_dataa.__dict__.copy()
					if self.password and not is_password_usable(self.password):
						# In case if user has first logged in using social network and then
						# tried register using Autolife registration
						self.set_password(self.password)
				elif Profile.objects.filter(username=self.username).exists():
					raise ValueError("Username already registered")  # Rare Case scenario
		else:
			if self.email:
				self.email = self.email.strip().lower()
			if self.username:
				self.username = self.username.strip().lower()
			self.last_modified = datetime.datetime.now()     # Last activity recorded
			old_user_data = Profile.objects.get(id=self.pk)
			try:
				changes = [
					{"change":"%s changed from %s to %s"%(
						key, old_user_data.analytics_json[key],
						self.analytics_json[key]
					), "change_type": "updated"}
					for key in old_user_data.analytics_json.keys()
					if self.analytics_json[key] != old_user_data.analytics_json[key]
				]
				save_users_changes(changes,self.id)
				UserUpdated(changes, self.id).start()
			except KeyError as e:
				print(e)
		UpdateCache().update_content_preferences(self.username)
		UpdateCache().update_user_info(self.username)
		super(Profile, self).save(*args, **kwargs)

	def __str__(self):
		return self.email

	@staticmethod
	def generate_username(username):
		"""
		This method will generate a new username for new user from his/her email,
		if the username  already exists then it will add random integer at the end of the user's username
		extracted from his/her email.
		:return:
		"""
		if Profile.objects.filter(username=username).exists():
			username += str(randint(1, 100))
		return username


	@property
	def to_json(self):
		obj = GetValuesFromCache().get_user_info(self.username)
		if not obj:
			obj =  {
				"username": self.username,
				"email": self.email,
				"first_name": self.first_name,
				"last_name": self.last_name,
				"avatar_url": self.avatar_url,
				"is_verified": self.is_verified,
				"is_subscribed": self.is_subscribed,
				"monthly_newsletter_subscription":self.monthly_newsletter_subscription,
				"is_superuser": self.is_superuser,
				"last_login": self.last_login,
				"last_activity_on": self.last_activity_on,
				"date_joined": self.date_joined,
				"contact_num": self.contact,
				"brands": [brand.name for brand in self.brands.all()],
				"social_login": self.social_login
			}
			if obj["avatar_url"]:
				if not "http" in obj["avatar_url"]:
					obj["avatar_url"] = "https://" + AWS_S3_CUSTOM_DOMAIN + self.avatar_url
			SetValuesInCache().set_user_info(self.username, obj)
		return obj

	@property
	def analytics_json(self):
		return {
			"id": self.id,
			"username": self.username,
			"email": self.email,
			"first_name": self.first_name,
			"last_name": self.last_name,
			"avatar_url": self.avatar_url,
			"is_verified": self.is_verified,
			"contact": self.contact,
			"is_subscribed": self.is_subscribed,
			"is_superuser": self.is_superuser,
			"last_login": self.last_login,
			"last_activity_on": self.last_activity_on,
			"date_joined": self.date_joined,
			"user_score": self.user_score,
		}

	@property
	def user_score(self):
		results = {}
		for tag_rel in UserTagRelation.objects.filter(user_id=self.id):
			if tag_rel.tag.tag_type:
				if tag_rel.tag.tag_type in results.keys():
					results[tag_rel.tag.tag_type].append(tag_rel.analytics_json)
				else:
					results[tag_rel.tag.tag_type.type_name] = [tag_rel.analytics_json]
			else:
				if "others" in results.keys():
					results["others"].append(tag_rel.analytics_json)
				else:
					results["others"] = [tag_rel.analytics_json]
		return results

	@property
	def personal_info(self):
		obj = {
			"username": self.username,
			"email": self.email,
			"first_name": self.first_name,
			"last_name": self.last_name,
			"avatar_url": self.avatar_url,
			"contact": self.contact,
			"postal_code": self.postal_code
		}
		if obj["avatar_url"]:
			if not "http" in obj["avatar_url"]:
				obj["avatar_url"] = "https://" + AWS_S3_CUSTOM_DOMAIN + self.avatar_url
		return obj

	@property
	def tag_scores(self):
		all_interests = GetValuesFromCache().user_interests(self.username)  # fetch from cache
		if not all_interests:
			all_interests = self.interests.all()    # fetch it from db if not available in cache
		user_journey_score = GetValuesFromCache().all_user_tag_relations(self.username)
		if not user_journey_score:
			user_journey_score = UserTagRelation.objects.filter(user_id=self.pk).prefetch_related("tag")
			SetValuesInCache().all_user_tag_relations(self.username, user_journey_score)
		for interest in all_interests:
			user_journey_score.exclude(tag_id=interest.id)
		return user_journey_score

	@property
	def user_score_interest_based(self):
		ut_data_all = GetValuesFromCache().all_user_tag_relations(self.username)
		if not ut_data_all:
			ut_data_all = UserTagRelation.objects.filter(user_id=self.pk).prefetch_related("tag")
			SetValuesInCache().all_user_tag_relations(self.username, ut_data_all)
		ut_data =  ut_data_all.filter(
			user_id=self.pk, tag__tag_type__type_name='interests').prefetch_related('tag')
		data = [{"tag": tag.tag, "weight": tag.weight} for tag in ut_data]
		return data

	@property
	def communication_preferences(self):
		return {
			"is_subscribed": self.is_subscribed,
			"monthly_newsletter_subscription": self.monthly_newsletter_subscription,
			"is_verified": self.is_verified
		}

	@property
	def subject_that_interests(self):
		likes = []
		all_interests = GetValuesFromCache().user_interests(self.username)
		if not all_interests:
			all_interests = self.interests.all()
			SetValuesInCache().user_interests(self.username, all_interests)
		interests_tags = GetValuesFromCache().get_interest_tags()
		if not interests_tags:
			interests_tags = Tag.objects.filter(tag_type__type_name='interests').order_by('name')
			SetValuesInCache().set_interests_tags(interests_tags)
		interests_tags = interests_tags.order_by('name')
		for lifestyle in interests_tags:
			if lifestyle in all_interests:
				likes.append(
					{
						"is_checked": True,
						"id": lifestyle.id,
						"name": lifestyle.name,
						"tag_line": lifestyle.tag_line,
						"logo": None if not lifestyle.image else lifestyle.image.url
					}
				)
			else:
				likes.append(
					{
						"is_checked": False,
						"id": lifestyle.id,
						"name": lifestyle.name,
						"tag_line": lifestyle.tag_line,
						"logo": None if not lifestyle.image else lifestyle.image.url
					}
				)
		return likes

	@property
	def only_lifestyle(self):
		all_makes = GetValuesFromCache().get_db_makes()
		if not all_makes:
			all_makes = Make.objects.all()
			SetValuesInCache().set_makes(all_makes)
		all_brands = self.brands.all()
		return {
			"subjects_that_interests": self.subject_that_interests,
			"brands_following": [

				{
					"is_checked": True if brand in all_brands else False,
					"id": brand.id,
					"name": brand.name,
					"logo": None if not brand.logo else brand.logo.url,
				}
				for brand in all_makes
			]
		}

	@property
	def user_content_preferences(self):

		return {
			"personal_information": self.personal_info,
			"communication_preferences": self.communication_preferences,
			"saved_cars": [vehicle.saved_cars for vehicle in self.saved_cars.all()],
			"lifestyle": self.only_lifestyle,
		}






class EmailConfirmation(Core):
	"""
	Models for confirmation link
	"""
	confirmation_token = models.CharField(max_length=255, blank=True, null=True)
	user = models.ForeignKey(Profile, blank=True, null=True)

	def __str__(self):
		return self.user.username


class UserTagRelation(Core):
	"""
	User tag relation for recording tag weights
	"""
	user = models.ForeignKey(Profile, related_name="user_tag_score")
	tag = models.ForeignKey(Tag, related_name="tag_associated")
	weight = models.IntegerField(default=0)

	def __str__(self):
		return self.user.username

	@property
	def analytics_json(self):
		return {
			"tag_weight": self.weight,
			"tag": self.tag.name,
			"tag_type": None if not self.tag.tag_type else self.tag.tag_type.type_name
		}

	def save(self, *args, **kwargs):
		UpdateCache().update_user_tag_relations(self.user.username)
		if not self.pk:
			if UserTagRelation.objects.filter(user_id=self.user_id, tag_id=self.tag_id).exists():
				try:
					ut_obj = UserTagRelation.objects.get(user_id=self.user_id, tag_id=self.tag_id)
				except UserTagRelation.MultipleObjectsReturned:
					ut_objects = UserTagRelation.objects.filter(user_id=self.user_id, tag_id=self.tag_id)
					ut_obj = ut_objects[0]
				ut_obj.weight += self.weight
				super(UserTagRelation, ut_obj).save()
			else:
				super(UserTagRelation, self).save()
		else:
			super(UserTagRelation, self).save()



def save_users_changes(changes,user_id):

	for i in range(0, len(changes)):
		action_object = Action.objects.create(
			change=changes[i]['change'],
			change_type=changes[i]['change_type']
		)
		userobj = Profile.objects.get(id=user_id)
		userobj.actions.add(action_object)


def save_user_visits(payload):
	visitobj = Visit.objects.create(
		url_accessed = payload['visits']['url_accessed'],
		country =  payload['visits']['geo_location']['country'],
		city = payload['visits']['geo_location']['city'],
		ip_address = payload['visits']['ip_address']
	)
	userobj = Profile.objects.get(id = payload['user']['id'])
	userobj.visits.add(visitobj)


class UserUpdatePassword(Core):
	"""
	When User updates password
	"""
	user = models.ForeignKey(Profile, blank=True, null=True)
	token = models.CharField(max_length=255, blank=True, null=True)

	def __str__(self):
		return self.user.username


class ContactAction(models.Model):
	"""
	Contact us form action
	"""
	name = models.CharField(max_length=50, blank=True, null=True)
	email = models.EmailField(blank=True, null=True)
	text = models.TextField(blank=True, null=True)
	mobile = models.CharField(max_length=20, blank=True, null=True)
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)


	def __str__(self):
		return self.name

	@property
	def short_description(self):
		return truncatechars(self.text, 60)


class UpdateLikesOnUserAction(object):
	"""
	Updates user likes on user action
	"""
	def __init__(self):
		pass

	def increase(self, content_id):
		temp_obj = TemplateContent.objects.get(id=content_id)
		temp_obj.likes += 1
		temp_obj.save()

	def decrease(self, content_id):
		temp_obj = TemplateContent.objects.get(id=content_id)
		temp_obj.likes -= 1
		temp_obj.save()


def content_liked(sender, **kwargs):
	"""
	Content like signal to update the tag relation of the user
	:param sender:
	:param kwargs:
	:return:
	"""
	instance = kwargs["instance"]
	pk_set = kwargs["pk_set"]
	action = kwargs["action"]
	changes = []
	UpdateCache().update_likes(instance.username)
	UpdateCache().update_user_likes(instance.username)
	if action == "post_add":

		# after adding into instance  increase/create the tag_weight into users profile
		changes.append({"change":"content %s liked"%pk_set, "change_type": "added"})
		try:
			group = Group.objects.get(name="STAFF_MEMBERS")
		except Group.DoesNotExist:
			group = None
		if instance.is_superuser or (group and group in instance.groups.all()):
			pass
		else:
			for pk in pk_set:
				try:
					for tag in ContentTagRelation.objects.get(content_id=pk).tag_weightage.all():
						UserTagRelation.objects.create(user_id=instance.id, tag_id=tag.tag.id, weight=tag.weight)
				except ObjectDoesNotExist or AttributeError:
					pass
				UpdateLikesOnUserAction().increase(pk)
			# UpdateCache().update_articles_might_like(instance.username)
			# UpdateCache().update_user_related(instance.username)
			MongoUpdate(instance.analytics_json).start()    # Updating users information
			UserUpdated(changes, instance.id).start()   # Changes updates in the mongo
			save_users_changes(changes,instance.id)
	elif action == "post_remove":
		# after removing lifestyle from instance decrease the tag_weight from profile
		changes.append({"change":"content %s removed from likes" % pk_set, "change_type": "removed"})
		try:
			group = Group.objects.get(name="STAFF_MEMBERS")
		except Group.DoesNotExist:
			group = None
		if instance.is_superuser or (group and group in instance.groups.all()):
			pass
		else:
			for pk in pk_set:
				try:
					for tag in ContentTagRelation.objects.get(content_id=pk).tag_weightage.all():
						UserTagRelation.objects.create(user_id=instance.id, tag_id=tag.tag.id, weight=-tag.weight)
				except ObjectDoesNotExist or AttributeError:
					pass
				UpdateLikesOnUserAction().decrease(pk)
			# UpdateCache().update_articles_might_like(instance.username)
			# UpdateCache().update_user_related(instance.username)
			MongoUpdate(instance.analytics_json).start()    # Updating users information
			UserUpdated(changes, instance.id).start()   # Changes updates in the mongo
			save_users_changes(changes, instance.id)



def content_visited(sender, **kwargs):
	"""
	Content like signal to update the tag relation of the user
	:param sender:
	:param kwargs:
	:return:
	"""
	instance = kwargs["instance"]
	pk_set = kwargs["pk_set"]
	action = kwargs["action"]
	changes = []
	if action == "post_add":
		# after adding into instance  increase/create the tag_weight into users profile
		changes.append({"change":"content %s visited "%pk_set, "change_type": "added"})
		try:
			group = Group.objects.get(name="STAFF_MEMBERS")
		except Group.DoesNotExist:
			group = None
		if instance.is_superuser or (group and group in instance.groups.all()):
			pass
		else:

			for pk in pk_set:
				try:
					for tag in ContentTagRelation.objects.get(content_id=pk).tag_weightage.all():
						UserTagRelation.objects.create(user_id=instance.id, tag_id=tag.tag.id, weight=tag.weight)
				except ObjectDoesNotExist:
					pass
			# UpdateCache().update_visits(instance.username)
			# UpdateCache().update_articles_might_like(instance.username)
			# UpdateCache().update_user_related(instance.username)
			MongoUpdate(instance.analytics_json).start()    # Updating users information
			UserUpdated(changes, instance.id).start()   # Changes updates in the mongo
			save_users_changes(changes, instance.id)
	elif action == "post_remove":
		# after removing lifestyle from instance decrease the tag_weight from profile
		changes.append({"change": "content %s removed from visited list" % pk_set, "change_type": "removed"})
		try:
			group = Group.objects.get(name="STAFF_MEMBERS")
		except Group.DoesNotExist:
			group = None
		if instance.is_superuser or (group and group in instance.groups.all()):
			pass
		else:
			for pk in pk_set:
				try:
					for tag in ContentTagRelation.objects.get(content_id=pk).tag_weightage.all():
						UserTagRelation.objects.create(user_id=instance.id, tag_id=tag.tag.id, weight=-tag.weight)
				except ObjectDoesNotExist:
					pass
			# UpdateCache().update_visits(instance.username)
			# UpdateCache().update_articles_might_like(instance.username)
			# UpdateCache().update_user_related(instance.username)
			MongoUpdate(instance.analytics_json).start()    # Updating users information
			UserUpdated(changes, instance.id).start()   # Changes updates in the mongo
			save_users_changes(changes, instance.id)


def saved_or_removed_car(sender, **kwargs):
	"""
	Keeps track of saved cars and removed cars
	:param sender:
	:param kwargs:
	:return:
	"""
	instance = kwargs["instance"]
	pk_set = kwargs["pk_set"]
	action = kwargs["action"]
	changes = []
	if action == "post_add":
		changes.append({"change": "car(s) %s saved "%pk_set, "change_type": "added"})
		try:
			group = Group.objects.filter(name="STAFF_MEMBERS")
		except Group.DoesNotExist:
			group = None
		if instance.is_superuser or (group and group in instance.groups.all()):
			pass
		else:
			for pk in pk_set:
				try:
					content_obj = Vehicle.objects.get(id=pk)
					if content_obj.article:
						for tag in ContentTagRelation.objects.get(content_id=content_obj.article_id).tag_weightage.all():
							UserTagRelation.objects.create(user_id=instance.id, tag_id=tag.tag.id, weight=tag.weight)
				except ObjectDoesNotExist as e:
					pass
			UserUpdated(changes, instance.id).start()  # Changes updates in the mongo
			save_users_changes(changes,instance.id)
	elif action == "post_remove":
		changes.append({"change":"car(s) %s removed"%pk_set, "change_type": "removed"})
		try:
			group = Group.objects.filter(name="STAFF_MEMBERS")
		except Group.DoesNotExist:
			group = None
		if instance.is_superuser or (group and group in instance.groups.all()):
			pass
		else:
			for pk in pk_set:
				try:
					content_obj = Vehicle.objects.get(id=pk)
					if content_obj.article:
						for tag in ContentTagRelation.objects.get(content_id=content_obj.article_id).tag_weightage.all():
							UserTagRelation.objects.create(user_id=instance.id, tag_id=tag.tag.id, weight=-tag.weight)
				except ObjectDoesNotExist as e:
					pass
			UserUpdated(changes, instance.id).start()  # Changes updates in the mongo
			save_users_changes(changes, instance.id)
	UpdateCache().update_content_preferences(instance.username)


def added_removed_interests(sender, **kwargs):
	"""
	Keeps track of saved cars and removed cars
	:param sender:
	:param kwargs:
	:return:
	"""
	instance = kwargs["instance"]
	pk_set = kwargs["pk_set"]
	action = kwargs["action"]
	changes = []
	if action == "post_add":
		pass
	if action== "post_remove":
		pass
	UpdateCache().update_interests(instance.username)
	UpdateCache().update_content_preferences(instance.username)
	UpdateCache().update_user_interest_based(instance.username)

m2m_changed.connect(content_liked, sender=Profile.liked_content.through)     # Content Liked or remove
m2m_changed.connect(content_visited, sender=Profile.visited_content.through)    # Content Visited
m2m_changed.connect(saved_or_removed_car, sender=Profile.saved_cars.through)    # Lifestyle changed or updated
m2m_changed.connect(added_removed_interests, sender=Profile.interests.through)    # Lifestyle changed or updated

