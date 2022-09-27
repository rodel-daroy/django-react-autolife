import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, text, array } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import ContentDecorator from './helpers/ContentDecorator';
import ArticleContentSection from 'routes/Admin/components/Articles/ArticleContentSection';
import AppDecorator from './helpers/AppDecorator';
import ArticlePublishingPanel from 'routes/Admin/components/Articles/ArticlePublishingPanel';
import ArticleTaggingPanel from 'routes/Admin/components/Articles/ArticleTaggingPanel';
import { reduxForm } from 'redux-form';
import ArticleForm from 'routes/Admin/components/Articles/ArticleForm';
import WeightIndicator from 'routes/Admin/components/Articles/WeightIndicator';
import AllArticlesCheckList from 'routes/Admin/components/Articles/AllArticlesCheckList';
import RelatedArticlesSelector from 'routes/Admin/components/Articles/RelatedArticlesSelector';
import RelatedArticlesSelectorField from 'routes/Admin/components/Articles/RelatedArticlesSelectorField';
import FieldTest from './helpers/FieldTest';

const Form = reduxForm({})(({ children }) => (
  <form>
    {children}
  </form>
));

storiesOf('Admin', module)
  .addDecorator(AppDecorator)
  .addDecorator(ContentDecorator)
  .add('Article content section', () => {
    return (
      <Form 
        form="test"
        initialValues={{
          headline: 'Heading',
          subheading: 'Subheading',
          body: '<p>Lorem ipsum</p>'
        }}>

        <ArticleContentSection form="test" />
      </Form>
    );
  })
  .add('Article publishing panel', () => {
    return (
      <Form form="test">
        <ArticlePublishingPanel form="test" />
      </Form>
    );
  })
  .add('Article tagging panel', () => (
    <Form form="test">
      <ArticleTaggingPanel form="test" />
    </Form>
  ))
  .add('Article form', () => (
    <ArticleForm />
  ))
  .add('Weight indicator', () => {
    const value = number('Value', 0, {
      range: true,
      min: -10,
      max: 10,
      step: 1
    });
    const label = text('Label', 'label');

    return (
      <WeightIndicator value={value} label={label} />
    );
  })
  .add('All articles checklist', () => {
    const filter = text('Filter');
    const pageSize = number('Page size');
    const selected = array('Selected', []).map(s => parseInt(s));

    return (
      <AllArticlesCheckList 
        filter={filter} 
        pageSize={pageSize} 
        onSelect={action('onSelect')}
        selected={selected} />
    );
  })
  .add('Related articles selector', () => {
    return (
      <RelatedArticlesSelector />
    );
  })
  .add('Related articles selector field', () => {
    const value = array('Value', []).map(a => parseInt(a));

    return (
      <FieldTest as={RelatedArticlesSelectorField} value={value} />
    );
  })