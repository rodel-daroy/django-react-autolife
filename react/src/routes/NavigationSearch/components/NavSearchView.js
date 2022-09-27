import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadMoreThumbnails from "../../../components/content/LoadMoreThumbnails";
import Breadcrumbs from "../../../components/Navigation/Breadcrumbs";
import { getSearchResult } from "../../../redux/actions/searchAction";
import Spinner from "../../../components/common/Spinner";
import ArticleThumbnailContainer from "../../../components/containers/ArticleThumbnailContainer";
import ArticleMetaTags from "../../../components/common/ArticleMetaTags";
import "./style.scss";

class NavSearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: 12
    };
  }

  componentDidMount() {
    const { getSearchResult, location } = this.props;
    const searchParams = location.search;
    console.log(searchParams, "didMount");
    const newParams = searchParams
      .split("=")[1]
      .split("%20")
      .join(" ");
    getSearchResult(newParams);
  }

  componentWillReceiveProps(nextProps) {
    const { getSearchResult, location } = this.props;
    const searchParams = nextProps.location.search;
    const newParams = searchParams
      .split("=")[1]
      .split("%20")
      .join(" ");
    console.log(newParams, "new Props");
    if (nextProps.location.search != location.search) {
      getSearchResult(newParams);
    }
  }

  onClickLoadMore = count => {
    this.setState({
      load: count
    });
  };

  onClickLoadLess = count => {
    this.setState({
      load: count
    });
  };

  render() {
    const { searchData, location, loadingSearchData } = this.props;
    const { load } = this.state;
    const searchParam = location.search
      .split("=")[1]
      .split("%20")
      .join(" ");
    console.log(searchParam, "search");
    return (
      <div className="search-page content-container">
        <ArticleMetaTags title="Search" />

        <div className="page-width">
          <div className="offset-header">
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb link="/search" name="Search" />
              </Breadcrumbs>
              <h1>Articles related to '{searchParam}'</h1>

              {loadingSearchData && (
                <div className="trends-container">
                  {searchData.length > 0 && (
                    <div>
                      <ArticleThumbnailContainer
                        articles={searchData.slice(0, load)}
                      />

                      <LoadMoreThumbnails
                        count={searchData.length}
                        onClickLoadMore={this.onClickLoadMore}
                        onClickLoadLess={this.onClickLoadLess}
                      />
                    </div>
                  )}

                  {searchData.length === 0 && (
                    <h4 className="no-results text-center">
                      No articles found
                    </h4>
                  )}
                </div>
              )}

              {!loadingSearchData && (
                <div style={{ position: "relative", minHeight: 500 }}>
                  <Spinner pulse color="lightgrey" scale={0.5} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchData: state.search.searchData,
    loadingSearchData: state.search.loadingSearchData
  };
}

const mapDispatchToProps = {
  getSearchResult
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavSearchView)
);
