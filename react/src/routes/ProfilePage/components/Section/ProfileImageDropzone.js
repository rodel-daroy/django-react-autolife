import Dropzone from "react-dropzone";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PrimaryButton from "../../../../components/Forms/PrimaryButton";
import { postImageUpload } from "../../../../redux/actions/profileActions";
import Spinner from "../../../../components/common/Spinner";
import get from "lodash/get";
import { showNotification } from "../../../../redux/actions/notificationAction";
import ObjectFit from "../../../../components/common/ObjectFit";

class renderDropzoneInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true
    };
  }

  uploadImage = acceptedFiles => {
    const { showNotification } = this.props;

    const formData = new FormData();
    let fileSize = "";
    acceptedFiles.forEach(file => {
      formData.append("file", file);
      fileSize = file.size;
    });
    this.setState({
      loaded: false
    });
    if (fileSize <= 1024 * 1024) {
      this.props
        .postImageUpload(formData, get(this.props, "user.authUser.accessToken"))
        .then(data => {
          if (data.type === "profile/POST_IMAGE_UPLOAD_SUCCESSFUL") {
            showNotification({
              message: "Profile image uploaded successfully"
            });
            this.setState({
              loaded: true
            });
            this.props.input.onChange(data.payload);
          }
        });
    } else {
      showNotification({
        message: "Image size should be less than or equal to 1mb",
        type: "ERROR"
      });
      this.setState({
        loaded: true
      });
    }
  };

  render() {
    const {
      input: { value }
    } = this.props;

    let loadingSpinner = null;
    if (!this.state.loaded) {
      loadingSpinner = <Spinner />;
    }
    return (
      <div className="profile-image">
        <Dropzone onDrop={this.uploadImage} className="dropzone">
          <div className="profile-image-inner">
            <ObjectFit>
              {value ? (
                <img src={value} alt="" />
              ) : (
                <img alt="" src={require("../../../../styles/img/user.jpg")} />
              )}
            </ObjectFit>

            {loadingSpinner}
          </div>

          <PrimaryButton>+ Upload new picture</PrimaryButton>
        </Dropzone>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
const mapDispatchToProps = {
  postImageUpload,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(renderDropzoneInput);
