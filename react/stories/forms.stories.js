import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean, number, date } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import PrimaryButton from '../src/components/Forms/PrimaryButton';
import ContentDecorator from './helpers/ContentDecorator';
import HtmlEditorField from 'components/Forms/HtmlEditorField';
import FieldTest from './helpers/FieldTest';
import RangeField from 'components/Forms/RangeField';
import DateField from 'components/Forms/DateField';

const CURRENT_DATE = new Date();

storiesOf('Forms', module)
  .addDecorator(ContentDecorator)
  .add('Primary button', () => {
    const caption = text('Caption', 'Submit');
    const dark = boolean('Dark', false);
    const size = select('Size', ['large', 'medium', 'small'], 'large');

    return (
      <PrimaryButton size={size} dark={dark} onClick={action('onClick')}>
        {caption}
      </PrimaryButton>
    );
  })
  .add('Html editor', () => {
    const value = text('Value', '<p>Lorem ipsum</p>\n\n<p>Lorem ipsum</p>');
    const state = select('State', ["success", "error", "warning"], "success");
    const helpText = text('Help text');
    const placeholder = text('Placeholder', 'Placeholder');
    const hideLabel = boolean('Hide label', false);

    return (
      <FieldTest 
        as={HtmlEditorField} 
        label="Label" 
        value={value} 
        state={state} 
        helpText={helpText}
        placeholder={placeholder}
        hideLabel={hideLabel} />
    );
  }, {
    knobs: {
      escapeHTML: false
    }
  })
  .add('Range', () => {
    const label = text('Label', 'Label');
    const value = number('Value', 0);
    const min = number('Min', -10);
    const max = number('Max', 10);
    const tickInterval = number('Tick interval', 1);

    return (
      <FieldTest
        as={RangeField}
        type="range"
        label={label}
        value={value}
        min={min}
        max={max}
        tickInterval={tickInterval} />
    );
  })
  .add('Date', () => {
    const label = text('Label', 'Label');
    const value = date('Value', CURRENT_DATE);

    return (
      <FieldTest
        as={DateField}
        label={label}
        value={value} />
    );
  });