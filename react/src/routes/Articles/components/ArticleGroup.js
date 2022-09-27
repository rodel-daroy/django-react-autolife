import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ArticleThumbnail from 'components/common/ArticleThumbnail';
import ArticleGroupSlidingArrow from './ArticleGroupSlidingArrow';
import debounce from 'lodash/debounce';
import memoize from 'lodash/memoize';
import { Waypoint } from 'react-waypoint';
import { cloudFrontImage } from 'utils';
import { TweenLite, ScrollToPlugin } from 'gsap/all';
import memoizeOne from "memoize-one";
import './ArticleGroup.scss';

// required to ensure ScrollToPlugin isn't dropped by webpack
// eslint-disable-next-line no-unused-vars
const plugins = [ScrollToPlugin];

const FIRST_ARTICLE_PADDING = 20;

class ArticleGroup extends Component {
  constructor(props) {
    super(props);

    this.loadIndexes = new Set();

    this.state = {
      pageIndex: 0
    }
  }

  static placeholderArticles = memoizeOne(count => new Array(count).fill(undefined))

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    this.updateNav();
    this.triggerLoadMore();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);

    this.handleResize.cancel();
    this.handleScroll.cancel();
    this.triggerLoadMore.cancel();

    clearTimeout(this.animation);

    if(this.pageChangeTween)
      this.pageChangeTween.kill();
  }

  componentDidUpdate(prevProps) {
    const { articles } = this.props;

    if((articles || []).length !== (prevProps.articles || []).length)
      this.updateNav();
  }

  triggerLoadMore = debounce(() => {
    const { onLoad, pageSize } = this.props;

    if(onLoad) {
      let indexes = Array.from(this.loadIndexes).sort((a, b) => a - b);
      this.loadIndexes.clear();

      const startIndex = indexes[0] || 0;

      let endIndex = indexes[indexes.length - 1] || 0;
      const delta = endIndex - startIndex;
      endIndex = startIndex + (Math.ceil(delta / pageSize) + 1) * pageSize - 1;

      onLoad({ startIndex, endIndex });
    }
  }, 500)

  handleEnterWaypoint = memoize(i => () => {
    this.loadIndexes.add(i);

    this.triggerLoadMore();
  })

  renderArticle = (article, i) => {
    const { pageSize } = this.props;

    if(article)
      return (
        <ArticleThumbnail
          key={article.content_id}
          image={cloudFrontImage(article.path, 264, 195)}
          link={`/content/${article.slug}`}
          title={article.heading}
          content={article.synopsis}
          assetType={article.asset_type}
          thumbnail={article.thumbnail}
        />
      );

    if(i % pageSize === 0)
      return (
        <Waypoint key={i} horizontal onEnter={this.handleEnterWaypoint(i)}>
          <ArticleThumbnail loading />
        </Waypoint>
      );

    return <ArticleThumbnail key={i} loading />;
  }

  handleMouseDown = e => {
    clearTimeout(this.animation);

    this.dragState = {
      scrollLeft: this._scroller.scrollLeft,
      clientX: e.clientX,
      startTime: new Date()
    };

    this.endingDrag = false;

    this._scroller.classList.add('mouse-scroll');
  }

  handleMouseMove = e => {
    if(this.dragState) {
      const deltaX = this.dragState.clientX - e.clientX;

      this._scroller.scrollLeft += deltaX;

      this.dragState.clientX = e.clientX;
    }
  }

  handleMouseUp = e => {
    if(this.dragState) {
      const distance = this._scroller.scrollLeft - this.dragState.scrollLeft;

      if(Math.abs(distance) > 2) {
        const time = (new Date() - this.dragState.startTime) / 1000;
        const velocity = Math.round(distance / time);
        const acceleration = Math.round(velocity / time / 1000);

        this.keepScrolling(acceleration);

        this.endingDrag = true;
      }

      this.dragState = null;
    }
  }

  handleClickCapture = e => {
    if(this.endingDrag) {
      e.preventDefault();
      e.stopPropagation();

      this.endingDrag = false;
    }
  }

  keepScrolling(acceleration) {
    const max = this._scroller.scrollWidth - this._scroller.offsetWidth;

    this.animation = setTimeout(() => {
      const scroll = this._scroller.scrollLeft;

      if (scroll !== 0 && scroll !== max && acceleration !== 0) {
          this._scroller.scrollLeft += acceleration;
          acceleration = acceleration > 0 ? acceleration - 1 : acceleration + 1;

          return this.keepScrolling(acceleration);
      }
    }, 10);
  }

  get articleWidth() {
    const firstArticle = this._scroller.firstChild;
    return firstArticle ? (firstArticle.clientWidth - FIRST_ARTICLE_PADDING) : 320;
  }

  get articlesPerPage() {
    return Math.floor(this._scroller.clientWidth / this.articleWidth);
  }

  get pageWidth() {
    return this.articleWidth * this.articlesPerPage;
  }

  get pageCount() {
    const { articles } = this.props;

    return Math.ceil((articles || []).length / this.articlesPerPage);
  }

  get pageIndex() {
    return Math.ceil(this._scroller.scrollLeft / this.pageWidth);
  }

  updateNav = () => {
    if(this._scroller) {
      const { pageCount, pageIndex } = this.state;

      if(this.pageCount !== pageCount || this.pageIndex !== pageIndex) {
        this.setState({
          pageCount: this.pageCount,
          pageIndex: this.pageIndex
        });
      }
    }
  }

  handlePageChange = index => {
    this.setState({
      pageIndex: index
    });

    this._scroller.classList.add('mouse-scroll');

    if(this.pageChangeTween)
      this.pageChangeTween.kill();

    const offset = index * this.pageWidth;
    this.pageChangeTween = TweenLite.to(this._scroller, 1, { 
      scrollTo: { x: offset },
      onStart: () => this.pageChanging = true,
      onComplete: () => this.pageChanging = false
    });
  }

  handleScroll = debounce(() => {
    if(!this.pageChanging)
      this.updateNav();
  }, 50)

  handleResize = debounce(this.updateNav, 200)

  render() {
    const {
      title,
      allLink,
      userRelated,
      totalCount,
      canEdit,
      articles,
      loading,
      pageSize
    } = this.props;
    const { pageCount, pageIndex } = this.state;

    if(!loading && articles && articles.length === 0)
      return null;

    const seeAll = className => articles && pageCount > 1 && (
      <Link to={allLink} className={`btn btn-link primary-link ${className || ''}`}>
        See All&nbsp;({totalCount})
      </Link>
    );

    return (
      <div className="page-section article-group animated fadeIn">
        <div className="page-section-header">
          <div className="text-container">
            <div className="article-group-header">
              <h3>
                {title}
              </h3>
              <Link 
                className="btn btn-link primary-link hidden-xs" 
                to="/profile#subjects" 
                style={{ visibility: (canEdit && userRelated) ? 'visible' : 'hidden' }}
                tabIndex={userRelated ? 0 : -1}>
                
                Edit
              </Link>

              {seeAll('last hidden-sm hidden-md hidden-lg')}
            </div>

            {articles && pageCount > 1 && (
              <div className="articleArrows hidden-xs">
                <ArticleGroupSlidingArrow
                  slideCount={pageCount}
                  index={pageIndex}
                  onChange={this.handlePageChange}
                />
                {seeAll('last hidden-xs')}
              </div>
            )}
          </div>
        </div>
        <div className="article-scroller-wrapper-outer">
          <div 
            ref={ref => this._scroller = ref} 
            className="article-scroller-wrapper"
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseUp}
            onClickCapture={this.handleClickCapture}
            onScroll={this.handleScroll}>

            {(articles || ArticleGroup.placeholderArticles(pageSize)).map((article, i) => (
              <div key={i} className="article-outer">
                {this.renderArticle(article, i)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ArticleGroup.propTypes = {
  title: PropTypes.string,
  articles: PropTypes.array,
  mappingId: PropTypes.number,
  userRelated: PropTypes.bool,
  onLoad: PropTypes.func,
  pageSize: PropTypes.number,
  canEdit: PropTypes.bool,
  totalCount: PropTypes.number,
  loading: PropTypes.bool,
  allLink: PropTypes.any.isRequired
};

ArticleGroup.defaultProps = {
  title: 'Title',
  pageSize: 7
};

export default ArticleGroup;