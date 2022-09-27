import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import ArticleForm from "./ArticleForm";
import { connect } from "react-redux";
import {
  loadArticle, updateArticle, createArticle
} from "redux/actions/articlesEditActions";
import { initialize } from "redux-form";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import { showInfoModal } from "redux/actions/infoModalActions";

const ArticleEditView = ({ 
  match: { params },
  history,
  initialize,
  loadArticle,
  updateArticle,
  createArticle,
  article: { loading, result: article },
  showInfoModal
}) => {
  const { id } = params;
  const newArticle = !id;

  useEffect(() => {
    if(id)
      loadArticle({ id });
    else
      createArticle();
  }, [id]);

  useEffect(() => {
    initialize("article", article);
  }, [article]);

  const handleSubmit = async values => {
    try {
      const article = await updateArticle(values);
      history.replace(`/page/${article.id}`);
    }
    catch(error) {
      showInfoModal('Error', error.toString());
    }
  };

  const handleCancel = () => {
    history.push("/template-list");
  };

  const headline = (article && article.headline) || "Untitled";

  return (
    <React.Fragment>
      <ArticleMetaTags title={`[${newArticle ? "New" : "Edit"}] ${headline}`} />

      <ArticleForm 
        form="article"
        onSubmit={handleSubmit}
        onCancel={handleCancel} />
    </React.Fragment>
  );
};

ArticleEditView.propTypes = {
  match: PropTypes.object.isRequired,

  initialize: PropTypes.func.isRequired,
  loadArticle: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  createArticle: PropTypes.func.isRequired,
  article: PropTypes.object.isRequired,
  showInfoModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  article: state.articlesEdit.article
});
 
export default connect(mapStateToProps, {
  initialize,
  loadArticle,
  updateArticle,
  createArticle,
  showInfoModal
})(withRouter(ArticleEditView));