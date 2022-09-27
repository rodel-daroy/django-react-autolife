"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""

class AutolifeRouter(object):
	"""
	Router to access multiple databases
	"""
	def db_for_read(self, model, **hints):
		return 'read_only'

	def db_for_write(self, model, **hints):
		return 'default'