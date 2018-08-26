import React, { PureComponent } from 'react';
import { connect } from 'dva';
import SelectSearch from 'components/input/SelectSearch';

@connect(({ business }) => ({
  business,
}))
class SelectSearchConnectMerchant extends PureComponent {
  render() {
    const { onChange, unionMerchantId, ...props } = this.props;

    return (
      <SelectSearch
        showSearch={false}
        {...props}
        onChange={onChange}
      />
    );
  }
}

export default SelectSearchConnectMerchant;
