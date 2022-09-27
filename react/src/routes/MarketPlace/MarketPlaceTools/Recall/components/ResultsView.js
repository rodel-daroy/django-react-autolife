import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from 'components/Navigation/Breadcrumbs';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getRecall } from 'redux/actions/recallActions';
import RecallList from './RecallList';
import OtherTools from '../../components/OtherTools';
import { CBBTOOLS } from 'config/constants';
import get from 'lodash/get';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import ToolsCarSelectorForm from '../../components/ToolsCarSelectorForm';
import './ResultsView.scss';

class ResultsView extends Component {
  componentDidMount() {
    this.performSearch(this.props.match.params);
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (match !== prevProps.match) this.performSearch(match.params);
  }

  performSearch = ({ year, make, model }) => {
    const { accessToken } = this.props;
    this.props.getRecall(year, make, model, accessToken);
  };

  handleSearch = ({ year, make, model }) => {
    this.props.history.replace(
      `/market-place/tools/recall/${year}/${make}/${model}`
    );
  };

  render() {
    const { match, loading, recall } = this.props;
    const { year, make, model } = match.params;

    return (
      <article className="recall-results-view">
        <ArticleMetaTags title="Recall Check" />

        <div className="page-width">
          <div className="content-container">
            <div className="content-strip">
              <div className="text-container text-center">
                <div className="offset-header">
                  <ToolsCarSelectorForm
                    form="recallResults"
                    initialValues={{ year, make, model }}
                    title="Recall Check"
                    submitText="Search"
                    onSubmit={this.handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb link="/market-place" name="Marketplace" />
                <Breadcrumbs.Crumb name="Recall Check" />
              </Breadcrumbs>
            </div>

            <div className="text-container">
              <div className="recall-results-view-list">
                <RecallList
                  loading={loading}
                  list={recall}
                  year={year}
                  make={make}
                  model={model}
                />
              </div>

              <OtherTools currentTool={CBBTOOLS.RECALL} />
            </div>
          </div>
        </div>
      </article>
    );
  }
}

ResultsView.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getRecall: PropTypes.func.isRequired,
  recall: PropTypes.any,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  recall: state.recall.recall,
  loading: state.recall.loading,
  accessToken: get(state, 'user.authUser.accessToken')
});

export default withRouter(
  connect(
    mapStateToProps,
    { getRecall }
  )(ResultsView)
);
