import { getUrlParams } from './utils';

const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  const rid = Math.round(Math.random());
  tableListDataSource.push({
    key: i,
    merchantId: i + 1, /* 商家ID */
    merchantName: `商家名称${i}`, /* 商家名称 */
    unionMerchantId: rid, /* 关联商家ID? */
    unionMerchantName: rid === 0 ? '' : `厂家${i}`, /* 关联厂家名称 */
    merchantType: 2, /* 商家类型 0全部 1厂商 2经销商 3小商家 */
    merchantTypeName: 'Freddy Predovic', /* 类型名称 */
    categoryId: 3, /* 分类ID */
    categoryName: 'Bridgette', /* 分类名称 */
    operateScopeIdList: '4,3', /* 经营范围ID */
    operateScopeNameList: null, /* 经营范围名称 */
    communityIdList: '147,145', /* 关联项目ID列表 */
    communityNameList: null, /* 关联名称列表 */
    createdTime: 1523495176399, /* 创建时间 */
    status: Math.floor(Math.random() * 3) + 1, /* 商家状态 0全部 1已下架 2已开通 3已冻结 */
  });
}

function list(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function add(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function edit(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function remove(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function exsit(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  list,
  add,
  edit,
  remove,
  exsit,
};
