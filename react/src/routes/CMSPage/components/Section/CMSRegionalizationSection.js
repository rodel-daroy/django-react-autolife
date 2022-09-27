import React from 'react';
import CMSRegionDropdown from './CMSRegionDropdown'
export default class CMSRegionalizationSection extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div className="col-sm-4 col-md-6">
        <section className="col-sm-12 bordered-column">
          <h4 className="column-heading">Regionalization</h4>
          <CMSRegionDropdown country = {this.props.country} state = {this.props.state} />
        </section>
      </div>
    );
  }
}
