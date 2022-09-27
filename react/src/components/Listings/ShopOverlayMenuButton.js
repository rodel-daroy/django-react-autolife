import React, { Component } from "react";
import TreeNav from "components/Navigation/TreeNav";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ExpandButton from "components/Forms/ExpandButton";
import OverlayMenu from "components/common/OverlayMenu";
import { getCarDetails } from "redux/actions/marketPlaceActions";
import get from "lodash/get";
import { accessToken } from "redux/selectors/userSelectors";

class ShopOverlayMenuButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      expandedBodyStyleId: props.carDetails
        ? props.carDetails.body_style_id
        : null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { carDetails } = this.props;

    if (carDetails !== nextProps.carDetails) {
      this.setState({
        expandedBodyStyleId: nextProps.carDetails
          ? nextProps.carDetails.body_style_id
          : null
      });
    }
  }

  handleToggle = () => {
    this.setState({
      showMenu: !this.state.showMenu
    });
  };

  handleExpandCategory = category => {
    this.setState({
      expandedBodyStyleId: category ? category.id : null
    });
  };

  handleChange = (category, subCategory) => {
    const { carDetails, getCarDetails, accessToken } = this.props;

    const results = get(
      carDetails,
      "vehicle_list.results",
      []
    );
    console.log(results, "resultssss")

    const bodyStyleId = category.id;
    let vehicle_id = subCategory ? subCategory.id : null;
    // let color_code =
    if (vehicle_id == null)
      for (let data of results) {
        if (
          data.body_style_id == bodyStyleId &&
          data.vehicles &&
          data.vehicles.length > 0
        ) {
          vehicle_id = data.vehicles[0].vehicle_id;

          break;
        }
      }

    getCarDetails({
      trim_id: vehicle_id, 
      body_style_id: bodyStyleId, 
      token: accessToken
    }).then(data => {
      this.props.history.push(
        `/shopping/vehicle-details/${vehicle_id}/${bodyStyleId}`
      );
    });

    this.setState({
      showMenu: false
    });
  };

  getCategories() {
    const { carDetails } = this.props;

    const bodyStyles = get(carDetails, "vehicle_list.results", []);

    const categories = bodyStyles.map((style, i) => {
      const subCategories = (style.vehicles || []).map((trim, i) => ({
        id: trim.vehicle_id,
        name: trim.trim_name !== "-" ? trim.trim_name : "Base"
      }));

      return {
        id: style.body_style_id,
        name: style.body_style,

        subCategories
      };
    });

    return categories;
  }

  renderMenu(categories) {
    const { expandedBodyStyleId } = this.state;
    const { carDetails } = this.props;

    const activeCategoryId = carDetails.body_style_id;
    const activeSubCategoryId = carDetails.vehicle_id;

    return (
      <TreeNav
        categories={categories}
        expandedCategoryId={expandedBodyStyleId}
        onExpandCategory={this.handleExpandCategory}
        onChange={this.handleChange}
        activeCategoryId={activeCategoryId}
        activeSubCategoryId={activeSubCategoryId}
        dark
      />
    );
  }

  render() {
    const { showMenu } = this.state;

    const categories = this.getCategories();

    const kindCount = categories.reduce(
      (prev, cur) => prev + cur.subCategories.length + 1,
      0
    );

    if (kindCount > 1) {
      return (
        <div className="shop-overlay-menu">
          <button
            type="button"
            className="btn btn-link categories-menu-button"
            onClick={this.handleToggle}
          >
            See More Trims &amp; Models <ExpandButton component="div" />
          </button>

          {showMenu && (
            <OverlayMenu
              className="browse-categories-menu"
              onClose={this.handleToggle}
            >
              {this.renderMenu(categories)}
            </OverlayMenu>
          )}
        </div>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  return {
    accessToken: accessToken(state),
    carDetails: state.MarketPlace.carDetails.data
  };
}

const mapDispatchToProps = {
  getCarDetails
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ShopOverlayMenuButton)
);
