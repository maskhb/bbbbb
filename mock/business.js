import { getUrlParams } from './utils';

const tableListDataSource = [];
for (let i = 0; i < 100; i += 1) {
  const rid = Math.round(Math.random());
  tableListDataSource.push({
    key: i,
    merchantId: i + 1, /* 商家ID */
    merchantName: `商家名称${i}`, /* 商家名称 */
    unionMerchantId: rid, /* 关联商家ID? */
    unionMerchantName: rid === 0 ? '' : `厂家${i}`, /* 关联厂家名称 */
    merchantType: Math.floor(Math.random() * 10) % 4, /* 商家类型 0全部 1厂商 2经销商 3小商家 */
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

function queryList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = req.method === 'GET' ? req.params : req.body;

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

  if (params.merchantType || params.merchantType === 0) {
    dataSource = dataSource.filter(data => data.merchantType === params.merchantType);
  }

  if (params.merchantName) {
    dataSource = dataSource.filter(data => data.merchantName.includes(params.merchantName));
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

function queryDetail(req, res) {
  const result = {
    address: '3214321',
    categoryId: 1,
    chineseName: '随便来个',
    couponAccount: '试一下',
    createdBy: 2,
    createdTime: 0,
    englishName: 'string',
    isDelete: 0,
    logoImgUrl: 'https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg',
    mainImgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    merchantId: 0,
    merchantName: 'string',
    merchantType: 2,
    orderReceiveTelphoneNo: 'string',
    preStatus: 0,
    predepositCouponSwitch: 0,
    regionId: 0,
    status: 0,
    summary: 'string',
    telphoneNo: 'string',
    trafficInfo: 'string',
    unionMerchantId: 0,
    unionMerchantName: '鹅厂大佬',
    updatedBy: 0,
    updatedTime: 0,
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function queryDetailAll(req, res) {
  const result = {
    merchantBaseVo: {
      address: 'string',
      categoryId: 0,
      chineseName: 'string',
      couponAccount: 'string',
      createdBy: 0,
      createdTime: 0,
      englishName: 'string',
      isDelete: 0,
      logoImgUrl: 'string',
      mainImgUrl: 'string',
      merchantId: 0,
      merchantName: 'string',
      merchantType: 0,
      orderReceiveTelphoneNo: 'string',
      preStatus: 0,
      predepositCouponSwitch: 0,
      regionId: 0,
      status: 0,
      summary: 'string',
      telphoneNo: 'string',
      trafficInfo: 'string',
      unionMerchantId: 0,
      unionMerchantName: 'string',
      updatedBy: 0,
      updatedTime: 0,
    },
    merchantBeneficiaryVo: {
      beneficiaryAccountNumber: 'string',
      beneficiaryBankName: 'string',
      beneficiaryId: 0,
      beneficiaryIdentityCardNumber: 'string',
      beneficiaryName: 'string',
      beneficiaryOpeningBankName: 'string',
      createdBy: 0,
      createdTime: 0,
      dbCreatedTime: '2018-04-23T02:38:30.820Z',
      dbUpdatedTime: '2018-04-23T02:38:30.820Z',
      isDelete: 0,
      merchantId: 0,
      taxNumber: 'string',
      updatedBy: 0,
      updatedTime: 0,
    },
    merchantCommunityRefVoList: [
      {
        communityId: 0,
        communityName: 'string',
        createdBy: 0,
        createdTime: 0,
        dbCreatedTime: '2018-04-23T02:38:30.820Z',
        dbUpdatedTime: '2018-04-23T02:38:30.820Z',
        isDelete: 0,
        merchantId: 0,
        orderNum: 0,
        refId: 0,
        updatedBy: 0,
        updatedTime: 0,
      },
    ],
    merchantContactVo: {
      contactId: 0,
      contactPersonEmail: 'string',
      contactPersonMobilePhone: 'string',
      contactPersonName: 'string',
      contactPersonPhone: 'string',
      createdBy: 0,
      createdTime: 0,
      dbCreatedTime: '2018-04-23T02:38:30.820Z',
      dbUpdatedTime: '2018-04-23T02:38:30.820Z',
      isDelete: 0,
      merchantId: 0,
      updatedBy: 0,
      updatedTime: 0,
    },
    merchantImgVoList: [
      {
        createdBy: 0,
        createdTime: 0,
        dbCreatedTime: '2018-04-23T02:38:30.820Z',
        dbUpdatedTime: '2018-04-23T02:38:30.820Z',
        imgId: 0,
        isDelete: 0,
        merchantId: 0,
        type: 0,
        url: 'string',
      },
    ],
    merchantLogVoList: [
      {
        operateResult: 'string',
        operateTime: 0,
        operaterName: 'string',
        remark: 'string',
        statusName: 'string',
      },
    ],
    merchantOperateScopeVoList: [
      {
        createdBy: 0,
        createdTime: 0,
        goodsCategoryId: 0,
        goodsCategoryName: 'string',
        isDelete: 0,
        merchantId: 0,
        scopeId: 0,
        updatedBy: 0,
        updatedTime: 0,
      },
    ],
    merchantQualificationVo: {
      createdBy: 0,
      createdTime: 0,
      dbCreatedTime: '2018-04-23T02:38:30.820Z',
      dbUpdatedTime: '2018-04-23T02:38:30.820Z',
      institutionaCode: 'string',
      isDelete: 0,
      legalRepresentative: 'string',
      legalRepresentativeIdcardNo: 'string',
      licenseName: 'string',
      licenseNumber: 'string',
      merchantId: 0,
      qualificationId: 0,
      updatedBy: 0,
      updatedTime: 0,
    },
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
  queryList,
  list,
  add,
  queryDetail,
  queryDetailAll,
  remove,
  exsit,
};
