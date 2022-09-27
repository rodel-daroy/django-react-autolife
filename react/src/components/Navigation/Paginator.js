import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Paginator = props => {
  const { pageCount, onChange, dark } = props
  let { selectedPage } = props

  if (typeof selectedPage !== 'number') selectedPage = 0

  const li = []
  for (let i = 0; i < pageCount; ++i) {
    let onClick = null
    if (onChange && selectedPage !== i) onClick = onChange.bind(this, i)

    li.push(
      <li key={i} className={`${selectedPage === i ? 'selected' : ''}`}>
        <button
          type='button'
          className={`btn btn-link page-button ${dark ? 'dark' : 'light'}`}
          onClick={onClick}
          role="radio"
          aria-label={`Page ${i + 1}`}
          aria-checked={selectedPage === i}
        />
      </li>
    )
  }

  const handleKeyDown = e => {
    if(onChange) {
      switch(e.key) {
        case 'ArrowLeft': {
          if(selectedPage > 0) {
            e.preventDefault()
            onChange(selectedPage - 1)

            break
          }
        }

        case 'ArrowRight': {
          if(selectedPage < pageCount - 1) {
            e.preventDefault()
            onChange(selectedPage + 1)

            break
          }
        }
      }
    }
  }

  return (
    <div className={`paginator ${dark ? 'dark' : 'light'}`} role="radiogroup" onKeyDown={handleKeyDown}>
      <ol className='pages'>
        {li}
      </ol>
    </div>
  )
}

Paginator.propTypes = {
  pageCount: PropTypes.number,
  selectedPage: PropTypes.number,
  onChange: PropTypes.func,
  dark: PropTypes.bool
}

export default Paginator
