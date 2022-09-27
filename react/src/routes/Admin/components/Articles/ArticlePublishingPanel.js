import React, { useState } from "react";
import PropTypes from "prop-types";
import ArticlePanel from "./ArticlePanel";
import { formValueSelector, change } from "redux-form";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import ResponsiveModal from "components/common/ResponsiveModal";
import ArticlePublishingForm from "./ArticlePublishingForm";
import { 
  getEffectivePublishState, 
  ALL_PUBLISH_STATES, 
  DRAFT_PUBLISH_STATE, 
  PUBLISHED_STATE, 
  UNAVAILABLE_PUBLISH_STATE, 
  READY_TO_PUBLISH_STATE
} from "./helpers";
import "./ArticlePublishingPanel.scss";

const ArticlePublishingPanel = ({ 
  id, 
  formValues,
  change, 
  form 
}) => {
  const { publishing_state: ps = {}, article_received_date, article_publish_date } = formValues;
  const [editVisible, setEditVisible] = useState(false);

  const handleSubmit = values => {
    for(const [key, value] of Object.entries(values))
      change(form, key, value);

    setEditVisible(false);
  };

  const effectivePublishState = getEffectivePublishState(ps);

  const formatDate = (date, placeholder = "(none)") => (date && moment(date).format("LL")) || placeholder;

  const renderUnpublishDate = (date, placeholder) => {
    const past = date && moment(date).isSameOrBefore(moment());

    return (
      <span className={`article-publishing-panel-unpublish-date ${past ? 'past' : ''}`}>
        {past && <span className="icon icon-past"></span>}
        {formatDate(date, placeholder)}
      </span>
    );
  };

  const handleClose = e => {
    if(e)
      e.stopPropagation();
    setEditVisible(false);
  };

  return (
    <ArticlePanel 
      className={`article-publishing-panel publish-state-${effectivePublishState}`}
      title={ALL_PUBLISH_STATES[effectivePublishState]}
      commands={id && (
        <Link className="btn btn-link primary-link large" to={`/content/preview/${id}`}>
          Preview
        </Link>
      )}
      onEdit={() => setEditVisible(true)}>

      {[DRAFT_PUBLISH_STATE, READY_TO_PUBLISH_STATE].includes(effectivePublishState) && (
        <ArticlePanel.Item label="Received date">
          {formatDate(article_received_date)}
        </ArticlePanel.Item>
      )}

      {[PUBLISHED_STATE, UNAVAILABLE_PUBLISH_STATE].includes(effectivePublishState) && (
        <React.Fragment>
          <ArticlePanel.Item label="Published date">
            {formatDate(article_publish_date)}
          </ArticlePanel.Item>
          <ArticlePanel.Item label="Available from">
            {renderUnpublishDate(ps.do_not_publish_until, "(publish date)")}
          </ArticlePanel.Item>
          <ArticlePanel.Item label="Available until">
            {renderUnpublishDate(ps.unpublishing_on, "(unpublished)")}
          </ArticlePanel.Item>
        </React.Fragment>
      )}

      {editVisible && (
        <ResponsiveModal 
          className="article-publishing-panel-modal"
          overlayClassName="article-publishing-panel-overlay" 
          onClose={handleClose}>
            
          <ResponsiveModal.Block position="left">
            <ArticlePublishingForm 
              initialValues={formValues}
              onSubmit={handleSubmit} 
              onCancel={handleClose} />
          </ResponsiveModal.Block>
        </ResponsiveModal>
      )}
    </ArticlePanel>
  );
};

ArticlePublishingPanel.propTypes = {
  form: PropTypes.string.isRequired,

  id: PropTypes.any,
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired
};

const mapStateToProps = (state, { form }) => {
  const formValue = formValueSelector(form);

  return {
    id: formValue(state, "id"),
    formValues: {
      publishing_state: formValue(state, "publishing_state"),
      article_received_date: formValue(state, "article_received_date"),
      article_publish_date: formValue(state, "article_publish_date")
    }
  };
};
 
export default connect(mapStateToProps, { change })(ArticlePublishingPanel);