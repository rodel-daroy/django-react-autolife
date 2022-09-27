import React from "react";
import CMSCompaignIDSection from "./Section/CMSCompaignIDSection";
import CMSInfo from "./Section/CMSInfo";
import CMSContentHandlingSection from "./Section/CMSContentHandlingSection";
import CMSCarBrandSection from "./Section/CMSCarBrandSection";
import CMSRegionalizationSection from "./Section/CMSRegionalizationSection";
import { withRouter } from "react-router-dom";
import Tagging from "./Section/Tagging";
import { connect } from "react-redux";
import { reduxForm, FormSection } from "redux-form";
import {
  getTagging,
  postTagData,
  redirectEdit,
  postTagDataById
} from "../../../redux/actions/CMSPageAction";
import get from "lodash/get";

const TaggingContent = props => {
  const { index, tagging } = props;
  if (tagging && typeof tagging[index] !== "undefined") {
    var label = tagging[index]["label"];
    var tagData = tagging[index]["children"];
    const twoRows = tagData.length > 4;
    return (
      <div>
        <h4 className="column-heading">{label}</h4>
        {twoRows ? (
          <div className="row">
            <Tagging tagging={tagData} label={label} />
          </div>
        ) : (
          <Tagging tagging={tagData} />
        )}
      </div>
    );
  }
  return <div />;
};
class CMSTaggingForm extends React.Component {
  constructor(props) {
    super(props);
    this.getSelectCompaign = [];
    this.brandList = [];
    this.manufactureBind = {
      manufacturer: [],
      make: [],
      model: [],
      year: []
    };
    this.state = {
      clicked: false
    };
  }
  componentWillMount() {
    const { getTagging } = this.props;
    getTagging(get(this.props, "user.authUser.accessToken"));
  }
  submittedTags = valuesData => {
    console.log(valuesData, "valuesData");
    const values = Object.assign({}, valuesData);
    const { postTagData, changeTabs, postTagDataById } = this.props;
    console.log(this.props, "tagging form");
    values.campaign = this.getSelectCompaign;
    values.manufacturer = [];
    values.make = [];
    values.model = [];
    values.years = [];
    if (this.props.match.params.id) {
      values.content_id = this.props.match.params.id;
    }
    const brandList = this.brandList;

    for (var i = 0; i < brandList.length; i++) {
      values.manufacturer.push(brandList[i].manufacturer.name);
      if (brandList[i].make) {
        values.make.push(brandList[i].make.name);
        if (brandList[i].model) {
          values.model.push(brandList[i].model.name);
          if (brandList[i].year) {
            values.years.push(brandList[i].year.name);
          }
        }
      }
    }
    var tagCollection = [];
    var objectKeysValue = Object.keys(values.tag);
    for (var i = 0; i < objectKeysValue.length; i++) {
      var data = {};
      if (objectKeysValue[i] !== "" && values.tag[objectKeysValue[i]]) {
        data[objectKeysValue[i]] = values.tag[objectKeysValue[i]];
        tagCollection.push(data);
      }
    }
    values.tag = tagCollection;
    const id = this.props.match.params ? this.props.match.params.id : "";
    if (this.props.match.params.id) {
      postTagDataById(
        id,
        values,
        get(this.props, "user.authUser.accessToken")
      ).then(data => {
        if (data.data.status === 200) {
          changeTabs("openPublishingTab");
        }
      });
    } else {
      postTagData(values, get(this.props, "user.authUser.accessToken")).then(
        data => {
          console.log(this.props.match.params.id, "tagging-data");
          if (data.data.status === 200) {
            if (!this.props.match.params.id)
              this.props.history.push(`/page/${data.data.created}`);
            changeTabs("openPublishingTab");
          }
        }
      );
    }
  };
  setCampaigns = campiagn => {
    this.getSelectCompaign = campiagn;
  };
  setBrands = list => {
    this.brandList = list;
  };
  render() {
    const { tagging } = this.props;
    const { handleSubmit, submitting, initialValues, invalid } = this.props;
    const campaigns = initialValues.campaigns;
    const defaultRegionValue = {
      country: initialValues.country,
      state: initialValues.state
    };
    return (
      <article
        className="content-box for-tab-1"
        style={{ display: "block" }}
        id="tab1"
      >
        <form
          className="form-horizontal"
          onSubmit={handleSubmit(this.submittedTags)}
        >
          <div className="row full-height-col">
            <div className="col-sm-12 col-md-8 col-lg-4">
              <section className="col-sm-12 bordered-column">
                <FormSection
                  component={TaggingContent}
                  name="tag"
                  index="0"
                  tagging={tagging}
                />
              </section>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-2">
              <section className="col-sm-12 bordered-column">
                <FormSection
                  component={TaggingContent}
                  name="tag"
                  index="1"
                  tagging={tagging}
                />
              </section>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-2">
              <section className="col-sm-12 bordered-column">
                <FormSection
                  component={TaggingContent}
                  name="tag"
                  index="2"
                  tagging={tagging}
                />
              </section>
            </div>
            <CMSContentHandlingSection />
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-8">
              <div className="row full-height-col top-block-space">
                <CMSRegionalizationSection {...defaultRegionValue} />
                <div className="col-sm-4 col-md-3">
                  <section className="col-sm-12 bordered-column">
                    <FormSection
                      component={TaggingContent}
                      name="tag"
                      index="3"
                      tagging={tagging}
                    />
                  </section>
                </div>
                <div className="col-sm-4 col-md-4">
                  <section className="col-sm-12 bordered-column">
                    <FormSection
                      component={TaggingContent}
                      name="tag"
                      index="4"
                      tagging={tagging}
                    />
                  </section>
                </div>
              </div>
            </div>

            <FormSection
              component={CMSCompaignIDSection}
              setCampaigns={this.setCampaigns}
              name="compaignSection"
              campaigns={campaigns}
            />
            <FormSection
              component={CMSCarBrandSection}
              listValue={initialValues.list}
              setBrands={this.setBrands}
              name="compaignSection"
              list={initialValues.list}
            />
          </div>
          <CMSInfo />
          <div className="row">
            <div className="col-sm-12 form-btn-sec">
              {!(invalid && this.state.clicked) || (
                <span className="error error-container text-right">
                  {" "}
                  Please fill the required fields{" "}
                </span>
              )}
              <button
                type="submit"
                className="form-action"
                disabled={submitting}
                onClick={() => {
                  this.setState({ clicked: true });
                }}
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </article>
    );
  }
}

function mapStateToProps(state) {
  return {
    tagging: state.page.tagging,
    user: state.user
  };
}
const mapDispatchToProps = {
  getTagging,
  postTagData,
  postTagDataById,
  redirectEdit
};
CMSTaggingForm = reduxForm({
  form: "CMSTaggingForm",
  enableReinitialize: true
})(CMSTaggingForm);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CMSTaggingForm)
);
