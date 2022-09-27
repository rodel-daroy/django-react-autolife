import React, { Component } from 'react';
import PropTypes from 'prop-types';
import truncate from 'lodash/truncate';
import moment from 'moment';
import PlayButton from 'components/Forms/PlayButton';
import AudioPlayer from 'react-h5-audio-player';
import './PodcastFeed.scss';

const formatContent = (title, content) => {
  return truncate(content || '', { length: 255, separator: ' ' })
    .replace(/\r\n/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(new RegExp(`${title}[\\.]*`, 'g'), '');
};

class Episode extends Component {
  state = {
    playing: false,
    paused: false
  }

  handlePlay = () => {
    const { onPlay } = this.props;

    this.setState({ 
      playing: true,
      paused: false
    });

    if(this._player)
      this._player.audio.play();

    if(onPlay)
      onPlay();
  }

  pause = () => {
    const { playing } = this.state;

    if(playing) {
      this.setState({ paused: true });
      this._player.audio.pause();
    }
  }

  handleEnded = () => {
    this.setState({
      paused: true
    });
  }

  render() {
    const { title, contentSnippet, isoDate, enclosure: { url } } = this.props;
    const { playing, paused } = this.state;

    return (
      <div className="podcast-feed-episode">
        <div className="podcast-feed-episode-play">
          <PlayButton 
            onClick={(!playing || paused) ? this.handlePlay : this.pause} 
            playState={(playing && !paused) ? 'pause' : 'play'} />
        </div>
        <div className="podcast-feed-episode-content">
          <h4>{title}</h4>
          <h5>{moment(isoDate).format('LL')}</h5>

          <div className="podcast-feed-episode-text">
            <p>{formatContent(title, contentSnippet)}</p>
          </div>

          {playing && (
            <div className="podcast-feed-episode-player">
              <AudioPlayer 
                ref={ref => this._player = ref} 
                src={url} 
                autoPlay
                onEnded={this.handleEnded} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

class PodcastFeed extends Component {
  constructor(props) {
    super(props);

    this._episodes = [];
  }

  handlePlay = i => () => {
    for(let j = 0; j < this._episodes.length; ++j) {
      if(this._episodes[j] && j !== i)
        this._episodes[j].pause();
    }
  }

  render() {
    const { feed, maxItems } = this.props;

    if(feed) {
      const { items } = feed;
  
      return (
        <section className="podcast-feed">
          {feed && items.slice(0, maxItems).map((item, i) => (
              <Episode 
                key={item.guid} 
                {...item} 
                ref={ref => this._episodes[i] = ref}
                onPlay={this.handlePlay(i)} />
            ))}
        </section>
      );
    }
    
    return null; 
  }
}

PodcastFeed.propTypes = {
  feed: PropTypes.object,
  maxItems: PropTypes.number
};

PodcastFeed.defaultProps = {
  maxItems: 10
};
 
export default PodcastFeed;