"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""


class TemplateConfiguration(object):
	"""
	Javascript Template configuration modifier
	"""
	def __new__(cls, str_val, change_type="disable", *args, **kwargs):
		try:
			dict_val = eval(str_val)
			if change_type=="enable":
				dict_val["Top"] = True
				dict_val["Bottom"] = True
			elif change_type=="disable":
				dict_val["Top"] = False
				dict_val["Bottom"] = False
			return str(dict_val)
		except:
			return str_val
