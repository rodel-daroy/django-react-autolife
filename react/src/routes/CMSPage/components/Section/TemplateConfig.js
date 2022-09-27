import React from 'react';
import {TagInputSwitch} from '../RFInputField'
import { Field } from 'redux-form'

export default class TemplateConfig extends React.Component {
    render() {
        const {currentConfig} = this.props

        return (<div className="row">
            <div className="col-sm-10 col-sm-offset-1 bordered-column">
                <h4 className="column-heading">Template Configuration</h4>
                {Object.keys(currentConfig).map((index) => {
                    return (
                        <div className="form-group col-sm-6" key={index}>
                            <label className='control-label col-sm-6' >{currentConfig[index].label}</label>
                            <div className='col-sm-6'>
                                <Field
                                    component={ TagInputSwitch }
                                    id={index}
                                    name={index}
                                    type="checkbox"
                                    checked={true}
                                    onChange={(e)=>this.props.onChangeSwitch(e.target.checked, index)}
                                    normalize={(v) => !!v}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>)
    }
}
