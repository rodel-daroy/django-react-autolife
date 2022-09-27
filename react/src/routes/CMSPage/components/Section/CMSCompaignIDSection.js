import React from "react";
import { Field } from "redux-form";
import { connect } from "react-redux";
import { TagRenderSelectField } from "../RFInputField";
import get from "lodash/get";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { sortListByAlphabetsOrder } from "../../../../utils/sort";
import { getCampaignList } from "../../../../redux/actions/editorialCmsActions";

class CMSCompaignIDSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: []
    };
    this.currentValue = "";
    this.loadData = false;
  }
  componentWillMount() {
    this.props.getCampaignList(get(this.props, "user.authUser.accessToken"));
  }
  componentDidUpdate() {
    var { campaigns } = this.props;
    if (!this.loadData && campaigns.length > 0) {
      this.loadData = true;
      this.setState({ campaigns: campaigns });
    }
  }
  addCampaign = () => {
    if (this.currentValue === "") {
      toast.error("Please select campaign", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (
      this.state.campaigns.indexOf(parseInt(this.currentValue)) !== -1
    ) {
      toast.error("This campaign has been already selected", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      var { campaigns } = this.state;
      campaigns.push(parseInt(this.currentValue));
      this.setState({ campaigns: campaigns });
      this.props.setCampaigns(campaigns);
    }
  };
  onChangeSelect = e => {
    this.currentValue = e.target.value;
  };
  trashCampiagnConfirm = id => {
    var { campaigns } = this.state;
    var index = campaigns.indexOf(id);
    if (index > -1) {
      campaigns.splice(index, 1);
    }
    this.setState({ campaigns: campaigns });
    this.props.setCampaigns(campaigns);
    toast.success("Campaign has been trashed successfully", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };
  trashCampiagn = id => {
    confirmAlert({
      title: " ",
      message: "Are you sure, you want to trash campaign",
      confirmLabel: "Ok",
      cancelLabel: "Cancel",
      onConfirm: () => {
        this.trashCampiagnConfirm(id);
      }
    });
  };
  render() {
    const { campaignList } = this.props;
    console.log(campaignList, "campaigne List");
    const { campaigns } = this.state;
    var index = 0;
    return (
      <div className="col-md-6 col-lg-4">
        <div className="row">
          <div className="col-sm-12 top-block-space">
            <section className="col-sm-12 bordered-column compaign-id">
              <h4 className="column-heading">Campaign ID</h4>
              <div className="form-group">
                <div className="col-md-10">
                  <Field
                    name="campaign"
                    component={TagRenderSelectField}
                    empty="List of Campaign Name"
                    model="campaign"
                    selectLists={sortListByAlphabetsOrder(campaignList)}
                    onChange={this.onChangeSelect}
                  />
                </div>
                <div
                  className="col-xs-2 add-icon cursor-pointer"
                  onClick={this.addCampaign}
                >
                  <i className="fa fa-plus" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-7 table-responsive">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th>#</th>
                        <th>Campaign Name</th>
                        <th />
                      </tr>
                      {campaignList.map(campaign => {
                        if (campaigns.indexOf(campaign.id) !== -1) {
                          return (
                            <tr key={"list_" + campaign.id}>
                              <td>{++index}</td>
                              <td>{campaign.name}</td>
                              <td
                                className="cursor-pointer"
                                onClick={() => {
                                  this.trashCampiagn(campaign.id);
                                }}
                              >
                                <i className="fa fa-trash" />
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    campaignList: state.CMSDetail.campaignList,
    user: state.user
  };
}

const mapDispatchToProps = {
  getCampaignList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMSCompaignIDSection);
