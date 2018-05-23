import React from 'react';
import _ from 'lodash';
import PromiseRender from './PromiseRender';
import { getCurrentPermissions } from './index';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */

const isDevAndAdmin = (authority, currentAuthority) => {
  if (localStorage.getItem('isAdmin') === 'true' &&
   currentAuthority && currentAuthority.indexOf('guest') === -1 &&
   authority.indexOf('guest') === -1) {
    if (
      process.env.NODE_ENV !== 'production' || !location.host || location.host.indexOf('.hd') > -1
    ) {
      return true;
    }
  }
  return false;
};

const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // console.log('current permissions', currentAuthority);
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }

  // 开发环境, 可以通过 isAdmin 来判断是否查看全部
  if (isDevAndAdmin(authority, currentAuthority)) {
    return target;
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf('') > -1 || _.intersection(authority, currentAuthority)?.length) {
      return target;
    }
    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (currentAuthority?.indexOf(authority) >= 0) {
      return target;
    }
    return Exception;
  }

  // Promise 处理
  if (isPromise(authority)) {
    return () => (
      <PromiseRender ok={target} error={Exception} promise={authority} />
    );
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority();
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };
const check = (authority, target, Exception) => {
  return checkPermissions(authority, getCurrentPermissions(), target || true, Exception);
};

export default check;
