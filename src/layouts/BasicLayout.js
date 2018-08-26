import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../views/Exception/404/view.js';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../core/menu';
import logo from '../assets/favicon.ico';

const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

@connect(({ user, global, loading, permission }) => ({
  current: user.current,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  permission: permission?.currentAuthority,
}))
export default class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/current',
    });
    // this.props.dispatch({
    //   type: 'permission/current',
    // });

    this.props.dispatch({
      type: 'global/fetchNotices',
      payload: {},
    });
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '运营后台-家居';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 运营后台-家居`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    // eslint-disable-next-line
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/home';
    }
    return redirect;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
        payload: {},
      });
    }
  }
  render() {
    const {
      current, collapsed, fetchingNotices, notices, routerData, match, location,
    } = this.props;

    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <GlobalHeader
            logo={logo}
            current={current}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item =>
                    (
                      <AuthorizedRoute
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                        authority={item.authority}
                        redirectPath="/exception/403"
                      />
                    )
                  )
                }
                <Redirect exact from="/" to={bashRedirect} />
                <Route render={NotFound} />
              </Switch>
            </div>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2018 恒腾网络技术部出品
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}
