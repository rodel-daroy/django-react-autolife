import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import ColorSwatches from 'routes/CBBDetail/components/ColorSwatches';

storiesOf('CBB Detail', module)
  .add('Color swatches', () => {
		const colors = [
			{
				color: '#ff0000',
				name: 'Red'
			},
			{
				color: '#00ff00',
				name: 'Green'
			},
			{
				color: '#0000ff',
				name: 'Blue'
			},
			{
				color: '#000000',
				name: 'Black'
			}
		];

		const value = text('Value');

		return (
			<ColorSwatches colors={colors} value={value} />
		);
	});