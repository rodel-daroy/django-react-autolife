import { LOG_ERROR } from '../actiontypes/commonActionTypes';
import { getDomain } from 'utils/url';
import Config from 'config';
import axios from 'axios';

const sendLogEntry = (body, domain = getDomain()) => {
	axios.post(`${Config.LOG_URL}?domain=${domain}`, body);
};

const getLogEntry = (error, metadata) => JSON.stringify({
	...metadata,

	error: { 
		...error,

		name: error.name,
		message: error.message,
		stack: error.stack
	},
	location: {
		domain: getDomain(),
		pathname: window.location.pathname,
		search: window.location.search
	},
	browser: {
		userAgent: navigator.userAgent
	}
});

export const logError = error => {
  console.error(error);

  sendLogEntry(getLogEntry(error));
  
  return {
    type: LOG_ERROR,
    payload: error
  };
};