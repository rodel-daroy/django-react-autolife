"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
This file includes the automation script of the autolife project, before running the script please ensure
that your "Linux" machine has virtualenv already installed. And after that you have to create virtualenv
in Python 3.5 for your current project by running command "virtualenv -p python3 your_env_name", this
command will create a new directory respective to your environment name after this you have to create a
new directory for project files by running command "mkdir autolife & cd autolife". Then place this file
in your project directory i.e autolife and run "fab deploy_with_git:<your_authorised_git_repository_path>.
Voila! that's all , you are ready with your working local server.
"""
import os
from getpass import getpass

from fabric.operations import local


# Dummy Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '127.0.0.1'
    }
}


class bcolors:
	HEADER = '\033[95m'
	OKBLUE = '\033[94m'
	OKGREEN = '\033[92m'
	WARNING = '\033[93m'
	FAIL = '\033[91m'
	ENDC = '\033[0m'
	BOLD = '\033[1m'
	UNDERLINE = '\033[4m'


def deploy_with_git(
		repository="", branch="dev_test", db_name="autolife_dev1", user="autolife_dev_user1", password="autolife_dev_password"
	):
	"""
	:param repository: your authorised git repo
	:param branch: your branch name
	:param db_name: database name
	:param user: database user
	:param password: database user's password
	"""
	local("sudo apt-get install postgresql-9.5 libpq-dev python3-pip git virtualenv")
	# local("mkdir autolife && cd autolife")
	local("git init")
	local("git remote add origin %s" %repository)
	local("git fetch && git checkout dev_main")
	local("git checkout -b dev_test dev_main")
	# local("virtualenv ../auto_env")
	# local(". ../autolife_env/bin/activate")
	db_name = db_name
	user = user
	password = password
	try:  # Creating Database on Postgresql server
		local("""sudo -u postgres psql -c 'CREATE DATABASE %s'""" % db_name)
	except:
		print(bcolors.FAIL+"Database name is not valid or already exists!!"+bcolors.ENDC)
	try:  # Creating User fo the database
		local(""" sudo -u postgres psql -c "CREATE USER %s WITH PASSWORD '%s'" """ % (user, password))
	except:
		print(bcolors.FAIL+"Role already exists in Postgresql, try creating different role"+bcolors.ENDC)
	try:  # Granting privileges to created user
		local(""" sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE %s TO %s" """ % (db_name, user))
	except:
		print(bcolors.FAIL+"Could not GRANT Permissions to role %s"+bcolors.ENDC % user)
	try:  # Installing project requirements into the environment
		local("pip install -r requirements.txt")
	except Exception as e:
		print(e)
	# Generating local_settings and adding db settings into it.
	print(bcolors.OKBLUE+"creating autolife/local_settings.py......."+bcolors.ENDC)
	DATABASES["default"]["USER"] = user
	DATABASES["default"]["PASSWORD"] = password
	DATABASES["default"]["NAME"] = db_name
	with open("autolife/local_settings.py", "w") as fp:
		fp.write("DATABASES = " + str(DATABASES) + "\nDEBUG = True")
	print(bcolors.OKBLUE+"Creating Tables........"+bcolors.ENDC)
	local("python manage.py migrate")
	print(bcolors.OKBLUE + "Loading data Into tables........" + bcolors.ENDC)
	local("python manage.py loaddata data.json -e contenttypes.ContentType  ")
	print(bcolors.OKBLUE + "Loaded Successfully" + bcolors.ENDC)
	print(bcolors.OKBLUE+"Creating Super User........"+bcolors.ENDC)
	local("python manage.py createsuperuser")
	print(bcolors.OKGREEN+"Autolife Environment Installed successfully!!!!!"+bcolors.ENDC)
	# print(bcolors.OKGREEN+"Removing fabfile.py!!!!!"+bcolors.ENDC)
	# local("rm -rf fabfile.py")
	# local("cp library/fabfile.py .")
	print(bcolors.BOLD+"Run Development Server using 'fab runserver' command"+bcolors.ENDC)


def runserver():
	local("python manage.py runserver")


def get_latest():
	local("git stash")
	local("git pull origin dev_main")
	local("python manage.py migrate")


def env_local():
	local("git pull origin dev_main")
	local("git checkout -b dev_hrkaur dev_main")
	local("pip install -r requirements.txt")
	local("python manage.py migrate")
	local("python manage.py loaddata data.json -e contenttypes.ContentType -e auth.permissions")
	local("python manage.py createsuperuser")
	local("python manage.py runserver")


