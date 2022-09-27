import React from "react";
import { Field } from "redux-form";
import { connect } from "react-redux";
import {
  TagInputNumber,
  RFTextField,
  TagRenderSelectListField
} from "../RFInputField";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import get from "lodash/get";

import { getTemplateLocationList } from "../../../../redux/actions/contentTabActions";
import {
  postAdData,
  postAdDetete
} from "../../../../redux/actions/CMSPageAction";

class AddsSection extends React.Component {
  constructor(props) {
    super(props);
    this.recordValues = {
      adName: "",
      adLocation: "",
      adDescription: ""
    };
    this.state = {
      adAdDetails: []
    };
    this.deleteAdFromList = this.deleteAdFromList.bind(this);
    this.loadData = false;
  }

  componentDidMount() {
    this.props.getTemplateLocationList();
  }

  componentDidUpdate() {
    const { ads } = this.props;
    if (!this.loadData && ads && ads.length > 0) {
      this.setState({ adAdDetails: ads });
      this.loadData = true;
    }
  }

  changeAdName = e => {
    this.recordValues.adName = e.target.value;
  };

  selectTemplateLocation = e => {
    this.recordValues.adLocation = e.target.value;
  };

  AdDescription = e => {
    this.recordValues.adDescription = e.target.value;
  };
  checkLocationExist = () => {
    const { adAdDetails } = this.state;
    for (var row = 0; row < adAdDetails.length; row++) {
      if (adAdDetails[row].location === this.recordValues.adLocation) {
        return true;
      }
    }
    return false;
  };
  addAdDetails = () => {
    var errorMessage = false;
    if (this.recordValues.adNam === "") {
      errorMessage = "Please enter AD name";
    } else if (this.recordValues.adLocation === "") {
      errorMessage = "Please select template location";
    } else if (this.recordValues.adDescription === "") {
      errorMessage = "Please add script";
    } else if (this.checkLocationExist()) {
      errorMessage = "Template Location has been already used";
    }
    if (errorMessage) {
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      /*this.state.adAdDetails.push({
              name: this.recordValues.adName,
              location: this.recordValues.adLocation,
              script: this.recordValues.adDescription
          })
          this.setState({
              adAdDetails: this.state.adAdDetails
          })*/
      const values = {
        name: this.recordValues.adName,
        location: this.recordValues.adLocation,
        script: this.recordValues.adDescription
      };
      this.props
        .postAdData(
          this.props.params.id,
          values,
          get(this.props, "user.authUser.accessToken")
        )
        .then(data => {
          if (data.status === 200) {
            toast.success("Ad has been added successfully", {
              position: toast.POSITION.BOTTOM_RIGHT
            });
            this.setState({
              adAdDetails: data.data
            });
            this.props.getAdId(this.state.adAdDetails);
          }
        });
    }
  };

  trasAd = index => {
    this.props.postAdDetete(
      this.state.adAdDetails[index]["id"],
      get(this.props, "user.authUser.accessToken")
    );
    this.state.adAdDetails.splice(index, 1);
    this.setState({
      adAdDetails: this.state.adAdDetails
    });
    toast.success("Ad has been trashed successfully", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };

  deleteAdFromList = index => {
    confirmAlert({
      title: " ",
      message: "Are you sure, you want to trash Ad from the list.?",
      confirmLabel: "Ok",
      cancelLabel: "Cancel",
      onConfirm: () => {
        this.trasAd(index);
      }
    });
  };

  render() {
    const { currentConfigValues } = this.props;
    var objectKeysData = [];
    if (currentConfigValues) {
      objectKeysData = Object.keys(currentConfigValues);
    }
    return (
      <div className="row">
        <div className="col-sm-10 col-sm-offset-1 bordered-column">
          <h4 className="column-heading">ADS</h4>
          <div className="form-group add-block">
            <div className="col-xs-12 col-sm-4">
              <div className="row">
                <label className="control-label col-sm-5">AD Name</label>
                <div className="col-sm-7">
                  <Field
                    component={TagInputNumber}
                    id="ad_name"
                    name="ad_name"
                    type="text"
                    onChange={this.changeAdName}
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-3">
              <Field
                name="template_list"
                component={TagRenderSelectListField}
                empty="Template Locations"
                selectLists={currentConfigValues}
                contentType="ads"
                onChange={this.selectTemplateLocation}
              />
            </div>
            <div className="col-xs-10 col-sm-4">
              <Field
                component={RFTextField}
                id="ad_description"
                name="ad_description"
                rows="2"
                onChange={this.AdDescription}
              />
            </div>
            <div
              className="col-xs-2 col-sm-1 fa-icon cursor-pointer"
              onClick={this.addAdDetails}
            >
              <i className="fa fa-plus" />
            </div>
            <div className="col-xs-12 col-sm-12">
              <br />
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-5 table-responsive">
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>AD Name</th>
                    <th>Template Location</th>
                    <th />
                  </tr>
                  {this.state.adAdDetails
                    ? this.state.adAdDetails.map((data, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{data.name}</td>
                          <td>{data.location}</td>
                          <td
                            className="cursor-pointer"
                            onClick={() => {
                              this.deleteAdFromList(i);
                            }}
                          >
                            <i className="fa fa-trash" />
                          </td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>
            <div className="col-sm-6 col-md-offset-1 col-md-5">
              <section
                className="col-sm-12 bordered-column info"
                style={{ marginTop: "20px" }}
              >
                <h4 className="column-heading">Note</h4>
                <p style={{ fontWeight: "400" }}>
                  The template you selected has asset spots for
                </p>
                <br />
                {objectKeysData.map(index => {
                  if (
                    !currentConfigValues[index].disable &&
                    currentConfigValues[index].type === "ads"
                  ) {
                    return (
                      <p key={index}>{currentConfigValues[index].label}</p>
                    );
                  }
                })}
              </section>
            </div>
            <div className="col-sm-12">
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    templateLocationList: state.CMSContentDetails.templateLocationList,
    user: state.user
  };
}

const mapDispatchToProps = {
  getTemplateLocationList,
  postAdData,
  postAdDetete
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddsSection);
