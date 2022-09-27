import React from "react";
import { trimUrl } from "../../../utils";

function getDirectionsUrl({ address, city, state_code }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )},${encodeURIComponent(city)},${encodeURIComponent(state_code)}`;
}

const AdditionalInfoWindow = ({ dealer }) => (
  <div className="info-window">
    <div className="contact-address">
      <div className="dealer-name">{dealer.dealer_name}</div>
      <div>{dealer.address}</div>
      <div>
        {dealer.city}, {dealer.state_code}
      </div>
    </div>
    <ul className="contact-info">
      <li>
        <a
          className="btn btn-link"
          href={getDirectionsUrl(dealer)}
          target="_blank"
        >
          <span className="icon icon-directions" /> Directions{" "}
          <span className="icon icon-angle-right" />
        </a>
      </li>

      {dealer.phone && (
        <li>
          <a className="btn btn-link" href={`tel:${dealer.phone}`}>
            <span className="icon icon-phone" /> {dealer.phone}
          </a>
        </li>
      )}

      {dealer.website && (
        <li>
          <a
            className="btn btn-link"
            href={`//${dealer.website}`}
            target="_blank"
          >
            <span className="icon icon-link" /> {trimUrl(dealer.website)}
          </a>
        </li>
      )}
    </ul>
  </div>
);

export default AdditionalInfoWindow;
