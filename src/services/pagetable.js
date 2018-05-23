/**
 * Created by rebecca on 2018/4/5.
 */
import request from '../utils/request';

/*
 * 底部导航相关
 */
// 获取底部导航列表
async function tablist(params) {
  return request('/mj/ht-mj-cms-server/bottomNav/getList', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 新增底部导航栏目
async function tabsave(params) {
  return request('/mj/ht-mj-cms-server/bottomNav/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 底部导航设为默认
async function tabdefault(params) {
  return request('/mj/ht-mj-cms-server/bottomNav/setDefault', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 更新底部导航
async function tabupdate(params) {
  return request('/mj/ht-mj-cms-server/bottomNav/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除底部导航
async function tabdelete(params) {
  return request('/mj/ht-mj-cms-server/bottomNav/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


/*
 * 公共导航相关
 */
// 获取公共导航列表
async function commonlist(params) {
  return request('/mj/ht-mj-cms-server/commonPc/getList', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 新增公共导航栏目
async function commonsave(params) {
  return request('/mj/ht-mj-cms-server/commonPc/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 更新公共导航
async function commonupdate(params) {
  return request('/mj/ht-mj-cms-server/commonPc/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除公共导航
async function commondelete(params) {
  return request('/mj/ht-mj-cms-server/commonPc/delete', {
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
  return request('/mj/ht-mj-cms-server/homeMobile/getTitle', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 首页标题编辑
async function homeupdatetitle(params) {
  return request('/mj/ht-mj-cms-server/homeMobile/updateTitle', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
 * 商城页-移动端
 */
// 商城页标题获取
async function mallpagetitle(params) {
  return request('/mj/ht-mj-cms-server/mallPage/getMallPageTitle', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 商城页标题编辑
async function mallupdatetitle(params) {
  return request('/mj/ht-mj-cms-server/mallPage/updateMallTitle', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 商城页获取导航列表
async function mallNavList(params) {
  return request('/mj/ht-mj-cms-server/mallPage/getNavList', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 商城页添加导航入口
async function mallsaveNav(params) {
  return request('/mj/ht-mj-cms-server/mallPage/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function mallupdateNav(params) {
  return request('/mj/ht-mj-cms-server/mallPage/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 商城页标题编辑
async function malldeleteNav(params) {
  return request('/mj/ht-mj-cms-server/mallPage/delete', {
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
  commonlist,
  commonsave,
  commonupdate,
  commondelete,
  homegettitle,
  homeupdatetitle,
  mallpagetitle,
  mallupdatetitle,
  mallNavList,
  mallsaveNav,
  mallupdateNav,
  malldeleteNav,
};
