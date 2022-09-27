import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import RadioButtonGroup from 'components/Forms/RadioButtonGroup';
import { getVehicleKinds } from './helpers';
import memoizeOne from 'memoize-one';

class MarketPlaceBodyStyle extends React.Component {
  getOptions = memoizeOne(car_details => {
    const results = get(car_details.data, 'vehicle_list.results', []);

    const kinds = getVehicleKinds(results);

    return uniqBy(kinds, kind => kind.body_style_id).map(bodyStyle => ({
      value: bodyStyle.body_style_id,
      label: bodyStyle.body_style,
      trim_id: bodyStyle.trim_id
    }));
  });

  handleChange = bodyStyleId => {
    const {
      car_details,
      history,
      match: { params }
    } = this.props;

    const options = this.getOptions(car_details);
    const selectedOption = options.find(option => option.value == bodyStyleId);

    history.replace({
      pathname: `/shopping/vehicle-details/${selectedOption.trim_id}/${bodyStyleId}/${params.color_code}`,
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

    const options = this.getOptions(car_details);

    if (options.length > 1)
      return (
        <RadioButtonGroup
          options={options}
          value={params.body_style_id}
          onChange={this.handleChange}
          size="small"
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

export default withRouter(connect(mapStateToProps)(MarketPlaceBodyStyle));
