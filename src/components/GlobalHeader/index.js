import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
// import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';

import moment from 'moment';
// import { Link } from 'dva/router';
// import { OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE,
//   OPERPORT_JIAJU_UNAPPROVEDPROLIST_LIST,
//   OPERPORT_JIAJU_TOAPPRPACKLIST_LIST,
//   OPERPORT_JIAJU_UNAPPRPACKLIST_LIST } from 'config/permission';
// import { goTo } from 'utils/utils';
// import checkPermission from 'components/Authorized/CheckPermissions';
// import AUDITSTATUS from 'components/AuditStatus';
// import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import GlobalChanger from '../GlobalChanger';

const { Header } = Layout;

@connect(({ goods, goodsPackage, loading }) => ({
  goods,
  goodsPackage,
  loading,
}))
export default class GlobalHeader extends PureComponent {
  state = {
    nowTime: new Date().getTime(),
  };
  // eslint-disable-next-line
  timer=null

  componentWillUnmount() {
    // eslint-disable-next-line
    this.timer && clearInterval(this.timer);
    this.triggerResizeEvent.cancel();
  }
  componentDidMount() {
    // 北京时间
    this.timer = setInterval(() => {
      this.setState({
        nowTime: new Date().getTime(),
      });
    }, 1000);
  }
  // getNoticeData() {
  //   const { notices } = this.props;

  //   const color = ({
  //     todo: '',
  //     processing: 'blue',
  //     urgent: 'red',
  //     doing: 'gold',
  //   });

  //   const newNotices = [];

  //   const notice1 = {
  //     id: '000000001',
  //     key: '000000001',
  //     title: '商品列表 - 待审核',
  //     description: '',
  //     extra: <Tag color={color.doing} style={{ marginRight: 0 }}>{notices?.[0] || 0}</Tag>,
  //     type: '待办',
  //     url: '/goods/listwaitaudit',
  //     linkState: {
  //       auditStatus: AUDITSTATUS.WAIT.value,
  //     },
  //   };
  //   const notice2 = {
  //     id: '000000002',
  //     key: '000000002',
  //     title: '商品列表 - 审核不通过',
  //     description: '',
  //     extra: <Tag color={color.todo} style={{ marginRight: 0 }}>{notices?.[1] || 0}</Tag>,
  //     type: '待办',
  //     url: '/goods/listfailaudit',
  //     linkState: {
  //       auditStatus: AUDITSTATUS.FAIL.value,
  //     },
  //   };
  //   const notice3 = {
  //     id: '000000003',
  //     key: '000000003',
  //     title: '套餐列表 - 待审核',
  //     description: '',
  //     extra: <Tag color={color.doing} style={{ marginRight: 0 }}>{notices?.[2] || 0}</Tag>,
  //     type: '待办',
  //     url: '/goods/packagewaitaudit',
  //     linkState: {
  //       auditStatus: AUDITSTATUS.WAIT.value - 1,
  //     },
  //   };
  //   const notice4 = {
  //     id: '000000004',
  //     key: '000000004',
  //     title: '套餐列表 - 审核不通过',
  //     description: '',
  //     extra: <Tag color={color.todo} style={{ marginRight: 0 }}>{notices?.[3] || 0}</Tag>,
  //     type: '待办',
  //     url: '/goods/packagefailaudit',
  //     linkState: {
  //       auditStatus: AUDITSTATUS.FAIL.value - 1,
  //     },
  //   };

  //   let count = 0;

  //   if (checkPermission(OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE)) {
  //     newNotices.push(notice1);

  //     count += notices?.[0] || 0;
  //   }

  //   if (checkPermission(OPERPORT_JIAJU_UNAPPROVEDPROLIST_LIST)) {
  //     newNotices.push(notice2);

  //     count += notices?.[1] || 0;
  //   }

  //   if (checkPermission(OPERPORT_JIAJU_TOAPPRPACKLIST_LIST)) {
  //     newNotices.push(notice3);

  //     count += notices?.[2] || 0;
  //   }

  //   if (checkPermission(OPERPORT_JIAJU_UNAPPRPACKLIST_LIST)) {
  //     newNotices.push(notice4);

  //     count += notices?.[3] || 0;
  //   }

  //   return {
  //     noticeData: groupBy(newNotices, 'type'),
  //     notifyCount: count,
  //   };
  // }

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

  // handleNoticeItemClick = (item) => {
  //   if (item.url) {
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'goods/addLinkAuditStatus',
  //       payload: item.linkState,
  //     });

  //     goTo(item.url);
  //   }
  // }

  render() {
    const {
      collapsed, // isMobile, logo,
      onMenuClick,

      // fetchingNotices,
      // onNoticeVisibleChange,
      // onNoticeClear,
    } = this.props;
    const user = JSON.parse(localStorage.user || '{}');

    const { nowTime } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="editpwd"><Icon type="edit" />修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    // const { notifyCount, noticeData } = this.getNoticeData();

    return (
      <Header className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <span>
          <GlobalChanger />
        </span>
        <span className="nowTime">
          <Icon type="clock-circle-o" />
          <span>{moment(nowTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </span>
        <div className={styles.right}>
          {/* <NoticeIcon
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
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon> */}

          <Dropdown overlay={menu} className="title">
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              <span className={styles.name}>{user?.userName}</span>
            </span>
          </Dropdown>
        </div>
      </Header>
    );
  }
}
