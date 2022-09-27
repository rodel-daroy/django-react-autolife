import React, { Component } from "react";
import { connect } from "react-redux";
import PrimaryButton from "../Forms/PrimaryButton";
import ResponsiveModal from "components/common/ResponsiveModal";
import { modalSignIn, closeModal } from "redux/actions/userContainerActions";
import { logoutUser,emptyUserMessage } from "redux/actions/userActions";

class Unauthorized extends Component {
  componentDidMount() {
    this.props.logoutUser();
  }
  handleClose = () => {
    this.props.emptyUserMessage()
    this.props.closeModal();
  };
  handleSingin = () => {
    this.props.modalSignIn();
  };
  render() {
    return (
      <ResponsiveModal onClose={this.handleClose} fullScreenMobile>
        <ResponsiveModal.Block>
          <div className="sign-up">
            <div className="sign-up-inner">
              <h6 style={{ fontSize: "12px" }}>
                Your Session has expired. Please log in again
              </h6>
              <PrimaryButton onClick={this.handleClose}>Cancel</PrimaryButton>
              <PrimaryButton onClick={this.handleSingin}>Singin</PrimaryButton>
            </div>
          </div>
        </ResponsiveModal.Block>
      </ResponsiveModal>
    );
  }
}

const mapDispatchToProps = {
  modalSignIn,
  logoutUser,
  closeModal,
  emptyUserMessage
};

export default connect(
  null,
  mapDispatchToProps
)(Unauthorized);
