import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEBUG = False

DATABASES = {
        'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv("DATABASE_NAME"),
                'USER': os.getenv("DATABASE_USER"),
                'PASSWORD':os.getenv("DATABASE_PASSWORD"),
                'HOST': os.getenv("DATABASE_HOST"),
                'PORT': 5432
        },

#       'read_only': {
#               'ENGINE': 'django.db.backends.postgresql',
#               # 'NAME': 'autolife_dev',
#               'NAME': 'autolife',
#               'USER': 'autolifemaster1',
#               'PASSWORD': 'autolife',
#               'HOST': 'readautolifedb.cmp22g0vs1is.us-east-2.rds.amazonaws.com',
#               'PORT': 5432
#       }

}

# Email Settings for django-ses
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_EMAIL_FROM = os.getenv("DEFAULT_EMAIL_FROM")
INFO_MAIL_FROM = os.getenv("INFO_MAIL_FROM")
EMAIL_BACKEND = 'django_ses.SESBackend'
EMAIL_PORT = 465
EMAIL_USE_TLS = True


ALLOWED_HOSTS = ['*']
STATIC_ROOT = '/var/static/'
MEDIA_ROOT = '/var/static/media/'
#MONGODB_HOST = "mongodb://18.216.198.59:27017"
MONGODB_HOST = "mongodb://{username}:{password}@18.216.198.59:27017/".format(username= os.getenv("MONGO_DB_USERNAME"), password= os.getenv("MONGO_DB_PASSWORD") )
MONGODB_DATABASE = os.getenv("MONGO_DB")

# REDIS CONFIG
BROKER_URL = 'redis://127.0.0.1:6379'
CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CACHES = {
        "default": {
                "BACKEND": "django_redis.cache.RedisCache",
                "LOCATION": "redis://app-server-redis.gglial.ng.0001.use2.cache.amazonaws.com:6379",
                "OPTIONS": {
                        "CLIENT_CLASS": "django_redis.client.DefaultClient",
                }
        }
}
CACHES = {
        "default": {
                "BACKEND": "django_redis.cache.RedisCache",
                "LOCATION": "redis://app-server-redis.gglial.ng.0001.use2.cache.amazonaws.com:6379",
                "OPTIONS": {
                        "CLIENT_CLASS": "django_redis.client.DefaultClient",
                }
        }
}



"""
LOGGING = {
    'disable_existing_loggers': False,
    'version': 1,
    'handlers': {
        'console': {
            # logging handler that outputs log messages to terminal
            'class': 'logging.StreamHandler',
            'level': 'DEBUG', # message level to be written to console
        },
             'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR+'/debug.log',
        },
    },
    'loggers': {
        '': {
            # this sets root level logger to log debug and higher level
            # logs to console. All other loggers inherit settings from
            # root level logger.
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False, # this tells logger to send logging message
                                # to its parent (will send if set to True)
        },
        'django.db': {
            # django also has database level logging
        },
    },
}

"""
# Social Authentication
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")
SOCIAL_AUTH_FACEBOOK_KEY = os.getenv("SOCIAL_AUTH_FACEBOOK_KEY")
SOCIAL_AUTH_FACEBOOK_SECRET = os.getenv("SOCIAL_AUTH_FACEBOOK_SECRET")
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email','avatar','name']  # optional
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': 'id,name,email, picture'
}


# JATO credentials
JATO_USERNAME = os.getenv("JATO_USERNAME")
JATO_PASSWORD = os.getenv("JATO_PASSWORD")
JATO_GRANT_TYPE = "password"
JATO_SUBSCRIPTION_KEY = os.getenv("JATO_SUBSCRIPTION_KEY")
# Production and development settings will go here
#if DEBUG:
#        ROOT_URLCONF = 'autolife.urls'
#        HOST_NAME = 'https://api.autolife.ca/'
#        SERVER_PATH = ''
#        IP_ADDRESS = "https:/api.autolife.ca/"
#        DOMAIN = 'http://www.autolife.ca'
#else:
ROOT_URLCONF = 'autolife.urls'
HOST_NAME = 'https://api.autolife.ca/'
SERVER_PATH = ''
IP_ADDRESS = "https://api.autolife.ca/"
DOMAIN = 'http://www.autolife.ca'


AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = 'media-staging-autolife-ca'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_LOCATION = 'static'
STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
MEDIA_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, 'media')
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
DEFAULT_FILE_STORAGE = 'library.aws_libs.MediaStorage'

REST_FRAMEWORK = {
        'DEFAULT_PERMISSION_CLASSES': (
                'rest_framework.permissions.IsAuthenticated',
        ),
        'DEFAULT_AUTHENTICATION_CLASSES': (
                'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
                'rest_framework_social_oauth2.authentication.SocialAuthentication',
                'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
                'rest_framework.authentication.SessionAuthentication',
                'rest_framework.authentication.BasicAuthentication',
        ),
        'DEFAULT_RENDERER_CLASSES': (
                'rest_framework.renderers.JSONRenderer',
        ),
}
# Insurance related constants
INSURANCE_URL = "http://beta.easyinsure.ca/{url}"
INSURANCE_TOKEN_HEADERS = {u'content-type': u'application/x-www-form-urlencoded'}
INSURANCE_TOKEN_PAYLOAD = {"username":os.getenv("INSURANCE_USERNAME"), "password":os.getenv("INSURANCE_PASSWORD"), "grant_type":"password"}
INSURANCE_QUOTE_HEADERS = {"Content-type" : "application/json", "Authorization": "bearer {access_token}"}
BASE_URL= 'localhost:8000'



