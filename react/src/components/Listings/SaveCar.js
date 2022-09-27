import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  saveVehicle,
  unSaveVehicle,
  postSearch
} from "redux/actions/marketPlaceActions";
import { showNotification } from "redux/actions/notificationAction";
import { modalSignIn } from "redux/actions/userContainerActions";
import { accessToken } from "redux/selectors/userSelectors";

class SaveCar extends Component {
  doSaveVehicle = trimId => {
    const {
      accessToken,
      onSave,
      saveVehicle,
      showNotification,
      section
    } = this.props;

    if (accessToken) {
      const browse_section = section === 'browse';
      const shop_section = section === 'shop';

      saveVehicle(trimId, accessToken, browse_section, shop_section).then(
        data => {
          if (data.status === 200 && onSave) {
            onSave();

            showNotification({
              message: "This car has been saved"
            });
          }
        }
      );

      return true;
    } else return false;
  };

  saveVehicle = () => {
    const { trimId, onNotLoggedIn, modalSignIn } = this.props;

    if (!this.doSaveVehicle(trimId)) {
      if (onNotLoggedIn) onNotLoggedIn();
      else {
        modalSignIn();
      }
    }
  };

  unsaveVehicle = () => {
    const {
      trimId,
      accessToken,
      unSaveVehicle,
      showNotification,
      onUnsave,
      section
    } = this.props;
    
    if (accessToken) {
      const browse_section = section === 'browse';
      const shop_section = section === 'shop';

      unSaveVehicle(trimId, accessToken, browse_section, shop_section).then(
        data => {
          if (data.status === 200) {
            showNotification({
              message: "Car unsaved"
            });
            if (onUnsave) onUnsave();
          }
        }
      );
    }
  };

  render() {
    const { children, saved, className } = this.props;

    if (children) {
      return children({
        handleSave: this.saveVehicle,
        handleUnsave: this.unsaveVehicle,
        saved,
        className
      });
    }
    return null;
  }
}

SaveCar.propTypes = {
  trimId: PropTypes.number,
  onSave: PropTypes.func,
  onUnsave: PropTypes.func,
  onNotLoggedIn: PropTypes.func,
  children: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  className: PropTypes.string,
  section: PropTypes.oneOf(['shop', 'browse']).isRequired,

  location: PropTypes.object.isRequired
};

SaveCar.defaultProps = {
  children: ({ handleSave, handleUnsave, saved, className }) => {
    if (saved) {
      return (
        <button
          className={`btn btn-link icon-button large ${className || ""}`}
          onClick={handleUnsave}
        >
          <span className="icon icon-heart" /> Unsave
        </button>
      );
    } else {
      return (
        <button
          className={`btn btn-link icon-button large ${className || ""}`}
          onClick={handleSave}
        >
          <span className="icon icon-heart-empty" /> Save
        </button>
      );
    }
  }
};

function mapStateToProps(state) {
  return {
    accessToken: accessToken(state)
  };
}

const mapDispatchToProps = {
  saveVehicle,
  unSaveVehicle,
  postSearch,
  showNotification,
  modalSignIn
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SaveCar)
);
