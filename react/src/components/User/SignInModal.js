import React, { Component } from "react";
import ResponsiveModal from "components/common/ResponsiveModal";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PrimaryButton from "components/Forms/PrimaryButton";
import Logo from "components/common/Logo";
import Media from "react-media";
import { mediaQuery } from "utils/style";
import { getHomePageTiles } from "redux/actions/homeActions";
import { closeModal } from "redux/actions/userContainerActions";
import {
  resetErrorMessage,
  authenticateUser,
  emptyUserMessage
} from "redux/actions/userActions";

class SignInModal extends Component {
  constructor(props) {
    super(props);
    this.props.resetErrorMessage();
    this.state = {
      loading: false
    };
  }

  submitLoginForm = values => {
    const { authenticateUser, location } = this.props;
    let postData = {
      email: values.email,
      password: values.password
    };

    authenticateUser(postData, location.search || "/").then(data => {
      if (data.status === 200) {
        this.setState({
          loading: true
        });
        const { getHomePageTiles, closeModal } = this.props;
        getHomePageTiles(data.data.token).then(data => {
          this.setState({
            loading: true
          });
          if (data.status === 200) {
            this.setState({
              loading: false
            });
            closeModal();
          }
        });
      }
    });
  };

  handleClose = () => {
    this.props.closeModal();
    this.props.emptyUserMessage();
  };

  render() {
    const { loading } = this.state;
    return (
      <ResponsiveModal
        onClose={this.handleClose}
        className="sign-in-modal"
        fullScreenMobile
      >
        <div className="sign-in">
          <ResponsiveModal.Block position="left">
            <LoginForm
              onSubmit={this.submitLoginForm}
              newProps={this.props}
              loading={loading}
            />
          </ResponsiveModal.Block>

          <Media query={mediaQuery("xs sm")}>
            {matches => (
              <ResponsiveModal.Block
                grey
                position={matches ? "bottom" : "right"}
              >
                <div className="sign-up">
                  <div className="sign-up-inner">
                    <Logo kind="Symbol-Colour" noLink />

                    <h2>Not a Member?</h2>
                    <p>Join the millions of Canadian drivers like you</p>
                    <PrimaryButton
                      link="?register"
                      onClick={this.props.closeModal}
                    >
                      Sign Up <span className="icon icon-angle-right" />
                    </PrimaryButton>
                  </div>
                </div>
              </ResponsiveModal.Block>
            )}
          </Media>
        </div>
      </ResponsiveModal>
    );
  }
}

const mapDispatchToProps = {
  resetErrorMessage,
  authenticateUser,
  getHomePageTiles,
  closeModal,
  emptyUserMessage
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(SignInModal)
);
