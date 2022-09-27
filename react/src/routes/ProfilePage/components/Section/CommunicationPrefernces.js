import React from 'react';
import { Field } from 'redux-form';
import PrimaryButton from '../../../../components/Forms/PrimaryButton';
import { ReduxCheckbox } from '../../../../components/Forms/Checkbox';

export const CommunicationPrefernces = () => (
  <section className="page-section">
    <header className="page-section-header">
      <h3>Communication preferences</h3>
      {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
    </header>
    <div className="page-section-content">
      <div>
        <Field
          component={ReduxCheckbox}
          id="monthly_newsletter_subscription"
          name="communication_preferences.monthly_newsletter_subscription"
          normalize={v => !!v}
          label="AutoLife Monthly Newsletter">

          {/*<a href="#">See Samples <span className="icon icon-angle-right" /></a>*/}
        </Field>
        <Field
          component={ReduxCheckbox}
          id="is_subscribed"
          name="communication_preferences.is_subscribed"
          normalize={v => !!v}
          label="AutoLife Subscription"
        />
      </div>
    </div>
  </section>
);

export default CommunicationPrefernces;
