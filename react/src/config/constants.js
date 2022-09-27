import React from "react";
import { Link } from "react-router-dom";
import restaurant from "../assets/demo/restaurant.jpg";

export const HEADER_LAYOUT_TYPES = {
  DEFAULT: "default",
  SOFTREGISTRATION: "softRegistration",
  NOT_FOUND: "notFound",
  NONE: "none"
};

export const FOOTER_LAYOUT_TYPES = {
  DEFAULT: "default",
  SOFTREGISTRATION: "softRegistration",
  NONE: "none"
};

export const IMAGE_PLACEHOLDER =
  "http://via.placeholder.com/169x71?text=Placeholder";
export const pollUrl = "https://polldaddy.com/polls";
export const mainLinks = [
  { route: "/market-place", label: "Tools" },
  { route: "/articles", label: "Articles" },
  { route: "/shopping", label: "Shop for Cars" },
  { route: "/insurance", label: "Insurance" },
  { route: "/autoshow", label: "Autoshow" }
  /* , { route: `${window.location.origin}/placeholder/news.html`, label: 'News' }
  { route: '/promotions', label: 'Promotions' } */
];

export const profileLinks = [
  { route: "/profile#personal-info", label: "Personal Information" },
  { route: "/profile#communication", label: "Communication Preferences" },
  { route: "/profile#saved-cars", label: "My Saved Cars" },
  { route: "/profile#subjects", label: "Trends I'm Following" },
  { route: "/profile#brands", label: "Brands I'm Following" }
];

export const defaultCarImg = require("../styles/img/listings/DefaultCar.svg");
export const defaultSuvImg = require("../styles/img/listings/DefaultCar-SUV.svg");
export const defaultTruckImg = require("../styles/img/listings/DefaultCar-Truck.svg");
export const defaultSedanImg = require("../styles/img/listings/DefaultCarIcon-NoLabel.svg");

export const bodyStyle = {
  Wagon: defaultSuvImg,
  Sedan: defaultSedanImg,
  Minivan: defaultSuvImg,
  Pickup: defaultTruckImg,
  Hatchback: defaultSedanImg,
  Coupe: defaultSedanImg,
  SUV: defaultSuvImg,
  Convertible: defaultSedanImg,
  Roadster: defaultSedanImg,
  "SUV / Crossover": defaultSuvImg,
  Van: defaultSuvImg
};
export const defaultDescription =
  "Autolife is about people and the emotional connection they have with cars. It provides a personalized journey, connecting you to things that matter the most to your ever-changing lifestyle.";
export const Characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const MSRP_TEXT = (
  <p>
    Pricing details are provided for information purposes only and does not
    include certain taxes and fees that may be applicable in Ontario. For
    complete pricing details, please 
    <Link
      to="/content/pricing-disclaimer"
      target="_blank"
      className="primary-link"
    >
      click here
    </Link>
    .
  </p>
);

export const OMVIC = 10;

export const TRADE_IN_TEXT =
  "  The trade-in value is presented as a guideline to give you a range of what you could expect to get from a dealer. It is important to note that when a dealer takes a vehicle in on trade, they will need to recondition and market it for resale. These costs are taken into account when providing a trade-in value. When trading in a vehicle, the value is applied to the transaction price prior to calculating the applicable sales taxes which can result in a tax saving to you. While selling a vehicle privately may garner a higher sale price than what you";

export const TRADE_IN_HIGH =
  "To receive the high estimate of your trade-in value, your vehicle must be in near perfect condition with no exterior blemishes or interior wear or odours. Mechanically, your vehicle must require no repairs";

export const TRADE_IN_LOW =
  "The low value is based on a vehicle that needs to be reconditioned cosmetically and mechanically to give it that new-to-you feeling for the next owner.";

export const facebookURL = "https://www.facebook.com/dialog/feed";

export const twitterURL = "https://twitter.com/intent/tweet?&text=";

export const gmailURL = "https://plus.google.com/share?url=";

export const ADVERTISE_WITH_US_TEXT =
  "Advertising on AutoLife is a unique opportunity to reach a deeply engaged and motivated automotive audience in a creative and compelling way.";

export const ABOUT_US_TEXT =
  "AutoLife is about people. We have created AutoLife for people just like us who are looking to get the most out of their auto lifestyle. People who are simply excited and want to be connected to what is next.";

export const CONTACT_US_TEXT = (
  <span>
    50 Leek Crescent
    <br /> Suite 2B
    <br /> Richmond Hill, ON <br />
    L4B 4J3
  </span>
);

export const footerItems = {
  data: [
    { id: "1", label: "ipsum sit dolor amit" },
    { id: "2", label: "Duis aute irure" },
    { id: "3", label: "Duis aute irure" },
    { id: "4", label: "Duis aute irure" }
  ]
};

export const pollsFooter = {
  data: [
    { id: "1", label: "Results", url: "results/?ad=poll-view-results" },
    { id: "2", label: "Votes", url: "vote-analysis/?ad=poll-view-analysis" },
    {
      id: "3",
      label: "IP Analysis",
      url: "ip-analysis/?ad=poll-view-detection"
    },
    { id: "4", label: "Voter Location", url: "location/?ad=poll-view-location" }
  ]
};

export const purchaseTimeFrame = [
  { id: "1", name: "3-6 Month" },
  { id: "2", name: "6-12 Month" },
  { id: "3", name: "12+ Month" }
];

export const footerTitle = {
  data: [
    { id: "1", label: "about us" },
    { id: "2", label: "advertise with us" },
    { id: "3", label: "media" },
    { id: "4", label: "contact us", link: "/contact-us" }
  ]
};
export const footerLinks = {
  data: [
    { id: "1", label: "Privacy", link: "/content/privacy-policy" },
    { id: "2", label: "Terms of Use", link: "/content/terms-of-use" }
    // { id: '3', label: 'Accessibility', link: '/content/accessibility' }
  ]
};

export const sortDataByPrice = {
  data: [
    { id: 0, name: "Price High To Low" },
    { id: 1, name: "Price Low To High" }
  ]
};

export const templateName = {
  data: [
    { id: 0, name: "All Templates", value: null },
    { id: 1, name: "Editorial Template", value: "Editorial Template" },
    { id: 2, name: "Vehicle Editorial Template", value: "Vehicle Editorial Template" }
  ]
};

export const sortDataByPublishingState = {
  data: [
    { id: 0, name: "Draft", params: "Draft" },
    { id: 1, name: "Published", params: "Published" },
    { id: 2, name: "Ready To Approve", params: "Ready To Approve" }
  ]
};

export const sortDataByPublishingDate = {
  data: [
    { id: 0, name: "Expired", params: "expired" },
    { id: 1, name: "Published", params: "published_by_date" },
    { id: 2, name: "To be Published", params: "to_be_published" }
  ]
};

export const cbbList = {
  data: [
    { id: "1", label: "Marketplace /", showImage: true, className: false },
    { id: "2", label: "Shopping Tools /", showImage: false, className: false },
    { id: "3", label: "Car Listings", showImage: false, className: true }
  ]
};

export const contentHandlingCheckbox = {
  data: [
    { id: "1", label: "Timely Content", name: "is_timely_content" },
    {
      id: "2",
      label: "Disable Personalization",
      name: "disable_personalization"
    },
    { id: "3", label: "Promoted Content", name: "is_promoted_content" },
    { id: "3", label: "Available on Home Page", name: "homepage_availability" },
    { id: "4", label: "Available on Trends ", name: "available_in_trends" },
    { id: "5", label: "Featured Article", name: "is_featured" }
  ]
};

export const cbbFilterTitle = {
  data: [
    {
      id: "1",
      label: "New Listings",
      showIcon: true,
      showImage: false,
      className: ""
    },
    {
      id: "2",
      label: "Used Listings",
      showIcon: true,
      showImage: true,
      className: ""
    },
    {
      id: "3",
      label: "Price",
      showIcon: false,
      showImage: false,
      className: "no-border_top"
    }
  ]
};

export const cbbPriceFilter = {
  data: [
    { id: "1", label: "Under $15,000", priceInitial: 0, priceFinal: 15000 },
    {
      id: "2",
      label: "$15,000 - $25,000",
      priceInitial: 15000,
      priceFinal: 25000
    },
    {
      id: "3",
      label: "$25,000 - $35,000",
      priceInitial: 25000,
      priceFinal: 35000
    },
    {
      id: "4",
      label: "$35,000 - $45,000",
      priceInitial: 35000,
      priceFinal: 45000
    },
    { id: "5", label: "over $45,000", priceInitial: 45000, priceFinal: 45000 }
  ]
};

export const defaultButtonText = "Know More";
export const defaultSubheading = "It's about what moves you";
export const defaultHeadline = "AutoLife";
export const defaultImageUrl = restaurant;
export const defaultCtaLink =
  "/content/this-new-app-uses-crowdsourcing-to-map-noise-levels-in-restaurants";

export const CBBTOOLS = {
  FUTUREVALUE: "future-value",
  AVERAGEPRICE: "average-price",
  TRADEIN: "trade-in-value",
  RECALL: "recall"
};

export const userValue = "a71d493d01162b8ea6c98c387";
export const userId = "f038de78a5";
export const subscribeAction =
  "https://autolife.us17.list-manage.com/subscribe/post";

export const NO_CARS_AVAILABLE = (
  <div>
    <h4>
      The vehicle you are looking for is currently unavailable
      <br /> or the information is pending an update.
    </h4>
    <p>
      We apologize for the inconvenience. Please adjust your search or check
      back later. <br />
      Your local dealer will have the most up to date information about the
      vehicle you are looking for.
    </p>
  </div>
);

export const INSURANCE_PHONE_TEXT = "1-833-HUB-AUTO";

export const INSURANCE_PHONE = "1-833-482-2886";

export const INSURANCE_EMAIL = "autolife@hubinternational.com";

export const FACEBOOK_URL = "https://www.facebook.com/AutoLifeCA/";
export const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCe61ki53tmSI1wF54nPBuaQ";
export const INSTAGRAM_URL = "https://www.instagram.com/Autolifeca/";
export const TWITTER_URL = "https://twitter.com/Autolifeca";

export const MEDIA_BUCKETS = [
  "media-staging-autolife-ca.s3.amazonaws.com",
  "media-dev-autolife-ca.s3.amazonaws.com"
];
