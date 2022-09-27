import React from 'react';
import PropTypes from 'prop-types';
import SocialShareModal from 'components/Listings/SocialShareModal';
import Breadcrumbs from 'components/Navigation/Breadcrumbs';

const FeaturedLayout = ({ name, children, url = window.location.href, share }) => (
  <div className="featured-layout">
    <div className="page-width">
      <aside className="content-container">
        <div className="text-container featured-layout-head">
          <div>
            <Breadcrumbs>
              <Breadcrumbs.Crumb name={name} />
            </Breadcrumbs>

            {share && (
              <div className="featured-layout-share-large">
                <SocialShareModal url={url} />
              </div>
            )}
          </div>
        </div>
      </aside>

      {children}

      {share && (
        <aside className="content-container">
          <div className="text-container">
            <div className="featured-layout-share-small">
              <SocialShareModal url={url} />
            </div>
          </div>
        </aside>
      )}
    </div>
  </div>
);

FeaturedLayout.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  children: PropTypes.node.isRequired,
  share: PropTypes.bool
};

FeaturedLayout.defaultProps = {
  share: true
};

FeaturedLayout.Band = ({ className, children, ...otherProps }) => (
  <div {...otherProps} className={`content-container ${className || ''}`}>
    {children}
  </div>
);

FeaturedLayout.Band.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

FeaturedLayout.Band.displayName = 'FeaturedLayout.Band';

export default FeaturedLayout;