from autolife.local_settings import DEBUG

SCI_LEAD_XML = """<SCI schemaVersion="4.0" xmlns:SciB="http://www.scitorque.com/Schema/BusinessBaseType">
    <Lead LeadClassName="Sales" Status="new">
        <LeadClassification>New</LeadClassification>
        <Requestdate>{request_date}</Requestdate>
        <ReceivedDate>{received_date}</ReceivedDate>
        <Vehicle Interest="buy" Status="new">
            <Year>{year}</Year>
            <Make>{make}</Make>
            <Model>{model}</Model>
            <Trim>{trim}</Trim>
            <Price Type="msrp" Currency="USD">{price}</Price>
            <Bodystyle>{body_style}</Bodystyle>
            <Id>{vehicle_id}</Id>
        </Vehicle>
        <Customer Type="individual">
            <Contact>
                <Name Part="first" Type="individual">{first_name}</Name>
                <Name Part="last" Type="individual">{last_name}</Name>
                <EMail PreferredContact="1" SCI="OK">{email}</EMail>
                <Phone Type="voice" Time="day" PreferredContact="1" ChannelCode="Business Phone" SCI="OK">
                    <Number>{mobile_num}</Number>
                    <Extension/>
                </Phone>
                <Address SCI="OK" Type="home">
                    <PostalCode>{postal_code}</PostalCode>
                    <City>{city}</City>
                    <Country CountryCode="CA">{country}</Country>
                </Address>
            </Contact>
            <CurrentlyOwned/>
        </Customer>
        <Vendor>
            <Id>999</Id>
            <Vendorname>{dealer_name}</Vendorname>
            <DealerID>{dealer_id}</DealerID>
            <Division>{division}</Division>
        </Vendor>
        <Provider>
            <Id Source="Mazda">600002</Id>
            <Name Part="full" Type="company">MazdaDlrTestDr</Name>
            <Service>MTDrive</Service>
        </Provider>
        <MiscData>
            <BusinessIndicator>Retail</BusinessIndicator>
        </MiscData>
        <LeadSourceName>Mazda Canada Book a Test Drive</LeadSourceName>
    </Lead>
</SCI>"""

# DEALERS RELATED CONSTANTS
PARTNER_TOKEN = "A510F190-8D31-4272-9F57-EB189A7A0731"
SCI_DEALER_XML = """
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:tor="http://schemas.datacontract.org/2004/07/Torque.LeadProcess.Entities" xmlns:arr="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
    <soapenv:Header/>
    <soapenv:Body>
        <tem:SearchDealerByDealerGroup>
            <tem:partnerToken>{partner_token}</tem:partnerToken>
            <tem:geoData>
                <tor:ZipCode>
               <!-- <tor:Latitude></tor:Latitude> -->
               <!-- <tor:Longitude></tor:Longitude> -->
               <tor:ZipPostal>{postal_code}</tor:ZipPostal>
            </tor:ZipCode>
            </tem:geoData>
            <!--Optional:-->
            <tem:searchRadius>{search_radius}</tem:searchRadius>
            <!--Optional:-->
            <tem:divisionFilter>
                <!--Zero or more repetitions:-->
                <arr:string>{division}</arr:string>
            </tem:divisionFilter>
            <!--Optional:-->
            <tem:dealerGroup>{dealer_group}</tem:dealerGroup>
            <!-- tem:dealerGroup>Chrysler Canada</tem:dealerGroup -->
        </tem:SearchDealerByDealerGroup>
    </soapenv:Body>
</soapenv:Envelope>
"""

SCI_ADF_XML = """

<adf>
    <prospect status = "new">
        <id sequence = "1" source = "Anything">BlackBook_201372975624_PC0025_5</id>
        <requestdate>{request_date}</requestdate>
        <vehicle interest = "buy" status = "new">
            <id sequence = "1" source = "OEM">117</id>
            <year>{year}</year>
            <make>{make}</make>
            <model>{model}</model>
            <trim>{trim}</trim>
            <bodystyle>{body_style}</bodystyle>
        </vehicle>
        <customer>
            <contact>
                <name part = "first" type = "individual">{first_name}</name>
                <name part = "last" type = "individual">{last_name}</name>
                <email>{email}</email>
                <phone time = "morning" type = "voice">{mobile_num}</phone>
                <address type = "home">
                    <street line = "1"></street>
                    <city>{city}</city>
                    <postalcode>{postal_code}</postalcode>
                    <country>{country}</country>
                </address>
            </contact>
            <comments>CLICK THIS LINK TO CLOSE THE SALE (www.blackbookinsight.com/dealer) EST. CREDIT SCORE: 723 - 948; NEW PYMT DESIRED: $315 - $368; EST. BALANCE OWED ON TRADE: $2016 - $6823; CURRENT PYMT: $230 - $622;</comments>
        </customer>
        <vendor>
            <id sequence = "1" source = "OEM">{dealer_id}</id>
            <vendorname>{dealer_name}</vendorname>
            <contact>
                <phone time = "day" type = "voice">{dealer_phone}</phone>
                <phone time = "day" type = "fax"/>
                <address type = "home">
                    <street line = "1">{dealer_address}</street>
                    <street line = "2"/>
                    <apartment/>
                    <city>{city}</city>
                    <regioncode>{dealer_state_code}</regioncode>
                    <postalcode>{dealer_postal_code}</postalcode>
                    <country>{country}</country>
                </address>
            </contact>
        </vendor>
        <provider><name part="full" type="business">Anything</name><service>Request A Quote</service><url>http://www.Autolife.com</url><email>support@Autolife.com</email><phone>800-898-8438</phone></provider>
    </prospect>
</adf>
"""

if not DEBUG:
	SCI_LEAD_URL = "https://leadpush.scidealerhub.com/oemleadpush/GetAdfLead/AutoLife"
else:
	SCI_LEAD_URL = "https://uatleadpush.scidealerhub.com/oemleadpush/GetAdfLead/AutoLife"
SCI_HEADERS = {"content-type": "application/xml"}

TEMP_ACCESS_TOKEN = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1laWQiOiIzODgxMmZjYy1hZjg4LTRlNGItYjk2MS1hMGMyYjk0NmYwYzYiLCJ1bmlxdWVfbmFtZSI6ImRlcmVrLnZhcm5lciIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vYWNjZXNzY29udHJvbHNlcnZpY2UvMjAxMC8wNy9jbGFpbXMvaWRlbnRpdHlwcm92aWRlciI6IkFTUC5ORVQgSWRlbnRpdHkiLCJBc3BOZXQuSWRlbnRpdHkuU2VjdXJpdHlTdGFtcCI6IjQ3YzMzZTAyLTU0ZTUtNDY4NC04ZDU1LTEzMzU0Mjk4NzQ1MiIsInJvbGUiOlsiVXNlciIsIkFkbWluIl0sImh0dHA6Ly9zY2hlbWFzLmphdG8uY29tL3dzLzIwMTUvMDYvaWRlbnRpdHkvY2xhaW1zL2FsbG93ZWRjdWx0dXJlcyI6WyJlcy1VUyIsImVuLVVTIiwiZW4tQ0EiLCJmci1DQSIsImVzLU1YIiwicHQtQlIiXSwiaHR0cDovL3NjaGVtYXMuamF0by5jb20vd3MvMjAxNS8wNi9pZGVudGl0eS9jbGFpbXMvYWxsb3dlZGl6bW8iOiJ0cnVlIiwiaHR0cDovL3NjaGVtYXMuamF0by5jb20vd3MvMjAxNS8wNy9pZGVudGl0eS9jbGFpbXMvYWxsb3dlZGluY2VudGl2ZXMiOiJ0cnVlIiwiaHR0cDovL3NjaGVtYXMuamF0by5jb20vd3MvMjAxNS8wOC9pZGVudGl0eS9jbGFpbXMvYWxsb3dlZHZpbmRlY29kaW5nIjoidHJ1ZSIsImh0dHA6Ly9zY2hlbWFzLmphdG8uY29tL3dzLzIwMTYvMDYvaWRlbnRpdHkvY2xhaW1zL2FsbG93ZWRoaXN0b3JpY2FsIjoidHJ1ZSIsImh0dHA6Ly9zY2hlbWFzLmphdG8uY29tL3dzLzIwMTYvMDkvaWRlbnRpdHkvY2xhaW1zL2FsbG93ZWRjb21wbGV4aXR5IjoidHJ1ZSIsImh0dHA6Ly9zY2hlbWFzLmphdG8uY29tL3dzLzIwMTcvMDQvaWRlbnRpdHkvY2xhaW1zL2Rpc3BsYXlpbnZvaWNlcHJpY2UiOiJ0cnVlIiwiaHR0cDovL3NjaGVtYXMuamF0by5jb20vd3MvMjAxNy8wNC9pZGVudGl0eS9jbGFpbXMvc3Vic2NyaXB0aW9ua2V5IjoiZGNhMmE4ZGNjYWM3NGFkMWIxZTA3MDQ2NjI0ZjIxYzQiLCJpc3MiOiJodHRwczovL2F1dGguamF0b2ZsZXguY29tIiwiYXVkIjoiNDE0ZTE5MjdhMzg4NGY2OGFiYzc5ZjcyODM4MzdmZDEiLCJleHAiOjE1MTk5NzY1NjQsIm5iZiI6MTUxOTg5MDE2NH0.pQmbvvV37C_kOSAgjVI_QGW7hK-oz3kJ4IjtjsrHURM"
GOOGLE_API_KEY = "AIzaSyBJRzLknVlcZlIspu5mniHdcWy2w0z98E8"

# Insurance related constants
#INSURANCE_URL = "http://settings.easyinsure.ca/{url}"
#INSURANCE_TOKEN_HEADERS = {u'content-type': u'application/x-www-form-urlencoded'}
#INSURANCE_TOKEN_PAYLOAD = {"username":"TestAutolife", "password":"TestAuto", "grant_type":"password"}
#INSURANCE_QUOTE_HEADERS = {"Content-type" : "application/json", "Authorization": "bearer {access_token}"}


# DEFAULT VALUES
TORONTO_LAT = "43.761539"
TORONTO_LONG = "-79.411079"

# Easy Insure
#DUMMY_DATA = {"GUID":"2697f200-dc3b-4e97-9069-748195f11b22","QuoteID":0,"ID":0,"ProvinceABBR":"ON","City":"Windsor","PostalCode":"L3P4R1","VehicleInfo":[{"VehID":721772,"Model":"Tacoma","Make":"Toyota","Year":"2017","PrimaryDriverID":821576,"PurchaseDate":"2018-06-18T17:14:16.776Z","VIN":None,"DistanceYearly":15000,"PrimaryUse":"Pleasure","DistanceDaily":10,"OwnedOrLeased":"Owned","WinterTire":True,"LossOfUse":False,"NonOwnedAuto":False,"WaiverOfDepreciation":False,"LiabLimit":"1000000","CollisionDeductible":"0","ComprehensiveDeductible":"0","AccidentWaiver":False,"HasAccidentBenefits":False}],"DriverProfile":[{"DriverID":821576,"QuoteType":2,"MaritalStatus":"M","Retired":False,"Birthday":"1986-04-15 00:00:00.000","Gender":"M","DriversTesting":False,"GDate":"2007-10-01 00:00:00.000","G1Date":"2005-09-01 00:00:00.000","G2Date":"2006-10-01 00:00:00.000","LicenseLetter":"G","IsLicenseCanceled":False,"ContinousIsuranceYears":6,"DateWithCurrentCompany":"0"}]}
DUMMY_DATA = {
  "GUID":"2697f200-dc3b-4e97-9069-748195f11b22",
  "QuoteID":0,
  "ID":0,
  "ProvinceABBR":"ON",
  "City":"Windsor",
  "PostalCode":"L3P4R1",
  "VehicleInfo":[
    {
      "VehID":721772,
      "Model":"Tacoma",
      "Make":"Toyota",
      "Year":"2017",
      "PrimaryDriverID":821576,
      "PurchasePrice":2500,
      "PurchaseDate":"2018-06-18T17:14:16.776Z",
      "VIN":None,
      "DistanceYearly":15000,
      "PrimaryUse":"Pleasure",
      "DistanceDaily":10,
      "OwnedOrLeased":"Owned",
      "WinterTire":True,
      "LossOfUse":False,
      "NonOwnedAuto":False,
      "WaiverOfDepreciation":False,
      "LiabLimit":"1000000",
      "CollisionDeductible":"0",
      "ComprehensiveDeductible":"0",
      "AccidentWaiver":False,
      "HasAccidentBenefits":False
    }],
  "DriverProfile":[
    {
      "DriverID":821576,
      "QuoteType":2,
      "MaritalStatus":"M",
      "Retired":False,
      "Birthday":"1986-04-15 00:00:00.000",
      "Gender":"M",
      "DriversTesting":False,
      "GDate":"2007-10-01 00:00:00.000",
      "G1Date":"2005-09-01 00:00:00.000",
      "G2Date":"2006-10-01 00:00:00.000",
      "LicenseLetter":"G",
      "IsLicenseCanceled":False,
      "ContinousIsuranceYears":6,
      "DateWithCurrentCompany":"0"
    }]
}
