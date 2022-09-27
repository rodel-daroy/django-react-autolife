import React from "react";
import ArticleSourceSection from "./Section/ArticleSourceSection";
import ArticleSEOSection from "./Section/ArticleSEOSection";
import ArticleSection from "./Section/ArticleSection";
import AssetSection from "./Section/AssetSection";
import AddsSection from "./Section/AddsSection";
import TemplateConfig from "./Section/TemplateConfig";
import RelatedArticleSection from "./Section/RelatedArticleSection";
import { reduxForm, Field, FormSection, change } from "redux-form";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { TagInputNumber, RFTextField } from "./RFInputField";
import get from "lodash/get";
import Config from "./Config";
import {
  postContentSection,
  getPublishArticle
} from "../../../redux/actions/CMSPageAction";
import { toast } from "react-toastify";

const number = value => (isNaN(Number(value)) ? "Must be a number" : "");

class CMSContentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeOfSubmit: "",
      currentTemplate: false,
      currentConfig: {},
      currentConfigValues: {},
      clicked: false,
      adId: [],
      rawHtml: ""
    };
    this.assets = [];
    this.ads = [];
    this.loadData = false;
  }

  componentDidMount() {
    const { getPublishArticle } = this.props;
    getPublishArticle(get(this.props, "user.authUser.accessToken"));
    this.templateChange("");
  }

  componentDidUpdate() {
    var { initialValues } = this.props;
    if (!this.loadData && initialValues.template) {
      this.loadData = true;
      this.templateChange(initialValues.template, true);
    }
  }

  getRawHtmlForArticle = val => {
    this.setState({
      rawHtml: val
    });
  };

  submittedContentSection = values => {
    const { postContentSection, contentData, getMetaTags } = this.props;
    values.body = this.state.rawHtml;
    let adId = [];
    values.content_id = this.props.match.params.id;
    contentData.ads.map(ads => {
      adId.push(ads.id);
    });
    values.ads = adId.concat(this.state.adId);
    var assets = [];
    for (var row = 0; row < this.assets.length; row++) {
      if (
        !this.state.currentConfigValues[this.assets[row]["template_location"]]
          .disable
      ) {
        assets.push(this.assets[row]);
      }
    }
    values.assets = assets;
    if (!values.preview_path) {
      values.preview_path = "Marketplace";
    }
    if (this.state.typeOfSubmit === "Update") {
      console.log(values.publishing_state, "values");
      postContentSection(
        values,
        get(this.props, "user.authUser.accessToken"),
        this.props.match.params.id,
        "Update"
      );
    } else {
      postContentSection(
        values,
        get(this.props, "user.authUser.accessToken"),
        this.props.match.params.id,
        "Preview"
      );
    }
    getMetaTags(values);
  };

  updateContentForm = () => {
    this.setState({
      typeOfSubmit: "Update",
      clicked: true
    });
  };

  setAssets = asset => {
    this.assets = asset;
  };

  previewContentForm = () => {
    this.setState({
      typeOfSubmit: "Preview",
      clicked: true
    });
    this.props.history.push(`/content/preview/${this.props.match.params.id}`);
  };

  templateChange = (value, load = false) => {
    const currentTemplate = value !== "";
    const currentConfig = value !== "" ? Config.Default : {};
    const { initialValues } = this.props;
    var { template_configuration } = initialValues;
    const configuration = template_configuration ? template_configuration : {};
    if (currentTemplate) {
      var defaultValues = {};
      var currentConfigValues = {};
      for (var configValue in currentConfig) {
        currentConfigValues[configValue] = currentConfig[configValue];
        if (!load) {
          currentConfigValues[configValue].disable = false;
          defaultValues[configValue] = true;
        } else {
          if (!configuration.hasOwnProperty(configValue)) {
            currentConfigValues[configValue].disable = false;
            defaultValues[configValue] = true;
          } else {
            currentConfigValues[configValue].disable = !configuration[
              configValue
            ];
            defaultValues[configValue] = configuration[configValue];
          }
        }
      }
    }
    this.assets = [];
    this.ads = [];
    this.setState({
      currentTemplate: currentTemplate,
      currentConfig: currentConfig,
      currentConfigValues: currentConfigValues
    });

    this.props.dispatch(
      change("CMSContentForm", "template_configuration", defaultValues)
    );
  };
  onChangeSwitch = (checked, name) => {
    this.state.currentConfigValues[name]["disable"] = !checked;
    this.setState({
      currentConfigValues: this.state.currentConfigValues
    });
  };

  getAdId = data => {
    let ad_id = [];
    data.map((newData, i) => {
      ad_id.push(newData.id);
    });
    this.setState({
      adId: ad_id
    });
    this.ads = data;
  };

  render() {
    const { handleSubmit, submitting, publishArticles, invalid } = this.props;
    const templateConfig = {
      currentTemplate: this.state.currentTemplate,
      currentConfig: this.state.currentConfig
    };
    const { initialValues } = this.props;
    const { ads, assets } = initialValues;
    const midleware = {
      change: this.props.change,
      dispatch: this.props.dispatch
    };
    return (
      <article
        className="content-box for-tab-3"
        id="tab3"
        style={{ display: "none" }}
      >
        <form
          className="form-horizontal"
          onSubmit={handleSubmit(this.submittedContentSection)}
          ref="form"
        >
          <div className="form-horizontal">
            <ArticleSourceSection templateChange={this.templateChange} />
            <ArticleSEOSection />
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1 bordered-column">
                <h4 className="column-heading">Search</h4>
                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-4 col-md-offset-2 col-md-5">
                    <div className="checkbox">
                      <label>
                        <Field
                          component={TagInputNumber}
                          id="search_result"
                          name="include_in_search"
                          type="checkbox"
                          removeClass
                        />
                        Include in search results
                      </label>
                    </div>
                  </div>
                  <label className="control-label col-sm-3 col-md-2">
                    Search Boost
                  </label>
                  <div className="col-sm-2 col-md-1">
                    <Field
                      component={TagInputNumber}
                      id="search_boost"
                      name="search_boost"
                      type="text"
                      validate={[number]}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3 col-md-2">
                    Search Keywords
                  </label>
                  <div className="col-sm-9 col-md-10">
                    <Field
                      component={RFTextField}
                      id="search_meta_description"
                      name="search_keywords"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
            <ArticleSection
              getRawHtmlForArticle={this.getRawHtmlForArticle}
              rawHtml={
                this.props.contentData
                  ? this.props.contentData.body
                  : this.state.rawHtml
              }
              initialValues={initialValues}
            />
            {!this.state.currentTemplate || (
              <FormSection
                onChangeSwitch={this.onChangeSwitch}
                component={TemplateConfig}
                name="template_configuration"
                {...templateConfig}
              />
            )}
            <AssetSection
              currentConfigValues={this.state.currentConfigValues}
              setAssets={this.setAssets}
              assets={assets}
            />
            {publishArticles.length > 0 ? (
              <div>
                <RelatedArticleSection
                  midleware={midleware}
                  publishArticles={publishArticles}
                  heading="Secondary Navigation"
                  name="secondary_navigation"
                  params={this.props.match.params}
                />
                <RelatedArticleSection
                  midleware={midleware}
                  publishArticles={publishArticles}
                  heading="Related Articles"
                  name="related_articles"
                  params={this.props.match.params}
                />
              </div>
            ) : (
              ""
            )}
            <AddsSection
              getAdId={this.getAdId}
              currentConfigValues={this.state.currentConfigValues}
              params={this.props.match.params}
              ads={ads}
            />
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1 form-btn-sec">
                {!(invalid && this.state.clicked) || (
                  <span className="error error-container text-right">
                    Please fill the required fields{" "}
                  </span>
                )}
              </div>
              <div className="col-sm-10 col-sm-offset-1 form-btn-sec">
                <button
                  className="form-action mleft"
                  onClick={this.previewContentForm}
                  disabled={submitting}
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="form-action"
                  disabled={submitting}
                  onClick={this.updateContentForm}
                >
                  Update
                </button>
                <Link to="/template-list">
                  <button
                    className="form-action"
                    style={{ marginLeft: "8px" }}
                    disabled={submitting}
                  >
                    Close
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </article>
    );
  }
}

CMSContentForm = reduxForm({
  form: "CMSContentForm",
  enableReinitialize: true
})(CMSContentForm);

function mapStateToProps(state) {
  return {
    user: state.user,
    successMsg: state.page.successMsg,
    publishArticles: state.page.publishArticles
  };
}

const mapDispatchToProps = {
  postContentSection,
  getPublishArticle
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CMSContentForm)
);
