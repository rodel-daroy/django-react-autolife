import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { PageStepperSmall } from "components/Navigation/PageStepper";
import Spinner from "components/common/Spinner";
import TextField from "components/Forms/TextField";
import useArticleList from "./useArticleList";
import { useDebounce } from "use-debounce";
import ArticlesCheckList from "./ArticlesCheckList";
import "./AllArticlesCheckList.scss";

const AllArticlesCheckList = ({ filter: inputFilter, pageSize, onSelect, selected }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState(inputFilter || '');

  useEffect(() => {
    if(inputFilter && inputFilter !== filter)
      setFilter(inputFilter);
  }, [inputFilter]);

  const [debouncedFilter] = useDebounce(filter, 300);
  const list = useArticleList({ filter: debouncedFilter, pageIndex, pageSize });

  useEffect(() => {
    if(!list.loading && pageIndex >= list.pageCount)
      setPageIndex(Math.max(0, list.pageCount - 1));
  }, [list]);

  const currentPage = useMemo(() => {
    return (list.currentPage || []).map(a => ({
      id: a.content_id,
      slug: a.slug,
      heading: a.heading,
      subHeading: a.sub_heading,
      synopsis: a.synopsis,
      date: a.date
    }));
  }, [list.currentPage]);

  return (
    <div className="all-articles-checklist">
      <TextField 
        prefix={<span className="icon icon-search"></span>} 
        placeholder="Search articles"
        value={filter}
        onChange={setFilter} />

      <ArticlesCheckList articles={currentPage} selected={selected} onSelect={onSelect} />

      {list.pageCount > 1 && (
        <PageStepperSmall 
          className="all-articles-checklist-stepper"
          count={list.pageCount}
          index={pageIndex}
          onChange={setPageIndex} />
      )}

      {list.loading && <Spinner color="lightgrey" />}
    </div>
  );
};

AllArticlesCheckList.propTypes = {
  filter: PropTypes.string,
  pageSize: PropTypes.number,
  onSelect: PropTypes.func,
  selected: PropTypes.array
};

AllArticlesCheckList.defaultProps = {
  selected: []
};
 
export default AllArticlesCheckList;