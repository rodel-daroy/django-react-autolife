import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TimelineMax } from 'gsap'
import isInteger from 'lodash/isInteger'

export default class Rotisserie extends Component {
  constructor (props) {
    super(props)

    this._items = []
    this._itemsInner = []
  }

  componentDidMount () {
    this.updateLayout()
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      !isNaN(this.props.activePage) &&
      this.props.activePage !== prevProps.activePage
    ) {
      this.updateLayout(prevProps.activePage)
    }
  }

  layout1 (prevActivePage) {
    const { activePage } = this.props

    const timeline = new TimelineMax()

    const yStep = 50
    const zStep = -100

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)
      const z = offset * zStep
      const y = offset * yStep * direction
      const zIndex = -offset

      timeline.to(this._items[i], 0.5, { zIndex }, 0)
      timeline.to(this._itemsInner[i], 0.5, { y, z }, 0)
    }
  }

  layout2 (prevActivePage) {
    const { activePage } = this.props

    const timeline = new TimelineMax()

    const yStep = 35
    const zStep = 100
    const xStep = 0
    const opacityStep = 2

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)

      let wrapOffset = 0
      if (i > activePage) {
        wrapOffset = i - activePage
      } else {
        if (i < activePage) wrapOffset = this._items.length - activePage + i
      }
      wrapOffset = wrapOffset
      const z = -wrapOffset * zStep
      const x = wrapOffset * xStep
      const y = -wrapOffset * yStep
      const zIndex = -wrapOffset
      const opacity = wrapOffset !== 0 ? 1 / (wrapOffset * opacityStep) : 1

      timeline.to(this._items[i], 0.5, { zIndex }, 0)
      timeline.to(this._itemsInner[i], 0.5, { x, y, z, opacity }, 0)
    }
  }

  layout3 (prevActivePage) {
    const { activePage } = this.props

    for (let i = 0; i < this._itemsInner.length; ++i) {
      if (!this._itemsInner[i].hasOwnProperty('blur')) {
        Object.defineProperty(this._itemsInner[i], 'blur', {
          set: function (value) {
            this.style.filter = `blur(${value}px)`
          },
          get: function () {
            const filter = this.style.filter
            if (filter) {
              const result = /blur\(([0-9]+)px\)/.exec(filter)
              return result ? parseFloat(result[1]) : 0
            } else return 0
          }
        })

        Object.defineProperty(this._itemsInner[i], 'brightness', {
          set: function (value) {
            this.style.filter = `brightness(${value})`
          },
          get: function () {
            const filter = this.style.filter
            if (filter) {
              const result = /brightness\((([0-9]|\.)+)\)/.exec(filter)
              return result ? parseFloat(result[1]) : 1
            } else return 1
          }
        })
      }
    }

    const timeline = new TimelineMax()

    const yStep = 35
    const zStep = 100
    const xStep = 0
    const opacityStep = 3

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)

      let wrapOffset = 0
      if (i > activePage) {
        wrapOffset = i - activePage
      } else {
        if (i < activePage) wrapOffset = this._items.length - activePage + i
      }
      wrapOffset = wrapOffset
      const z = -wrapOffset * zStep
      const x = wrapOffset * xStep
      const y = -wrapOffset * yStep
      const zIndex = -wrapOffset
      const opacity = wrapOffset !== 0 ? 1 / (wrapOffset * opacityStep) : 1
      const blur = wrapOffset

      timeline.to(this._items[i], 0.5, { zIndex }, 0)
      timeline.to(
        this._itemsInner[i],
        0.5,
        { x, y, z, brightness: opacity },
        0
      )
    }
  }

  layout4 (prevActivePage) {
    const { activePage } = this.props

    for (let i = 0; i < this._itemsInner.length; ++i) {
      if (!this._itemsInner[i].hasOwnProperty('brightness')) {
        Object.defineProperty(this._itemsInner[i], 'brightness', {
          set: function (value) {
            this.style.filter = `brightness(${value})`
          },
          get: function () {
            const filter = this.style.filter
            if (filter) {
              const result = /brightness\((([0-9]|\.)+)\)/.exec(filter)
              return result ? parseFloat(result[1]) : 1
            } else return 1
          }
        })
      }
    }

    const timeline = new TimelineMax()

    if (isInteger(prevActivePage)) {
      const xPercent = 105
      const rotationY = 10

      timeline.to(this._itemsInner[prevActivePage], 0.125, { rotationY })
      timeline.to(this._itemsInner[prevActivePage], 0.25, { xPercent }, 0)
      timeline.to(
        this._itemsInner[prevActivePage],
        0.125,
        { rotationY: 0 },
        0.125
      )
    }

    const yStep = 35
    const zStep = 100
    const brightnessStep = 3

    const startTime = timeline.totalDuration()

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)

      let wrapOffset = 0
      if (i > activePage) {
        wrapOffset = i - activePage
      } else {
        if (i < activePage) wrapOffset = this._items.length - activePage + i
      }
      wrapOffset = wrapOffset

      const z = -wrapOffset * zStep
      const y = -wrapOffset * yStep
      const zIndex = -wrapOffset
      const brightness =
        wrapOffset !== 0 ? 1 / (wrapOffset * brightnessStep) : 1

      timeline.to(this._items[i], 0.5, { zIndex }, startTime)
      timeline.to(this._itemsInner[i], 0.5, { y, z, brightness }, startTime)
    }

    if (isInteger(prevActivePage)) {
      const rotationY = -5

      timeline.to(this._itemsInner[prevActivePage], 0.125, { rotationY })
      timeline.to(
        this._itemsInner[prevActivePage],
        0.25,
        { xPercent: 0 },
        '-=.125'
      )
      timeline.to(
        this._itemsInner[prevActivePage],
        0.125,
        { rotationY: 0 },
        '-=.125'
      )
    }

    timeline.timeScale(0.6)
  }

  layout5 (prevActivePage) {
    const { activePage } = this.props

    for (let i = 0; i < this._itemsInner.length; ++i) {
      if (!this._itemsInner[i].hasOwnProperty('brightness')) {
        Object.defineProperty(this._itemsInner[i], 'brightness', {
          set: function (value) {
            this.style.filter = `brightness(${value})`
          },
          get: function () {
            const filter = this.style.filter
            if (filter) {
              const result = /brightness\((([0-9]|\.)+)\)/.exec(filter)
              return result ? parseFloat(result[1]) : 1
            } else return 1
          }
        })
      }
    }

    const timeline = new TimelineMax()

    /* if(isInteger(prevActivePage)) {
			const xPercent = 105
			const rotationY = 10

			timeline.to(this._itemsInner[prevActivePage], .125, { rotationY })
			timeline.to(this._itemsInner[prevActivePage], .25, { xPercent }, 0)
			timeline.to(this._itemsInner[prevActivePage], .125, { rotationY: 0 }, .125)
		} */

    const yStep = 35
    const zStep = 200
    const brightnessStep = 2.5

    const startTime = timeline.totalDuration()

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)

      let wrapOffset = 0
      if (i > activePage) {
        wrapOffset = i - activePage
      } else {
        if (i < activePage) wrapOffset = this._items.length - activePage + i
      }
      wrapOffset = wrapOffset

      const z = offset * -zStep
      const y = -wrapOffset * yStep
      const xPercent = offset * direction * 120
      const zIndex = -wrapOffset
      const brightness =
        wrapOffset !== 0 ? 1 / (wrapOffset * brightnessStep) : 1

      timeline.to(this._items[i], 0.5, { zIndex }, startTime)
      // timeline.to(this._itemsInner[i], .5, { y, z, brightness }, startTime)
      timeline.to(
        this._itemsInner[i],
        0.5,
        { xPercent, z, brightness, opacity: brightness },
        startTime
      )
    }

    /* if(isInteger(prevActivePage)) {
			const rotationY = -5

			timeline.to(this._itemsInner[prevActivePage], .125, { rotationY })
			timeline.to(this._itemsInner[prevActivePage], .25, { xPercent: 0 }, '-=.125')
			timeline.to(this._itemsInner[prevActivePage], .125, { rotationY: 0 }, '-=.125')
		} */

    timeline.timeScale(0.6)
  }

  layout6 (prevActivePage) {
    const { activePage } = this.props

    for (let i = 0; i < this._itemsInner.length; ++i) {
      if (!this._itemsInner[i].hasOwnProperty('brightness')) {
        Object.defineProperty(this._itemsInner[i], 'brightness', {
          set: function (value) {
            this.style.filter = `brightness(${value})`
          },
          get: function () {
            const filter = this.style.filter
            if (filter) {
              const result = /brightness\((([0-9]|\.)+)\)/.exec(filter)
              return result ? parseFloat(result[1]) : 1
            } else return 1
          }
        })
      }
    }

    const timeline = new TimelineMax()

    const yStep = 35
    const zStep = 200
    const brightnessStep = 2.5

    const startTime = timeline.totalDuration()

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)

      let wrapOffset = 0
      if (i > activePage) {
        wrapOffset = i - activePage
      } else {
        if (i < activePage) wrapOffset = this._items.length - activePage + i
      }
      wrapOffset = wrapOffset

      const z = offset * -zStep
      const y = -wrapOffset * yStep
      const xPercent = offset * direction * 120
      const zIndex = -wrapOffset
      const brightness =
        wrapOffset !== 0 ? 1 / (wrapOffset * brightnessStep) : 1

      timeline.to(this._items[i], 0.5, { zIndex }, startTime)

      timeline.to(
        this._itemsInner[i],
        0.5,
        { xPercent, z, brightness },
        startTime
      )
      if (i < activePage) {
        timeline.to(this._itemsInner[i], 0.25, { opacity: 0 }, startTime)
      } else {
        timeline.to(
          this._itemsInner[i],
          0.5,
          { opacity: brightness },
          startTime
        )
      }
    }

    timeline.timeScale(0.6)
  }

  layout7 (prevActivePage) {
    const { activePage } = this.props

    for (let i = 0; i < this._itemsInner.length; ++i) {
      if (!this._itemsInner[i].hasOwnProperty('brightness')) {
        Object.defineProperty(this._itemsInner[i], 'brightness', {
          set: function (value) {
            this.style.filter = `brightness(${value})`
          },
          get: function () {
            const filter = this.style.filter
            if (filter) {
              const result = /brightness\((([0-9]|\.)+)\)/.exec(filter)
              return result ? parseFloat(result[1]) : 1
            } else return 1
          }
        })
      }
    }

    const timeline = new TimelineMax()

    const yStep = 35
    const zStep = 100
    const brightnessStep = 3

    const startTime = timeline.totalDuration()

    for (let i = 0; i < this._items.length; ++i) {
      const offset = Math.abs(i - activePage)
      const direction = Math.sign(i - activePage)

      let wrapOffset = 0
      if (i > activePage) {
        wrapOffset = i - activePage
      } else {
        if (i < activePage) wrapOffset = this._items.length - activePage + i
      }
      wrapOffset = wrapOffset

      const z = -wrapOffset * zStep
      const y = -wrapOffset * yStep
      const zIndex = -wrapOffset
      const brightness =
        wrapOffset !== 0 ? 1 / (wrapOffset * brightnessStep) : 1

      if (isInteger(prevActivePage) && i === prevActivePage) {
        timeline.to(this._items[i], 0.5, { zIndex: 1 }, startTime)
        timeline.to(this._items[i], 0.1, { opacity: 0 }, startTime)
        timeline.set(this._items[i], { visibility: 'hidden' }, startTime + 0.5)
        timeline.to(
          this._itemsInner[i],
          0.5,
          { y: yStep, z: zStep },
          startTime
        )
      } else {
        timeline.to(this._items[i], 0.5, { zIndex }, startTime)
        timeline.to(this._itemsInner[i], 0.5, { y, z, brightness }, startTime)
      }
    }

    timeline.timeScale(0.6)
  }

  updateLayout (prevActivePage) {
    // this.layout1(prevActivePage)
    // this.layout2(prevActivePage)
    // this.layout3(prevActivePage)
    // this.layout4(prevActivePage)
    // this.layout5(prevActivePage)
    // this.layout6(prevActivePage)
    this.layout7(prevActivePage)
  }

  renderItem (item, i) {
    const { activePage } = this.props

    const isActive = activePage === i
    const offset = i - activePage

    const className = `rotisserie-item ${isActive ? 'active' : 'inactive'}`

    return (
      <div
        ref={ref => (this._items[i] = ref)}
        key={`rotisserie-item-${i}`}
        className={className}
      >
        <div
          ref={ref => (this._itemsInner[i] = ref)}
          className={`rotisserie-item-inner`}
        >
          {item}

          <div className='rotisserie-item-shade' />
        </div>
      </div>
    )
  }

  render () {
    const { children } = this.props
    let items = [].concat(children)

    return (
      <div className='rotisserie'>
        {items.map(this.renderItem.bind(this))}
      </div>
    )
  }
}

Rotisserie.propTypes = {
  activePage: PropTypes.number
}

Rotisserie.defaultProps = {
  activePage: 0
}
