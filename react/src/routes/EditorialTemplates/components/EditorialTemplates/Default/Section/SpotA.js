import React, { Component } from "react";
import { connect } from "react-redux";
import FeatureSpot from "components/common/FeatureSpot";
import Sponsor from "components/content/Sponsor";
import Profile from "./Profile";
import ASpotBody from "components/common/ASpotBody";
import ImageAttribution from "components/content/ImageAttribution";
import ArticleRate from "./ArticleRate";
import { resizeImageUrl } from "utils";
import { SCREEN_XS_MAX } from "utils/style";
import { getASpotProps } from "./helpers";

class SpotA extends Component {
  handleResize = () => {};

  getAssetProps() {
    const { previewData } = this.props;
    
    return getASpotProps(previewData.data.assets);
  }

  renderSmall(assetProps) {
    const { previewData } = this.props;

    let image_attribution = "";
    previewData &&
      previewData.data.assets.map(data => {
        if (data.template_location == "spot_A")
          image_attribution = data.content_attribution;
      });

    let asset = null;
    if (typeof assetProps.images === "string") {
      asset = (
        <div className="mobile-a-spot">
          <img
            src={
              assetProps.images
                ? resizeImageUrl(assetProps.images, SCREEN_XS_MAX, 500)
                : ""
            }
          />
          <ImageAttribution>{image_attribution}</ImageAttribution>
        </div>
      );
    } else {
      asset = (
        <FeatureSpot spot="A" animate={false} {...assetProps}>
          <ImageAttribution>{image_attribution}</ImageAttribution>
        </FeatureSpot>
      );
    }

    return (
      <div>
        <div className="content-container offset-header">
          <div className="text-container">
            <h1 className="editorial-headline">{previewData.data.headline}</h1>
            <aside className="mobile-content-aside">
              {previewData.data.template_configuration &&
                previewData.data.template_configuration.author_profile && (
                  <Profile />
                )}
              {previewData.data.template_configuration &&
                previewData.data.template_configuration.rate_of_story && (
                  <ArticleRate />
                )}
            </aside>
          </div>
        </div>

        {asset}

        {previewData.data.sponsor && (
          <div className="content-container">
            <div className="text-container">
              <div className="sponsor-inline">
                Brought to you by
                <img src={previewData.data.sponsor.logo} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderLarge(assetProps) {
    const { previewData } = this.props;
    let image_attribution = "";
    previewData.data.assets.map(data => {
      if (data.template_location == "spot_A")
        image_attribution = data.content_attribution;
    });
    if (assetProps)
      return (
        <FeatureSpot
          spot="A"
          scrim="gradient"
          {...assetProps}
          frameContent={
            previewData.data.sponsor && (
              <Sponsor image={previewData.data.sponsor.logo} />
            )
          }
        >
          <ASpotBody
            heading={previewData.data.headline}
            synopsis={previewData.data.subheading}
            rate={<ArticleRate dark noCaption />}
          />

          <ImageAttribution>{image_attribution}</ImageAttribution>
        </FeatureSpot>
      );
    return null;
  }

  render() {
    const { previewData, mobile } = this.props;
    const hasASpot =
      previewData.data.template_configuration &&
      previewData.data.template_configuration.spot_A;
    const assetProps = hasASpot ? this.getAssetProps() : null;

    if (assetProps)
      return mobile
        ? this.renderSmall(assetProps)
        : this.renderLarge(assetProps);
    return null;
  }
}

function mapStateToProps(state) {
  return {
    previewData: state.editorial.previewData
  };
}

export default connect(mapStateToProps)(SpotA);
