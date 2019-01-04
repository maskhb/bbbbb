/*
 * @Author: wuhao
 * @Date: 2018-07-18 17:28:36
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-18 17:30:17
 *
 * 擅长科目 下拉选择框业务组件
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import SelectGoodSubjects from './index';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class SelectGoodSubjectsBusiness extends PureComponent {
  static defaultProps = {};

  state = {
    data: this.props.common?.getGoodSubjects || [],
  }

  componentDidMount() {
    if (!this.state.data || this.state.data.length < 1) {
      this.getGoodSubjectsList();
    }
  }

  getGoodSubjectsList = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'common/getGoodSubjects',
      payload: {

      },
    });

    const { common } = this.props;

    this.setState({
      data: common?.getGoodSubjects || [],
    });
  }

  render() {
    const { data } = this.state;
    return (
      <SelectGoodSubjects {...this.props} dataSource={data} />
    );
  }
}

export default SelectGoodSubjectsBusiness;
