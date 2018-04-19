import { getUrlParams } from './utils';

const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    propertyKeyId: i + 1,
    propertyName: `基本属性${i}`,
    inputType: (Math.floor(Math.random() * 10) % 4) + 1,
    isRequired: (Math.floor(Math.random() * 10) % 2) + 1,
    isFilter: (Math.floor(Math.random() * 10) % 2) + 1,
    orderNum: i,
    createdTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`).getTime(),
    createrName: `创建人${i}`,
    status: (Math.floor(Math.random() * 10) % 3) + 1,
    url: 'https://www.baidu.com',
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
    const paramStatus = params.status.split(',');
    let filterDataSource = [];
    paramStatus.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
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

function detail(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  const result = {
    propertyKeyId: params.id,
    key: params.id,
    image: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
    propertyName: `螺丝${params.id}`,
    order: params.id,
    createdTime: new Date(`2017-07-${Math.floor(params.id / 2) + 1}`),
    creater: `创建人${params.id}`,
    status: Math.floor(Math.random() * 10) % 3,
    url: 'https://www.baidu.com',
    description: '描述',
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
  detail,
  add,
  remove,
  status,
};
