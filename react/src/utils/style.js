import json2mq from "json2mq";

const SCREEN_XS_MIN = 320;
const SCREEN_SM_MIN = 641;
const SCREEN_MD_MIN = 769;
const SCREEN_LG_MIN = 1025;

const SCREEN_XS_MAX = SCREEN_SM_MIN - 1;
const SCREEN_SM_MAX = SCREEN_MD_MIN - 1;
const SCREEN_MD_MAX = SCREEN_LG_MIN - 1;

const SCREEN_QUERIES = {
  xs: { maxWidth: SCREEN_XS_MAX },
  sm: { minWidth: SCREEN_SM_MIN, maxWidth: SCREEN_SM_MAX },
  md: { minWidth: SCREEN_MD_MIN, maxWidth: SCREEN_MD_MAX },
  lg: { minWidth: SCREEN_LG_MIN }
};

function mediaQuery(sizes) {
  sizes = sizes.toLowerCase().split(" ");

  return sizes.map(size => SCREEN_QUERIES[size]);
}

function mediaQueryString(sizes) {
  const obj = mediaQuery(sizes);

  return json2mq(obj);
}

function getMediaSize(width = 0, mediaSizes = ['xs', 'sm', 'md', 'lg']) {
	for(let i = 0; i < mediaSizes.length; ++i) {
		let { maxWidth, minWidth } = SCREEN_QUERIES[mediaSizes[i]];

		if(i === 0)
			minWidth = null;
		if(i === mediaSizes.length - 1)
			maxWidth = null;

		if(width <= (maxWidth || Number.MAX_VALUE) && width >= (minWidth || Number.MIN_VALUE))
			return mediaSizes[i];
	}

	return mediaSizes[mediaSizes.length - 1];
}

const getScrollContainer = () => {
  return document.querySelector(".layout-inner");
};

const COLORS = {
  // primary colors
  BRAND_RED: "#ED222C",
  BRAND_DARKBLUE: "#232C3A",
  BRAND_WHITE: "#FFFFFF",
  BRAND_DARKGREY: "#858789",
  BRAND_LIGHTGREY: "#D3D5D8",
  BRAND_BLACK: "#000000",
  // secondary colors
  BRAND_ORANGE: "#FF8B28",
  BRAND_YELLOW: "#FFCD1E",
  BRAND_GREEN: "#59DF70",
  BRAND_BLUE: "#3D8BE5",
  // other colors
  MEDIUMBLUE: "#383f4b"
};

export {
  SCREEN_XS_MIN,
  SCREEN_SM_MIN,
  SCREEN_MD_MIN,
  SCREEN_LG_MIN,
  SCREEN_XS_MAX,
  SCREEN_SM_MAX,
  SCREEN_MD_MAX,
  SCREEN_QUERIES,
  mediaQuery,
  mediaQueryString,
  getMediaSize,
  COLORS,
  getScrollContainer
};
