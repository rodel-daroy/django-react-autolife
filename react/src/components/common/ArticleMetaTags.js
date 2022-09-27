import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import { defaultDescription, defaultImageUrl } from "../../config/constants";

const ArticleMetaTags = props => {
  const {
    metaDescription,
    title,
    metaKeyword,
    url,
    imageUrl,
    assetsType,
    noSuffix,
    videoUrl
  } = props;
  const hasTitle = title && title.toString().length > 0;
  let formattedTitle = title;
  if (hasTitle && !noSuffix) {
    formattedTitle = `${title} | AutoLife`;
  }
  return (
    <MetaTags>
      {hasTitle && <title id="pageTitle">{formattedTitle}</title>}
      <link
        id="canonicalLink"
        rel="canonical"
        href={url || window.location.href}
      />
      <meta
        id="metaDescription"
        name="description"
        content={metaDescription || defaultDescription}
      />
      <meta id="metaKeyword" name="keywords" content={metaKeyword || ""} />
      <meta id="fbAppId" property="fb:app_id" content="2009066502454251" />
      <meta id="ogType" property="og:type" content="article" />
      <meta
        id="ogUrl"
        property="og:url"
        content={url || window.location.href}
      />
      <meta
        id="ogTitle"
        property="og:title"
        content={title || formattedTitle}
      />
      <meta
        id="ogDescription"
        property="og:description"
        content={metaDescription || defaultDescription}
      />

      {assetsType === "video" ? (
        <Fragment>
          <meta
            id="ogVideo"
            property="og:video"
            content={imageUrl || defaultImageUrl}
          />
          <meta
            id="ogVideo"
            property="og:video:secure_url"
            content={imageUrl || defaultImageUrl}
          />
          <meta id="ogVideoWidth" property="og:video:width" content="270" />
          <meta id="ogVideoHeight" property="og:video:height" content="284" />
        </Fragment>
      ) : (
        <Fragment>
          <meta
            id="ogImage"
            property="og:image"
            content={imageUrl || defaultImageUrl}
          />
          <meta id="ogImageWidth" property="og:image:width" content="270" />
          <meta id="ogImageHeight" property="og:image:height" content="284" />
        </Fragment>
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TwitterDev" />
      <meta
        id="twitterTitle"
        name="twitter:title"
        content={title || formattedTitle}
      />
      <meta
        id="twitterDescription"
        name="twitter:description"
        content={metaDescription}
      />
      <meta name="twitter:image" content={imageUrl || defaultImageUrl} />
    </MetaTags>
  );
};
export default ArticleMetaTags;

ArticleMetaTags.defaultProps = {
  assetsType: "image"
};
