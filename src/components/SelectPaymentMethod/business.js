/*
 * @Author: wuhao
 * @Date: 2018-05-05 13:56:07
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-05 15:26:54
 *
 * 支付方式下拉框--业务组件
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import SelectPaymentMethod from './index';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class SelectPaymentMethodBusiness extends PureComponent {
  static defaultProps = {};

  state = {
    data: this.props.common?.[`getPaymentMethodList-${this.props?.type || 0}`]?.dataList || [],
  }

  componentDidMount() {
    if (!this.state.data || this.state.data.length < 1) {
      this.getPaymentMethodList();
    }
  }

  getPaymentMethodList = async () => {
    const { dispatch, type } = this.props;
    await dispatch({
      type: 'common/getPaymentMethodList',
      payload: {
        type,
      },
    });

    const { common } = this.props;

    this.setState({
      data: common?.[`getPaymentMethodList-${this.props?.type || 0}`] || [],
    });
  }

  render() {
    const { data } = this.state;
    return (
      <SelectPaymentMethod {...this.props} dataSource={data} />
    );
  }
}

export default SelectPaymentMethodBusiness;
