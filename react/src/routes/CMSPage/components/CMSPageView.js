import React, { Component } from "react";
import "./style.scss";
import "../../../styles/icons/font-awesome/scss/font-awesome.scss";
import ArticleMetaTags from "../../../components/common/ArticleMetaTags";
import CMSTaggingForm from "./CMSTaggingForm";
import CMSPublishingForm from "./CMSPublishingForm";
import CMSContentForm from "./CMSContentForm";
import { ToastContainer } from "react-toastify";
import get from "lodash/get";
import moment from "moment";
import $ from "jquery";
import { convertUTCDateToLocalDate } from "../../../utils/format";

class CMSPageView extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      showPublishingTab: false,
      showContentTab: false,
      metaTags: {}
    };
    this.loadSuccess = false;
  }
  componentWillMount() {
    console.log(this.props, "params");
    if (this.props.match.params.id) {
      this.props.getContentData(
        this.props.match.params.id,
        get(this.props, "user.authUser.accessToken")
      );
    } else {
      this.props.getContentDataApiSuccess({ data: {} });
    }
  }

  componentDidMount() {
    // const { hideLoader } = this.props;
    // hideLoader();
    this.props.getContentDataApiSuccess({ data: {} });
    $(".site_loader").hide("2000");
  }

  componentDidUpdate(prevProps) {
    const { contentData } = this.props;
    // hideLoader();
    if (prevProps.contentData.id !== contentData.id) {
      this.setState({
        metaTags: contentData
      });
    }
  }

  openTaggingTab = e => {
    if (this.props.match.params.id && !this.loadSuccess) {
      this.loadSuccess = true;
      this.props.getContentData(
        this.props.match.params.id,
        get(this.props, "user.authUser.accessToken")
      );
    }
    document.getElementById("tab2").style.display = "none";
    document.getElementById("tab1").style.display = "block";
    document.getElementById("tab3").style.display = "none";
    document.getElementById("labeltab1").classList.add("tab_backgrnd");
    document.getElementById("labeltab3").classList.remove("tab_backgrnd");
    document.getElementById("labeltab2").classList.remove("tab_backgrnd");
  };

  openPublishingTab = e => {
    if (this.props.match.params.id && !this.loadSuccess) {
      this.loadSuccess = true;
      this.props.getContentData(
        this.props.match.params.id,
        get(this.props, "user.authUser.accessToken")
      );
    }
    document.getElementById("tab2").style.display = "block";
    document.getElementById("tab1").style.display = "none";
    document.getElementById("tab3").style.display = "none";
    document.getElementById("labeltab2") &&
      document.getElementById("labeltab2").classList.add("tab_backgrnd");
    document.getElementById("labeltab1") &&
      document.getElementById("labeltab1").classList.remove("tab_backgrnd");
    document.getElementById("labeltab3") &&
      document.getElementById("labeltab3").classList.remove("tab_backgrnd");
  };

  openContentTab = e => {
    document.getElementById("tab3").style.display = "block";
    document.getElementById("tab1").style.display = "none";
    document.getElementById("tab2").style.display = "none";
    document.getElementById("labeltab3") &&
      document.getElementById("labeltab3").classList.add("tab_backgrnd");
    document.getElementById("labeltab1") &&
      document.getElementById("labeltab1").classList.remove("tab_backgrnd");
    document.getElementById("labeltab2") &&
      document.getElementById("labeltab2").classList.remove("tab_backgrnd");
  };

  getMetaTags = values => {
    this.setState({
      metaTags: values
    });
  };

  renderTabs = () => {
    const {
      match: { params },
      contentData
    } = this.props;
    const tag = {};
    let country = "";
    let state = "";
    let city = "";
    let sponsor = "";
    const campaigns = [];
    const list = [];
    const publishInitialization = {};
    let contentInitialization = {
      related_articles: [],
      configuration: {},
      secondary_navigation: []
    };
    if (Object.keys(contentData).length && this.props.match.params.id) {
      if (!contentData.secondary_navigation) {
        contentData.secondary_navigation = [];
      }
      if (!contentData.related_articles) {
        contentData.related_articles = [];
      }
      const { publishing_state } = contentData;
      if (contentData.tag) {
        for (var i = 0; i < contentData.tag.length; i++) {
          const key = Object.keys(contentData.tag[i]);
          tag[key[0]] = contentData.tag[i][key[0]];
        }
      }
      country = contentData.country ? contentData.country.id : "";
      state = contentData.state ? contentData.state.id : "";
      city = contentData.city ? contentData.city.id : "";
      sponsor = contentData.sponsor ? contentData.sponsor.id : "";
      for (var i = 0; i < contentData.campaigns.length; i++) {
        campaigns.push(contentData.campaigns[i].id);
      }
      for (var i = 0; i < contentData.manufacturers.length; i++) {
        list.push({
          manufacturer: contentData.manufacturers[i],
          make: contentData.makes.hasOwnProperty(i)
            ? contentData.makes[i]
            : false,
          model: contentData.models.hasOwnProperty(i)
            ? contentData.models[i]
            : false,
          year: contentData.years.hasOwnProperty(i)
            ? contentData.years[i]
            : false
        });
      }
      if (publishing_state) {
        publishInitialization.publish_state = publishing_state.publish_state;
        publishInitialization.do_not_publish_until = publishing_state.do_not_publish_until
          ? moment(
              convertUTCDateToLocalDate(publishing_state.do_not_publish_until)
            ).format("MM/DD/YYYY")
          : "";
        publishInitialization.unpublishing_on = publishing_state.unpublishing_on
          ? moment(
              convertUTCDateToLocalDate(publishing_state.unpublishing_on)
            ).format("MM/DD/YYYY")
          : "";
        publishInitialization.article_publish_date = publishing_state.article_publish_date ?
        moment(
          convertUTCDateToLocalDate(publishing_state.article_publish_date)
        ).format("MM/DD/YYYY")
      : "";
      }
      contentInitialization = contentData;
      contentInitialization.partner = contentData.content_partner
        ? contentData.content_partner.id
        : "";
      contentInitialization.article_received_date = contentData.article_received_date
        ? moment(
            convertUTCDateToLocalDate(contentData.article_received_date)
          ).format("MM/DD/YYYY")
        : "";
      contentInitialization.article_publish_date =
        contentData.article_publish_date &&
        (contentData.publishing_state
          ? contentData.publishing_state.publish_state == 3 ||
            contentData.publishing_state.publish_state == 1 ||
            contentData.publishing_state.publish_state == 2
          : "")
          ? moment(
              convertUTCDateToLocalDate(contentData.article_publish_date)
            ).format("MM/DD/YYYY")
          : "";
    }
    const initialValues = {
      tag,
      country,
      state,
      city,
      sponsor,
      campaigns,
      homepage_availability: contentData.homepage_availability,
      is_timely_content: contentData.is_timely_content,
      is_promoted_content: contentData.is_promoted_content,
      disable_personalization: contentData.disable_personalization,
      available_in_trends: contentData.available_in_trends,
      is_featured: contentData.is_featured,
      list,
      related_articles: [],
      secondary_navigation: []
    };
    const { metaTags } = this.state;
    return (
      <div>
        <ArticleMetaTags
          metaKeyword={metaTags.seo_keywords}
          metaDescription={metaTags.seo_meta_description}
          title={metaTags.seo_meta_name}
          url={window.location.href}
        />
        <CMSContentForm
          {...params}
          initialValues={contentInitialization}
          contentData={contentData}
          getMetaTags={this.getMetaTags}
        />
        <CMSPublishingForm
          {...params}
          changeTabs={this.changeTabs}
          initialValues={publishInitialization}
        />
        <CMSTaggingForm
          changeTabs={this.changeTabs}
          {...params}
          initialValues={initialValues}
        />
      </div>
    );
  };

  changeTabs = type => {
    if (type === "openPublishingTab") {
      this.openPublishingTab();
    } else if (type === "openContentTab") {
      this.openContentTab();
    }
  };
  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <section className="content-container container-fluid">
          <div className="row">
            <section className="col-sm-12 cms-tabbing">
              <label
                className="tab-label tab_backgrnd"
                id="labeltab1"
                onClick={this.openTaggingTab}
              >
                Tagging
              </label>
              {!this.props.match.params.id || (
                <label
                  className="tab-label"
                  id="labeltab2"
                  onClick={this.openPublishingTab}
                >
                  Publishing
                </label>
              )}
              {!this.props.match.params.id || (
                <label
                  className="tab-label"
                  id="labeltab3"
                  onClick={this.openContentTab}
                >
                  Content
                </label>
              )}
              {this.renderTabs()}
            </section>
          </div>
        </section>
      </div>
    );
  }
}

CMSPageView.propTypes = {};

export default CMSPageView;
