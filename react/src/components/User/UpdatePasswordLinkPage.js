import React, { Component, Fragment } from "react";
import ResponsiveModal from "../common/ResponsiveModal";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import image from "../../styles/img/signin/Email_tick.svg";
import omit from "lodash/omit";
import { closeModal } from "../../redux/actions/userContainerActions";

class UpdatePasswordLinkPage extends Component {
  handleClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  responseData = resetData => {
    if (resetData.status === 200) {
      return (
        <Fragment>
          <h2>Password Reset</h2>
          <p>
            We've sent password reset instructions to your email. <br />
            Check your inbox and follow the link.
          </p>
          <p className="reset-email">
            {resetData ? resetData.data && resetData.data.email : ""}
          </p>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <h2>{resetData.message}</h2>
      </Fragment>
    );
  };

  render() {
    const { resetData } = this.props;
    console.log(this.props, "resetData");
    return (
      <ResponsiveModal
        className="reset-password-modal"
        onClose={this.handleClose}
      >
        <ResponsiveModal.Block>
          <div className="reset-password">
            <div className="reset-password-inner">
              <div className="reset-password-img">
                <img src={image} />
              </div>

              {this.responseData(resetData)}
            </div>
          </div>
        </ResponsiveModal.Block>
      </ResponsiveModal>
    );
  }
}

function mapStateToProps(state) {
  return {
    resetData: state.user.resetData
  };
}

const mapDispatchToProps = {
  closeModal
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UpdatePasswordLinkPage)
);
