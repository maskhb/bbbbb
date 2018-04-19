import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request(`/api/marketingCategory/list?${stringify(params)}`);
}

export default {
  list,
};
