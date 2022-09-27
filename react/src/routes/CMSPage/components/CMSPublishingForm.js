import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { sortListByAlphabetsOrder } from '../../../utils/sort';
import { withRouter } from 'react-router-dom';
import {
  TagRenderSelectField,
  TagInputDatePicker,
  TagInputNumber
} from './RFInputField';
import get from 'lodash/get';
import CMSInfo from './Section/CMSInfo';
import {
  getPublishingState,
  postPublishSettings,
  getContentData
} from '../../../redux/actions/CMSPageAction';

const required = value => (value ? undefined : 'Required');

class CMSPublishingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      dateEqual: false,
      dateError: ''
    };
  }

  componentWillMount() {
    const { getPublishingState } = this.props;
    getPublishingState(get(this.props, 'user.authUser.accessToken'));
  }

  submittedPublishSettings = values => {
    const do_not_publish_until = new Date(
      moment(values.do_not_publish_until).format('MM-DD-YYYY')
    );
    const unpublishing_on = new Date(
      moment(values.unpublishing_on).format('MM-DD-YYYY')
    );
    if (unpublishing_on && do_not_publish_until !== '') {
      unpublishing_on.setDate(unpublishing_on.getDate() - 1);
      if (unpublishing_on == do_not_publish_until) {
        this.setState({
          dateEqual: true,
          dateError: 'Published date and Unpublished date can not be same'
        });
        return false;
      } else if (unpublishing_on < do_not_publish_until) {
        this.setState({
          dateEqual: true,
          dateError:
            'Unpublished date should be greater than do not publish until date'
        });
        return false;
      }
    }
    const id = this.props.match.params.id;
    const { postPublishSettings, changeTabs } = this.props;
    console.log(values, 'valuesssss');
    postPublishSettings(
      values,
      get(this.props, 'user.authUser.accessToken'),
      id
    ).then(data => {
      console.log(data, 'foram-data');
      if (data.payload.status === 200) {
        if (this.props.match.params.id) {
          this.props.getContentData(
            this.props.match.params.id,
            get(this.props, 'user.authUser.accessToken')
          );
        }
        changeTabs('openContentTab');
      }
    });
  };

  render() {
    const {
      handleSubmit,
      submitting,
      contentPublishOptions,
      valid,
      publishState
    } = this.props;
    return (
      <article
        className="content-box for-tab-2"
        style={{ display: 'none' }}
        id="tab2"
      >
        <form
          className="form-horizontal"
          onSubmit={handleSubmit(this.submittedPublishSettings)}
        >
          <div className="row">
            <div className="col-sm-6">
              <section className="col-sm-12 bordered-column">
                <h4 className="column-heading">Publishing State</h4>
                <div className="row">
                  <div className="col-sm-12">
                    <Field
                      name="publish_state"
                      component={TagRenderSelectField}
                      empty="Select Publish Content Mode"
                      model="publish_content_mode"
                      selectLists={sortListByAlphabetsOrder(
                        contentPublishOptions
                      )}
                      validate={[required]}
                    />
                  </div>
                </div>
              </section>
            </div>
            <div className="col-sm-6">
              <section className="col-sm-12 bordered-column publishing-res">
                <h4 className="column-heading">Publishing Restrictions</h4>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="control-label col-xs-12 col-sm-5 col-md-4">
                        Do not publish until
                      </label>
                      <div className="col-xs-10 col-sm-5 col-md-6">
                        <Field
                          component={TagInputDatePicker}
                          name="do_not_publish_until"
                          className="form-control datepicker"
                          id="do_not_publish_until"
                        />
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 fa-icon">
                        <i className="fa fa-calendar" />
                      </div>
                    </div>
                    {publishState == 3 ? (
                      <div className="form-group">
                        <label className="control-label col-xs-12 col-sm-5 col-md-4">
                          Article Publish Date
                        </label>
                        <div className="col-xs-10 col-sm-5 col-md-6">
                          <Field
                            component={TagInputDatePicker}
                            name="article_publish_date"
                            className="form-control datepicker"
                            validate={[required]}
                            id="article_publish_date"
                          />
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2 fa-icon">
                          <i className="fa fa-calendar" />
                        </div>
                      </div>
                    ) : null}
                    <div className="form-group">
                      <label className="control-label col-xs-12 col-sm-5 col-md-4">
                        Unpublished On
                      </label>
                      <div className="col-xs-10 col-sm-5 col-md-6">
                        <Field
                          component={TagInputDatePicker}
                          name="unpublishing_on"
                          className="form-control datepicker"
                          id="unpublishing_on"
                        />
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 fa-icon">
                        <i className="fa fa-calendar" />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-offset-4 col-md-6 col-sm-offset-4 col-sm-8 text-right">
                        <div className="checkbox">
                          <label>
                            {' '}
                            <Field
                              component={TagInputNumber}
                              id="no_external_access"
                              name="no_external_access"
                              type="checkbox"
                            />
                            Not for external access
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <br />
              </section>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <CMSInfo />
          <div className="row">
            <div className="col-sm-12 form-btn-sec">
              {!(valid && this.state.clicked) || (
                <span className="error error-container text-right">
                  {' '}
                  Please fill the required fields{' '}
                </span>
              )}
              {this.state.dateEqual && (
                <span className="error error-container text-right">
                  {' '}
                  {this.state.dateError}{' '}
                </span>
              )}
              <button
                type="submit"
                className="form-action"
                disabled={submitting}
                onClick={() => {
                  this.setState({
                    clicked: true,
                    dateEqual: false,
                    dateError: ''
                  });
                }}
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </article>
    );
  }
}

const selector = formValueSelector('CMSPublishingForm');

function mapStateToProps(state) {
  return {
    contentPublishOptions: state.page.contentPublishOptions,
    user: state.user,
    publishState: selector(state, 'publish_state')
  };
}
const mapDispatchToProps = {
  getPublishingState,
  postPublishSettings,
  getContentData
};

CMSPublishingForm = reduxForm({
  form: 'CMSPublishingForm',
  enableReinitialize: true
})(CMSPublishingForm);
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CMSPublishingForm)
);
