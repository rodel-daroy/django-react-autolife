import React, { Component } from "react";
import PropTypes from "prop-types";
import ResponsiveModal from "../../components/common/ResponsiveModal";
import { MSRP_TEXT, OMVIC } from "../../config/constants";
import { formatCurrency } from "../../utils/format";

const formatPrice = (price, showZero) => {
  if (!isNaN(parseFloat(price)) && (price != 0 || showZero))
    return `$${formatCurrency(price, false)}`;
  else return "NA";
};

export default class MSRP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  handleOpen = e => {
    e.stopPropagation();

    this.setState({
      showModal: true
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    const { showModal } = this.state;
    const {
      price,
      freight,
      airTax,
      totalPrice,
      caption,
      tabIndex
    } = this.props;
    return (
      <span className="msrp">
        {caption}
        <button
          type="button"
          className="btn btn-link"
          onClick={this.handleOpen}
          tabIndex={tabIndex}
          aria-label="More info"
        >
          <span className="icon icon-info" />
        </button>

        {showModal && (
          <ResponsiveModal onClose={this.handleClose}>
            <ResponsiveModal.Block position="header" component="div">
              <div className="msrp-modal">
                <table>
                  <tbody>
                    <tr>
                      <td className="row-label">Vehicle MSRP</td>
                      <td className="row-value">
                        {!isNaN(price) ? formatPrice(price, true) : price}
                      </td>
                    </tr>
                    <tr>
                      <td className="row-label">Delivery price</td>
                      <td className="row-value">
                        {!isNaN(freight)
                          ? formatPrice(freight, false)
                          : freight}
                      </td>
                    </tr>
                    <tr>
                      <td className="row-label">Air conditioning tax</td>
                      <td className="row-value">
                        {!isNaN(airTax) ? formatPrice(airTax, false) : airTax}
                      </td>
                    </tr>
                    <tr>
                      <td className="row-label">OMVIC</td>
                      <td className="row-value">{formatPrice(OMVIC, false)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="row-label">Total</td>
                      <td className="row-value">
                        {!isNaN(totalPrice)
                          ? formatPrice(totalPrice, false)
                          : totalPrice}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                {MSRP_TEXT}
              </div>
            </ResponsiveModal.Block>
          </ResponsiveModal>
        )}
      </span>
    );
  }
}

MSRP.propTypes = {
  caption: PropTypes.string,
  totalPrice: PropTypes.any,
  freight: PropTypes.any,
  airTax: PropTypes.any,
  price: PropTypes.any,
  tabIndex: PropTypes.number
};

MSRP.defaultProps = {
  totalPrice: "NA",
  freight: "NA",
  airTax: "NA",
  price: "NA"
};
