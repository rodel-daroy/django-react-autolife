import requests
from django.conf import settings
from marketplace.models import MappingModel
from rest_framework.exceptions import APIException
from marketplace.utility.utils import updatedJatoIdWithYear



class FetchData():

    def get_data(self, jato_ids):
        jatoid_with_year = updatedJatoIdWithYear(jato_ids)
        response = [self.get_data_from_db(id) for id in jatoid_with_year]
        return {'status': 200, 'message': 'Success', 'data':response}

    def get_data_from_db(self, jid):
        map_obj = MappingModel.objects.filter(jid=jid).values('evox_id').first()

        if map_obj is None:
            raise APIException("Jato id: {jid} doesn't exists in records.".format(jid=jid))

        url = settings.EVOX_BASE_URL+"/vehicles/{map_obj}/products/2/40".format(map_obj=map_obj['evox_id'])
        headers = {
            'x-api-key':settings.EVOX_X_API_KEY
        }
        response_data = requests.get(url=url, headers=headers).json()
        return {
            'jato-id' : jid,
            'evox-id':map_obj['evox_id'],
            'url':url,
            'evox-image':[image for image in response_data['urls']]
        }
