import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { closeInfoModal } from "../../../redux/actions/infoModalActions";
import ResponsiveModal from "../../common/ResponsiveModal";

const InfoModal = ({ title, content = "content", isOpen, closeModal }) =>
  isOpen && (
    <ResponsiveModal
      className="info-modal"
      onClose={closeModal}
      showClose={true}
    >
      <ResponsiveModal.Block position="header">
        {title && <h1>{title}</h1>}
        {typeof content === "string" && <p>{content}</p>}
        {typeof content !== "string" && content}
      </ResponsiveModal.Block>
    </ResponsiveModal>
  );

export default connect(
  (state, ownProps) => ({
    title: state.infoModal.title,
    content: state.infoModal.content,
    isOpen: state.infoModal.isOpen
  }),
  dispatch => ({
    closeModal: () => dispatch(closeInfoModal())
  })
)(InfoModal);
