function list(req, res) {
  const params = req.method === 'GET' ? req.params : req.body;

  const tableListDataSource = [];
  for (let i = 0; i < 146; i += 1) {
    tableListDataSource.push({
      goodsId: i + 1,
      key: i,
      imgUrl: Math.floor(Math.random() * 10) % 2 ? 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp' : '',
      goodsName: `螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝${i}`,
      model: `型号${i}`,
      merchantId: i + 1,
      merchantName: `所属商家名称所属商家名称所属商家名称所属商家名称${i}`,
      goodsCategoryId: i + 1,
      supplierShortName: `xx供应商${i}`,
      brandName: `品牌${i}`,
      sellUnitName: `${i}个`,
      createdTime: Date.now(),
      beginTime: Date.now(),
      auditStatus: (Math.floor(Math.random() * 10) % 3) + 1,
      orderStatus: Math.floor(Math.random() * 10) % 8,
      onlineStatus: Math.floor(Math.random() * 10) % 3,
      code: 1,
      barCode: 1,
      moq: 1,
      supplyPrice: 1,
      marketPrice: 1,
      price: 1,
      discountPrice: 1,
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

  if (params.auditStatus || params.auditStatus === 0) {
    const paramStatus = String(params.auditStatus).split(',').map(v => Number(v));
    dataSource = dataSource.filter(data => paramStatus.includes(data.auditStatus));
  }

  if (params.onlineStatus || params.onlineStatus === 0) {
    const paramStatus = String(params.onlineStatus).split(',').map(v => Number(v));
    dataSource = dataSource.filter(data => paramStatus.includes(data.onlineStatus));
  }

  if (params.goodsName) {
    dataSource = dataSource.filter(data => data.goodsName.indexOf(params.goodsName) > -1);
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
    id: params.id + 1,
    key: params.id,
    image: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
    name: `螺丝${params.id}`,
    model: `型号${params.id}`,
    categoryNameLv1: `装修材料${params.id}`,
    categoryNameLv2: `装修材料${params.id}`,
    categoryNameLv3: `装修材料${params.id}`,
    supplierShortName: `xx供应商${params.id}`,
    brandName: `品牌${params.id}`,
    sellUnitName: `${params.id}个`,
    createdTime: new Date(`2017-07-${Math.floor(params.id / 2) + 1}`),
    beginTime: new Date(`2017-07-${Math.floor(params.id / 2) + 1}`),
    auditStatus: Math.floor(Math.random() * 10) % 3,
    orderStatus: Math.floor(Math.random() * 10) % 8,
    onlineStatus: Math.floor(Math.random() * 10) % 2,
    code: 1,
    barCode: 1,
    moq: 1,
    supplyPrice: 1,
    marketPrice: 1,
    price: 1,
    discountPrice: 1,
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
    msg: '服务器错误',
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

function audit(req, res) {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function unit(req, res) {
  const result = [
    {
      id: 1,
      text: '个',
    },
    {
      id: 2,
      text: '台',
    },
  ];

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
  audit,
  unit,
};
