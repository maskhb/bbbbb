/*
 * 商家选择框  --  业务组件
 * value:{
 *  factoryId,
 *  factoryName,
 *  merchantId,
 *  merchantName,
 * }
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import emitter from 'utils/events';
import _ from 'lodash';

import ProjectSelect from './FactorySelect';

@connect(({ common }) => ({
  common,
}))
class ProjectInputBusiness extends PureComponent {
  constructor(props) {
    super(props);
    const { value = '' } = props;
    this.state = {
      value,
      loading: false,
      keyName: 'factoryList',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleSearch = async (payload) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    const { keyName } = this.state;
    await dispatch({
      type: 'common/queryMerchantList',
      payload: {
        ...payload,
        statusList: [1, 2],
        merchantTypeList: [1, 3],
        keyName,
      },
    });
    this.setState({ loading: false });
  }

  handleChange = (value) => {
    this.props.onChange(value);
    const { eventName, common } = this.props;
    const { keyName } = this.state;
    const curItem = _.find(common[keyName]?.dataList, (item) => { return item.value === value; });

    if (eventName) {
      emitter.emit(eventName, { linkId: value, item: curItem });
    }
  }

  render() {
    const { common, ...otherProps } = this.props;
    const { value, loading } = this.state;
    const { keyName } = this.state;

    return (
      <ProjectSelect
        {...common}
        {...otherProps}
        onChange={this.handleChange}
        handleSearch={this.handleSearch}
        value={value}
        loading={loading}
        list={common[keyName]}
      />
    );
  }
}

export default ProjectInputBusiness;
