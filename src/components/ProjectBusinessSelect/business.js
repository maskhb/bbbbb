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
import PropTypes from 'prop-types';

import ProjectSelect from './index';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class ProjectInputBusiness extends PureComponent {
  static defaultProps = {
    value: PropTypes.object,
  };

  handleSearchFactory = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/queryMerchantList',
      payload,
    });
  }

  handleSearchMerchant = (payload) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'common/queryMerchantList',
      payload,
    });
  }

  resetMerchant = (keyName = 'merchantList') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        [keyName]: [],
      },
    });
  }

  handleChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { common, ...otherProps } = this.props;

    return (
      <ProjectSelect
        {...common}
        {...otherProps}
        onChange={this.handleChange}
        handleSearchFactory={this.handleSearchFactory}
        handleSearchMerchant={this.handleSearchMerchant}
        resetMerchant={this.resetMerchant}
      />
    );
  }
}

export default ProjectInputBusiness;
