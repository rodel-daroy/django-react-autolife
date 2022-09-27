import { connect } from 'react-redux';
import CarSelectorForm from 'components/Listings/CarSelectorForm';
import get from 'lodash/get';
import {
  getMakeAvgPrice,
  getModelAvgPrice
} from "redux/actions/carWorthAction";

const mapStateToProps = state => ({
  makes: get(state, 'carWorth.avgPriceMakeData.data'),
  models: get(state, 'carWorth.avgPriceModelData.data')
});

const mapDispatchToProps = dispatch => ({
  getMakes: ({ year }) => dispatch(getMakeAvgPrice(year)),
  getModels: ({ year, make }) => dispatch(getModelAvgPrice(year, make))
});

const ToolsCarSelectorForm = connect(mapStateToProps, mapDispatchToProps)(CarSelectorForm);

export default ToolsCarSelectorForm;