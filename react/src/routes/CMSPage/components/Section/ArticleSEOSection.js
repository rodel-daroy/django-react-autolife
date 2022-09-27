import React from 'react'
import {Field} from 'redux-form'
import {connect} from 'react-redux'
import {TagRenderSelectField, TagInputNumber, RFTextField} from '../RFInputField'

class ArticleSEOSection extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount () {
    }

    render() {
      const{ partnerList } = this.props
        return (
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 bordered-column">
              <h4 className="column-heading">SEO</h4>
              <div className="form-group">
                <label className='control-label col-sm-3 col-md-2' >Canonical Link</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ TagInputNumber }
                    id="canonical_link" name="canonical_link" type="text"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3 col-md-2">Meta Name</label>
                <div className='col-sm-9 col-md-10'>
                  <Field name="seo_meta_name"
                     component={TagInputNumber}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className='control-label col-sm-3 col-md-2' >Meta Keyword</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ TagInputNumber }
                    id="meta_keyword" name="seo_keywords" type="text"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3 col-md-2">Meta Description</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ RFTextField }
                    id="meta_description" name="seo_meta_description" rows="5"
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
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleSEOSection)
