import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import startCase from "lodash/startCase";
import PrimaryButton from "components/Forms/PrimaryButton";
import SaveCar from "./SaveCar";
import { Link, withRouter } from "react-router-dom";
import CarName from "./CarName";
import CarPrice from "./CarPrice";
import { connect } from "react-redux";
import { modalSignIn } from "redux/actions/userContainerActions";

class CarListingRollover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSaved: false,
      showRegister: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { active } = this.props;
    const { showRegister, showSaved } = this.state;

    if (prevProps.active !== active) {
      clearTimeout(this._activeTimeout);

      this._activeTimeout = setTimeout(() => {
        this.setState({
          showSaved: false,
          showRegister: false
        });
      }, 500);
    }

    if (showSaved && !prevState.showSaved)
      ReactDOM.findDOMNode(this._manage).focus();
    if (showRegister && !prevState.showRegister)
      ReactDOM.findDOMNode(this._signin).focus();
  }

  componentWillUnmount() {
    clearTimeout(this._activeTimeout);
  }

  renderStat(label, value, i) {
    if (value !== null) {
      if (value instanceof Array)
        value = value.map((item, j) => <p key={j}>{item}</p>);

      return (
        <li key={i}>
          <div className="car-listing-stat-label">{startCase(label)}</div>
          <div className="car-listing-stat-value">{value}</div>
        </li>
      );
    } else return null;
  }

  renderSaveCar = ({ handleSave, handleUnsave, saved }) => {
    const onClick = e => {
      e.stopPropagation();

      if (saved) handleUnsave();
      else handleSave();
    };

    return (
      <button
        type="button"
        className="btn btn-link icon-button large"
        onClick={onClick}
      >
        {saved && saved ? (
          <div>
            <span className="icon icon-heart" /> Unsave
          </div>
        ) : (
          <div>
            <span className="icon icon-heart-empty" /> Save
          </div>
        )}
        {/* {!saved && (
          <div>
            <span className="icon icon-heart-empty" /> Save
          </div>
        )}

        {saved && (
          <div>
            <span className="icon icon-heart" /> Unsave
          </div>
        )} */}
      </button>
    );
  };

  handleNotLoggedIn = () => {
    this.setState({
      showRegister: true
    });
  };

  handleSaved = () => {
    const { onSave } = this.props;
    this.setState({
      showSaved: true
    });
    if (onSave) onSave();
  };

  handleViewClick = e => {
    const { onView } = this.props;

    e.stopPropagation();
    if(onView) onView();
  }

  renderStats() {
    const { saved, trimId, onUnsave, section } = this.props;

    const stats = Object.assign({}, this.props.stats);

    return (
      <div className="car-listing-stats">
        <ul>
          {Object.keys(stats)
            .sort()
            .map((key, i) => this.renderStat(key, stats[key], i))}
        </ul>

        <nav>
          <ul className="commands">
            <li>
              <PrimaryButton className="first" size="medium" onClick={this.handleViewClick}>
                View Listing <span className="icon icon-angle-right" />
              </PrimaryButton>
            </li>
            <li>
              <SaveCar
                trimId={trimId}
                saved={saved}
                onNotLoggedIn={this.handleNotLoggedIn}
                onSave={this.handleSaved}
                onUnsave={onUnsave}
                section={section}
                className="last">

                {this.renderSaveCar}
              </SaveCar>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

  renderSaved() {
    return (
      <div className="car-listing-save">
        <div className="car-listing-save-text saved">
          <div className="car-listing-save-icon">
            <span className="icon icon-circle-tick" />
          </div>

          <p>This vehicle has been saved to your profile</p>
        </div>

        <div className="car-listing-save-foot">
          You can{" "}
          <Link
            ref={ref => (this._manage = ref)}
            className="primary-link"
            onClick={e => e.stopPropagation()}
            to="/profile"
          >
            Manage Your Profile
          </Link>{" "}
          at any time.
        </div>
      </div>
    );
  }

  renderRegister() {
    return (
      <div className="car-listing-save">
        <div className="car-listing-save-text register">
          <div className="car-listing-save-icon">
            <span className="icon icon-user-warning" />
          </div>

          <p>
            <Link
              ref={ref => (this._signin = ref)}
              className="btn-link primary-link"
              onClick={e => e.stopPropagation()}
              to="?signin"
            >
              Signin
            </Link>{" "}
            or{" "}
            <Link
              className="btn-link primary-link"
              onClick={e => e.stopPropagation()}
              to="?register"
            >
              Register
            </Link>{" "}
            to save this vehicle.
          </p>
        </div>
      </div>
    );
  }

  renderName() {
    const { make, model } = this.props;

    return (
      <div className="car-listing-name">
        {make} {model}
      </div>
    );
  }

  render() {
    const { active } = this.props;
    const { showRegister, showSaved } = this.state;

    let body = null;
    if (showRegister) body = this.renderRegister();
    else {
      if (showSaved) body = this.renderSaved();
      else body = this.renderStats();
    }

    return (
      <div className={`car-listing-rollover ${active ? "active" : ""}`}>
        <header className="car-listing-rollover-head">
          {this.renderName()}

          <CarPrice {...this.props} />
        </header>

        <div className="car-listing-rollover-body">{body}</div>
      </div>
    );
  }
}

CarListingRollover.propTypes = {
  ...CarName.propTypes,
  ...CarPrice.propTypes,

  stats: PropTypes.object,
  onView: PropTypes.func,
  onSave: PropTypes.func,
  active: PropTypes.bool,
  saved: PropTypes.bool,
  trimId: PropTypes.number,
  section: PropTypes.oneOf(['shop', 'browse']).isRequired
};

const mapDispatchToProps = {
  modalSignIn
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(CarListingRollover)
);
