import React from 'react';
import PropTypes from 'prop-types';

const SortTemplateList = (props) => (
  <div style={{float:'right'}}>
    <div onClick={props.onClickUpArrow} style={{cursor: 'pointer'}}>
      <i className="fa fa-sort-up list_sort_up" style={{fontSize: '20px'}}></i>
    </div>
    <div onClick={props.onClickDownArrow} style={{marginTop: '-13px', cursor: 'pointer'}}>
      <i className="fa fa-sort-down list_sort_down" style={{fontSize: '20px'}}></i>
    </div>
  </div>
);

SortTemplateList.propTypes = {
  onClickUpArrow: PropTypes.func,
  onClickDownArrow: PropTypes.func
};

export default SortTemplateList;
