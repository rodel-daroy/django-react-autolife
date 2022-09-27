import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Checkbox from "components/Forms/Checkbox";
import { Link } from "react-router-dom";
import "./ArticlesCheckList.scss";

const ArticlesCheckListItem = ({ article, onClick, selected }) => {
  return (
    <div className={`articles-checklist-item ${selected ? "selected" : ""}`}>
      <Checkbox
        checked={selected}
        onClick={onClick}
        label={(
          <div className="articles-checklist-item-inner">
            <div className="articles-checklist-item-title">
              <div className="articles-checklist-item-heading">{article.heading || article.slug || "(untitled)"}</div>
              <div className="articles-checklist-item-sub">{article.subHeading || article.synopsis}</div>
            </div>

            <div className="articles-checklist-item-date">{moment(article.date).format("YYYY-MM-DD")}</div>
          </div>
        )}>
      </Checkbox>

      <Link className="btn btn-link primary-link" to={`/content/${article.slug || article.id}`} target="_blank">
        <span className="icon icon-link"></span>
      </Link>
    </div>
  );
};

const ArticlesCheckList = ({ articles, selected, onSelect }) => {
  const handleItemClick = article => () => {
    if(onSelect)
      onSelect(article.id, article);
  };

  return (
    <div className="articles-checklist">
      {articles.map(article => (
        <ArticlesCheckListItem 
          key={article.id} 
          article={article} 
          onClick={handleItemClick(article)}
          selected={selected.includes(article.id)} />
      ))}
    </div>
  );
};

ArticlesCheckList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    slug: PropTypes.string,
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    synopsis: PropTypes.string,
    date: PropTypes.string
  })),
  selected: PropTypes.array,
  onSelect: PropTypes.func
};

ArticlesCheckList.defaultProps = {
  articles: [],
  selected: []
};
 
export default ArticlesCheckList;