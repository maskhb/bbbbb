/*
 * @Author: wuhao
 * @Date: 2018-04-24 15:01:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-09 15:37:08
 *
 * 项目选择输入框  --  业务组件
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import ProjectInput from './index';

@connect(({ common }) => ({
  common,
}))
class ProjectInputBusiness extends PureComponent {
  static defaultProps = {};

  state = {
    data: this.props.common?.queryCommunityList?.dataList || [],
  }

  componentDidMount() {
    if (!this.state.data || this.state.data.length < 1) {
      this.getCommunityList();
    }
  }

  getCommunityList = async () => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'common/queryCommunityList',
      payload: {
        queryCondition: {
          isVirtual: -1,
          platformField: 3,
          isOpen: 0,
        },
        pageSize: 0,
        currentPage: 0,
      },
    });

    const { common } = this.props;

    this.setState({
      data: common?.queryCommunityList?.dataList || [],
    });
  }

  render() {
    const { data } = this.state;
    const { dispatch, ...other } = this.props;
    return (
      <ProjectInput
        {...other}
        data={data}
      />
    );
  }
}

export default ProjectInputBusiness;
