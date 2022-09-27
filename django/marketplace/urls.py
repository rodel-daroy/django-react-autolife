"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.conf.urls import url

from marketplace.views import CbbDropdownLists, CbbSearch, OffersAPI, JatoMakes, JatoModelByMakes, \
	JatoBodyStyles, JatoSearch, JatoVehicleDetails, JatoModelTrims, JatoFeatureByTrim, DetailsByVehicleID, \
	SpecsByVehicleID, SimilarVehicles, UnhaggleIncentive, GetDealers, SCILeadPost, CBBAvgAskingPrice, AveragePrice, \
	GetTradeInValues, TradeInValueResults, GetFutureValues, FutureValueResults, GetInsuranceQuote, InsuranceVehicles, \
	ContactConfirmationView, SearchEvoxView, EvoxImagesView, VehicleImagesView, VehicleColorsView, VehicleAllImages

urlpatterns = [
	url(r'^offers/', OffersAPI.as_view(), name = "offers"),
	# JATO
	url(r'^jatomakes/', JatoMakes.as_view(), name="jato_makes"),
	url(r'^jato_trim/(?P<make>[\w -]+)/$', JatoBodyStyles.as_view(), name="jato trims"),
	url(r'^jato_models/(?P<make>[\w -]+)/$', JatoModelByMakes.as_view(), name="jato models"),
	url(r'^jato_search/', JatoSearch.as_view(), name="jato search"),
	url(r'^jato_vehicle/(?P<vehicle_id>\w+)/$', JatoVehicleDetails.as_view(), name="jato vehicle details"),
	url(r'^jato_trims/(?P<model_id>\w+)/$', JatoModelTrims.as_view(), name="jato vehicle trims"),
	url(r'^jato_features/', JatoFeatureByTrim.as_view(), name="jato vehicle feature by trim"),
	url(r'^jato_vehicle_specs/(?P<vehicle_id>\w+)/', SpecsByVehicleID.as_view(), name="jato vehicle specs by vehicle id"),
	url(r'^jato_vehicle_details/(?P<vehicle_id>\w+)/', DetailsByVehicleID.as_view(), name="jato vehicle details by vehicle id"),
	url(r'^jato_similar_vehicles/(?P<vehicle_id>\w+)/', SimilarVehicles.as_view(), name="similar vehicle by vehicle id"),
	# UNHAGGLE
	url(r'^unhaggle_incentives/', UnhaggleIncentive.as_view(), name="incentive for vehicles"),
	# SCI
	url(r'^get_dealers/', GetDealers.as_view(), name="SCI Dealers List"),
	url(r'^sci_lead_post/', SCILeadPost.as_view(), name="SCI lead post"),
	# CBB average asking
	url(r'^avg_asking/', CBBAvgAskingPrice.as_view(), name="CBB average asking years make and model"),
	url(r'^avg_asking_results/', AveragePrice.as_view(), name="Average Price results"),
	# CBB Trade In value
	url(r'^trade_in/', GetTradeInValues.as_view(), name="CBB Trade in value make model and year"),
	url(r'^trade_in_results/', TradeInValueResults.as_view(), name="CBB Trade in value make model and year"),
	# CBB Future Value
	url(r'^future_value/', GetFutureValues.as_view(), name="CBB future value params"),
	url(r'^future_value_results/', FutureValueResults.as_view(), name="CBB future value results"),
	# Insurance
	url(r'^insurance/', InsuranceVehicles.as_view(), name="insurance vehicles"),
	url(r'^get_insurance_quote/', GetInsuranceQuote.as_view(), name="insurance quote"),
	url(r'^contact_confirm/', ContactConfirmationView.as_view(), name="contact_confirmation"),
	url(r'^evox_search_images/', SearchEvoxView.as_view(), name="search_evox"),
	url(r'^evox_color_images/', VehicleImagesView.as_view(), name="evox_color_images"),
	url(r'^evox_vehicle_colors/', VehicleColorsView.as_view(), name="evox_vehicle_color"),
	url(r'^evox_vehicle_all_images/', VehicleAllImages.as_view(), name="evox_vehicle_all_images"),
]
