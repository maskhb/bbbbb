import React from 'react';
import { routerRedux, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './core/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  const PrintLayout = routerData['/print'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <AuthorizedRoute
            path="/user"
            render={props => <UserLayout {...props} />}
            authority={['guest']}
            redirectPath="/"
          />
          <AuthorizedRoute
            path="/print"
            render={props => <PrintLayout {...props} />}
            authority={['user']}
            redirectPath="/user/login"
          />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['user']}
            redirectPath="/user/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
