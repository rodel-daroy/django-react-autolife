import React from "react";
import PropTypes from "prop-types";
import FeatureSpot from "components/common/FeatureSpot";
import FeatureSpotCarousel from "components/common/FeatureSpotCarousel";
import ASpotBody from "components/common/ASpotBody";
import memoizeOne from "memoize-one";

const getLink = tile => {
  if (tile.tile_cta_link) return tile.tile_cta_link;
  else return `/content/${tile.tile_cta_article}`;
};

const splitHeading = heading => {
  const parts = (heading || "").split("|");

  return (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          <br />
        </span>
      ))}
    </span>
  );
};

const getAssetType = tile => {
  const asset = tile.tile_asset[0];
  console.log(asset, "assetsss");
  switch (asset.asset_type) {
    case "image": {
      return {
        kind: "image",
        images: asset.asset_url
      };
    }
    case "carousel": {
      return {
        kind: "image",
        images: asset.asset_url
      };
    }
    case "video": {
      return {
        kind: "video",
        video: asset.asset_url,
        muteVideo: true,
        fullVideo: asset.asset_url
      };
    }

    default:
      return null;
  }
};

const renderItem = (item, key) => (
  <FeatureSpot
    key={key}
    // frameContent={item.sponsor && <Sponsor name={item.sponsor.name} image={item.sponsor.logo} />}
    {...getAssetType(item)}
  >
    <ASpotBody
      heading={splitHeading(item.tile_headline)}
      synopsis={splitHeading(item.tile_subheadline)}
      link={getLink(item)}
      linkLabel={item.tile_cta_text}
      target={item.linked_outside ? "_blank" : null}
    />
  </FeatureSpot>
);

const renderItems = memoizeOne(data => data.map((item, i) => renderItem(item, i)));

const FeatureSpotCarouselContainer = ({ data, ...otherProps }) => {
  if (data.length > 1) {
    return (
      data.length > 1 && (
        <FeatureSpotCarousel {...otherProps}>
          {renderItems(data)}
        </FeatureSpotCarousel>
      )
    );
  }
  return renderItem(data[0]);
};

FeatureSpotCarouselContainer.propTypes = {
  data: PropTypes.array
};

export default FeatureSpotCarouselContainer;
