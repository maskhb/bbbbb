import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Tabs } from 'antd';
import classNames from 'classnames';
import { configs } from '../../core/collectConfigs';
import styles from './index.less';

function getBreadcrumb(breadcrumbNameMap, url) {
  if (breadcrumbNameMap[url]) {
    return breadcrumbNameMap[url];
  }
  const urlWithoutSplash = url.replace(/\/$/, '');
  if (breadcrumbNameMap[urlWithoutSplash]) {
    return breadcrumbNameMap[urlWithoutSplash];
  }
  let breadcrumb = {};
  Object.keys(breadcrumbNameMap).forEach((item) => {
    const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
    const itemRegExp = new RegExp(itemRegExpStr);
    if (itemRegExp.test(url)) {
      breadcrumb = breadcrumbNameMap[item];
    }
  });
  return breadcrumb;
}

export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      location: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return (last || !route.component)
      ? <span>{route.breadcrumbName}</span>
      : createElement(linkElement, {
        href: paths.join('/') || '/',
        to: paths.join('/') || '/',
      }, route.breadcrumbName);
  }
  render() {
    const { routes, params, location, breadcrumbNameMap } = this.getBreadcrumbProps();

    const {
      breadcrumbList, className, linkElement = 'a',
      withoutBreadcrumb,
    } = this.props;
    const clsString = classNames(styles.pageHeader, className);
    let breadcrumb;
    if (breadcrumbList && breadcrumbList.length) {
      breadcrumb = (
        <Breadcrumb className={styles.breadcrumb}>
          {
            breadcrumbList.map(item => (
              <Breadcrumb.Item key={item.title}>
                {item.href ? (
                  createElement(linkElement, {
                    [linkElement === 'a' ? 'href' : 'to']: item.href,
                  }, item.title)
                ) : item.title}
              </Breadcrumb.Item>)
            )
          }
        </Breadcrumb>
      );
    } else if (routes && params) {
      breadcrumb = (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
        />
      );
    } else if (location && location.pathname) {
      const pathSnippets = location.pathname.split('/').filter(i => i);

      const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);

        // 如果是一级菜单，从菜单里 匹配菜单名称 到面包屑
        const name = url.match(/\//g)?.length === 1
          ? configs[url.split('/')[1].toLowerCase().replace(/( |^)[a-z]/g, v => v.toUpperCase())]?.menu?.name
          : null;
        const isLinkable = (index !== pathSnippets.length - 1) && currentBreadcrumb.component;
        const isLast = index === pathSnippets.length - 1;
        return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
          <Breadcrumb.Item key={url}>
            {createElement(
              isLinkable ? linkElement : 'span',
              { [linkElement === 'a' ? 'href' : 'to']: url },
              isLast && this.props.crumbTitle ? this.props.crumbTitle : currentBreadcrumb.name,
            )}
          </Breadcrumb.Item>
        ) : name ? (
          <Breadcrumb.Item key={url}>
            {createElement(
              'span',
              {},
              isLast && this.props.crumbTitle ? this.props.crumbTitle : name,
            )}
          </Breadcrumb.Item>
        ) : null;
      });

      const breadcrumbItems = [(
        <Breadcrumb.Item key="home">
          {createElement(linkElement, {
            [linkElement === 'a' ? 'href' : 'to']: '/',
          }, '首页')}
        </Breadcrumb.Item>
      )].concat(extraBreadcrumbItems);
      breadcrumb = (
        <Breadcrumb className={styles.breadcrumb}>
          {breadcrumbItems}
        </Breadcrumb>
      );
    } else {
      breadcrumb = null;
    }
    return !withoutBreadcrumb ? (
      <div className={clsString}>
        {breadcrumb}
      </div>
    ) : '';
  }
}
