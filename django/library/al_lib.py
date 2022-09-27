"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from datetime import datetime
from threading import Thread

import psycopg2
import requests
import xmltodict as xmltodict
from django.conf.global_settings import SECRET_KEY
from django.core.cache import cache
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from hashids import Hashids
from rest_framework.response import Response

from autolife.local_settings import DATABASES, DEFAULT_EMAIL_FROM
from library.constants import RESPONSE


class ALResponse(object):
	"""
	Custom class for delivering JSON Response
	"""

	def __init__(self, status, data=None, message=None):
		self.data = data
		self.status = status
		self.message = message
		self.response = {
			"status": None,
			"message": None,
			"data": []
		}

	def success(self):
		self.response["status"], self.response["message"] = 200 if not self.status else self.status, RESPONSE[
			200] if not self.message else self.message
		self.response["data"] = self.data if self.data else []
		return Response(data=self.response)

	def server_error(self, details=""):
		self.response["status"] = self.status
		self.response["message"] = RESPONSE[self.status] if not self.message else self.message
		self.response["data"] = self.data if self.data else []
		self.response["details"] = details
		return Response(data=self.response)


class Slug(object):
	"""
	slugify the arguments passed to the object
	"""

	def __init__(self, **kwargs):
		self.items = kwargs
		self.slug = None
		self.slugify()

	def slugify(self):
		self.slug = ''.join(self.items.values()) + str(datetime.now()).replace(".", "").replace(":", "").replace("-",
																												 "")
		self.slug = self.slug.replace(" ", "")


class SendMail(object):
	"""
	Sending email from django server
	"""

	def __init__(self, recipient_list, subject, message, mail_from=None):
		self.mail_from = mail_from
		self.recipient_list = recipient_list
		self.subject = subject
		self.message = message
		self.send()

	def send(self):
		try:
			send_mail(subject=self.subject, message=self.message, recipient_list=self.recipient_list,
					  from_email=DEFAULT_EMAIL_FROM if not self.mail_from else self.mail_from)
			print("Email sent!")
		except:
			print("Email sending failed!")

class SendMailWithTemplate(object):
	"""
	Sending email from django server
	"""

	def __init__(self, recipient_list, subject, message, mail_from=None, html_message=None):
		self.mail_from = mail_from
		self.recipient_list = recipient_list
		self.subject = subject
		self.message = message
		self.html_message = html_message

	def send(self):
		try:
			send_mail(subject=self.subject, message=self.message, recipient_list=self.recipient_list,
					  from_email=DEFAULT_EMAIL_FROM if not self.mail_from else self.mail_from, html_message=self.html_message)
			return {'status':200, 'message':'Email sent'}
		except:
			return {'status': 500, 'message':'Unable to send Email'}


class MailThread(Thread):
	"""
	Sending mail in separate thread.
	This class basically creates separate thread and executes itself on the same thread and sends
	a mail.
	"""

	def __init__(self, recipient_list, subject, message, mail_from):
		super(MailThread, self).__init__()
		self.recipient_list = recipient_list
		self.subject = subject
		self.mail_from = mail_from
		self.message = message

	def run(self):
		SendMail(self.recipient_list, self.subject, self.message, mail_from=self.mail_from)
		print("Mail sent successfully")


class HTMLMailThread(Thread):
	"""
	Sending mail in separate thread.
	This class basically creates separate thread and executes itself on the same thread and sends
	a mail.
	"""

	def __init__(self, recipient_list, subject, context, template_name, email_from):
		super(HTMLMailThread, self).__init__()
		self.recipient_list = recipient_list
		self.subject = subject
		self.context = context
		self.template_name = template_name
		self.email_from = email_from

	def run(self):
		HTMLMail(self.recipient_list, self.template_name, self.context, self.subject, self.email_from)
		print("Mail sent successfully")


class GUID(object):
	"""
	Encrypting or decrypting the id's of the Models
	Here we are using third party library called Hashid, which basically generates a encrypted id
	and that Id can further be decrypted. It's an open source project, there is no issue with lecensing
	software.
	"""

	def __new__(cls, content_id, encrypt=False, decrypt=False):
		hashids = Hashids(salt=SECRET_KEY)  # Django's SECRET_KEY is used as SALT
		if encrypt:
			return hashids.encode(content_id)
		elif decrypt:
			decrypted = hashids.decode(content_id)
			return decrypted[0] if isinstance(decrypted, tuple) else decrypted
		else:
			return None

from autolife.settings import EMAIL_HOST_USER

class XMLTODict(object):
	"""
	Converting XML object to dictionary format
	"""

	def __new__(cls, xml_obj, *args, **kwargs):
		return dict(xmltodict.parse(xml_obj))


class GetIp(object):
	"""
	returns IP address from request HEADERS
	"""

	def __new__(cls, header, *args, **kwargs):
		x_forwarded_for = header.get('HTTP_X_FORWARDED_FOR')
		if x_forwarded_for:
			return x_forwarded_for.split(',')[0]
		else:
			return header.get('REMOTE_ADDR')


class StoreInCache(object):
	"""
	Storing or updating the cache store
	"""
	def __new__(cls, key, value, *args, **kwargs):
		if cache.get(key, None):
			pass
		else:
			cache.set(key, value)


class GetCacheValue(object):
	"""
	Get cache value of the key
	"""
	def __new__(cls, key, *args, **kwargs):
		return cache.get(key, None)


class Request(object):
	"""
	Making requests
	"""
	def __new__(cls, url, method="get", headers=None, data={}, *args, **kwargs):
		if method=="post":
			result = requests.post(url, headers=headers, data=data)
			print(result)
		else:
			result = requests.get(url, headers=headers, data=data)
		return result


class RawQuery(object):
	"""
	Writing raw queries into the db # for read purpose only
	"""
	def __new__(cls, query, *args, **kwargs):
		con_str = "dbname={dbname} user={user} password={password} host={host} port={port}".format(
			dbname=DATABASES["default"]["NAME"],
			user=DATABASES["default"]["USER"],
			password=DATABASES["default"]["PASSWORD"],
			host=DATABASES["default"]["HOST"],
			port=DATABASES["default"]["PORT"],

		)
		conn = psycopg2.connect(con_str)
		try:
			cursor = conn.cursor()
			cursor.execute(query)
			record = cursor.fetchall()
			conn.close()
		except Exception as e:
			record = ()
		return record


class Percentile(object):
	"""
	Percentile of number according to number
	"""
	def __new__(cls, num, pc, *args, **kwargs):
		pass


class HTMLMail(object):
	"""
	Sending HTML Mail
	"""
	def __new__(cls, send_to, template_name, context, subject, email_from,  *args, **kwargs):
		rendered = render_to_string(template_name, context)
		text_content = strip_tags(rendered)
		msg = EmailMultiAlternatives("Welcome To Autolife", text_content, email_from, send_to,)
		msg.attach_alternative(rendered, "text/html")
		msg.subject = subject
		msg.send()

