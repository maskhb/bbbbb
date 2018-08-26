import { getUrlParams } from './utils';

const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    accountId: i + 1,
    key: i,
    loginName: `登录名${i}`,
    realName: `真实名称${i}`,
    nickName: `昵称${i}`,
    mobile: `13800${Math.floor(Math.random() * 10) % 2}`,
    createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    memberStatus: Math.floor(Math.random() * 10) % 2,
    accountType: Math.floor(Math.random() * 10) % 3,
  });
}

const logList = [];
for (let i = 0; i < 100; i += 1) {
  logList.push({
    key: i,
    loginName: `操作人登录ID${i}`,
    action: `asdasd${i}`,
    remark: `备注备注++${i}`,
    mobile: `13800${Math.floor(Math.random() * 10) % 2}`,
    createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
  });
}

const details = {
  accountId: 'string',
  accountType: 1,
  address: 'string',
  avatarUrl: 'string',
  businessType: 'MM_EC',
  countryCode: 'string',
  email: 'string',
  gender: 'MALE',
  idCardNo: 'string',
  legacyUserId: 0,
  loginName: 'string',
  memberStatus: 'ACTIVATED',
  mobile: 'string',
  nickName: 'string',
  parentId: 'string',
  realName: 'string',
  thirdBinds: [
    {
      thirdAvatar: 'string',
      thirdName: 'string',
    },
  ],
  token: 'string',
  userStatus: 'Invalid',
  createTime: new Date(`2017-07-${Math.floor(10 / 2) + 1}`),
  birthDate: new Date(`2017-07-${Math.floor(10 / 2) + 1}`),
};
const list = (req, res, u) => {
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
};

const log = (req, res, u) => {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...logList];

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
};

const add = (req, res) => {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const detail = (req, res) => {
  const result = {
    result: details,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const edit = (req, res) => {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const remove = (req, res) => {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const exist = (req, res) => {
  const result = {
    result: Math.floor(Math.random() * 10) % 2,
    msg: 'xxx',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

export default {
  list,
  add,
  edit,
  detail,
  remove,
  log,
  exist,
};
