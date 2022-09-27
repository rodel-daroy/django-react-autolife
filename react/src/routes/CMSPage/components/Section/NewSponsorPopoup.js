import React from 'react';
import Modal from 'react-responsive-modal';
import { reduxForm, Field } from 'redux-form'
import {TagInputNumber} from '../RFInputField'
import {connect} from 'react-redux'
import {  toast } from 'react-toastify'
import get from 'lodash/get'
import {
  postNewSponsor
} from '../../../../redux/actions/CMSPageAction'

import {
getSponsorList
} from '../../../../redux/actions/editorialCmsActions'

const required = value => value ? undefined : 'Required';
class NewSponsorPopoup extends React.Component {

  constructor (props) {
    super(props);
  }

  addNewSponsor = (values) => {
    const { postNewSponsor, getSponsorList } = this.props
    postNewSponsor( values, get(this.props, 'user.authUser.accessToken')).then((data)=>{
        if(data.status == 200) {
          toast.success("Sponsor added successfully", {
              position: toast.POSITION.BOTTOM_RIGHT
          })
          getSponsorList( get(this.props, 'user.authUser.accessToken'))
          this.props.onCloseModal ()
        }
    })
  }

  render() {
    const {  handleSubmit, submitting } = this.props
    return (
        <Modal open={this.props.open} onClose={this.props.onCloseModal} classNames={{modal: 'custom-modal' }}>
          <form className="form-horizontal" onSubmit={handleSubmit(this.addNewSponsor)}>
          <div className="row">
            <div className="col-md-10">
              <div className="form-group" >
                  <label className='control-label col-sm-7' >Sponsor Name</label>
                  <div className='col-sm-5'>
                    <Field
                        component={ TagInputNumber }
                         name="name" type="text"
                        validate={[required]}
                    />
                  </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-10">
              <div className="form-group" >
                  <label className='control-label col-sm-7'> Sponsor Logo Url</label>
                  <div className='col-sm-5'>
                      <Field
                          component={ TagInputNumber }
                           name="logo" type="text"
                      />
                  </div>
              </div>
            </div>
          </div>
          <button type="submit" className="form-action modal_btn" style={{marginLeft: '92px'}} disabled={submitting}>Add Sponsor</button>
          </form>
        </Modal>
    );
  }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}
const mapDispatchToProps = {
  postNewSponsor,
  getSponsorList
}

NewSponsorPopoup= reduxForm({
    form: 'NewSponsorPopoup',
    enableReinitialize: true
})(NewSponsorPopoup);

export default connect(mapStateToProps,mapDispatchToProps)(NewSponsorPopoup)
