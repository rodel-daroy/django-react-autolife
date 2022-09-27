"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import psycopg2

from autolife.local_settings import SERVER_PATH
from library.al_lib import RawQuery


class ManufacturersMake(object):
	"""
	Returns list of makers according to manufacturer
	"""
	def __new__(cls, manufacturer_id,  *args, **kwargs):
		try:

			pass
		except:
			pass


class AssetList(object):

	def __new__(cls, *args, **kwargs):
		try:
			return tuple(
				RawQuery("select id, name from content_manager_asset;")
			)
		except:
			return ()


class TemplateList(object):

	def __new__(cls, *args, **kwargs):
		results = RawQuery("select id, content_heading from content_manager_templatecontent where template='Vehicle Editorial Template';")
		results = ((str(data[0]), data[1]) for data in results)
		if results:
			results = list(results)
			results.insert(0, (" ", "Select Article"))
			return tuple(
				results
			)
		return (('', "N/A"),)


class GetAssetsForVehicle(object):

	def __new__(cls, content_id, *args, **kwargs):

		try:
			query = "select assetassociation_id from content_manager_templatecontent_asset_template_association join content_manager_templatecontent on content_manager_templatecontent_asset_template_association.templatecontent_id=%d" %int(content_id)
			asset_association_id = RawQuery(query)[0][0]
			query_2 = "select asset_id from content_manager_assetassociation where id=%d and template_location='spot_A';" %asset_association_id
			asset_id = RawQuery(query_2)[0][0]
			query_3 = "select content_manager_asset_assets.assetcontent_id from content_manager_asset_assets where content_manager_asset_assets.asset_id=%d" %asset_id
			all_assets = []
			for asset_content in RawQuery(query_3):
				sub_query = "select content from content_manager_assetcontent where id=%d"%asset_content[0]
				all_assets.append(RawQuery(sub_query)[0][0])
			asset_type_id = RawQuery("select asset_type_id from content_manager_asset where id=%d"%asset_id)[0][0]
			asset_type = RawQuery("select name from content_manager_assettype where id=%d" %asset_type_id)[0][0]
			data = {
				"asset_type": asset_type,
				"assets":[SERVER_PATH+asset for asset in all_assets]
			}
		except psycopg2.OperationalError or psycopg2.ProgrammingError:
			data = {}
		return data


