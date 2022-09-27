import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { profileLinks } from "config/constants";
import Accordion from "components/common/Accordion";
// import get from "lodash/get";
import ObjectFit from "components/common/ObjectFit";
import { modalSignOut } from "redux/actions/userContainerActions";

class Dropdown extends Component {
  handleClickOutside = e => {
    const { onClose } = this.props;

    if (onClose) onClose(e);
  };

  handleLink = () => {
    this.handleClickOutside(null);
    // localStorage.clear();
  };

  openSignOutModal = () => {
    this.props.modalSignOut();
  };

  render() {
    const { show } = this.props;

    return (
      <div className={`nav-dropdown ${show ? "visible" : ""}`} role="menu">
        <ul className={`nav-dropdown-links ${show ? "visible" : ""}`}>
          {profileLinks.map((link, i) => (
            <li key={i}>
              <Link
                to={link.route}
                className="btn btn-link"
                onClick={this.handleLink}
                role="menuitem"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li role="separator" />
          <li>
            <button className="btn btn-link logout-button" onClick={this.openSignOutModal}>
              <span className="icon icon-logout" /> Sign out
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  show: PropTypes.bool,
  logoutUser: PropTypes.func,
  onClose: PropTypes.func
};
const mapDispatchToProps = {
  modalSignOut
};

const DesktopDropdown = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(onClickOutside(Dropdown))
);

Dropdown = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Dropdown)
);

class ProfileView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false
    };
  }

  toggleDropdown = e => {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  };

  hideDropdown = e => {
    if (!e || !this._button.contains(e.target))
      this.setState({
        showDropdown: false
      });
  };

  renderMobile = (user_details, profileImage) => {
    const { showDropdown } = this.state;

    return (
      <Accordion open={showDropdown} className="profile-accordion">
        <Accordion.Header
          icon={null}
          open={showDropdown}
          onOpen={() => this.setState({ showDropdown: true })}
          onClose={() => this.setState({ showDropdown: false })}
        >
          <ul className="nav-links">
            <li>
              <div
                className={`btn btn-link primary-link has-dropdown ${
                  showDropdown ? "dropdown-visible" : ""
                }`}
              >
                <div className="profile-avatar">
                  <ObjectFit>
                    <img src={profileImage} />
                  </ObjectFit>
                </div>
                <span className="link-text">
                  {user_details.first_name} {user_details.last_name}
                </span>
                <span className="icon icon-angle-down" aria-hidden="true" />
              </div>
            </li>
          </ul>
        </Accordion.Header>

        <Accordion.Body open={showDropdown}>
          <Dropdown show />
        </Accordion.Body>
      </Accordion>
    );
  };

  render() {
    const { user, location, mobile } = this.props;
    const { showDropdown } = this.state;
    let name = "";
    let profileImage = require("../../../../styles/img/user.jpg");
    console.log(this.props.location.pathname.split("/")[3], "edit-props");
    const user_details = user && user.user && user.user.user_details;
    if (user_details && user_details) {
      name = `${user_details.first_name} ${user_details.last_name}`;
      profileImage = user_details.avatar_url || profileImage;
    }

    let { animationRef } = this.props;

    animationRef = animationRef || ((ref, i) => {});
    const content_id = this.props.location.pathname.split("/")[3];

    console.log(content_id, "id");

    // const new_location = location
    //   ? location.pathname
    //     ? location.pathname
    //     : ""
    //   : "";
    if (mobile) return this.renderMobile(user_details, profileImage);
    else
      return (
        <div className="main-subheader-content">
          <div ref={ref => animationRef(ref, 0)}>
            Join the millions of Canadian drivers like you!
          </div>
          {this.props.location.pathname === `/content/preview/${content_id}` ? (
            <Link to={`/page/` + content_id}>
              <div ref={ref => animationRef(ref, 0)} className="backBtn">
                EDIT MODE
              </div>
            </Link>
          ) : (
            ""
          )}

          <div ref={ref => animationRef(ref, 1, 1)}>
            <ul className="nav-links">
              {user_details && (
                <li>
                  <button
                    ref={ref => (this._button = ref)}
                    className={`btn btn-link has-dropdown ${
                      showDropdown ? "dropdown-visible" : ""
                    }`}
                    type="button"
                    onClick={this.toggleDropdown}
                    aria-haspopup="menu"
                  >
                    <div className="profile-avatar">
                      <ObjectFit>
                        <img src={profileImage} />
                      </ObjectFit>
                    </div>
                    <span className="link-text">{name}</span>
                    <span className="icon icon-angle-down" aria-hidden="true" />
                  </button>

                  <DesktopDropdown
                    eventTypes="click"
                    show={showDropdown}
                    onClose={this.hideDropdown}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.authUser,
    logout: state.user.logout
  };
}

export const Profile = withRouter(
  connect(
    mapStateToProps,
    null
  )(ProfileView)
);
