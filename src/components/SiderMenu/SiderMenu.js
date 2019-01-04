import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (icon === '') {
    return '';
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

@connect(({ permission }) => ({
  permission,
}))
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    const defaultOpenKeys = this.getDefaultOpenKeys(this.menus);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props, defaultOpenKeys),
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      /**
       * 用于过滤掉非展开目录
       * （
       * 注：getDefaultCollapsedSubMenus方法中会自动在openKeys中添加当前路由拆分，
       * 由于路由和目录匹配，需过滤掉
       * 如：
       * /checkin/orderform/edit/568
       * 会添加： checkin checkin/orderform checkin/edit
       * 不过滤会导致目录判断出错，
       * 只需保存要开启的一级和当前路由的拆分
       *
       * author：wuhao
       * ）
       */
      const newKeys = (this.state.openKeys || []).filter(item => item.indexOf('/') === -1);
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps, newKeys),
      });
    }
  }
  getDefaultOpenKeys(menus = [], type = 'defaultOpen') {
    let defaultOpenKeys = [];
    menus?.forEach((item) => {
      if (item[type]) {
        defaultOpenKeys.push(item.path);
      }

      if (item.children) {
        defaultOpenKeys = defaultOpenKeys.concat(this.getDefaultOpenKeys(item.children, type));
      }
    });

    return defaultOpenKeys;
  }
  getDefaultCollapsedSubMenus(props, openKeys) {
    const { location: { pathname } } = props || this.props;
    const snippets = pathname.split('/').slice(1, -1);
    const currentPathSnippets = snippets.map((item, index) => {
      const arr = snippets.filter((s, i) => i <= index);
      return arr.join('/');
    });
    let currentMenuSelectedKeys = [];
    currentPathSnippets.forEach((item) => {
      currentMenuSelectedKeys = currentMenuSelectedKeys.concat(this.getSelectedMenuKeys(item));
    });

    currentMenuSelectedKeys?.forEach((item) => {
      if (openKeys.indexOf(item) === -1) {
        openKeys.push(item);
      }
    });

    return _.uniq(openKeys || []);
  }
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }
  getSelectedMenuKeys = (path) => {
    const flatMenuKeys = this.getFlatMenuKeys(this.menus);
    if (flatMenuKeys.indexOf(path.replace(/^\//, '')) > -1) {
      return [path.replace(/^\//, '')];
    }
    if (flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')) > -1) {
      return [path.replace(/^\//, '').replace(/\/$/, '')];
    }

    return flatMenuKeys.filter((item) => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      return itemRegExp.test(path.replace(/^\//, '').replace(/\/$/, ''));
    });
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  * Judge whether it is http link.return a or Link
  * @memberof SiderMenu
  */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}<span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={this.props.isMobile ? () => { this.props.onCollapse(true); } : undefined}
      >
        {icon}<span>{name}</span>
      </Link>
    );
  }
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem=(item) => {
    if (item.children && item.children.some(child => child.name)) {
      const allwaysOpenKeys = this.getDefaultOpenKeys(this.menus, 'alwaysOpen') || [];
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : item.name
            }
          key={item.key || item.path}
          className={allwaysOpenKeys.indexOf(item.path) !== -1 ? 'hideArrow' : ''}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.key || item.path}>
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  }
  /**
  * 获得菜单子节点
  * @memberof SiderMenu
  */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return this.filterMenus(menusData)
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => !!item);
  }

  /* 区分项目级和管理级功能 */
  filterMenus = (menusData) => {
    let newArr = [];
    let orgType = 0;
    let user = localStorage.user;
    if (user) {
      user = JSON.parse(user);
      if (user.orgType) {
        orgType = user.orgType || 0;
      } else {
        orgType = user?.orgVOSelected?.orgType || 0;
      }
    }
    switch (orgType) {
      case 1:
        menusData.map((v) => {
          const item = v || {};
          if (v.children) {
            item.children = v.children.filter(cv => cv.orgType !== 2);
          }
          newArr.push(item);
          return '';
        });
        break;
      case 2:
        menusData.map((v) => {
          const item = v || {};
          if (v.children) {
            item.children = v.children.filter(cv => cv.orgType !== 1);
          }
          newArr.push(item);
          return '';
        });
        break;
      default:
        newArr = menusData;
        break;
    }
    const lastArr = [];
    newArr.map((v) => {
      if (v.level === 0 && (v.children.length !== 0 || v.name === '首页')) {
        lastArr.push(v);
      } else if (v.level !== 0) {
        lastArr.push(v);
      }
      return lastArr;
    });
    return lastArr;
  };

  // conversion Path
  // 转化路径
  conversionPath=(path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { checkPermissions } = this.props.Authorized;
      return checkPermissions(
        authority,
        this.props.permission?.currentAuthority,
        ItemDom
      );
    }
    return ItemDom;
  }
  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  }
  render() {
    const { logo, collapsed, location: { pathname }, onCollapse } = this.props;
    const { openKeys } = this.state;
    const allwaysOpenKeys = this.getDefaultOpenKeys(this.menus, 'alwaysOpen');
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: openKeys.concat(allwaysOpenKeys),
    };
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    // 菜单选中状态：菜单中如果没有匹配项，匹配二级菜单
    if (!selectedKeys.length) {
      selectedKeys = openKeys.filter(k => k.match(/\//g)?.length === 1);
    }

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={onCollapse}
        width={256}
        className={styles.sider}
        style={{
          width: 256,
        }}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{
            background: '#606C6E',
          }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}
