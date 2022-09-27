import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { reduxForm, propTypes } from "redux-form";
import ArticlePublishingPanel from "./ArticlePublishingPanel";
import ArticleTaggingPanel from "./ArticleTaggingPanel";
import ArticleContentSection from "./ArticleContentSection";
import ArticleSEOPanel from "./ArticleSEOPanel";
import CommandBar from "components/common/CommandBar";
import PrimaryButton from "components/Forms/PrimaryButton";
import ArticleRelatedArticlesSection from "./ArticleRelatedArticlesSection";
import { Prompt } from "react-router";
import ErrorSummary from "components/Forms/ErrorSummary";
import ResponsiveModal from "components/common/ResponsiveModal";
import usePrevious from "hooks/usePrevious";
import "./ArticleForm.scss";

const ArticleForm = ({ handleSubmit, form, dirty, reset, onCancel, submitFailed }) => {
  const [submitCount, setSubmitCount] = useState(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const prevSubmitCount = usePrevious(submitCount);
  useEffect(() => {
    if(submitFailed && submitCount !== prevSubmitCount)
      setErrorModalVisible(true);
  }, [submitFailed, prevSubmitCount, submitCount, setErrorModalVisible]);

  const handleFormSubmit = e => {
    setSubmitCount(count => ++count);
    return handleSubmit(e);
  };
  
  const handleCancel = () => {
    reset();
    if(onCancel)
      onCancel();
  };

  return (
    <form className="article-form" onSubmit={handleFormSubmit}>
      <div className="page-width">
        <header className="article-form-header offset-header">
          <div className="article-form-header-inner">
            <ArticlePublishingPanel form={form} />
            <ArticleTaggingPanel form={form} />
            <ArticleSEOPanel form={form} />
          </div>
        </header>

        <ArticleContentSection form={form} />

        <ArticleRelatedArticlesSection form={form} />

        <ErrorSummary form={form} submitCount={submitCount} />

        <CommandBar active={dirty}>
          <div className="article-form-commands-inner">
            <ul className="commands">
              <li>
                <PrimaryButton type="submit">
                  Save changes
                </PrimaryButton>
              </li>

              <li>
                <button type="button" className="btn btn-link" onClick={handleCancel}>
                  <span className="icon icon-x"></span> Cancel changes
                </button>
              </li>
            </ul>
          </div>
        </CommandBar>
        <Prompt when={dirty && !errorModalVisible} message="Are you sure you want to discard your changes?"></Prompt>

        {errorModalVisible && (
          <ResponsiveModal onClose={() => setErrorModalVisible(false)}>
            <ResponsiveModal.Block position="left">
              <ErrorSummary form={form} submitCount={submitCount} />
            </ResponsiveModal.Block>
          </ResponsiveModal>
        )}
      </div>
    </form>
  );
};

ArticleForm.propTypes = {
  ...propTypes,

  onCancel: PropTypes.func
};
 
export default reduxForm({
  form: "article"
})(ArticleForm);