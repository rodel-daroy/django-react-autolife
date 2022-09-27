import React from 'react'
import {Field} from 'redux-form'
import {connect} from 'react-redux'
import {TagRenderSelectField, TagInputNumber, RFTextField, TwoBoxMultiSelect} from '../RFInputField'

export default class RelatedArticleSection extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
      const{ partnerList, heading, name, publishArticles, midleware, params } = this.props
      var nameInput = midleware
      nameInput['name'] = name
        return (
          <div className="row">
              <div className="col-sm-10 col-sm-offset-1 bordered-column">
                  <h4 className="column-heading">{heading}</h4>
                  <div className="row">
                      <Field
                          {...nameInput}
                          component={ TwoBoxMultiSelect }
                          id="twoBoxMultiSelect"
                          options = {publishArticles}
                          params={params}
                      />
              </div>
              </div>
          </div>
        );
    }
}
