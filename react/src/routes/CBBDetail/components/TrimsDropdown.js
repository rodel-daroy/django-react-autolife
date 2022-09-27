import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DropdownField from 'components/Forms/DropdownField';
import get from 'lodash/get';
import { getVehicleKinds } from './helpers';

class TrimsDropdown extends React.Component {
  handleDropdown = ({ value: trim_id }) => {
    const {
      history,
      match: { params }
    } = this.props;

    history.replace({
      pathname: `/shopping/vehicle-details/${trim_id}/${params.body_style_id}/${
        params.color_code !== undefined ? params.color_code : ''
      }`,
      state: {
        changeKind: true
      }
    });
  };

  render() {
    const {
      car_details,
      match: { params }
    } = this.props;
    const { trim_id, body_style_id } = params;

    const results = get(car_details.data, 'vehicle_list.results', []);

    const kinds = getVehicleKinds(results);

    const options = kinds
      .filter(kind => kind.body_style_id == body_style_id)
      .map(kind => ({
        label: kind.trim_name,
        value: kind.trim_id.toString()
      }));

    if (options.length > 0)
      return (
        <DropdownField
          className="trims-dropdown"
          size="medium"
          options={options}
          value={trim_id}
          onChange={this.handleDropdown}
          noBorder
        />
      );

    return null;
  }
}

function mapStateToProps(state) {
  return {
    car_details: state.MarketPlace.carDetails
  };
}

export default withRouter(connect(mapStateToProps)(TrimsDropdown));
