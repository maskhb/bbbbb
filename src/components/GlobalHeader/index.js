import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Tag, Dropdown, Avatar } from 'antd';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
// import { Link } from 'dva/router';
import { OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE,
  OPERPORT_JIAJU_UNAPPROVEDPROLIST_LIST,
  OPERPORT_JIAJU_TOAPPRPACKLIST_LIST,
  OPERPORT_JIAJU_UNAPPRPACKLIST_LIST } from 'config/permission';
import { goTo } from 'utils/utils';
import checkPermission from 'components/Authorized/CheckPermissions';
import AUDITSTATUS from 'components/AuditStatus';
import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

const { Header } = Layout;

@connect(({ goods, goodsPackage, loading }) => ({
  goods,
  goodsPackage,
  loading,
}))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices } = this.props;

    const color = ({
      todo: '',
      processing: 'blue',
      urgent: 'red',
      doing: 'gold',
    });

    const newNotices = [];

    const notice1 = {
      id: '000000001',
      key: '000000001',
      title: '商品列表 - 待审核',
      description: '',
      extra: <Tag color={color.doing} style={{ marginRight: 0 }}>{notices?.[0] || 0}</Tag>,
      type: '待办',
      url: '/goods/listwaitaudit',
      linkState: {
        auditStatus: AUDITSTATUS.WAIT.value,
      },
    };
    const notice2 = {
      id: '000000002',
      key: '000000002',
      title: '商品列表 - 审核不通过',
      description: '',
      extra: <Tag color={color.todo} style={{ marginRight: 0 }}>{notices?.[1] || 0}</Tag>,
      type: '待办',
      url: '/goods/listfailaudit',
      linkState: {
        auditStatus: AUDITSTATUS.FAIL.value,
      },
    };
    const notice3 = {
      id: '000000003',
      key: '000000003',
      title: '套餐列表 - 待审核',
      description: '',
      extra: <Tag color={color.doing} style={{ marginRight: 0 }}>{notices?.[2] || 0}</Tag>,
      type: '待办',
      url: '/goods/packagewaitaudit',
      linkState: {
        auditStatus: AUDITSTATUS.WAIT.value - 1,
      },
    };
    const notice4 = {
      id: '000000004',
      key: '000000004',
      title: '套餐列表 - 审核不通过',
      description: '',
      extra: <Tag color={color.todo} style={{ marginRight: 0 }}>{notices?.[3] || 0}</Tag>,
      type: '待办',
      url: '/goods/packagefailaudit',
      linkState: {
        auditStatus: AUDITSTATUS.FAIL.value - 1,
      },
    };

    let count = 0;

    if (checkPermission(OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE)) {
      newNotices.push(notice1);

      count += notices?.[0] || 0;
    }

    if (checkPermission(OPERPORT_JIAJU_UNAPPROVEDPROLIST_LIST)) {
      newNotices.push(notice2);

      count += notices?.[1] || 0;
    }

    if (checkPermission(OPERPORT_JIAJU_TOAPPRPACKLIST_LIST)) {
      newNotices.push(notice3);

      count += notices?.[2] || 0;
    }

    if (checkPermission(OPERPORT_JIAJU_UNAPPRPACKLIST_LIST)) {
      newNotices.push(notice4);

      count += notices?.[3] || 0;
    }

    return {
      noticeData: groupBy(newNotices, 'type'),
      notifyCount: count,
    };
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  handleNoticeItemClick = (item) => {
    if (item.url) {
      const { dispatch } = this.props;
      dispatch({
        type: 'goods/addLinkAuditStatus',
        payload: item.linkState,
      });

      goTo(item.url);
    }
  }

  render() {
    const {
      current, collapsed, // isMobile, logo,
      onMenuClick,

      fetchingNotices,
      onNoticeVisibleChange,
      onNoticeClear,
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Item key="triggerError"><Icon type="close-circle" />触发报错</Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const { notifyCount, noticeData } = this.getNoticeData();

    return (
      <Header className={styles.header}>
        {/* {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                <img src={logo} alt="logo" width="32" />
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )} */}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {/* <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={(value) => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={(value) => {
              console.log('enter', value); // eslint-disable-line
            }}
          /> */}
          <NoticeIcon
            className={styles.action}
            count={notifyCount}
            onItemClick={(item) => {
              this.handleNoticeItemClick(item);
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            {/* <NoticeIcon.Tab
              list={noticeData['通知'] || []}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息'] || []}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            /> */}
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          {/* {current?.name ? ( */}
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={current?.avatar} />
              <span className={styles.name}>{current?.name}</span>
            </span>
          </Dropdown>
          {/* ) : <Spin size="small" style={{ marginLeft: 8 }} />} */}
        </div>
      </Header>
    );
  }
}
