import React, { PureComponent } from 'react';
import { Card, Button, Modal } from 'antd';
import { connect } from 'dva/index';
import moment from 'moment';
import { goTo } from 'utils/utils';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
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
  nightCheckFn() {
    const that = this;
    const { dispatch } = this.props;
    const { businessTime } = this.state;
    Modal.confirm({
      title: '提示',
      content: `确认执行本营业日（${moment(new Date(businessTime)).format('YYYY-MM-DD')}）夜审？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'nightCheck/doCheck',
          payload: {
            orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
          },
        }).then(() => {
          const result = that.props.nightCheck.doCheck;
          if (result && typeof result === 'boolean') {
            Modal.success({
              title: '提示',
              content: '夜审成功！',
              onOk: () => {
                goTo('/nightcheck/check');
              },
            });
          }
        });
      },
    });
  }

  render() {
    const { businessTime } = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.title}>
            <div className={styles.titleName}>执行夜审_确认执行</div>
            <div className={styles.time}>当前营业日：{moment(new Date(businessTime)).format('YYYY-MM-DD')}</div>
            <Button className={styles.nextButton} type="primary" onClick={this.nightCheckFn.bind(this)}>确认执行</Button>
          </div>
          <div className={styles.content}>
            <p className={styles.pageHeader}>第三步确认执行说明</p>
            <p>① 第三步包括生成房费、生成报表、前进营业日等</p>
            <p>② 这个环节是系统自动处理，处理时间会因系统数据量变化，在系统营业日未发生变化前不可进行其他操作</p>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
