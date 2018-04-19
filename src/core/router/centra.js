import * as views from '../../views/**/view.js';
import * as configs from '../../views/**/view.json';

export default () => {
  const routes = {};

  for (const [key, val] of Object.entries(views)) {
    const { route: { params = '', authority = '' } = {}, model = [] } = configs[key] || {};
    const rKey = key.replace(/\$/g, '/').toLowerCase() + params;

    routes[rKey] = {
      filePath: key.replace(/\$/g, '/'),
      default: val,
      model: model.filter(v => !!v),
      authority,
    };

    // 面包屑数据来自于此
    const { menu = {}, breadcrumb = {} } = configs[key] || {};
    routes[rKey] = {
      ...routes[rKey],
      name: breadcrumb.name || menu.name,
    };
  }

  return routes;
};
