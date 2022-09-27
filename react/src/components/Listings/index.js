import React from "react";
import pick from "lodash/pick";
import PropTypes from "prop-types";
import Breadcrumbs from "components/Navigation/Breadcrumbs";
import PrimaryButton from "components/Forms/PrimaryButton";
import { OMVIC } from "config/constants";

export const getStats = car => {
	let stats = pick(car, [
    	"engine_type", "horse_power", "transmission", "fuel_economy_city", "fuel_economy_hwy"
    ]);
    if(stats.hasOwnProperty("fuel_economy_city")) {
		stats.fuel_economy = [
			`${stats.fuel_economy_city ? `${stats.fuel_economy_city}L / 100km`: "NA"}(city)`,
			`${stats.fuel_economy_hwy ? `${stats.fuel_economy_hwy}L / 100km` : "NA"}(highway)`
		];

		delete stats.fuel_economy_city;
		delete stats.fuel_economy_hwy;
    }

    if(stats.hasOwnProperty("engine_type")) {
    	stats.engine = stats.engine_type ? stats.engine_type : "NA";
    	delete stats.engine_type;
    }

    if(stats.hasOwnProperty("horse_power")) {
    	stats.horsepower = stats.horse_power ? stats.horse_power : "NA";
    	delete stats.horse_power;
	}
	
	return stats;
};

export const CarPricePropTypes = {
    totalPrice: PropTypes.any,
    freight: PropTypes.any,
    airTax: PropTypes.any,
    price: PropTypes.any
};

export const getCarPrice = carDetails => {
    let price = parseInt(carDetails.price);
    if(!price)
        price = NaN;
    
    const airTax = !isNaN(carDetails.air_tax) && carDetails.air_tax ? carDetails.air_tax : 0;
    const freight = !isNaN(carDetails.freight) && carDetails.freight ? carDetails.freight : 0;

    const totalPrice = price + parseInt(airTax) + parseInt(freight) + OMVIC;

    return {
        price,
        totalPrice,
        freight,
        airTax
    };
};

export const getBreadcrumbs = ({ className, breadcrumbs, currentBreadcrumb = "Shopping Car Listings" } = {}) => {
    let useBreadcrumbs = null;
    if(breadcrumbs)
        useBreadcrumbs = breadcrumbs.map((crumb, i) => <Breadcrumbs.Crumb key={i} {...crumb} />);
    else
        useBreadcrumbs = <Breadcrumbs.Crumb name={currentBreadcrumb} />;

    return (
        <Breadcrumbs className={className}>
            <Breadcrumbs.Crumb link={`/shopping`} name="Shop for Cars" />
            {useBreadcrumbs}
        </Breadcrumbs>
    );
};

export const getBackButton = ({ backLink, className } = {}) => (
    <PrimaryButton 
        size="medium" 
        className={`car-listing-back ${className || ""}`} 
        link={backLink}>

        <span className="icon icon-angle-left"></span> Back to Results
    </PrimaryButton>
);

export const HIGH_TO_LOW = 0;
export const LOW_TO_HIGH = 1;

export const sortByPrice = (cars, sort = HIGH_TO_LOW) => {
    return cars.slice().sort((a, b) => {
        const { totalPrice: priceA } = getCarPrice(a);
        const { totalPrice: priceB } = getCarPrice(b);

        if(sort === HIGH_TO_LOW)
            return (priceB || 0) - (priceA || 0);
        else
            return (priceA || Number.MAX_VALUE) - (priceB || Number.MAX_VALUE);
    });
};