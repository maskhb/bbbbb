/*
 * @Author: wuhao
 * @Date: 2018-06-13 16:17:08
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-23 11:26:34
 *
 * 退货单详情
 */

import React, { PureComponent } from 'react';

import { Form } from 'antd';

import { connect } from 'dva';
import classNames from 'classnames';

import PageHeaderLayout from 'layouts/PageHeaderLayout';

import BasicInfo from '../../components/details/BasicInfo';
import TabsOtherMoreInfo from './components/TabsOtherMoreInfo';

import styles from './index.less';

@connect(({ aftersale, loading }) => ({
  aftersale,
  loading: loading.effects['aftersale/queryReturnOrderDetail'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {};

  state = {}

  componentDidMount = () => {
    this.initDetail();
  }

  initDetail = async () => {
    const { dispatch } = this.props;

    const { id: returnSn } = this.props?.match?.params;

    await dispatch({
      type: 'aftersale/queryReturnOrderDetail',
      payload: {
        returnSn,
      },
    });
  }

  render() {
    const { aftersale } = this.props;
    const { queryReturnOrderDetail } = aftersale || {};
    // console.log(queryReturnOrderDetail);
    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_aftersale_returnbill_detail)}>
        <BasicInfo
          {...this.props}
          type={1}
          detailVO={queryReturnOrderDetail}
        />
        <TabsOtherMoreInfo
          {...this.props}
          detailVO={queryReturnOrderDetail}
        />
      </PageHeaderLayout>
    );
  }
}
