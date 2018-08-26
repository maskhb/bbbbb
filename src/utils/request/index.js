import fetch from 'dva/fetch';
// import { routerRedux } from 'dva/router';
// import store from '../index';
import qs from 'qs';
// import { env } from '../../config/global';
import * as utils from './utils';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function baseRequest(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  if (!newOptions.method) {
    newOptions.method = 'POST';
  }
  // if (options.pagination && typeof (newOptions.body) === 'object' && !newOptions.body.pageInfo) {
  //   newOptions.body.pageInfo = { pageSize: 1, currPage: 10 };
  // }
  const isFormData = newOptions.body instanceof FormData;

  if ((newOptions.method === 'POST' || newOptions.method === 'PUT') && !isFormData) {
    if (newOptions.transformRequest) {
      newOptions.body = JSON.stringify(newOptions.transformRequest(newOptions.body));
    } else {
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }


  newOptions.headers = utils.getDefaultHeaders(newOptions, isFormData);

  let newURL = utils.toFullPath(url);
  if (newOptions.query) {
    if (typeof newOptions.query === 'string') {
      newURL = `${newURL}?${newOptions.query}`;
    } else {
      newURL = `${newURL}?${qs.stringify(newOptions.query)}`;
    }
  }

  return fetch(newURL, newOptions);
}

export default function request(url, options) {
  return baseRequest(url, options)
    .then(utils.checkStatus)
    .then(response => response.json())
    .then(utils.checkIsMock)
    .then(utils.checkResponseJSON)
    .then(json => utils.transformResponse(json, options))
    .then(json => utils.transformPagination(json, options))
    .then(json => (json === null ? -1 : json))
    .catch(e => utils.transformError(e, options));
}

// 方便调试
// if (env !== 'production') {
window.request = request;
// }
