"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import json
import urllib3

from library.al_lib import Request
from library.cache_store import GetValuesFromCache, SetValuesInCache
from marketplace.utility.marketplace_constants import DUMMY_DATA


class AutolifeInsurance(object):
	"""
	Autolife insurance
	"""
	def __init__(self, data):
		if data:
			self.data = data
		else:
			self.data = DUMMY_DATA
		self.get_token()
		self.status = False

	def get_token(self, val=0):
		if not GetValuesFromCache().get_insurance_headers():
			from autolife.local_settings import INSURANCE_URL
			from autolife.local_settings import INSURANCE_TOKEN_HEADERS
			from autolife.local_settings import INSURANCE_TOKEN_PAYLOAD
			response = Request(
				INSURANCE_URL.format(url="token"),
				headers=INSURANCE_TOKEN_HEADERS,
				data = INSURANCE_TOKEN_PAYLOAD
			)
			# save_token in cache
			if response.status_code == 200:
				dict_response = json.loads(response.text)
				self.access_token = dict_response.get("access_token")
				self.bearer = dict_response.get("token_type")
			else:
				if val < 1:
					val += 1
					self.get_token(val=val)
				else:
					pass
				self.access_token = None

	def get_quote(self):
		INSURANCE_QUOTE_HEADERS = GetValuesFromCache().get_insurance_headers()
		if not INSURANCE_QUOTE_HEADERS:
			if self.access_token:
				from autolife.local_settings import INSURANCE_QUOTE_HEADERS
				INSURANCE_QUOTE_HEADERS["Authorization"] = INSURANCE_QUOTE_HEADERS['Authorization'].format(
					access_token=self.access_token
				)
				SetValuesInCache().set_insurance_headers(INSURANCE_QUOTE_HEADERS)
			else:
				return {"message": "Authorization Error"}
		http = urllib3.PoolManager()
		from autolife.local_settings import INSURANCE_URL
		response = http.request(
			url=INSURANCE_URL.format(url='api/AutoLife/1.0/Quote/Price'),
				method='POST', headers=INSURANCE_QUOTE_HEADERS,
				body=json.dumps(self.data).encode('utf-8')
			)

		if response.status == 200:
			self.status = True
			return json.loads(response.data.decode('utf-8'))
		elif response.status == 415:
			return {"message": "Incorrect data"}
		else:
			return {"message": "source server returned error response {status}".format(status=response.status)}



