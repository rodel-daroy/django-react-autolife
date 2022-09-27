import React from 'react'

const FieldSelect = ({ input, empty, model, selectLists, meta: { touched, error, warning } }) => {
  return (
    <div className='select_tab1'>
      <select {...input}>
        <option value=''>
          {empty}
        </option>
        {selectLists &&
          selectLists.map((list, i) => {
            return (
              <option key={i} value={list.name}>
                {list.name}
              </option>
            )
          })}
      </select>
      {touched &&
        ((error &&
          <span className='error error-container'>
            {error}
          </span>) ||
          (warning &&
            <span className='error' tyle={{ position: 'relative', top: '30px' }}>
              {warning}
            </span>))}
    </div>
  )
};

export default FieldSelect
