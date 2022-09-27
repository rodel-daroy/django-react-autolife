import React, { useState } from "react";
import PropTypes from "prop-types";
import ArticlePanel from "./ArticlePanel";
import { formValueSelector, change } from "redux-form";
import { connect } from "react-redux";
import ResponsiveModal from "components/common/ResponsiveModal";
import ArticleSEOForm from "./ArticleSEOForm";

const ArticleSEOPanel = ({ keywords, change, form }) => {
  const [editVisible, setEditVisible] = useState(false);

  const handleSubmit = values => {
    for(const [key, value] of Object.entries(values))
      change(form, key, value);

    setEditVisible(false);
  };

  const handleClose = e => {
    if(e)
      e.stopPropagation();
    setEditVisible(false);
  };

  return (
    <ArticlePanel title="SEO" onEdit={() => setEditVisible(true)}>
      {keywords && (
        <ArticlePanel.Item label="Keywords">
          {keywords}
        </ArticlePanel.Item>
      )}
      {!keywords && (
        <ArticlePanel.CheckItem>
          Keywords added
        </ArticlePanel.CheckItem>
      )}

      {editVisible && (
        <ResponsiveModal onClose={handleClose}>
          <ResponsiveModal.Block position="left">
            <ArticleSEOForm 
              initialValues={{
                seo_keywords: keywords
              }}
              onSubmit={handleSubmit} 
              onCancel={handleClose} />
          </ResponsiveModal.Block>
        </ResponsiveModal>
      )}
    </ArticlePanel>
  );
};

ArticleSEOPanel.propTypes = {
  form: PropTypes.string.isRequired,

  keywords: PropTypes.string,
  change: PropTypes.func.isRequired
};

const mapStateToProps = (state, { form }) => {
  const formValue = formValueSelector(form);

  return {
    keywords: formValue(state, "seo_keywords")
  };
};
 
export default connect(mapStateToProps, { change })(ArticleSEOPanel);