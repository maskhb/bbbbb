import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { connect } from 'dva/index';
import styles from '../../index.less';

@connect(({ nightCheck, loading }) => ({
  nightCheck,
  loading: loading.models.nightCheck,
}))
export default class List extends PureComponent {
  static defaultProps = {};

  state = {
    businessTime: 0,
  };

  componentDidMount() {
    this.getBusinessTime();
  }
  getBusinessTime() {
    const that = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'nightCheck/businessTime',
      payload: {
        orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
      },
    }).then(() => {
      const { businessTime } = that.props.nightCheck;
      if (businessTime && typeof businessTime === 'number') {
        that.setState({
          businessTime,
        });
      }
    });
  }

  render() {
    const { businessTime } = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.title}>
            <div className={styles.titleName}>执行夜审_夜审说明</div>
            <div className={styles.time}>当前营业日：{moment(new Date(businessTime)).format('YYYY-MM-DD')}</div>
            <Link to="/nightcheck/check/beforeCheck"><Button className={styles.nextButton} type="primary">下一步</Button></Link>
          </div>
          <div className={styles.content}>
            <p className={styles.pageHeader}>夜审流程如下（注意：夜审操作时建议其他前台停止操作，以防出现数据错误，夜审操作不可逆）</p>
            <p>① 系统检查：对今日营业情况进行检查，夜审操作人对异常问题（如该到未到，该离未离）进行处理</p>
            <p>② 核对房价：人工对今日房价进行核对</p>
            <p>③ 系统执行任务：生成房费、生成报表、前进营业日、初始化营业数据和房间数据</p>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
