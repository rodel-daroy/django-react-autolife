import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Media from 'react-media'
import { mediaQuery } from '../../utils/style'
import RadialButton from '../Forms/RadialButton'
// import 'bootstrap-loader'

const Stepper = props => {
  const {
    orientation,
    first,
    last,
    onPrevious,
    onNext,
    children,
    dark,
    size
  } = props

  const handleKeyDown = e => {
    switch(e.key) {
      case 'ArrowLeft': {
        if(onPrevious && !first) {
          e.preventDefault()
          onPrevious()

          break
        }
      }

      case 'ArrowRight': {
        if(onNext && !last) {
          e.preventDefault()
          onNext()

          break
        }
      }
    }
  }

  return (
    <nav className={`stepper ${orientation} ${dark ? 'dark' : 'light'}`} onKeyDown={handleKeyDown}>
      <Media query={mediaQuery('xs')}>
        {matches =>
          ((matches && size !== 'small') || size === 'large')
            ? <div className='stepper-inner'>
              <RadialButton
                dark={dark}
                disabled={first}
                onClick={onPrevious}
                size='large'
                aria-label="Previous"
                >
                {orientation === 'horizontal'
                    ? <span className='icon icon-arrow-left' />
                    : <span className='icon icon-arrow-up' />}
              </RadialButton>

              {children}

              <RadialButton dark={dark} disabled={last} onClick={onNext} size='large' aria-label="Next">
                {orientation === 'horizontal'
                    ? <span className='icon icon-arrow-right' />
                    : <span className='icon icon-arrow-down' />}
              </RadialButton>
            </div>
            : <div className='stepper-inner'>
              <button
                className='btn btn-link stepper-button'
                type='button'
                disabled={first}
                onClick={onPrevious}
                aria-label="Previous"
                >
                {orientation === 'horizontal'
                    ? <span className='icon icon-arrow-left' />
                    : <span className='icon icon-arrow-up' />}
              </button>

              {children}

              <button
                className='btn btn-link stepper-button'
                type='button'
                disabled={last}
                onClick={onNext}
                aria-label="Next"
                >
                {orientation === 'horizontal'
                    ? <span className='icon icon-arrow-right' />
                    : <span className='icon icon-arrow-down' />}
              </button>
            </div>}
      </Media>
    </nav>
  )
}

Stepper.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  first: PropTypes.bool,
  last: PropTypes.bool,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  children: PropTypes.node,
  dark: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large'])
}

Stepper.defaultProps = {
  orientation: 'vertical'
}

export default Stepper
