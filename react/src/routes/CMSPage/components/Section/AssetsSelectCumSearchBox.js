import React, {Component} from 'react'
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
export default class  AssetsSelectCumSearchBox extends Component {

  onSelect = (v) => {
    console.log('onSelect', v);
  }

  onChange = (value) => {
    this.props.onChange(value)
  }

    render () {
        const { input, empty, model, selectLists, meta: {touched, error, warning}} = this.props
        return (
            <div>
            <Select
              style={{ width: 500 }}
              onChange={this.props.onChange}
              notFoundContent=""
              allowClear
              placeholder="please select"
              backfill
              {...input}
              className="form-control"
            >
                    <Option value="">{empty}</Option>
                    {(selectLists) ? (selectLists.map((list,i)=>
                        <Option key={i} value={list.id}>{list.name}</Option>
                    )): ''}
                </Select>
                {touched && ((error && <span className="error error-container">{error}</span>) || (warning &&
                    <span className="error">{warning}</span>))}
            </div>
        )
    }
}
