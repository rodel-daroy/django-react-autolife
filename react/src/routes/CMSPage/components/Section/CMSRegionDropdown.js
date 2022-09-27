import React, {Component} from 'react'
import {Field, reduxForm, change} from 'redux-form'
import {RFSelectField} from '../RFInputField'
import {connect} from 'react-redux'
import {TagRenderSelectField, TagInputNumber} from '../RFInputField'
import get from 'lodash/get'
import { sortListByAlphabetsOrder } from '../../../../utils/sort'
import {
    getCountryList,
    getStateList,
    getCityList
} from '../../../../redux/actions/editorialCmsActions';
const required = message => value => value ? undefined : message


class CMSRegionDropdown extends Component {
    constructor(props, context) {
        super(props)
        this.countryDropdown=this.countryDropdown.bind(this)
        this.stateDropdown=this.stateDropdown.bind(this)
        this.cityDropdown=this.cityDropdown.bind(this)
        this.country = false
    }

    componentDidMount () {
        this.props.getCountryList ( get(this.props, 'user.authUser.accessToken'))
    }
    componentDidUpdate () {
        const {country, state} = this.props
        if(this.country !== country) {
            this.country = country
            if( country ){
                this.props.getStateList (country,  get(this.props, 'user.authUser.accessToken'))
            }
            if( state ) {
                this.props.getCityList (state,  get(this.props, 'user.authUser.accessToken'))
            }
        }
    }

    countryDropdown (e) {
        const id = e.target.value
        this.props.getStateList (id,  get(this.props, 'user.authUser.accessToken'))
    }

    stateDropdown (e) {
        const id = e.target.value
        this.props.getCityList (id,  get(this.props, 'user.authUser.accessToken'))
    }

    cityDropdown (e) {
     console.log(e.target.value)
    }

    render() {
        const { countryList,stateList, cityList } = this.props
        return(<div>
            <div className="form-group">
                <div className='col-md-10'>
                    <Field name="country"
                       component={TagRenderSelectField}
                       empty = "Country"
                       model = "country"
                       onChange = {this.countryDropdown}
                       selectLists={sortListByAlphabetsOrder(countryList)}
                        />
                </div>
            </div>

            <div className="form-group">
                <div className='col-md-10'>
                    <Field name="state"
                       component={TagRenderSelectField}
                       empty = "Province/State"
                       model = "state"
                       selectLists={sortListByAlphabetsOrder(stateList)}
                       onChange = {this.stateDropdown}
                       />
                </div>
            </div>

            <div className="form-group">
                <div className='col-md-10'>
                    <Field name="city"
                       component={TagRenderSelectField}
                       empty = "City"
                       model = "city"
                       selectLists={sortListByAlphabetsOrder(cityList)}
                       onChange = {this.cityDropdown}
                       />
                </div>
            </div>
        </div>)
    }
}

function mapStateToProps(state) {
  return {
    countryList: state.CMSDetail.countryList,
    stateList: state.CMSDetail.stateList,
    cityList: state.CMSDetail.cityList,
    user: state.user
  };
}



const mapDispatchToProps = {
    getCountryList,
    getStateList,
    getCityList
}
export default connect(mapStateToProps, mapDispatchToProps)(CMSRegionDropdown)
