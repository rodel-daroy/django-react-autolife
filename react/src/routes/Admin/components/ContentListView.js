import React, { Component } from "react";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import PrimaryButton from "components/Forms/PrimaryButton";
import "./style.scss";

class ContentListView extends Component {
  render() {
    return (
      <div className="content-list-view offset-header content-container">
        <ArticleMetaTags title="Admin" />

        <div className="text-container">
          <h1>Admin</h1>

          <div className="content-list-view-buttons">
            <PrimaryButton className="first" link="/template-list">
              Articles
            </PrimaryButton>

            <PrimaryButton link="/tiles">
              Tiles
            </PrimaryButton>

            <PrimaryButton link="/analytics">
              Analytics
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

export default ContentListView;
