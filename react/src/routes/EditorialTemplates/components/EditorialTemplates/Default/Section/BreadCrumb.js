import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux';

class BreadCrumb extends Component {
    render() {
      const {previewData,params}=this.props
        return( <div className="browse-cars_div">
            <div className="breadcrumb_div cbb-financial-breadcrum">
                <div className="container-fluid">
                    <ul>
                      <li><Link to={'/market-place'} target="_blank"><img src={require("styles/img/home-thumb.png")} />Marketplace / </Link></li>
                      <li><Link to={'/content/preview/'+params.content_name} target="_blank" className="activ">{previewData.headline}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="clearfix"></div>
        </div> )
    }
}

function mapStateToProps(state) {
  return {
      previewData: state.editorial.previewData.data
  };
}

export default connect(mapStateToProps)(BreadCrumb)
