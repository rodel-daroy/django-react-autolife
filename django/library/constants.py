"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

RESPONSE = {
    200: "OK",
    201: "CREATED",
    304: "NOT MODIFIED",
    401: "UNAUTHORIZED",
    404: "NOT FOUND",
    409: "CONFLICT",
    500: "INTERNAL SERVER ERROR",
}

CONFIRM_MAIL_MESSAGE = "Hi, Welcome Aboard!!\n Thanks for Sign Up," \
					   " Your Autolife Journey is about to start." \
                       "Please Follow the link below to verfy your account."
CONFIRM_MAIL_SUBJECT = "Account Verification"
VERIFICATION_SUCCESS = "Welcome to Autolife"
RESET_PASSWORD_SUBJECT = "Password Reset link"
SUBSCRIPTION_SUBJECT = "Thanks for subscribing"
UNSUBSCRIPTION_SUBJECT = "Unsubscribed from autolife"
GRANT_TYPE = "convert_token"
BACKENDS = {"google": "google-oauth2", "facebook": "facebook"}
DEFAULT_USER_IMAGE = "http://www.motorverso.com/wp-content/uploads/2017/03/104501_All_new_Honda_Civic_Type_R_races_into_view_at_Geneva-710x566.jpg"

CONTENT_PUBLISH_STATES = {
	1: "Draft",
	2: "Ready To Approve",
	3: "Published"
}

CONTENT_PUBLISH_STATE_STR = {y:x for x,y in CONTENT_PUBLISH_STATES.items()}

JSON_CONTENT_PUBLISH_STATE= [
	{"id": 1, "name": CONTENT_PUBLISH_STATES[1]},
	{"id": 2, "name": CONTENT_PUBLISH_STATES[2]},
	{"id": 3, "name": CONTENT_PUBLISH_STATES[3]},
]

SCI_GET_DEALER = "https://api.scimarketview.com/LeadProcessService/DealerExternal.svc"


RESET_PASSWORD_TEXT = "You have requested for password change , " \
                      "Please follow the link below to update your password.\n {hostname}{link}"


ASSET_CSS = "<style> #assets{'width': 200px}</style>"
READ_ONLY_DB = "read-only"
DEFAULT_DB = "default"