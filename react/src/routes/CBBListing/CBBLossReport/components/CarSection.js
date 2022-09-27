import React, {Component} from 'react'

export default class CarSection extends Component {
	constructor(props, context) {
        super(props)
    }
    render() {
        return (
        	<div className="browse-cars_div">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="container">
                                <div className="breadcrumb_div cbb-financial-breadcrum">{/* NEW CLASS cbb-financial-breadcrum  */}
                                    <div className="container-fluid">
                                        <ul>
                                            <li><a href="#"><img src={require("styles/img/home-thumb.png")} />Marketplace / </a></li>
                                            <li><a href="#" className="activ">Total Loss Report</a></li>
                                        </ul>
                                        <div className="col-right_side">
                                            <div className="rate-sec">
                                                <ul>
                                                    <li><span>Rate</span></li>
                                                    <li><a href="#"><img src={require("styles/img/cb-like.png")} /></a></li>
                                                    <li><a href="#"><img src={require("styles/img/cb-dislike.png")} /></a></li>
                                                </ul>
                                                <ul className="share_right">
                                                    <li><span>Share</span></li>
                                                    <li><a href="#"><img src={require("styles/img/share.png")} /></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>)
    }
}
