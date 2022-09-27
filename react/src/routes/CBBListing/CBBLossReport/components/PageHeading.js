import React, {Component} from 'react'

export default  class PageHeading extends Component {
	constructor(props, context) {
        super(props)
    }
    render() {
        return (
        	<div className="market_banner cbb-total-loss-banner">{/* NEW CLASS cbb-total-loss-banner  */}
                <div className="divbanner">
                    <h1>CBB TOTAL LOSS REPORT</h1>
                    <h2>Subheading goes here under the heading</h2>
                </div>
            </div>)
    }
}
