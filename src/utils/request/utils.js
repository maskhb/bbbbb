import { notification, Modal, message } from 'antd';
// import { routerRedux } from 'dva/router';

import cookie from '../cookie';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
const apiKeys = ['busCode', 'msgCode'];
function isMockResponse(json) {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  const keys = Object.keys(json);
  return apiKeys.filter(key => keys.includes(key)).length < 2;
}
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error; // 抛出异常会被fetch方法catch，跳转到例如403页面
}

export function checkIsMock(json) {
  if (isMockResponse(json)) {
    if (!isNaN(json)) {
      return {
        isMock: true,
        data: json,
      };
    } else {
      // eslint-disable-next-line
      json.isMock = true;
    }
  } else {
    return json;
  }
  return json;
}

export function toFullPath(path) {
  const paths = location.pathname.split('/').filter(p => !!p);
  if (!paths[0]) {
    return path;
  } else {
    return `/${paths[0]}${path}`;
  }
}

export function checkResponseJSON(json) {
  if (json.isMock) {
    return json;
  } else {
    if (json.busCode !== 0 || json.msgCode !== 200) {
      const errorText = json.message || '请求失败';
      errorMessage(errorText, json);
      // message.error(errorText);
      // if (json.msgCode === 402 || json.msgCode === 401 || json.message === '账户未登录或登录已过期') {
      //   // cookie.clear();
      //   // // window.location.reload();
      //   // // console.log('iofjdosfjsoj ojfosdjofjsdofj ');
      //   // // routerRedux.push('user/login');
      //   // setTimeout(() => {
      //   //   window.location.reload();
      //   // }, 1000);
      //   return;
      // }
      const error = new Error(errorText);
      error.response = json;
      throw error;
    }
    return json;
  }
}

export function transformResponse(json, options = {}) {
  if (options.transformResponse) {
    return options.transformResponse(json);
  }
  if (!json.isMock) {
    if ('result' in json.data) {
      return json.data.result;
    } else {
      return json.data;
    }
  }
  return json;
}

export function transformPagination(json, options = {}) {
  if (options.pagination) {
    if (json.isMock) {
      return {
        list: json.list || json.dataList,
        pagination: {
          current: json.currPage,
          pageSize: json.pageSize,
          total: json.totalCount,
          ...json.pagination,
        },
      };
    } else {
      return {
        list: json.dataList,
        pagination: {
          current: json.currPage,
          pageSize: json.pageSize,
          total: json.totalCount,
        },
      };
    }
  } else {
    return json;
  }
}

const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
function randomString(len = 16) {
  const maxPos = $chars.length;
  let pwd = '';
  // eslint-disable-next-line
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function getClientId() {
  let clientId = cookie.get('x-client-id');
  if (!clientId) {
    clientId = randomString();
    cookie.set('x-client-id', clientId);
  }
  return clientId;
}

export function getToken() {
  return cookie.get('x-manager-token');
}

export function getDefaultHeaders(options, isFormData) {
  const headers = {
    Accept: 'application/json',
    // 'Content-Type': 'application/json; charset=utf-8',
    'x-manager-token': `${getToken() || ''}`,
    'x-client-type': 'pc', // 接口开发说必须有这个
    'x-client-id': getClientId(),
  };
  // 如果是 formData fetch 会根据 formData 内容自动生成 content-type
  if (!isFormData) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  return { ...headers, ...options.headers };
}

// eslint-disable-next-line
export function transformError(error, options = {}) {
  // const errJson = {
  //   ...error.response,
  //   error,
  // };
  // if (options.pagination) {
  //   Object.assign(errJson, {
  //     list: [],
  //     pagination: {
  //       current: 1,
  //       pageSize: 10,
  //       total: 0,
  //     },
  //   });
  // }
  // // throw errJson;
  // return errJson;
  return null;
}

const errorCodeQueue = [];
function errorMessage(errorText, json) {
  if (errorCodeQueue.indexOf(json.msgCode) === -1) {
    errorCodeQueue.push(json.msgCode);
    if (
      json.busCode === 1001001 || json.msgCode === 402 || json.msgCode === 401 ||
      errorText.indexOf('未登录') > -1 || errorText === '无效授权'
    ) {
      Modal.confirm({
        title: errorText,
        cancelText: '关闭',
        onCancel: () => {
          const index = errorCodeQueue.indexOf(json.msgCode);
          if (index > -1) {
            errorCodeQueue.splice(index, 1);
          }
        },
        okText: '重新登录',
        onOk: () => {
          cookie.clear();
          if (location.hostname === 'localhost') {
            window.location.reload();
          } else {
            location.href = '/';
          }
        },
      });
    } else {
      message.error(errorText, 3, () => {
        const index = errorCodeQueue.indexOf(json.msgCode);
        if (index > -1) {
          errorCodeQueue.splice(index, 1);
        }
      });
    }
  }
}
