import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import centra from './centra';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0 && component().default) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }

      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }

  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'permission', 'common', 'login'], () => import('../../layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, ['login', 'permission'], () => import('../../layouts/UserLayout')),
    },
  };

  const views = centra();
  for (const [key, val] of Object.entries(views)) {
    routerConfig[`/${key}`] = {
      component: dynamicWrapper(app, val.model, () => import(`../../views/${val.filePath}/view`)),
      authority: val.authority,
      name: val.name,
    };
  }

  return routerConfig;
};
