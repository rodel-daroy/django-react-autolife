import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import RelatedArticles from "components/content/RelatedArticles";
import get from "lodash/get";

const BottomRelatedArticles = props => {
  const {
    previewData: {
      data: { related_articles }
    }
  } = props;
  
  if (related_articles && related_articles.length > 0) {
    const articles = related_articles.slice(0, 4).map((item, i) => {
      let image = {};
      const asset = get(item, "assets[0].asset_type", {});

      if (asset === "video") {
        let thumbnail = get(item, "assets[0].thumbnail");
        console.log(thumbnail, "thumbnail");
        const { alternate_text: alt } = get(
          item,
          "assets[0].asset_content[0]",
          {}
        );
        image = { url: thumbnail, alt };
        console.log(image, "image");
      } else {
        const { url, alternate_text: alt } = get(
          item,
          "assets[0].asset_content[0]",
          {}
        );
        image = {
          url,
          alt
        };
      }

      return (
        <RelatedArticles.Article
          key={i}
          title={item.heading}
          content={item.synopsis}
          link={
            props.match.path === "/content/preview/:content_name"
              ? `/content/preview/${item.content_id}`
              : `/content/${item.slug}`
          }
          image={image}
        />
      );
    });

    return (
      <nav className="page-section">
        <header className="page-section-header">
          <h3>Related Articles</h3>
        </header>

        <div className="page-section-content">
          <RelatedArticles>{articles}</RelatedArticles>
        </div>
      </nav>
    );
  }
  
  return null;
};

function mapStateToProps(state) {
  return {
    previewData: state.editorial.previewData
  };
}

export default withRouter(connect(mapStateToProps)(BottomRelatedArticles));
