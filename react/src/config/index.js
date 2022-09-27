const development = {
  API: "https://api.test.autolife.ca/",
  MEDIA_URL: "https://d2avndct4sd7dh.cloudfront.net",
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};
const test = {
  API: "https://api.test.autolife.ca/",
  MEDIA_URL: "https://d2avndct4sd7dh.cloudfront.net",
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};
const production = {
  API: "https://api.autolife.ca/",
  MEDIA_URL: "https://d3h652g9lldx73.cloudfront.net",
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};
const staging = {
  API: "https://api.autolife.ca/",
  MEDIA_URL: "https://d3h652g9lldx73.cloudfront.net",
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};

const Config = (env = process.env.REACT_APP_ENV) => {
  if (env === "production") {
    return production;
  } else if (env === "staging") {
    return staging;
  } else if (env === "test") {
    return test;
  }
  return development;
};
export default Config();
