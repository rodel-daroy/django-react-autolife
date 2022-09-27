/* Pagination Component
-------------------------------------------------*/
import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import './style.scss';

const propTypes = {
  items: PropTypes.array,
  onChangePage: PropTypes.func,
  initialPage: PropTypes.number,
};

const defaultProps = {
  initialPage: 1,
};

export default class NumberPagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  handlePageOnSort() {
    const { pager } = this.state;
    this.setPage(pager.currentPage);
  }

  setPage(page) {
    let items = this.props.items;
    let pager = this.state.pager;

    // get new pager object for specified page
    pager = this.getPager(items.length, page);

    // get new page of items from items array
    let pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    // update state
    this.setState({ pager });
    // call change page function in parent component
    this.props.getCurrentPageCallback(pageOfItems, pager);
  }

  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || this.props.limit;

    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage, 
endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    };
  }

  render() {
    let pager = this.state.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
          <div className="pop_up_fa">
              <a className={pager.currentPage === 1 ? 'disabled' : ''} onClick={() => this.setPage(pager.currentPage - 1)}>
                  <i className={`fa fa-angle-left ${this.props.chevron}`} />
                </a>
              <ul className={this.props.className}>
                {pager.pages.map((page, index) =>
                  (<li className={this.props.page_listing+(pager.currentPage === page ? this.props.isActiveList : '')} key={index} onClick={() => this.setPage(page)}>
                        <a className={pager.currentPage === page ? this.props.isActiveColor : ''}>{page}</a>
                    </li>),)}
              </ul>
              <a className={pager.currentPage === pager.totalPages ? 'disabled' : ''} onClick={() => this.setPage(pager.currentPage + 1)}>
                  <i className={`fa fa-angle-right ${this.props.chevron}`}  />
                </a>
            </div>
    );
  }
}

NumberPagination.propTypes = propTypes;
NumberPagination.defaultProps = defaultProps;
