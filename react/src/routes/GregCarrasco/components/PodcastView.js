import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Parser from 'rss-parser';
import PodcastFeed from './PodcastFeed';
import Spinner from 'components/common/Spinner';
import './PodcastView.scss';

const RSS_URL = 'https://www.omnycontent.com/d/playlist/fdc2ad13-d199-4e97-b2db-a59300cb6cc2/6fd64081-5cf5-4d38-a80c-a5d9014fe82b/9d2233ff-7109-47bd-a5bb-a5da0131f9d4/podcast.rss';

class PodcastView extends Component {
  constructor(props) {
    super(props);

    this.loadFeed();
  }

  state = {
    loading: true
  }

  async loadFeed() {
    const { url } = this.props;

    const parser = new Parser();
    try {
      const feed = await parser.parseURL(url);

      this.setState({
        feed,
        loading: false
      });

      //console.log({ feed });
    }
    catch(error) {
      this.setState({ error });
    }
  }

  render() { 
    const { feed, loading } = this.state;

    return (
      <div className="podcast-view">
        {loading && (
          <Spinner scale={.5} />
        )}
        {!loading && (
          <PodcastFeed feed={feed} />
        )}
      </div>
    );
  }
}

PodcastView.propTypes = {
  url: PropTypes.string.isRequired
};

PodcastView.defaultProps = {
  url: RSS_URL
};
 
export default PodcastView;