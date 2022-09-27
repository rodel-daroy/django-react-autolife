import React, { Component } from "react";
import { defaultCarImg } from "config/constants";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import { getCarName } from "components/Listings/CarName";
import { cloudFrontImage } from "utils";
import get from "lodash/get";
import Responsive from "components/content/Responsive";
import ObjectFit from "components/common/ObjectFit";

export default class BrowseDetailAssetSection extends Component {
  renderImage = () => {
    const { carDetailData } = this.props;

    const share_image = get(carDetailData, "assets.assets[0].url") || carDetailData.image_url || defaultCarImg;

    let title;
    if (carDetailData) {
      title = getCarName({
        year: carDetailData && carDetailData.year,
        make: carDetailData && carDetailData.make,
        model: carDetailData && carDetailData.model,
        bodyStyle: carDetailData && carDetailData.body_style,
        trim: carDetailData && carDetailData.trim_name,
        kind: "long"
      });
    }
    return (
      <div className="browse-car-detail-image">
        <ArticleMetaTags
          metaKeyword={carDetailData.seo_keywords}
          metaDescription={carDetailData.article_text}
          title={carDetailData.seo_meta_name || carDetailData.name}
          url={window.location.href}
          imageUrl={share_image}
        />
        <Responsive className="browse-car-detail-image-inner">
          {width => {
            const assetImage = get(carDetailData, "assets.assets[0].path");
            const image = cloudFrontImage(assetImage, width) || carDetailData.image_url || defaultCarImg;

            return (
              <ObjectFit fit="contain" tag="img">
                <img src={image} alt={title} />
              </ObjectFit>
            );
          }}
        </Responsive>
      </div>
    );
  };

  render() {
    return this.renderImage();
  }
}
