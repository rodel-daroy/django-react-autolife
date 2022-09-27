import React, { Component } from 'react'
import PageHeading from './PageHeading'
import CarSection from './CarSection'
import StartFinancial from './StartFinancial'

class CBBLossReportView extends Component {
  constructor (props, context) {
    super(props)
  }

  componentDidMount () {
    const { hideLoader } = this.props
    hideLoader()
  }

  componentWillUpdate () {
    const { addLoader } = this.props
    addLoader()
  }
  render () {
    return (
      <div>
        {/* top banner section */}

        <PageHeading />

        {/* toggle section for browse cars */}
        <CarSection />
        {/* toggle section for browse cars */}

        {/* CBB FINANCIAL STARTS HERE  */}
        <StartFinancial />
        {/* CBB FINANCIAL ENDS HERE  */}
      </div>
    )
  }
}

CBBLossReportView.propTypes = {}

export default CBBLossReportView
