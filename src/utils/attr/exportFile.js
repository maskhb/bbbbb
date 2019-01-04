/**
 * 模块名
 */
export const moduleOptions = [
  {
    value: 900001,
    label: '房态管理-维修单',
  },
  {
    value: 900002,
    label: '入住登记单',
  },
  {
    value: 900003,
    label: '历史账务查询',
  },
  {
    value: 900004,
    label: '房源管理-房间管理',
  },
];

/**
 * 状态
 */
export const statusOptions = [
  {
    value: 1,
    label: '请求中',
  },
  {
    value: 2,
    label: '生成中',
  },
  {
    value: 3,
    label: '已完成',
  },
  {
    value: 4,
    label: '已取消',
  },
];

/**
 * 导出 param
 */
export const getExportParams = (params = {}) => {
  const newParams = [];

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      newParams.push(`${key}=${JSON.stringify(value)}`);
    }
  }
  return newParams.length > 0 ? newParams.join('&') : '';
};

export const getPrefix = (dataUrl = '', oldServiceUrl) => {
  if (dataUrl.indexOf('http') === 0) {
    return dataUrl;
  }

  const { hostname } = location;
  let env = 'prd';
  const envList = [
    '172',
    'dev',
    'sit',
    'stg',
    'test',
    'fix',
    'stress',
  ];
  envList.forEach((item) => {
    if (hostname?.indexOf(item) > -1) {
      env = item;
    }
  });

  if (hostname === 'localhost' || env === '172') {
    env = 'dev';
  } else if (env === 'prd' && oldServiceUrl) {
    env = 'release';
  }

  // let env = process.env.API_ENV;
  // if (typeof env === 'undefined') {
  //   env = 'dev';
  // }

  if (oldServiceUrl) {
    let hostName = `${env}.${oldServiceUrl}.hd`;
    if (env === 'stg') {
      hostName = `ht-${oldServiceUrl}-stg.htmimi.com`;
    }
    if (env === 'release') {
      hostName = `ht-${oldServiceUrl}.htmimi.com`;
    }
    return `http://${hostName}${dataUrl.indexOf('/') === 0 ? '' : '/'}${dataUrl}`;
  } else {
    const suffix = `-${env}.hd`;
    return `http://zuul-internal${suffix}${dataUrl.indexOf('/') === 0 ? '' : '/'}${dataUrl}`;
  }
};
