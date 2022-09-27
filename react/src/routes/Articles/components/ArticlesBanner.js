import React from "react";
import FeatureSpot from "components/common/FeatureSpot";
import ASpotBody from "components/common/ASpotBody";
import ArticleRate from "routes/EditorialTemplates/components/EditorialTemplates/Default/Section/ArticleRate";
import Spinner from "components/common/Spinner";
import { connect } from "react-redux";
import get from "lodash/get";
import aSpotImage from "./img/a-spot.jpg";

const ArticlesBanner = ({ featured, authorized }) => {
  if (!authorized)
    return (
      <FeatureSpot images={aSpotImage} kind="image" short scrim="gradient">
        <ASpotBody
          heading="Get the most out of your auto lifestyle"
          synopsis="Personalize your journey &amp; connect to ideas and conversations that inspire you"
          link="?register"
          linkLabel="Sign up"
        />
      </FeatureSpot>
    );

  let content, image, assetType, videoType, fullVideo;

  if (featured) {
    const {
      slug,
      image_url,
      heading,
      thumbnail,
      synopsis,
      asset_type,
      video_thumbnail
    } = featured; // eslint-disable-line

    // console.log(video_thumbnail[2][640], "featured");
    if (asset_type === "video") {
      content = (
        <ASpotBody
          heading={heading}
          synopsis={synopsis}
          rate={<ArticleRate dark noCaption articleId={featured.content_id} />}
          label="Recently added"
          link={`/content/${featured.slug}`}
        />
      );
      image = video_thumbnail[2][640];
      assetType = "video";
      videoType = "video/mp4";
      fullVideo = image_url;
    } else {
      content = (
        <ASpotBody
          heading={heading}
          synopsis={synopsis}
          rate={<ArticleRate dark noCaption articleId={featured.content_id} />}
          label="Recently added"
          link={`/content/${featured.slug}`}
        />
      );
      image = image_url;
      assetType = "image";
    }
  } else {
    content = (
      <div style={{ position: "relative", height: "20vh" }}>
        <Spinner pulse scale={0.5} color="white" />
      </div>
    );
    image = null;
  }

  return (
    <FeatureSpot
      images={image}
      kind={assetType}
      fullVideo={fullVideo}
      short
      scrim="gradient"
    >
      {content}
    </FeatureSpot>
  );
};

const mapStateToProps = state => ({
  authorized: !!get(state, "user.authUser.accessToken")
});

export default connect(mapStateToProps)(ArticlesBanner);
