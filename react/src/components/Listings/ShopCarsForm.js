import React from "react";
import PropTypes from "prop-types";
import CarSelectorForm from "./CarSelectorForm";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  getMakes,
  getModel
} from "redux/actions/marketPlaceActions";
import get from "lodash/get";

const ShopCarsForm = ({ history, location, match, form, ...otherProps }) => {
  const handleSubmit = ({ year, make, model }) => {
    history.push(`/shopping/vehicle-search/${model}/${year}/${make}`);
  };

  return (
    <CarSelectorForm 
      {...otherProps}

      form={form}
      pastYears={1}
      futureYears={1}
      onSubmit={handleSubmit}
      submitText="Search" />
  );
};

ShopCarsForm.propTypes = {
  form: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  makes: get(state, "MarketPlace.makes.data"),
  models: get(state, "MarketPlace.model.data")
});

const mapDispatchToProps = dispatch => ({
  getMakes: ({ year }) => dispatch(getMakes(year)),
  getModels: ({ make }) => dispatch(getModel(make))
});
 
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopCarsForm));
