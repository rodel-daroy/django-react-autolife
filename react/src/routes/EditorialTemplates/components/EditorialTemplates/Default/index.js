import React, { Component } from "react";
import "./style.scss";
import SpotA from "./Section/SpotA";
import SpotB from "./Section/SpotB";
import { splitHtml } from "components/content";
import Breadcrumbs from "components/Navigation/Breadcrumbs";
import Profile from "./Section/Profile";
import SidebarArticles from "./Section/SidebarArticles";
import BottomRelatedArticles from "./Section/BottomRelatedArticles";
import Interstitial from "components/content/Interstitial";
import InterstitialMessage from "components/content/InterstitialMessage";
import AnimationContainer from "components/Animation/AnimationContainer";
import Animate from "components/Animation/Animate";
import {
  AnimationOptions,
  stagger,
  fadeIn
} from "components/Animation";
import { connect } from "react-redux";
import Media from "react-media";
import { mediaQuery } from "utils/style";
import { withRouter } from "react-router-dom";
import SocialShareModal from "components/Listings/SocialShareModal";
import last from "lodash/last";
import get from "lodash/get";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import ArticleRate from "./Section/ArticleRate";
import AdaptiveAdBanner from "components/content/AdaptiveAdBanner";
import {
  articleLiked,
  articleDisliked
} from "redux/actions/articlesActions";

const BASE_ANIMATE_OPTIONS = {
  delayIn: stagger(2, 0.15),
  enter: fadeIn()
};

class DefaultInner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getImageURlToShare = () => {
    const { previewData } = this.props;
    let assetData;
    if (previewData && previewData.data && previewData.data.assets.length > 0) {
      const asset = last(
        previewData.data.assets.filter(
          asset => asset.template_location === "spot_A"
        )
      );
      console.log(asset, "assetsDat");
      if (
        (asset && asset.asset_type === "image") ||
        (asset && asset.asset_type === "carousel")
      ) {
        assetData = {
          url: asset.asset_content[0].url,
          assetType: asset.asset_type
        };
      } else if (asset && asset.asset_type === "video") {
        assetData = {
          url: asset.thumbnail,
          videoUrl: asset.asset_content[0].url,
          assetType: asset.asset_type
        };
      }
    }
    return assetData;
  };

  renderArticleFoot(chunks) {
    const { previewData } = this.props;
    const url = window.location.href;
    const config = get(
      previewData && previewData.data,
      "template_configuration",
      {}
    );
    const assetContent = this.getImageURlToShare();
    return (
      <div>
        <div className="article-content">
          <Animate>
            <div
              className="article-text"
              dangerouslySetInnerHTML={{ __html: chunks[3] }}
            />
          </Animate>
        </div>

        <Media query={mediaQuery("xs sm")}>
          {matches =>
            matches ? (
              <aside className="mobile-content-aside">
                {config && config.share_this_story && (
                  <SocialShareModal
                    url={url || ""}
                    imageUrl={
                      assetContent && assetContent.url
                        ? assetContent && assetContent.url
                        : ""
                    }
                    text={previewData.data.headline || ""}
                    assetsType={
                      assetContent && assetContent.assetType
                        ? assetContent && assetContent.assetType
                        : ""
                    }
                  />
                )}
                {config && config.rate_of_story && <ArticleRate />}
              </aside>
            ) : null
          }
        </Media>

        {previewData.next_article && (
          <div className="article-content">
            <Animate>
              <Interstitial>
                <InterstitialMessage.NextArticle />
              </Interstitial>
            </Animate>
          </div>
        )}
      </div>
    );
  }

  _renderBreadcrumbs() {
    const { previewData } = this.props;
    if (
      previewData &&
      previewData.data &&
      previewData.data.preview_path === "Home"
    ) {
      return [<Breadcrumbs.Crumb key={0} name={previewData.data.headline} />];
    }
    return [
      <Breadcrumbs.Crumb
        key={0}
        link={this.getBreadcrumbsLink(previewData.data.preview_path)}
        name={previewData.data.preview_path}
      />,
      <Breadcrumbs.Crumb key={1} name={previewData.data.headline} />
    ];
  }

  getBreadcrumbsLink = path => {
    switch (path) {
      case "Marketplace": {
        return "/market-place";
      }
      case "Promotion": {
        return "/promotion";
      }
      case "Trends": {
        return "/trends";
      }

      default:
        return undefined;
    }
  };

  renderAd(location) {
    const { previewData, /* user */ } = this.props;

    const config = get(
      previewData && previewData.data,
      "template_configuration",
      {}
    );
    //const signedIn = !!get(user, "authUser.accessToken");

    if (config[location])
      return (
        <div className="editorial-page-ad article-text">
          <AdaptiveAdBanner /* zoneId={signedIn ? 1 : 8} */ />
        </div>
      );

    return null;
  }

  renderStructuredData() {
    const { previewData } = this.props;
    const data = {
      "@context": "http://schema.org",
      "@type": "Article",
      headline: (previewData && previewData.data.headline) || "",
      image: (previewData.data.assets || [])
        .filter(asset => asset.asset_type === "image")
        .map(asset => asset.asset_content[0].url),
      datePublished: previewData.data.article_publish_date,
      description: previewData.data.synopsis,
      author: previewData.data.byline
        ? {
            "@type": "Person",
            name: previewData.data.byline
          }
        : undefined,
      articleSection: previewData.data.preview_path,
      publisher: {
        "@type": "Organization",
        name: "AutoLife",
        logo: {
          "@type": "ImageObject",
          url: `${window.location.origin}/AL-Logo-Horizontal-Colour.png`,
          width: 267,
          height: 60
        }
      },
      mainEntityOfPage: window.location.href
    };

    return <script type="application/ld+json">{JSON.stringify(data)}</script>;
  }

  render() {
    const {
      previewData = {},
      location,
      match: { params },
      mobile,
      loading
    } = this.props;

    const config = get(
      previewData && previewData.data,
      "template_configuration",
      {}
    );
    console.log(previewData && previewData.data, "config");

    const hasASpot = config && config.spot_A;
    const hasBSpot = config && config.spot_B;

    const { chunks, totalWordCount } = splitHtml(
      previewData && previewData.data && previewData.data.body,
      [150, 350, 100]
    );

    const url = window.location.href;
    const matchedLocation = `content/${params.content_name}`;

    const animationOptions = new AnimationOptions(BASE_ANIMATE_OPTIONS);
    const assetContent = this.getImageURlToShare();
    console.log(previewData.data.seo_keywords, "Pdata");
    if (loading) return null;
    else
      return (
        <article className="editorial-page page-width">
          {(location.pathname || "").replace(/^\//, "") === matchedLocation && (
            <ArticleMetaTags
              metaKeyword={previewData.data.seo_keywords}
              metaDescription={previewData.data.seo_meta_description}
              title={
                previewData.data.seo_meta_name || previewData.data.headline
              }
              url={url || ""}
              imageUrl={assetContent && assetContent.url}
              text={previewData.data.headline || ""}
              assetsType={assetContent && assetContent.assetType}
              test="test"
              videoUrl={assetContent && assetContent.videoUrl}
            />
          )}

          {this.renderStructuredData()}
          <SpotA mobile={mobile} location={location} params={params} />

          <div
            ref={ref => (this._container = ref)}
            className="content-container"
          >
            <AnimationContainer
              options={animationOptions}
              className={`${!hasASpot ? "offset-header" : ""}`}
            >
              <div className="text-container">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12">
                      <Media query={mediaQuery("md lg")}>
                        {previewData.data.preview_path ? (
                          <Breadcrumbs>{this._renderBreadcrumbs()}</Breadcrumbs>
                        ) : (
                          ""
                        )}
                      </Media>
                    </div>
                  </div>
                  <div className="row">
                    <Media query={mediaQuery("md lg")}>
                      {matches =>
                        matches ? (
                          <div className="col-md-4">
                            <Animate>
                              <aside className="sidebar">
                                {config.author_profile ? <Profile /> : ""}
                                {config.share_this_story ? (
                                  <SocialShareModal
                                    url={url || ""}
                                    imageUrl={assetContent && assetContent.url}
                                    text={previewData.data.headline || ""}
                                    assetsType={
                                      assetContent && assetContent.assetType
                                    }
                                  />
                                ) : (
                                  ""
                                )}
                                {config.rate_of_story && <ArticleRate />}
                                {config.secondary_navigation ? (
                                  <SidebarArticles />
                                ) : (
                                  ""
                                )}
                              </aside>
                            </Animate>
                          </div>
                        ) : null
                      }
                    </Media>

                    <div className="col-md-8">
                      <div className="article-content first">
                        <Animate>
                          <div className="article-text">
                            {!config.spot_A && (
                              <h1>{previewData.data.headline}</h1>
                            )}
                            {config.subheading &&
                              previewData.data.subheading && (
                                <h2
                                  className={
                                    config.spot_A
                                      ? "hidden-sm hidden-md hidden-lg"
                                      : ""
                                  }
                                >
                                  {previewData.data.subheading}
                                </h2>
                              )}
                          </div>
                        </Animate>

                        <Animate>
                          <div
                            className="article-text"
                            dangerouslySetInnerHTML={{ __html: chunks[0] }}
                          />
                        </Animate>

                        {this.renderAd("Top")}

                        {chunks.length > 1 && (
                          <React.Fragment>
                            <Animate>
                              <div
                                className="article-text"
                                dangerouslySetInnerHTML={{ __html: chunks[1] }}
                              />
                            </Animate>

                            {totalWordCount > 500 && this.renderAd("Bottom")}

                            {chunks.length > 2 && (
                              <Animate>
                                <div
                                  className="article-text"
                                  dangerouslySetInnerHTML={{ __html: chunks[2] }}
                                />
                              </Animate>
                            )}
                          </React.Fragment>
                        )}

                        {!hasBSpot && this.renderArticleFoot(chunks)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {hasBSpot && (
                <Animate>
                  <SpotB />
                </Animate>
              )}

              <div className="text-container">
                <div className="container-fluid">
                  {hasBSpot && (
                    <div className="row">
                      <div className="col-md-8 col-md-offset-4">
                        {this.renderArticleFoot(chunks)}
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-12">
                      <Animate>
                        {config.related_articles && (
                          <BottomRelatedArticles />
                        )}
                      </Animate>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationContainer>
          </div>
        </article>
      );
  }
}

const Default = props => {
  return (
    <Media query={mediaQuery("xs")}>
      {matches => <DefaultInner {...props} mobile={matches} />}
    </Media>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
    previewData: state.editorial.previewData,
    loading: state.editorial.loading
  };
}

const mapDispatchToProps = {
  articleLiked,
  articleDisliked
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Default)
);
