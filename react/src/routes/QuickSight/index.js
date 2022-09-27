import React, { Component } from 'react';
import { embedDashboard } from 'amazon-quicksight-embedding-sdk';
import { getAnalyticsUrl } from 'redux/actions/analyticsActions';
import { connect } from 'react-redux';
import get from 'lodash/get';

class QuickSight extends Component {
  embededDashboard = url => {
    var dashboard;
    var containerDiv = document.getElementById('dashboardContainer');
    var options = {
      url,
      container: containerDiv,
      parameters: {
        country: 'United States'
      },
      scrolling: 'yes',
      height: '1000px',
      width: '100%'
    };
    dashboard = embedDashboard(options);
    dashboard.on('error', () => console.log('error'));
    dashboard.on('load', () => console.log('loading'));
  };
  async componentDidMount() {
    const { getAnalyticsUrl, accessToken } = this.props;
    const analyticsUrl = await getAnalyticsUrl(accessToken);
    console.log(analyticsUrl, 'getDashboardUR');
    this.embededDashboard(analyticsUrl);
  }

  render() {
    return <div style={{ paddingTop: '100px' }} id="dashboardContainer"></div>;
  }
}

const mapStateToProps = state => ({
  accessToken: get(state, 'user.authUser.accessToken')
});

const mapDispatchToProps = {
  getAnalyticsUrl
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickSight);
