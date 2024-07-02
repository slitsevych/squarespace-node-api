const axios = require('axios');
const Promise = require('bluebird');

const rejectMissingArg = (argName) => Promise.reject(new Error(`Missing ${argName}`));

module.exports = ({ apiKey = '' }) => {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  const instance = axios.create({
    baseURL: 'https://api.squarespace.com/1.0/commerce',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'squarespace-node-api',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  function _request(config) {
    return instance(config)
      .then(response => response.data)
      .catch(error => {
        if (error.response) {
          return Promise.reject(new Error(`Request failed with status code ${error.response.status}`));
        }
        return Promise.reject(error);
      });
  }

  return {
    get(url, params = {}) {
      if (!url) {
        return rejectMissingArg('url');
      }

      return _request({ url, method: 'GET', params });
    },

    post(url, data) {
      if (!url) {
        return rejectMissingArg('url');
      }

      if (!data || isEmptyObject(data)) {
        return rejectMissingArg('body');
      }

      return _request({ url, method: 'POST', data });
    }
  };
};

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
