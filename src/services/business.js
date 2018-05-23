import { stringify } from 'qs';
import request from '../utils/request';

/* 商家列表页 */

/* 分页获取商家信息接口 */
async function queryListByPage(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/queryListByPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function queryList(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/* 根据商家id查询商家基本信息详情接口 */
async function queryDetail(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 根据商家id查询商家完整信息详情接口 */
async function queryDetailAll(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/queryDetailAll', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 校验厂家 */
async function validateUnion(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/validateUnion', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 更新商家状态接口 */
async function updateStatus(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/* 下载批量导入模板 */
// 下载帐号模板批量
async function downloadMerchantAccountTemplate(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/downloadMerchantAccountTemplate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 下载商家模板批量
async function downloadMerchantTemplate(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/downloadMerchantTemplate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 新增商家信息接口
async function saveNewMerchant(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新商家信息接口
async function updateMerchant(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 导入帐号
async function importAccount(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/importAccount', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 导入商家
async function importMerchant(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/importMerchant', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 关联商家

async function unionMerchant(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/unionMerchant', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 解除关联

async function disunionMerchant(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/disunionMerchant', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function list(params) {
  return request(`/api/business/list?${stringify(params)}`);
}

async function add(params) {
  return request('/api/business/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function edit(params) {
  return request('/api/business/edit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function remove(params) {
  return request('/api/business/remove', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


async function exsit(params) {
  return request('/api/business/exsit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 根据复合条件查询商家列表
async function queryListByMutilCondition(params) {
  return request('/mj/ht-mj-merchant-server/merchantBase/queryListByMutilCondition', {
    method: 'POST',
    body: {
      merchantBaseVoMultiCondition: {
        ...params,
      },
    },
    pagination: true,
  });
}

// 查询地址节点路径
async function getRegionPath(params) {
  return request('/json/region-api/region/getRegionPath', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryListByPage,
  queryList,
  queryDetail,
  queryDetailAll,
  downloadMerchantAccountTemplate,
  downloadMerchantTemplate,
  saveNewMerchant,
  importMerchant,
  importAccount,
  updateMerchant,
  unionMerchant,
  disunionMerchant,
  list,
  add,
  edit,
  remove,
  exsit,
  validateUnion,
  updateStatus,
  getRegionPath,

  queryListByMutilCondition,
};
