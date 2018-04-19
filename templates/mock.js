import { getUrlParams } from './utils';

const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    id: i + 1,
    key: i,
    name: `名称${i}`,
    time: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    status: Math.floor(Math.random() * 10) % 3,
    image: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
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

function detail(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const i = 1;
  const result = {
    id: i + 1,
    key: i,
    name: `名称${i}`,
    time: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    status: Math.floor(Math.random() * 10) % 3,
    image: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
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

function update(req, res) {
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
  detail,
  add,
  edit,
  remove,
  update,
};
