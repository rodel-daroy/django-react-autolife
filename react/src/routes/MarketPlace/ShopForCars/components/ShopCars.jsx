import React from "react";
import ShopCarsForm from "components/Listings/ShopCarsForm";

const ShopCars = () => (
  <section className="page-section shop-cars">
    <header className="page-section-header">
      <div className="text-container horizontal-header">
        <h3>Shop for Cars</h3>
        <p>
          Looking to buy a new family car or that dream car you’ve always
          wanted? AutoLife makes it easy to explore and compare every model,
          from all automotive manufacturers. Discover available incentives, then
          when you are ready, we can help you find a local dealer.
        </p>
      </div>
    </header>
    <div className="page-section-content">
      <div className="content-strip" style={{ marginBottom: "150px" }}>
        <div className="text-container text-center">
          <ShopCarsForm form="shopCars" />
        </div>
      </div>
    </div>
  </section>
);

export default ShopCars;
