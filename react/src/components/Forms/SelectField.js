import React from 'react'

export default ({ input, empty, model, options, meta: { touched, error, warning } }) => {
  return (
    <div className='customSelect'>
      <select {...input}>
        {empty &&
          <option value=''>
            {empty}
          </option>}
        {options &&
          options.map((list, i) => <option key={i} value={list.value}>{list.label}</option>
          )}Î
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
}
