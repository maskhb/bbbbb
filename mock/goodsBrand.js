function list(req, res) {
  const params = res.type === 'GET' ? req.params : req.body;

  const tableListDataSource = [];
  for (let i = 0; i < 46; i += 1) {
    tableListDataSource.push({
      brandId: i + 1,
      status: Math.floor(Math.random() * 10) % 3,
      brandName: `螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝
      螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝
      螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝${i}`,
      brandUrl: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
      orderNum: i + 1,
      createdTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`).getTime(),
      createdName: `创建人${i}`,
      brandHomeUrl: 'https://www.baidu.com',
    });
  }
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
    const paramStatus = String(params.status).split(',').map(v => Number(v));
    dataSource = dataSource.filter(data => paramStatus.includes(data.status));
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
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

function detail(req, res) {
  const params = res.type === 'GET' ? req.params : req.body;

  const result = {
    brandId: Number(params.id) || 1,
    status: Math.floor(Math.random() * 10) % 3,
    brandName: `螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝
    螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝
    螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝1`,
    brandUrl: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
    orderNum: 1,
    createdName: '创建人1',
    brandHomeUrl: 'https://www.baidu.com',
    createdTime: Date.now(),
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
