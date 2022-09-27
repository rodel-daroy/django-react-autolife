import { connect } from "react-redux";
import Attribution from "components/content/Attribution";
import trim from "lodash/trim";
import get from "lodash/get";

function mapStateToProps(state) {
  const previewData = get(state, "editorial.previewData.data");

  return {
    author: trim(previewData.byline),
    byline_link: trim(previewData.byline_link),
    url: previewData.content_partner ? previewData.content_partner.name : "",
    date: previewData.article_publish_date || new Date()
  };
}

export default connect(mapStateToProps)(Attribution);
