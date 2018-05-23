const tableListDataSource = [];
for (let i = 0; i < 246; i += 1) {
  tableListDataSource.push({
    goodsId: i + 1,
    goodsName: `螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝${i}`,
    imgUrl: Math.floor(Math.random() * 10) % 2 ? 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp' : '',
    merchantName: `所属商家名称所属商家名称所属商家名称所属商家名称${i}`,
    goodsCategoryId: i + 1,
    status: (Math.floor(Math.random() * 10) % 3) + 1,
    auditStatus: (Math.floor(Math.random() * 10) % 3) + 1,
    createdTime: Date.now(),

    model: `型号${i}`,
    merchantId: i + 1,
    supplierShortName: `xx供应商${i}`,
    brandName: `品牌${i}`,
    sellUnitName: `${i}个`,
    orderStatus: Math.floor(Math.random() * 10) % 8,
    code: 1,
    barCode: 1,
    moq: 1,
    supplyPrice: 1,
    marketPrice: 1,
    price: 1,
    discountPrice: 1,
    isCopy: (Math.floor(Math.random() * 10) % 2) + 1,
    auditOpinion: '螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝$',
  });
}

function list(req, res) {
  const params = req.method === 'GET' ? req.params : req.body.goodsBaseVoList;

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

  if (params.status || params.status === 0) {
    const paramStatus = String(params.status).split(',').map(v => Number(v));
    dataSource = dataSource.filter(data => paramStatus.includes(data.status));
  }

  if (params.goodsName) {
    dataSource = dataSource.filter(data => data.goodsName.indexOf(params.goodsName) > -1);
  }

  let pageSize = 10;
  if (params.pageInfo.pageSize) {
    pageSize = params.pageInfo.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.pageInfo.currPage, 10),
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function detail(req, res) {
  // const params = res.type === 'GET' ? req.params : req.body;

  const result = {
    // goodsId: params.id + 1,
    // key: params.id,
    // imgUrl: Math.floor(Math.random() * 10) % 2 ? 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp' : '',
    // goodsName: `螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝螺丝${params.id}`,
    // model: `型号${params.id}`,
    // factoryId: 1,
    // factoryName: '对对对',
    // merchantId: 4,
    // unionMerchantId: 1,
    // goodsType: 1,
    // merchantName: `所属商家名称所属商家名称所属商家名称所属商家名称${params.id}`,
    // goodsCategoryId: params.id + 1,
    // supplierShortName: `xx供应商${params.id}`,
    // brandName: `品牌${params.id}`,
    // sellUnitName: `${params.id}个`,
    // createdTime: Date.now(),
    // beginTime: Date.now(),
    // auditStatus: (Math.floor(Math.random() * 10) % 3) + 1,
    // orderStatus: Math.floor(Math.random() * 10) % 8,
    // status: Math.floor(Math.random() * 10) % 3,
    // code: 1,
    // barCode: 1,
    // moq: 1,
    // supplyPrice: 1,
    // marketPrice: 1,
    // price: 1,
    // discountPrice: 1,
    // goodsSellingPoint: '卖点',
    // goodsCode: '编码',

    basePropertyGroupId: 1,
    brandId: 1,
    factoryId: 1,
    goodsCategoryId: 1,
    goodsCode: 'string',
    goodsDetail: 'string',
    goodsId: 0,
    goodsImgGroupVoList: [
      {
        baseSkuId: 0,
        goodsImgVoList: [
          {
            imgUrl: 'http://g-search2.alicdn.com/img/bao/uploaded/i4/i4/3527440877/TB19EyfksnI8KJjSsziXXb8QpXa_!!0-item_pic.jpg_250x250.jpg_.webp',
            isMain: 0,
          },
        ],
        id: 0,
        imgGroupId: 1,
        imgGroupName: 'string',
        isDefault: 0,
      },
    ],
    goodsName: 'string',
    goodsPropertyRelationVoSList: [
      {
        propertyGroupId: 1,
        propertyId: 1,
        propertyValueId: 0,
      },
    ],
    goodsSellingPoint: 'string',
    goodsSkuVoList: [
      {
        propertyGroupId: 0, // 此sku是基于哪个属性组生成的
        barCode: 'string',
        discountPrice: 0,
        id: 1,
        imgGroupId: 1,
        isDefault: 1,
        marketPrice: 0,
        occupyNum: 0,
        remainNum: 0,
        salePrice: 0,
        skuCode: 'string',
        skuId: 1,
        skuPropertyRelationVoSList: [
          {
            propertyKey: 'sku属性1',
            propertyKeyId: 0,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性2',
            propertyKeyId: 2,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性3',
            propertyKeyId: 3,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
        ],
        status: 0,
        supplyPrice: 0,
        totalNum: 0,
      },
      {
        propertyGroupId: 1, // 此sku是基于哪个属性组生成的
        barCode: 'string',
        discountPrice: 0,
        id: 1,
        isDefault: 0,
        marketPrice: 0,
        occupyNum: 0,
        remainNum: 0,
        salePrice: 0,
        skuCode: 'string',
        skuId: 2,
        skuPropertyRelationVoSList: [
          {
            propertyKey: 'sku属性4',
            propertyKeyId: 3,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性4',
            propertyKeyId: 4,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性5',
            propertyKeyId: 5,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性6',
            propertyKeyId: 6,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性7',
            propertyKeyId: 7,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
          {
            propertyKey: 'sku属性8',
            propertyKeyId: 8,
            propertyValue: 'sku属性1的值',
            propertyValueId: 0,
          },
        ],
        status: 0,
        supplyPrice: 0,
        totalNum: 0,
      },
    ],
    goodsType: 0,
    marketingCategoryId: 1,
    merchantId: 4,
    merchantName: '所属厂家',
    propertyGroupId: 1,
    serviceTime: 1,
    serviceType: 1,
    spaceId: 0,
    unitName: 'string',
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

function online(req, res) {
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
  auditStatusList: list,
  online,
};
