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
      posId: i + 1,
      key: i + 1,
      posName: `广告位置${(i + 1)}`,
      showStyle: 1,
      categoryDesc: `posDesc${i}`,
      isScrooling: (1 + (Math.floor(Math.random() * 10) % 2)),
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
    posId: i + 1,
    posName: `广告位置${(i + 1)}`,
    showStyle: 1,
    categoryDesc: `posDesc${i}`,
    isScrooling: (1 + (Math.floor(Math.random() * 10) % 2)),
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
