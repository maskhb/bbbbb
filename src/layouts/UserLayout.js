import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
// import logo from '../assets/logo.jpg';
import { getRoutes } from '../utils/utils';

const links = [
  // {
  //   key: 'help',
  //   title: '帮助',
  //   href: '',
  //   blankTarget: '_blank',
  // }, {
  //   key: 'privacy',
  //   title: '隐私',
  //   href: '',
  //   blankTarget: '_blank',
  // }, {
  //   key: 'terms',
  //   title: '条款',
  //   href: '',
  //   blankTarget: '_blank',
  // },
];

const copyright = <div>Copyright <Icon type="copyright" /> 2018 广州纷程网络科技有限公司</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '纷程酒店管理系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                <span className={styles.title}>纷程酒店管理系统</span>
              </Link>
            </div>
            {/* <div className={styles.desc}>hengten networks</div> */}
          </div>
          <Switch>
            {getRoutes(match.path, routerData).map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )}
            <Redirect exact from="/user" to="/user/login" />
          </Switch>
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
