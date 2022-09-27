"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.core.management import BaseCommand

from regions.utility.utils import SaveRegion


class AddRegions(BaseCommand):

	def handle(self, *args, **options):
		sr_obj = SaveRegion()
		print("Fetching countries...............")
		sr_obj.save_countries()
		print("Fetching states...............")
		sr_obj.save_states()
		print("Fetching cities...............")
		sr_obj.save_cities()
