import React from "react";
import { connect } from "react-redux";
import CBBIncentivesTab from "./CbbTabs/CBBIncentivesTab";
import CBBSpecificationTab from "./CbbTabs/CBBSpecificationTab";
import CBBWarrantyTab from "./CbbTabs/CBBWarrantyTab";
import TabSet from "components/Navigation/TabSet";
import incentiveIcon from "styles/img/listings/incentive-small.svg";
import { getCarSpecification } from "redux/actions/marketPlaceActions";

class CbbSpecificationTabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true
    };
  }

  render() {
    const { carDetails, carByTrims } = this.props;

    const tabs = [
      {
        caption: (
          <div className="shop-details-incentive-tab">
            <div className="incentive-icon">
              <img src={incentiveIcon} width="16" />
            </div>
            Incentives
          </div>
        ),
        content: () => (
          <CBBIncentivesTab
            onUpdated={this.props.onUpdated}
          />
        )
      },
      {
        caption: "Specifications",
        content: () => (
          <CBBSpecificationTab
            carDetails={carDetails}
            trimValue={this.props.trimValue}
            carByTrims={carByTrims}
            loaded={this.state.loaded}
          />
        )
      },
      {
        caption: "Warranty",
        content: () => <CBBWarrantyTab />
      }
    ];

    return (
      <TabSet
        name="shop-details-specs"
        tabs={tabs}
        className="shop-details-specs"
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    carSpecs: state.MarketPlace.carSpecs
  };
}

const mapDispatchToProps = {
  getCarSpecification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CbbSpecificationTabView);
