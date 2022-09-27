"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.core.exceptions import ObjectDoesNotExist
from mailchimp3 import MailChimp
from mailchimp3.mailchimpclient import MailChimpError

from autolife.settings import MAILCHIMP_API_KEY, MAILCHIMP_USER, MAILCHIMP_LIST_ID, DOMAIN, DEFAULT_EMAIL_FROM
from library.al_lib import HTMLMailThread
from library.constants import RESET_PASSWORD_SUBJECT, SUBSCRIPTION_SUBJECT, UNSUBSCRIPTION_SUBJECT
from users.models import Profile
from rest_framework.exceptions import ValidationError


class Subscribe(object):
	"""
	Subscribing to mailchimp
	"""
	def __init__(self, data):
		self.data = data

	def subscribe(self,template):
		client = MailChimp(mc_api=MAILCHIMP_API_KEY, mc_user=MAILCHIMP_USER)

		try:
			email = self.data.get('email')
			if isinstance(email, list):
				email = email[0]
			if email is None or email == '':
				raise ValidationError("Email doesn't Exists")

			response = client.lists.members.create(MAILCHIMP_LIST_ID, {
							'email_address': self.data.get('email'),
							'status': 'subscribed',
							'merge_fields': {
								'FNAME': self.data.get('first_name', ''),
								'LNAME': self.data.get('last_name', '')
							},
						})


			if self.data.get('email') is None or self.data.get('email') == '':
				raise ValidationError("Email doesn't Exists")

			if template=="daily":

				self.send_email_after_subscribe(email=self.data.get('email'))
			else:
				self.send_email_after_monthly_news_subscribe(email=self.data.get('email'))

			return response.get("status")

		except MailChimpError as e:
			return {"error": "fake or already subscribed email"}

		except ValidationError as v:
			return {"error": "Email doesn't exists."}



	def unsubscribe(self):
		client = MailChimp(mc_api=MAILCHIMP_API_KEY, mc_user=MAILCHIMP_USER)

		try:
			email = self.data.get('email')
			if isinstance(email, list):
				email = email[0]
			if email is None or email == '':
				raise ValidationError("Email doesn't Exists")

			response = client.lists.members.update(MAILCHIMP_LIST_ID,subscriber_hash=self.data.get('email'),data= {
							'email_address': self.data.get('email'),
							'status': 'unsubscribed',
							'merge_fields': {
								'FNAME': self.data.get('first_name', ''),
								'LNAME': self.data.get('last_name', '')
							},
						})


			self.send_email_after_unsubscribe(email=self.data.get("email"))

			return response.get("status")

		except MailChimpError as e:
			return {"error": "fake or already subscribed email"}

		except ValidationError as v:
			return {"error": "Email doesn't exists."}


	def resubscribe(self,is_alredy_member,subscribe):
		client = MailChimp(mc_api=MAILCHIMP_API_KEY, mc_user=MAILCHIMP_USER)

		try:
			response = client.lists.members.update(MAILCHIMP_LIST_ID,subscriber_hash=self.data.get('email'),data= {
							'email_address': self.data.get('email'),
							'status': 'subscribed',
							'merge_fields': {
								'FNAME': self.data.get('first_name', ''),
								'LNAME': self.data.get('last_name', '')
							},
						})

			if not is_alredy_member:

				if subscribe:
					self.send_email_after_subscribe(email=self.data.get('email'))
				else:
					self.send_email_after_monthly_news_subscribe(email=self.data.get('email'))

			return response.get("status")
		except MailChimpError as e:
			return {"error": "fake or already subscribed email"}




	def send_email_after_subscribe(self,email):
		HTMLMailThread(
			[email],
			SUBSCRIPTION_SUBJECT,
			{},
			'subscribe.html',
			DEFAULT_EMAIL_FROM
		).start()

	def send_email_after_monthly_news_subscribe(self,email):
		HTMLMailThread(
			[email],
			SUBSCRIPTION_SUBJECT,
			{},
			'monthly_news_letter_subscribe.html',
			DEFAULT_EMAIL_FROM
		).start()

	def send_email_after_unsubscribe(self,email):
		HTMLMailThread(
			[email],
			UNSUBSCRIPTION_SUBJECT,
			{},
			'unsubscribe.html',
			DEFAULT_EMAIL_FROM
		).start()