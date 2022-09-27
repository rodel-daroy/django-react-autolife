import React, { Component } from 'react'
import PropTypes from 'prop-types'
import offer from '../../styles/img/offer.png'
import { resizeImageUrl } from '../../utils'

let id = 0

export default class ImageRadioButton extends Component {
  constructor (props) {
    super(props)

    this._id = `image-radio-${++id}`
  }

  render () {
    const { image, caption, checked, onChange, name, value } = this.props

    return (
      <div className={`btn image-button ${caption ? 'has-text' : ''}`}>
        <input
          id={this._id}
          type='radio'
          name={name}
          value={value}
          checked={!!checked}
          onChange={onChange}
        />
        <label htmlFor={this._id} className='image-outer' aria-label={caption || value}>
          <div
            ref={ref => (this._image = ref)}
            className='image-inner'
            style={{ backgroundImage: `url(${resizeImageUrl(image, 300, 300)})` }}
          />
          <div ref={ref => (this._text = ref)} className='image-text'>
            {caption &&
              <div className='image-text-inner'>
                {caption}
              </div>}
            <div className='keyline' />
          </div>
        </label>
      </div>
    )
  }
}

ImageRadioButton.propTypes = {
  caption: PropTypes.string,
  image: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string
}

ImageRadioButton.defaultProps = {
  image: offer
}
