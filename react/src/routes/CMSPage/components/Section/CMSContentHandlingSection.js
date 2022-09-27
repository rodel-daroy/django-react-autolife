import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change } from "redux-form";
import { TagRenderSelectField, TagInputNumber } from "../RFInputField";
import { contentHandlingCheckbox } from "../../../../config/constants";
import get from "lodash/get";
import NewSponsorPopoup from "./NewSponsorPopoup";
import { sortListByAlphabetsOrder } from "../../../../utils/sort";
import { getSponsorList } from "../../../../redux/actions/editorialCmsActions";

const required = value => (value ? undefined : "Required");

class CMSContentHandlingSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    this.props.getSponsorList(get(this.props, "user.authUser.accessToken"));
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { sponsorList } = this.props;
    return (
      <div className="col-sm-12 col-md-8 col-lg-4">
        <section className="col-sm-12 bordered-column">
          <h4 className="column-heading">Content Handling</h4>
          <div className="form-group">
            <div className="col-md-10">
              <Field
                name="sponsor"
                component={TagRenderSelectField}
                empty="Sponsored List of sponsores"
                selectLists={sortListByAlphabetsOrder(sponsorList)}
              />
            </div>
            <div
              className="cursor-pointer col-xs-2 add-icon"
              onClick={this.onOpenModal}
            >
              <i className="fa fa-plus" />
            </div>
          </div>
          <NewSponsorPopoup
            open={this.state.open}
            onCloseModal={this.onCloseModal}
          />
          <div className="form-group">
            {contentHandlingCheckbox.data.map((data, i) => (
              <div className="col-sm-12" key={i}>
                <div className="checkbox" id="content_handle">
                  <label>
                    <Field
                      component={TagInputNumber}
                      id={i}
                      name={data.name}
                      type="checkbox"
                      removeClass
                      normalize={v => !!v}
                    />
                    {data.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sponsorList: state.CMSDetail.sponsorList,
    user: state.user
  };
}

const mapDispatchToProps = {
  getSponsorList
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMSContentHandlingSection);
