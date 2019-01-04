import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import moment from 'moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import checkPermission from 'components/Authorized/CheckPermissions';
import styles from './view.less';

@connect(({ global, loading, user }) => ({
  global,
  user,
  loading,
}))
export default class Home extends PureComponent {
  state = {
    homeInfo: {},
    timer: null,
    businessTime: 0,
    distance: '',
    orgType: 0,
  };
  componentDidMount() {
    const that = this;
    const { dispatch } = this.props;
    const { timer } = this.state;
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
    that.setState({
      orgType,
    });
    if (orgType === 1) {
      this.getBusinessTime();

      dispatch({
        type: 'global/homeInfo',
      }).then(() => {
        const result = that.props.global.homeInfo;
        that.setState({
          homeInfo: result,
        });
        window.localStorage.latestHomeQueryTime
          = Number(window.localStorage.currentHomeQueryTime) ||
          new Date().getTime();
        window.localStorage.currentHomeQueryTime = new Date().getTime();
        if (timer) {
          clearInterval(timer);
        }
        const newTimer = setInterval(() => {
          const distance = Home.getTimeDistance(Number(window.localStorage.currentHomeQueryTime) ||
            new Date().getTime());
          that.setState({
            distance,
          });
        }, 1000);
        that.setState({
          timer: newTimer,
        });
      });
    }
  }
  static getTimeDistance(timestamp) {
    let distance = new Date().getTime() - timestamp;
    const result = []; // 存储时间距离的小时数，分钟数
    result[0] = Math.floor(distance / (1000 * 60 * 60));
    distance -= (result[0] * 1000 * 60 * 60);
    result[1] = Math.floor(distance / (1000 * 60));
    distance -= (result[1] * 1000 * 60);
    result[2] = Math.floor(distance / 1000);
    return `${result[0] ? result[0] : ''}${result[0] ? '小时' : ''} ${result[1]}分钟`;
  }
  getBusinessTime() {
    const that = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/businessTime',
      payload: {
        orgId: Number((localStorage.user ? JSON.parse(localStorage.user) : {})?.orgIdSelected),
      },
    }).then(() => {
      const { businessTime } = that.props.global;
      if (businessTime && typeof businessTime === 'number') {
        that.setState({
          businessTime,
        });
      }
    });
  }
  render() {
    const { homeInfo, businessTime, distance, orgType } = this.state;
    return (
      <PageHeaderLayout withoutBreadcrumb >
        {orgType === 1 ? (
          <div>
            <div className={styles.cardContainer}>
              <div className={styles.header}>
                <span>营业概况</span><span>（距离上次刷新时间{distance}）</span>
                <div className={styles.businessTime}>营业日期： {businessTime ? moment(new Date(businessTime)).format('YYYY-MM-DD') : ''}</div>
              </div>
              <div className={styles.content}>
                <ul className={styles.countLabelUl}>
                  <li>
                    <Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_INDIVIDUALAPPROACHING') ? '/checkin/orderform?batch=PersonTodayWillIn' : ''}>
                      <p className={styles.labelCount}>{homeInfo?.PersonTodayWillIn || 0}</p>
                      <p className={styles.labelName}>今日预抵（散客）</p>
                      <span className={styles.toDetail}>查看详情<Icon type="right" /></span>
                    </Link>
                  </li>
                  <li>
                    <Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_INDIVIDUALARRIVEL') ? '/checkin/orderform?batch=PersonTodayIn' : ''}>
                      <p className={styles.labelCount}>{homeInfo?.PersonTodayIn || 0}</p>
                      <p className={styles.labelName}>今日已抵（散客）</p>
                      <span className={styles.toDetail}>查看详情<Icon type="right" /></span>
                    </Link>
                  </li>
                  <li>
                    <Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_GROUPAPPROACHING') ? '/checkin/teambooking?batch=PersonTodayWillIn' : ''}>
                      <p className={styles.labelCount}>{homeInfo?.GroupTodayWillIn || 0}</p>
                      <p className={styles.labelName}>今日预抵（团队）</p>
                      <span className={styles.toDetail}>查看详情<Icon type="right" /></span>
                    </Link>
                  </li>
                  <li>
                    <Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_GROUPARRIVEL') ? '/checkin/teambooking?batch=GroupTodayIn' : ''}>
                      <p className={styles.labelCount}>{homeInfo?.GroupTodayIn || 0}</p>
                      <p className={styles.labelName}>今日已抵（团队）</p>
                      <span className={styles.toDetail}>查看详情<Icon type="right" /></span>
                    </Link>
                  </li>
                  <li>
                    <Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_SOONTOLEAVE') ? '/checkin/checkinform?batch=TodayWillOut' : ''}>
                      <p className={styles.labelCount}>{homeInfo?.TodayWillOut || 0}</p>
                      <p className={styles.labelName}>今日预离房间</p>
                      <span className={styles.toDetail}>查看详情<Icon type="right" /></span>
                    </Link>
                  </li>
                  <li>
                    <Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_LIVINGIN') ? '/checkin/checkinform?batch=In' : ''}>
                      <p className={styles.labelCount}>{homeInfo?.In || 0}</p>
                      <p className={styles.labelName}>在住房间</p>
                      <span className={styles.toDetail}>查看详情<Icon type="right" /></span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.cardContainer}>
              <div className={styles.header}><span>常用功能</span></div>
              <div className={styles.content}>
                <ul className={styles.commonFunction}>
                  <li><Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_TONIGHTTRIAL') ? '/nightcheck/check/introduce' : ''}>夜审</Link></li>
                  <li><Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_INDIVIDUALCHECKIN') ? '/checkin/checkinform/add' : ''}>散客步入</Link></li>
                  <li><Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_INDIVIDUALRESERVE') ? '/checkin/orderform/add' : ''}>散客预订</Link></li>
                  <li><Link to={checkPermission('PMS_HOMEPAGE_HOMEPAGE_GROUPRESERVE') ? '/checkin/teambooking/add' : ''}>团队预订</Link></li>
                  {/* <li><Link to="/statement/checkinschedule">导出收款日报表</Link></li> */}
                  {/* <li>导出月流水表</li> */}
                  {/* <li>导出房态实时统计表</li> */}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.cardContainer}>
            <div className="empty">
              当前组织非酒店门店级别，请切换至酒店门店级别查看首页内容
            </div>
          </div>
        )}
      </PageHeaderLayout>
    );
  }
}
