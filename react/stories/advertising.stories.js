import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs';

import ContentDecorator from './helpers/ContentDecorator';
import AdBanner from 'components/content/AdBanner';
import AdaptiveAdBanner from 'components/content/AdaptiveAdBanner';

storiesOf('Advertising', module)
  .addDecorator(ContentDecorator)
  .add('Ad banner', () => {
    const zoneId = number('Zone ID', 1);

    return (
      <AdBanner zoneId={zoneId} />
    );
  })
  .add('Adaptive ad banner', () => {
    return (
      <AdaptiveAdBanner />
    );
  });