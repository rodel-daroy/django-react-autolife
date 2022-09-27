import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import ArticlePanel from "./ArticlePanel";
import { formValueSelector, change } from "redux-form";
import { connect } from "react-redux";
import WeightIndicator from "./WeightIndicator";
import { getTagging } from "redux/actions/CMSPageAction";
import { accessToken } from "redux/selectors/userSelectors";
import orderBy from "lodash/orderBy";
import ResponsiveModal from "components/common/ResponsiveModal";
import ArticleTaggingForm from "./ArticleTaggingForm";
import cloneDeep from "lodash/cloneDeep";
import "./ArticleTaggingPanel.scss";

const ArticleTaggingPanel = ({ 
  includeInArticles, 
  includeInHomepage, 
  getTagging, 
  accessToken, 
  tagging, 
  tag, 
  form, 
  change 
}) => {
  useEffect(() => {
    getTagging(accessToken);
  }, []);

  const weights = useMemo(() => {
    const articleTags = Object.assign({}, ...(tag || []));

    const interests = (tagging || []).find(t => t.label === "interests");

    if(interests)
      return interests.children.map(tag => ({
        id: tag.id,
        label: tag.label,
        value: articleTags[tag.id] || 0
      }));

    return [];
  }, [tagging, tag]);

  const zeroWeight = useMemo(() => {
    const articleTags = Object.assign({}, ...(tag || []));
    const totalWeight = Object.values(articleTags).reduce((prev, cur) => prev + cur, 0);

    return totalWeight === 0;
  }, [tag]);

  const weightIndicators = useMemo(() => {
    if(weights) {
      return orderBy(weights, ["value"], ["desc"]).map(weight => (
        <WeightIndicator
          key={weight.id}
          label={weight.label}
          value={weight.value} />
      ));
    }
  }, [weights]);

  const [editVisible, setEditVisible] = useState(false);
  const handleEdit = () => setEditVisible(true);

  const handleSubmit = values => {
    const { weights, ...otherProps } = values;
    
    let updateTag = cloneDeep(tag);

    const changeTag = (id, value) => {
      let index = updateTag.findIndex(t => t[id] != null);
      if(index === -1)
        index = updateTag.length;

      const newEntry = { [id]: value };

      updateTag[index] = newEntry;
      change(form, `tag[${index}]`, newEntry);
    };

    for(const weight of weights)
      changeTag(weight.id, weight.value);

    for(const [key, value] of Object.entries(otherProps))
      change(form, key, value);

    setEditVisible(false);
  };

  const handleClose = e => {
    if(e)
      e.stopPropagation();
    setEditVisible(false);
  };

  return (
    <React.Fragment>
      <ArticlePanel title="Tagging" onEdit={handleEdit}>
        <div className="article-tagging-panel">
          <div className="article-tagging-panel-weights">
            {(!zeroWeight && weightIndicators) || (
              <ArticlePanel.CheckItem>
                Interests tagged
              </ArticlePanel.CheckItem>
            )}
          </div>
          
          <ArticlePanel.CheckItem checked={includeInArticles}>
            Included in articles section
          </ArticlePanel.CheckItem>
          <ArticlePanel.CheckItem checked={includeInHomepage}>
            Included in home page
          </ArticlePanel.CheckItem>
        </div>
      </ArticlePanel>

      {editVisible && (
        <ResponsiveModal onClose={handleClose}>
          <ResponsiveModal.Block position="left">
            <ArticleTaggingForm 
              initialValues={{
                weights,
                "available_in_trends": includeInArticles,
                "homepage_availability": includeInHomepage
              }} 
              onSubmit={handleSubmit} 
              onCancel={handleClose} />
          </ResponsiveModal.Block>
        </ResponsiveModal>
      )}
    </React.Fragment>
  );
};

ArticleTaggingPanel.propTypes = {
  form: PropTypes.string.isRequired,

  includeInArticles: PropTypes.bool,
  includeInHomepage: PropTypes.bool,
  getTagging: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
  tagging: PropTypes.array,
  tag: PropTypes.array
};

const mapStateToProps = (state, { form }) => {
  const formValue = formValueSelector(form);

  return {
    includeInArticles: formValue(state, "available_in_trends"),
    includeInHomepage: formValue(state, "homepage_availability"),
    tag: formValue(state, "tag"),
    accessToken: accessToken(state),
    tagging: state.page.tagging
  };
};
 
export default connect(mapStateToProps, { getTagging, change })(ArticleTaggingPanel);