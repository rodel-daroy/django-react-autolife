import React from 'react'
import {Field} from 'redux-form'
import {connect} from 'react-redux'
import { selectBreadCrumbs, TagInputNumber, RFTextField } from '../RFInputField'
import HtmlEditor from './HtmlEditor'
const required = message => value => value ? undefined : message

const breadcrumbsList = [
    {id: '1', name: 'Home'},
    {id: '2', name: 'Articles'},
    {id: '3', name: 'Promotion'}
  ]
class ArticleSection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

      const{ partnerList,initialValues } = this.props
        return (
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 bordered-column">
              <h4 className="column-heading">Article</h4>
              <div className="form-group">
                <label className='control-label col-sm-3 col-md-2' >Article Headline</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ TagInputNumber }
                    id="article_headline" name="headline" type="text"
                    validate={[required("Please enter article headline")]}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className='control-label col-sm-3 col-md-2' >Article Subheading</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ TagInputNumber }
                    id="subheading" name="subheading" type="text"
                    validate={[required("Please enter article subheading")]}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className='control-label col-sm-3 col-md-2' >Article Byline</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ TagInputNumber }
                    id="article_byline" name="byline" type="text"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className='control-label col-sm-3 col-md-2' >Article byline Link</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ TagInputNumber }
                    id="article_byline" name="byline_link" type="text"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3 col-md-2">Article Synopsis</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ RFTextField }
                    id="article_synopsis" name="synopsis" rows="5"
                    validate={[required("Please enter article synopsis")]}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3 col-md-2">Article Body</label>
                <div className='col-sm-9 col-md-10'>
                  <Field
                    component={ HtmlEditor }
                    id="article_body" name="body" rows="5"
                    validate={[required("Please enter article body")]}
                    getRawHtmlCallback={this.props.getRawHtmlForArticle}
                    rawHtml={this.props.rawHtml}
                    initialValues={initialValues}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3 col-md-2">Breadcrumbs</label>
                <div className='col-sm-9 col-md-10'>
                <Field name="template"
                   component={selectBreadCrumbs}
                   empty = "Marketplace"
                   name="preview_path"
                   selectLists={breadcrumbsList}
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

export default connect(mapStateToProps, mapDispatchToProps)(ArticleSection)
