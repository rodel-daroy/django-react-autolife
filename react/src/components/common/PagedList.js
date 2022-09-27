import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TimelineMax } from 'gsap'
import chunk from 'lodash/chunk'

const speed = 0.75

export default class PagedList extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.updateLayout()
  }

  componentWillUnmount () {
    if (this._timeline) {
      this._timeline.kill()
      delete this._timeline
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      !isNaN(this.props.activeColumn) &&
      this.props.activeColumn !== prevProps.activeColumn
    ) {
      this.updateLayout()
    }
  }

  updateLayout () {
    if (this._timeline) {
      this._timeline.kill()
      delete this._timeline
    }

    const timeline = new TimelineMax()

    const { activeColumn } = this.props
    const xPercent = -activeColumn * (1 / this.columnCount * 100)
    timeline.to(this._content, speed, { xPercent })

    this._timeline = timeline
  }

  get columnCount () {
    const itemCount = React.Children.count(this.props.children)
    const { columnSize } = this.props

    return Math.ceil(itemCount / columnSize)
  }

  render () {
    const { visibleColumns, className, columnSize, activeColumn } = this.props
    const items = React.Children.toArray(this.props.children)

    const contentWidth = this.columnCount / visibleColumns * 100 /* + 1 */ // add one to account for rounding errors
    const columnWidth = 1 / this.columnCount * 100

    const columns = chunk(items, columnSize)

    const isColumnVisible = column => {
      return column >= activeColumn && column < activeColumn + visibleColumns
    }

    return (
      <div
        ref={ref => (this._list = ref)}
        className={`paged-list ${className || ''}`}
      >
        <div
          ref={ref => (this._content = ref)}
          className='paged-list-content'
          style={{ width: `${contentWidth}%` }}
        >
          {columns.map((column, i) =>
            <fieldset
              key={i}
              className='paged-list-column'
              style={{ width: `${columnWidth}%` }}
              disabled={!isColumnVisible(i)}
            >
              {column.map((item, j) =>
                <div key={j} className='paged-list-item'>
                  {item}
                </div>
              )}
            </fieldset>
          )}
        </div>
      </div>
    )
  }
}

PagedList.propTypes = {
  children: PropTypes.node,
  activeColumn: PropTypes.number,
  visibleColumns: PropTypes.number.isRequired,
  columnSize: PropTypes.number.isRequired,
  className: PropTypes.string
}

PagedList.defaultProps = {
  columnSize: 3
}
