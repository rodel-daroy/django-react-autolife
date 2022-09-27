import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import '../src/styles/icons/autolife/css/autolife.css';
import '../src/styles/main.scss';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  addDecorator(withKnobs);
  
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
