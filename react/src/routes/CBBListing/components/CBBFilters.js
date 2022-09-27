import React from 'react';
import { cbbFilterTitle, cbbPriceFilter } from "config/constants";
import {connect} from 'react-redux'
class CBBFilters extends React.Component {

  constructor (props) {
    super(props);
    this.state={
      selectedCarIndex: null,
      selectedNewCarIndex: null
    }
    this.state = {
      cars: []
  }
    this.priceFilterCars=this.priceFilterCars.bind(this)
    this.showCarsListing = this.showCarsListing.bind(this)
  }

  showCarsListing (index,name) {
    this.setState ({
      selectedNewCarIndex: index,
      selectedCarIndex:null
    })
    if(name == 'New Listings') {
      this.props.filterCarsByPrice (this.state.cars)
    }
  }

  priceFilterCars (index,initialPrice,finalPrice) {
    let filteredCars = []
    this.props.searchData.results.map((data,i)=>{
    data.vehicles.map((newData,i)=>{
      if(35000>=initialPrice && 40000<=finalPrice) {
        filteredCars = data
      }
    })
  })
    if(initialPrice !== 45000) {
      filteredCars = this.state.cars.filter((data => data.Price>=initialPrice && data.Price <=finalPrice))
    } else {
      filteredCars = this.state.cars.filter((data => data.Price>=initialPrice))
    }
    this.setState ({
      selectedCarIndex: index,
      selectedNewCarIndex: null
    })
    this.props.filterCarsByPrice (filteredCars)
  }

  render() {
    const {selectedCarIndex,selectedNewCarIndex} = this.state
    return (
      <div className="left_side_div_bar">
        <h1>filters</h1>
        <ul>
        {cbbFilterTitle.data.map((data,i)=>
          <li key={i}>
            <a className={data.className+(selectedNewCarIndex==i ? 'active-value' : '')} onClick={()=>{this.showCarsListing(i,data.label)}}>
              <span>{data.showIcon ? '+' : '-'}</span>
              {data.label}
            </a>
            {selectedNewCarIndex==i ? <img src={require("styles/img/close.png")}/> : '' }
          </li>
        )}
          <li>
            <ul>
            {cbbPriceFilter.data.map((data,i)=>
              <li key={i}>
                <a className={selectedCarIndex==i ? "active-value" : '' } onClick={()=>{this.priceFilterCars(i,data.priceInitial, data.priceFinal)}}>
                  {data.label}
                </a>
                {selectedCarIndex==i ? <img src={require("styles/img/close.png")}/> : ''}
              </li>
            )}
            </ul>
          </li>
          <li><a href="#" className="no-border_top"><span>-</span> Location</a></li>
          <li>
            <ul>
              <li><a href="#">Calgary, AB</a></li>
              <li><a href="#">Edmenton, AB</a></li>
              <li><a href="#" >Halifax, NS</a></li>
              <li><a href="#">London, ON</a></li>
              <li><a href="#">Montreal, QC</a></li>

              <li><a href="#" >Ottawa , ON</a></li>
              <li><a href="#">Quebec, QC</a></li>
              <li><a href="#">Regina, SK</a></li>

              <li><a href="#" >Saskatoon, SK</a></li>
              <li><a href="#">Toronto, ON</a></li>
              <li><a href="#">Vancouver, BC</a></li>
              <li><a href="#">Winnipeg, MB</a></li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchData: state.MarketPlace.searchData
  };
}

export default connect(mapStateToProps)(CBBFilters)
