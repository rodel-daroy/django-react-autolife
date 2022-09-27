import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FilterDropdown from "./FilterDropdown";
import {
  sortDataByPublishingState,
  templateName,
  sortDataByPublishingDate
} from "config/constants";
import moment from "moment";
import debounce from "lodash/debounce";
import SortTemplateList from "./SortTemplateList";
import "routes/CMSPage/components/style.scss";
import "styles/icons/font-awesome/scss/font-awesome.scss";
import {
  getTemplateList,
  deleteTemplates
} from "redux/actions/CMSTemplateListingViewActions";
import PrimaryButton from "components/Forms/PrimaryButton";
import DropdownField from "components/Forms/DropdownField";
import TextField from "components/Forms/TextField";
import LoadingOverlay from "components/common/LoadingOverlay";
import PagedList from "components/Layout/PagedList";
import "./CMSTemplateListingView.scss";

class CMSTemplateListingView extends Component {
  state = {
    currentFilterQuery: {},
    sort: {},
    pageIndex: 0,
    key: 0,
    searchText: null
  };

  static getDerivedStateFromProps(props, state) {
    const { location: { state: newState = {} } } = props;

    return {
      currentFilterQuery: newState.currentFilterQuery || state.currentFilterQuery,
      sort: newState.sort || state.sort,
      pageIndex: (typeof newState.pageIndex === 'number') ? newState.pageIndex : state.pageIndex,
      key: newState.key || state.key,
      searchText: (typeof state.searchText === 'string' || !newState.currentFilterQuery) ? state.searchText : newState.currentFilterQuery.searchText
    };
  }

  trashArticleConfirm = id => {
    const { deleteTemplates, history, location } = this.props;
    const { key } = this.state;

    deleteTemplates(id)
      .then(data => {
        if (data.status === 200) {
          toast.success("Template Deleted SuccessFully", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }

        history.replace({
          ...location,
          state: {
            key: key + 1
          }
        });
      });
  };

  confirmDeleteSelectedTemplate = id => {
    confirmAlert({
      title: " ",
      message: "Are you sure you want to delete this article?",
      confirmLabel: "Ok",
      cancelLabel: "Cancel",
      onConfirm: () => {
        this.trashArticleConfirm(id);
      }
    });
  }

  updateSort(sort, sortDirection = "asc") {
    const { history, location } = this.props;
    const { key } = this.state;

    const newSort = {
      sort,
      sortDirection
    };

    history.replace({
      ...location,
      state: {
        sort: newSort,
        key: key + 1
      }
    });
  }

  updateFilterQuery(query) {
    const { currentFilterQuery, key } = this.state;
    const { history, location } = this.props;

    const newFilterQuery = {
      ...currentFilterQuery,
      ...query
    };

    history.replace({
      ...location,
      state: {
        currentFilterQuery: newFilterQuery,
        pageIndex: 0,
        key: key + 1
      }
    });
  }

  filterDataByState = state => {
    this.updateFilterQuery({ state });
  };

  filterDataByDate = date => {
    this.updateFilterQuery({ date });
  }

  updateSearch = debounce(searchText => {
    this.updateFilterQuery({ searchText });
  }, 500)

  handleContentSearch = searchText => {
    this.setState({ searchText });
    this.updateSearch(searchText);
  }

  handleCMSTemplateFilter = item => {
    this.updateFilterQuery({
      template: item.value
    });
  };

  handlePageChange = pageIndex => {
    const { history, location } = this.props;

    history.replace({
      ...location,
      state: {
        pageIndex
      }
    });
  }

  _renderCMSTemplateList() {
    const { templateList, loading } = this.props;
    const { pageIndex, key } = this.state;

    return (
      <PagedList
        key={`list-${key}`}
        totalCount={templateList.total_count || 0}
        pageSize={20}
        pageIndex={pageIndex}
        onChange={this.handlePageChange}
        onRangeChange={this.handleRangeChange}
        jumpList>

        {() => (
          <div className="cms-template-listing-view-table">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    Template Name
                    <SortTemplateList
                      onClickUpArrow={() => this.updateSort("template", "asc")}
                      onClickDownArrow={() => this.updateSort("template", "dsc")} />
                  </th>
                  <th>
                    {" "}
                    Content Headline
                    <SortTemplateList
                      onClickUpArrow={() => this.updateSort("content_name", "asc")}
                      onClickDownArrow={() => this.updateSort("content_name", "dsc")} />
                  </th>
                  <th>
                    Published State
                    <SortTemplateList
                      onClickUpArrow={() => this.updateSort("publish_state", "asc")}
                      onClickDownArrow={() => this.updateSort("publish_state", "dsc")} />
                  </th>
                  <th>
                    Created On
                    <SortTemplateList
                      onClickUpArrow={() => this.updateSort("created_on", "asc")}
                      onClickDownArrow={() => this.updateSort("created_on", "dsc")} />
                  </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    {" "}
                    Action{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(templateList.result || []).map((list, i) => {
                  return (
                    <tr key={i}>
                      <td>{list.id}</td>
                      <td>{list.template}</td>
                      <td>{list.content_name}</td>
                      <td>{list.publish_state}</td>
                      <td>{moment(list.created_on).format("DD/MM/YYYY")}</td>
                      <td className="cms-template-listing-view-actions">
                        <Link className="btn btn-link primary-link" to={`/page/` + list.id}>
                          Edit
                        </Link>
    
                        <button 
                          type="button" 
                          className="btn btn-link primary-link" 
                          onClick={() => this.confirmDeleteSelectedTemplate(list.id)}>
    
                          Delete
                        </button>
    
                        {list.completed && (
                          <Link className="btn btn-link primary-link" to={`/content/preview/` + list.id}>
                            Preview
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {loading && (
              <LoadingOverlay color="lightgrey" />
            )}
          </div>
        )}
      </PagedList>
    );
  }

  renderStatesDropdown() {
    const { currentFilterQuery } = this.state;

    return (
      <FilterDropdown
        selectLists={sortDataByPublishingState.data}
        filterDataByState={this.filterDataByState}
        filterText="Filter By State"
        form="stateFilter"
        value={currentFilterQuery.state}
      />
    );
  }

  renderTemplateListFilterDropdown() {
    const { currentFilterQuery } = this.state;

    return (
      <DropdownField
        className="cms-template-listing-view-template-name-filter"
        placeholder="Filter by Template Name"
        options={templateName.data.map((item) => ({
          label: item.name,
          value: item.value
        }))}
        onChange={this.handleCMSTemplateFilter}
        value={currentFilterQuery.template}
        size="small"
        noBorder
        searchable={false} />
    );
  }

  renderPublishedDateDropdown() {
    const { currentFilterQuery } = this.state;

    return (
      <FilterDropdown
        selectLists={sortDataByPublishingDate.data}
        filterDataByState={this.filterDataByDate}
        filterText="Filter By Date"
        form="dateFilter"
        value={currentFilterQuery.date}
      />
    );
  }

  handleRangeChange = ({ startIndex, endIndex }) => {
    const { getTemplateList } = this.props;
    const { currentFilterQuery, sort } = this.state;

    getTemplateList({
      startIndex,
      count: endIndex - startIndex,
      filter: currentFilterQuery,
      ...sort
    });
  }

  render() {
    const { searchText } = this.state;

    return (
      <div className="cms-template-listing-view offset-header content-container">
        <div className="text-container" style={{ background: "white" }}>
          <h1>
            Articles
          </h1>
          <PrimaryButton className="first" link="/page">
            Create article
          </PrimaryButton>
          <br />
          <div>
            <div className="cms-template-listing-view-filter">
              {this.renderTemplateListFilterDropdown()}

              <TextField
                type="text"
                className="cms-template-listing-view-search"
                placeholder="Search by content headline..."
                onChange={this.handleContentSearch}
                prefix={(
                  <span className="icon icon-search"></span>
                )}
                onFocus={e => e.target.select()}
                value={searchText} />

              <div className="cms-template-listing-view-states">
                {this.renderStatesDropdown()}
                {this.renderPublishedDateDropdown()}
              </div>
            </div>
            {this._renderCMSTemplateList()}
          </div>
        </div>
      </div>
    );
  }
}

CMSTemplateListingView.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    templateList: state.templates.templateList,
    loading: state.templates.loading
  };
}

const mapDispatchToProps = {
  getTemplateList,
  deleteTemplates
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMSTemplateListingView);
