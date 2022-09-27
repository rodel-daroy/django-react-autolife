import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import RelatedArticles from "components/content/RelatedArticles";
import get from "lodash/get";

const SidebarArticles = props => {
  const {
    previewData: {
      data: { secondary_navigation }
    }
  } = props;
  if (secondary_navigation && secondary_navigation.length > 0) {
    return (
      <RelatedArticles orientation="vertical">
        {secondary_navigation.map((item, i) => {
          let image = {};
          const asset = get(item, "assets[0].asset_type", {});
          if (asset === "video") {
            let thumbnail = get(item, "assets[0].thumbnail");
            const { alternate_text: alt } = get(
              item,
              "assets[0].asset_content[0]",
              {}
            );
            image = {
              url: thumbnail,
              alt
            };
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
              content={item.heading}
              link={
                props.match.path === "/content/preview/:content_name"
                  ? `/content/preview/${item.content_id}`
                  : `/content/${item.slug}`
              }
              image={image}
            />
          );
        })}
      </RelatedArticles>
    );
  } else return null;
};

function mapStateToProps(state) {
  return {
    previewData: state.editorial.previewData
  };
}

export default withRouter(connect(mapStateToProps)(SidebarArticles));
