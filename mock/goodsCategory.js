function list(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }


  const dataSource = [];
  for (let i = 0; i < 100; i += 1) {
    dataSource.push({
      categoryId: i + 1,
      key: i,
      orderNum: i,
      parentId: Math.floor(i / 5),
      categoryName: `分类名称${(i + 1)}`,
      categoryAliasName: `别名${(i + 1)}`,
      categoryDesc: `描述${i}`,
      arriveTime: new Date(`2018-04-${Math.floor(i / 2) + 1}`),
      status: Math.floor(Math.random() * 10) % 3,
      isAllowUseDiscount: Math.floor(Math.random() * 10) % 2,
      isArrivalAll: Math.floor(Math.random() * 10) % 2,
      propertyGroupId: 1,
      basePropertyGroupId: 1,
    });
  }

  const result = dataSource;

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

  const i = 20;
  const result = {
    categoryId: i + 1,
    key: i,
    orderNum: i,
    parentId: Math.floor(i / 5),
    categoryName: `分类名称${(i + 1)}`,
    categoryAliasName: `别名${(i + 1)}`,
    categoryDesc: `描述${i}`,
    arriveTime: new Date(`2018-04-${Math.floor(i / 2) + 1}`),
    status: Math.floor(Math.random() * 10) % 3,
    isAllowUseDiscount: Math.floor(Math.random() * 10) % 2,
    isArrivalAll: Math.floor(Math.random() * 10) % 2,
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
