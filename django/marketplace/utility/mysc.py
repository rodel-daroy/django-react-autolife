from xlrd import open_workbook

from autolife.settings import BASE_DIR
from marketplace.models import MappingModel


path = BASE_DIR +'/marketplace/utility/Motoinsight_EVOX_Mapping_file_2019-07-30_x.xlsx'
# path = BASE_DIR + '/marketplace/utility/Motoinsight_EVOX_Mapping_File_Demo_2019-03-13_x.xlsx'
book = open_workbook(path)
sheet = book.sheet_by_index(0)
keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]

for row_index in range(1, sheet.nrows):
    entityValues = {keys[col_index].strip(): sheet.cell(row_index, col_index).value
                    for col_index in range(sheet.ncols)}
    if entityValues:
        MappingModel.objects.create(
            uid=entityValues['UID'],
            jid=int(entityValues['JID']),
            evox_id=int(entityValues['EVOX ID'])
        )

    print(entityValues)
