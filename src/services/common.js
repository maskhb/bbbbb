// 公用 api 请求
import request from '../utils/request';

async function getProvincesWithCommunities() {
  return request('/mj/ht-mj-cms-server/community/getAllComCommunity', { mock: false });
}
async function queryCommunityList(params) {
  return request('/json/community-api/community/base/listPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export default {
  getProvincesWithCommunities,
  queryCommunityList,
};
