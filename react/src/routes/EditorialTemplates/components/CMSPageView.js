import React, { Component } from "react";
import EditorialTemplates from "./EditorialTemplates";
import { connect } from "react-redux";
// import Loader from "react-loader";
import get from "lodash/get";
import {
  getSavedTemplateData,
  getArticleData
} from "../../../redux/actions/editorialActions";
// import NotFoundPage from '../../NotFoundURL/components/NotFoundPage';

class CMSPageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound: false
    };
  }

  loadContent = () => {
    const {
      match: {
        params: { content_name },
        path
      },
      getArticleData,
      getSavedTemplateData
    } = this.props;
    const accessToken = get(this.props, "user.authUser.accessToken");

    if (path === "/content/:content_name") {
      getArticleData(accessToken, content_name);
    } else {
      getSavedTemplateData(accessToken, content_name);
    }
  };

  componentDidMount() {
    this.loadContent();
  }

  componentDidUpdate(previousProps) {
    const {
      match: {
        params: { content_name }
      },
      previewData
    } = this.props;

    if (previousProps.match.params.content_name !== content_name) {
      this.loadContent();
    } else {
      if (previousProps.previewData !== previewData) {
        if (
          !previewData ||
          (previewData instanceof Array && previewData.length === 0)
        )
          this.setState({
            notFound: true
          });
      }
    }
  }

  render() {
    const {
      match: { params },
      previewData,
      location,
      loading
    } = this.props;
    const { notFound } = this.state;

    if (notFound) return <div>Hello</div>;
    else {
      if(!loading)
        return (
          <EditorialTemplates
            previewData={previewData}
            parmKey="Default"
            location={location || ""}
            params={params}
          />
        );

      return null;
    }
  }
}

CMSPageView.propTypes = {};

function mapStateToProps(state) {
  return {
    user: state.user,
    previewData: state.editorial.previewData,
    loading: state.editorial.loading
  };
}

const mapDispatchToProps = {
  getSavedTemplateData,
  getArticleData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMSPageView);
