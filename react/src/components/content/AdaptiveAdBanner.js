import React from 'react';
import PropTypes from 'prop-types';
import AdBanner from './AdBanner';
import useElementSize from 'hooks/useElementSize';
import orderBy from 'lodash/orderBy';

const DEFAULT_ZONE_MAP = {
  320: 19,
  728: 18
};

const AdaptiveAdBanner = ({ zoneMap, className }) => {
  const { ref, size } = useElementSize();
  
  let ad = null;
  if(zoneMap) {
    const width = Math.floor(size.width || 0);
    const zoneWidths = orderBy(Object.keys(zoneMap), w => w, ['desc']);

    const zoneWidth = zoneWidths.find(w => w <= width);
    const zoneId = zoneMap[zoneWidth];

    if(zoneId)
      ad = (
        <AdBanner className={className} zoneId={zoneId} />
      );
  }

  return (
    <div ref={ref} className="adaptive-ad-banner">
      {ad}
    </div>
  );
};

AdaptiveAdBanner.propTypes = {
  zoneMap: PropTypes.object,
  className: PropTypes.string
};

AdaptiveAdBanner.defaultProps = {
  zoneMap: DEFAULT_ZONE_MAP
};
 
export default AdaptiveAdBanner;