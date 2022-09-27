import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ResponsiveModal from "../common/ResponsiveModal";
import PrimaryButton from "../Forms/PrimaryButton";
import Commands from "../common/Commands";
import omit from "lodash/omit";
import get from "lodash/get";
import { logoutUser } from "../../redux/actions/userActions";
import { closeModal } from "../../redux/actions/userContainerActions";
import { getHomePageTiles } from "../../redux/actions/homeActions";
import loadingGif from "../../loading.gif";

class SignOutModal extends Component {
  state = {
    loading: false
  };

  handleSignOut = async () => {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({
      loading: true
    });
    const {
      logoutUser,
      getHomePageTiles,
      closeModal,
      accessToken,
      history: { push }
    } = this.props;
    await logoutUser(accessToken);
    await getHomePageTiles();
    this.setState({
      loading: false
    });
    await push("/");
    closeModal();
  };

  handleCancel = () => {
    const { history, location, closeModal } = this.props;

    const newLocation = {
      ...location,
      query: omit(location.search, ["signout"])
    };

    history.push(newLocation);
    closeModal();
  };

  render() {
    const { loading } = this.state;
    return (
      <ResponsiveModal
        className="sign-out-modal"
        onClose={this.handleCancel}
        showClose={false}
      >
        <ResponsiveModal.Block position="top" className="text-center">
          <p>Are you sure you want to sign out?</p>
        </ResponsiveModal.Block>

        <ResponsiveModal.Block position="bottom" grey>
          {loading ? (
            <React.Fragment>
              <img src={loadingGif} alt="loading" width="50" height="50" />
              <React.Fragment>Signing Out...</React.Fragment>
            </React.Fragment>
          ) : (
            <Commands>
              <button
                type="button"
                className="btn btn-link"
                onClick={this.handleCancel}
              >
                <span className="icon icon-x" /> Cancel
              </button>
              <PrimaryButton onClick={this.handleSignOut}>
                Sign out
              </PrimaryButton>
            </Commands>
          )}
        </ResponsiveModal.Block>
      </ResponsiveModal>
    );
  }
}

function mapStateToProps(state) {
  const accessToken = get(state, "user.authUser.accessToken");

  return {
    accessToken
  };
}

const mapDispatchToProps = {
  logoutUser,
  getHomePageTiles,
  closeModal
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignOutModal)
);
