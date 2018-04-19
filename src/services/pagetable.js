/**
 * Created by rebecca on 2018/4/5.
 */
import request from '../utils/request';

/*
 * 底部导航相关
 */
// 获取底部导航列表
async function tablist(params) {
  return request('/api/ht-mj-cms-server/bottomNav/getList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 新增底部导航栏目
async function tabsave(params) {
  return request('/api/ht-mj-cms-server/bottomNav/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 底部导航设为默认
async function tabdefault(params) {
  return request('/api/ht-mj-cms-server/bottomNav/setDefault', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 更新底部导航
async function tabupdate(params) {
  return request('/cmd/bottomNav/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除底部导航
async function tabdelete(params) {
  return request('/api/ht-mj-cms-server/bottomNav/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
 * 首页-移动端
 */
// 首页标题获取
async function homegettitle(params) {
  return request('/cms/homeMobile/getTitle', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 首页标题编辑
async function homeupdatetitle(params) {
  return request('/cms/homeMobile/updateTitle', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  tablist,
  tabsave,
  tabdefault,
  tabupdate,
  tabdelete,
  homegettitle,
  homeupdatetitle,
};
