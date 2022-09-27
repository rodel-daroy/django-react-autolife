import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Stepper from './Stepper'

const AlphaPaginator = props => {
  const { enabledLetters, onChange, dark } = props
  const { selectedLetter } = props

  const li = []
  for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); ++i) {
    const isEnabled =
      enabledLetters
        .map(letter => letter.toLowerCase().charCodeAt(0))
        .indexOf(i) !== -1
    const isSelected =
      selectedLetter && selectedLetter.toLowerCase().charCodeAt(0) === i

    let onClick = null
    if (isEnabled && !isSelected && onChange) {
      onClick = onChange.bind(this, String.fromCharCode(i))
    }

    li.push(
      <li
        key={i}
        className={`${isEnabled ? '' : 'disabled'} ${isSelected
          ? 'selected'
          : ''}`}
      >
        <button
          type='button'
          className={`btn btn-link page-button ${dark ? 'dark' : 'light'}`}
          onClick={onClick}
          role="radio"
          aria-checked={isSelected}
          disabled={!isEnabled}
        >
          <span className='page-button-text'>
            {String.fromCharCode(i)}
          </span>
        </button>
      </li>
    )
  }

  return (
    <div className={`paginator alpha ${dark ? 'dark' : 'light'}`} role="radiogroup">
      <ol className='pages'>
        {li}
      </ol>
    </div>
  )
}

AlphaPaginator.propTypes = {
  enabledLetters: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedLetter: PropTypes.string,
  onChange: PropTypes.func,
  dark: PropTypes.bool
}

AlphaPaginator.defaultProps = {
  enabledLetters: []
}

const AlphaPaginatorSection = props => {
  const { enabledLetters, selectedLetter, onChange } = props

  const currentIndex = enabledLetters.findIndex(
    letter => letter.toLowerCase() === selectedLetter.toLowerCase()
  )

  const handlePrevious = () => {
    if (onChange && currentIndex !== -1) {
      let previousIndex = currentIndex - 1
      if (previousIndex < 0) previousIndex = enabledLetters.length - 1

      onChange(enabledLetters[previousIndex])
    }
  }

  const handleNext = () => {
    if (onChange && currentIndex !== -1) {
      let nextIndex = currentIndex + 1
      if (nextIndex > enabledLetters.length - 1) nextIndex = 0

      onChange(enabledLetters[nextIndex])
    }
  }

  return (
    <div className='paginator-section'>
      <AlphaPaginator {...props} />

      <Stepper
        orientation='horizontal'
        first={currentIndex === 0}
        last={currentIndex === enabledLetters.length - 1}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
}

export default AlphaPaginator
export { AlphaPaginatorSection }
