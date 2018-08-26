import { getUrlParams } from './utils';

function list(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);
  const dataSource = [];
  for (let i = 0; i < 100; i += 1) {
    dataSource.push({
      adItemId: i + 1,
      key: i + 1,
      adName: `广告项${(i + 1)}`,
      communityType: 1,
      orderNum: 1,
      posId: 1,
      categoryDesc: `posDesc${i}`,
      openStatus: (1 + (Math.floor(Math.random() * 10) % 2)),
      createdTime: new Date(`2018-04-${Math.floor(i / 2) + 1}`),
    });
  }
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    dataList: dataSource,
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

function detail(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  const i = params.id;
  const result = {
    adItemId: i + 1,
    key: i + 1,
    adName: `广告项${(i + 1)}`,
    communityType: 1,
    orderNum: 1,
    posId: 1,
    categoryDesc: `posDesc${i}`,
    openStatus: (1 + (Math.floor(Math.random() * 10) % 2)),
    createdTime: new Date(`2018-04-${Math.floor(i / 2) + 1}`),
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function add(req, res) {
  const result = {
    msgCode: 200,
    data: Boolean(Math.floor(Math.random() * 10) % 2),
    message: '',
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
    msgCode: 200,
    data: Boolean(Math.floor(Math.random() * 10) % 2),
    message: '',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


function status(req, res) {
  const result = {
    msgCode: 200,
    data: Boolean(Math.floor(Math.random() * 10) % 2),
    message: '',
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
  status,
  detail,
};
