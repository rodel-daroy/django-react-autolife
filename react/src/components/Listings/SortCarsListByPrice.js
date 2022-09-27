import React, { Component } from "react";
import PropTypes from "prop-types";
import DropdownField from "components/Forms/DropdownField";
import { HIGH_TO_LOW, LOW_TO_HIGH } from "./";

class SortCarsListByPrice extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getSortedValue = e => {
    const { onChange } = this.props;

    if (onChange) onChange(e);
    this.setState({ value: e });
  };

  render() {
    const { options } = this.props;
    const { value } = this.state;

    return (
      <DropdownField
        options={options}
        onChange={this.getSortedValue}
        placeholder="Sort by price"
        value={value}
        noBorder
        className="car-sort-by-price"
        searchable={false}
      />
    );
  }
}

SortCarsListByPrice.props = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired
};

SortCarsListByPrice.defaultProps = {
  options: [
    { label: "Price High to Low", value: HIGH_TO_LOW },
    { label: "Price Low to High", value: LOW_TO_HIGH }
  ]
};

export default SortCarsListByPrice;
