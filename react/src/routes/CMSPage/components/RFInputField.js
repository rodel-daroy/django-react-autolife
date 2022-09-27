import React, {Component} from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import MultiselectTwoSides from './MultiselectTwoSides'
import { change as changeFieldValue } from 'redux-form'


export class TagInputNumber extends Component {
    render () {
        const {input, type, removeClass,addStyle, id,placeholder, meta: {touched, error, warning}} = this.props
        return (
            <div>
            <input {...input}  placeholder={placeholder} type={type} style ={{width: addStyle ? '28px' : ''}} className={!removeClass ? "form-control "+(this.props.className) : ''} readOnly = {this.props.readOnly ? true : false} id={id}/>
                {touched && ((error && <span className="error error-container ">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}
export class renderFieldSelect extends Component {
    render () {
        const {input, type, empty,selectLists, removeClass,addStyle, id,placeholder, meta: {touched, error, warning}} = this.props
        return (
          <div>
            <select
                {...input} >
                <option value="">{empty}</option>
                {selectLists !=null ? selectLists.map((list,i) =>{
                  return  <option key={i} value={list.name}>{list.name}</option>
                }): ''}
            </select>
            {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                <span className="error" style={{position:'relative', top:'30px'}}>{warning}</span>))}
          </div>
        )
    }
}

export class TagInputSwitch extends Component {
    render () {
        const {input, id} = this.props
        return (
            <label className="switch">
              <input {...input} type="checkbox" id={id} />
              <span className="slider round"></span>
            </label>
        )
    }
}

export class CustomCheckbox extends Component {
    render () {
        const {input, id} = this.props
        return (
            <input {...input} type="checkbox" id={id} disabled={this.props.isChecked ? true : false}
            />
        )
    }
}

export class TwoBoxMultiSelect extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const {input,params, options, meta: {touched, error, warning}, change} = this.props
        const selectedCount  = 0
        const availableCount = 1;
        return (
            <div>
                <MultiselectTwoSides
                    {...input}
                    options = {options}
                    change = {change}
                    params={params}
                />
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}

export class TagInputDatePicker extends Component {
    handleChange = (date) => {
        this.props.input.onChange(moment(date).format('MM-DD-YYYY'))
    }

    render() {
        const {input, type, id, meta: {touched, error, warning}} = this.props
        const {value} = input
        return (
            <div>
                <DatePicker onSelect={this.handleChange} selected={value ? moment(value) : null} {...input} className={"form-control " + (this.props.className)} readOnly={true} type={type}
                            id={id}/>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>)
    }
}

export class RFTextField extends Component {
    render () {
        const {input, id, meta: {touched, error, warning}} = this.props
        return (
            <div>
            <textarea {...input} className="form-control text-box" rows={this.props.rows} id={id}></textarea>
            {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                <span className="error">{warning}</span>))}
            </div>
        )
    }
}

export class  TagRenderDependSelectField extends Component {
    render () {
        const { input, empty, model, selectLists, meta: {touched, error, warning}} = this.props
        // const { name, onBlur, onChange, onDragStart, onDrop, onFocus, value } = input
        delete input.value
        return (
            <div>
                <select className='form-control'
                        {...input}>
                    <option value="">{empty}</option>
                    {(selectLists) ? (selectLists.map((list,i)=>
                        <option key={i} value={list.id}>{list.name}</option>
                    )): ''}
                </select>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}
export class  TagRenderSelectField extends Component {
    render () {
        const { input, empty, model, selectLists, meta: {touched, error, warning}} = this.props
       // const { name, onBlur, onChange, onDragStart, onDrop, onFocus, value } = input
        return (
            <div>
                <select className='form-control'
                        {...input}>
                    <option value="">{empty}</option>
                    {(selectLists) ? (selectLists.map((list,i)=>
                        <option key={i} value={list.id}>{list.name}</option>
                    )): ''}
                </select>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}

export class selectBreadCrumbs extends Component {
    render () {
        const { input, empty, model, selectLists, meta: {touched, error, warning}} = this.props
       // const { name, onBlur, onChange, onDragStart, onDrop, onFocus, value } = input
        return (
            <div>
                <select className='form-control'
                        {...input}>
                    <option value="">{empty}</option>
                    {(selectLists) ? (selectLists.map((list,i)=>
                        <option key={i} value={list.name}>{list.name}</option>
                    )): ''}
                </select>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}

export class reduxSelectDropdown extends Component {
    render () {
        const { input, empty, model, selectLists, meta: {touched, error, warning}} = this.props
       // const { name, onBlur, onChange, onDragStart, onDrop, onFocus, value } = input
        return (
            <div>
                <select className='form-control'
                        {...input}>
                    <option value="">{empty}</option>
                    {(selectLists) ? (selectLists.map((list,i)=>
                        <option key={i} value={list.name}>{list.name}</option>
                    )): ''}
                </select>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}

export class  TagRenderSelectListField extends Component {
    render () {
        const { input, empty, model, contentType, selectLists, meta: {touched, error, warning}} = this.props
        var objectKeysData = []
        if( selectLists ) {
             objectKeysData = Object.keys(selectLists)
        }
        return (
            <div>
                <select className='form-control'
                        {...input}>
                    <option value="">{empty}</option>
                    { objectKeysData.map(( index )=>{
                        if( !selectLists[index].disable &&  selectLists[index].type === contentType) {
                            return <option key={index} value={index}>{selectLists[index].label}</option>
                        }
                    })}
                </select>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}

export default class RFInputField extends Component {
  render () {
    const {input, cursor, label, type, id, meta: {touched, error, warning}} = this.props;
    return (
      <div>
        <div className="input-field radius-div input-box">
          <input {...input} type={type} className="form-control" id={id}/>
          <label htmlFor={id}>{label}</label>
          <span className="glyphicon form-control-feedback" aria-hidden="true"/>
          <div className="help-block with-errors"/>
        </div>
        {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
        <span className="error">{warning}</span>))}
      </div>
    );
  }
}
