"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

# Polldaddy partner ID
import urllib3
import json


import requests

POLLDADDY_EMAIL = "blake.medulan@gnr8r.ca"
POLLDADDY_PASSWORD = "thisisbdot"
POLLDADDY_PARTNER_ID = "5bfea932-84fd-6908-ea53-000022c12ed0"
POLLDADDY_USER_CODE = "$P$B/rtq8fsnRA8nPXvletsw1lqvX1FEf/"

INITIAL_URL = "https://api.polldaddy.com/"
HEADERS = {"Content-Type": "application/json"}

init_data = {
	"pdInitiate": {
		"partnerGUID": POLLDADDY_PARTNER_ID,
		"partnerUserID": "0",
		"email": POLLDADDY_EMAIL,
		"password": POLLDADDY_PASSWORD
	}
}

class Polls(object):
	"""
	Managing polls from Polldaddy
	"""
	def __init__(self):
		self.user_code = None

	def poll_init(self):
		response = requests.post(url=INITIAL_URL, headers=HEADERS, data=init_data)
		print(response.text)
		self.user_code = json.loads(response.text)["userCode"]
		print(self.user_code)

	def poll_list(self):
		payload = {
			"pdRequest": {
				"partnerGUID": POLLDADDY_PARTNER_ID,
				"userCode": POLLDADDY_USER_CODE,
				"demands": {
					"demand": {
						"list": {
							"folder_id": "28405504"
						}, "id": "GetPolls"
					}
				}
			}
		}
		http = urllib3.PoolManager()
		response = http.request("POST", INITIAL_URL, body=json.dumps(payload))
		print(json.loads(response.data.decode('utf8')))

	def poll_details(self, poll_code):
		payload = {
			"pdRequest": {
				"partnerGUID": POLLDADDY_PARTNER_ID,
				"userCode": POLLDADDY_USER_CODE,
				"demands": {
					"demand": {
						"poll": {
							"id": poll_code,
						}, "id": "GetPoll"
					}
				}
			}
		}
		http = urllib3.PoolManager()
		response = http.request("POST", INITIAL_URL, body=json.dumps(payload))
		return json.loads(response.data.decode('utf8')).get('pdResponse').get('demands').get("demand")[0]

	def vote_method(self, answer_code="46137692", poll_id='10054923', **kwargs):
		payload = {
			"pdRequest": {
				"partnerGUID": POLLDADDY_PARTNER_ID,
				"userCode": POLLDADDY_USER_CODE,
				"demands": {
					"demand": {
						"vote": {
							"answers_text": answer_code,
							"other_text": "",
							"url": "",
							"ip": "",
							"tags": {
								"tag": {
									"name": "email",
									"value": kwargs.get("email", "me@polldaddy.com")
								}
							},
							"poll_id": poll_id,
							"widget_id": "0",
							"cookie": "0"
						},
						"id": "vote"
					}
				}
			}
		}
		http = urllib3.PoolManager()
		response = http.request("POST", INITIAL_URL, body=json.dumps(payload))
		return json.loads(response.data.decode('utf8')).get('pdResponse')
