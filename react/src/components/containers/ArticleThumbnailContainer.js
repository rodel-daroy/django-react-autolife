import React from "react";
import PropTypes from "prop-types";
import ArticleThumbnail from "components/common/ArticleThumbnail";
import ThumbnailSection from "components/common/ThumbnailSection";
import defaultImage from "styles/img/a1.png";

const ArticleThumbnailContainer = ({ articles, ...otherProps }) => {
  return (
    <ThumbnailSection {...otherProps}>
      {articles.map((article, i) => {
        let articleLink = `/content/${article.slug}`;

        if (article.template === "Vehicle Editorial Template") {
          const vehicle = article.vehicle;
          articleLink = `/market-place/browse-detail/${vehicle.id}/${
            vehicle.make
          }/${vehicle.model}`;
        }
        return (
          <ArticleThumbnail
            key={i}
            zoomArticle
            link={articleLink}
            image={{
              url:
                article.image_url || article.asset_url
                  ? article.image_url || article.asset_url
                  : defaultImage
            }}
            title={article.heading}
            content={article.synopsis}
            slug={article.slug}
            thumbnail={article.thumbnail}
            assetType={article.asset_type}
          />
        );
      })}
    </ThumbnailSection>
  );
};

ArticleThumbnailContainer.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object)
};

export default ArticleThumbnailContainer;
