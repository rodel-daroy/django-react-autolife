import React from "react";
import { Field } from "redux-form";
import { connect } from "react-redux";
import {
  TagRenderSelectField,
  TagInputNumber,
  TagInputDatePicker
} from "../RFInputField";
import get from "lodash/get";
import moment from "moment";
import {
  getPartnerList,
  getTemplateList
} from "../../../../redux/actions/contentTabActions";

const required = value => (value ? undefined : "Required");

const validateArticleRecieveDate = (value, values) => {
  const selectedDate = moment(values.article_received_date).format(
    "MM-DD-YYYY"
  );
  return changeDateFormat(selectedDate);
};

const validateArticlePublishDate = (value, values) => {
  const selectedDate = moment(values.article_publish_date).format("MM-DD-YYYY");
  return changeDateFormat(selectedDate);
};

const changeDateFormat = selectedDate => {
  const date = new Date();
  // date.setDate(date.getDate() - 1);
  const newDate = new Date(selectedDate);
  if (newDate > date) {
    return "Date can not be greater than current date";
  } else {
    return undefined;
  }
};

class ArticleSourceSection extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getPartnerList(get(this.props, "user.authUser.accessToken"));
    this.props.getTemplateList();
  }
  templateChange = e => {
    const value = e.target.value;
    this.props.templateChange(value);
  };

  render() {
    const { partnerList, templateList } = this.props;
    return (
      <div className="row">
        <div className="col-sm-10 col-sm-offset-1 bordered-column">
          <h4 className="column-heading">Article Source</h4>
          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">
              Article Partner Source
            </label>
            <div className="col-sm-6 col-md-5">
              <Field
                name="partner"
                component={TagRenderSelectField}
                empty="List Of Partners"
                selectLists={partnerList}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">
              Article Recieved Date
            </label>
            <div className="col-sm-6 col-md-5">
              <Field
                component={TagInputDatePicker}
                id="article_received_date"
                name="article_received_date"
                className="datepicker_width"
                validate={[required, validateArticleRecieveDate]}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">
              Article Published On
            </label>
            <div className="col-sm-6 col-md-5">
              <Field
                component={TagInputNumber}
                id="article_publish_date"
                name="article_publish_date"
                readOnly
              />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">
              Article Templates
            </label>
            <div className="col-sm-6 col-md-5">
              <Field
                name="template"
                component={TagRenderSelectField}
                empty="List of Article Templates"
                name="template"
                selectLists={templateList}
                onChange={this.templateChange}
                validate={[required]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    partnerList: state.CMSContentDetails.partnerList,
    templateList: state.CMSContentDetails.templateList,
    user: state.user
  };
}

const mapDispatchToProps = {
  getPartnerList,
  getTemplateList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleSourceSection);
