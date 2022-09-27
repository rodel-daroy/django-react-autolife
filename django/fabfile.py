"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from fabric.api import run, local, hosts, cd
from colorama import Fore, Back, Style

SERVERS = ["ubuntu@18.222.55.21"]
DEV_SERVERS = ["ubuntu@52.15.99.53"]


def deploy_dev_main():
	"""
	WILL WORK ON EC2 INSTANCES
	:return:
	"""
	local("git checkout dev_main && git stash && git pull origin dev_main")
	local("pip install -r requirements.txt")
	local("python manage.py migrate")
	local("sudo systemctl restart gunicorn")
	print(
		Back.RED + Fore.LIGHTGREEN_EX + "latest code pulled from dev_main and deployed, Check server status using command sudo systemctl status gunicorn" + Style.RESET_ALL)


def push_dev_main(message):
	"""
	WILL WORK ON LOCAL MACHINE TO PUSH ALL CHANGES TO GIT WITH MESSAGE.
	:param message:
	:return:
	"""
	local('git add . && git commit -m "{message}" && git push origin dev_main'.format(message=message))
	print(Back.LIGHTBLACK_EX + Fore.LIGHTGREEN_EX + "Successfully pushed to remote with message: {message}".format(
		message=message) + Style.RESET_ALL)


def remote_server_deployment():
	"""
	WILL WORK ON LOCAL MACHINE WHICH HAS REGISTERED IDENTITY OF REMOTE MACHINES (.pem file)
	:return:
	"""
	with cd('autolife'):
		run("git checkout dev_main && git pull origin dev_main")
	run( 'auto_env/bin/pip install -r autolife/requirements.txt')
	run('auto_env/bin/python autolife/manage.py migrate')
	run('sudo systemctl restart gunicorn')


def remote_development_server_deployment():
	"""
	WILL WORK ON LOCAL MACHINE WHICH HAS REGISTERED IDENTITY OF REMOTE MACHINES (.pem file)
	:return:
	"""

	with cd('autolife'):
		run("git checkout dev_testing && git pull origin dev_testing")
	run( 'auto_env/bin/pip install -r autolife/requirements.txt')
	run('auto_env/bin/python autolife/manage.py migrate')
	run('sudo systemctl restart gunicorn')


def connect(task):
	"""
	CONNECT TO REMOTE AND RUN TASKS ON REMOTE SERVER
	:param task:
	:return:
	"""
	host_string = ''
	for host in SERVERS:
		host_string += host
	local( "fab -H {hosts} {task}".format(hosts=host_string, task=task))


def deploy_on_server():
	"""
	DEPLOY DEV_MAIN CODE TO MULTIPLE SERVERS
	:return:
	"""
	connect(task="remote_server_deployment")
	print(
		Back.RED
		+ Fore.LIGHTGREEN_EX
		+ "latest code pulled from dev_main and deployed, Check server status using command sudo systemctl status gunicorn"
		+ Style.RESET_ALL
	)


def development(task):
	"""
	Internal task for developent deployment
	:return:
	"""
	host_string = ''
	for host in DEV_SERVERS:
		host_string += host
	local("fab -H {hosts} {task}".format(hosts=host_string, task=task))



def deploy_on_dev():
	"""
	Deployment on test server
	:return:
	"""
	development(task="remote_development_server_deployment")
	print(
		Back.RED
		+ Fore.LIGHTGREEN_EX
		+ "latest code pulled from dev_main and deployed on dev server"
		+ Style.RESET_ALL
	)


def gunicorn_status():
	"""
	WILL GIVE GUNICORN STATUS OF THE REMOTE MACHINE
	:return:
	"""
	print(Back.LIGHTBLACK_EX + Fore.GREEN +Style.BRIGHT+"Server Status"+ Style.RESET_ALL)
	run("sudo systemctl status gunicorn")


def restart_services():
	"""
	restarting services of the remote server
	:return:
	"""
	run("sudo systemctl restart gunicorn")
	run("sudo service nginx restart")


def restart():
	"""
	Restarting services of the remote server
	:return:
	"""
	connect(task='restart_services')


def check_server_status():
	"""
	CHECKS SERVER RUNNING STATUS
	:return:
	"""
	connect(task='gunicorn_status')
