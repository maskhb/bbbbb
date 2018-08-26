import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';

export default class MerchantSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        merchantId: '',
        ...props.value,
      },
      defaultValue: {
        ...props.value,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { merchantId, merchantName } = this.state.defaultValue || {};
    const { value } = nextProps;
    if (value?.merchantId !== merchantId
      || value?.merchantName !== merchantName
    ) {
      this.setState({ value, defaultValue: { ...value } });
    }
  }

  handleSearchMerchant = (merchantName) => {
    if (!merchantName) {
      return;
    }

    const unionMerchantId = this.state.value.factoryId;
    this.props.handleSearchMerchant({
      merchantName,
      merchantTypeList: [1, 2, 3],
      keyName: 'merchantList',
      unionMerchantId,
    });
  }

  handleMerchantChange = (merchantId) => {
    this.setState({ value: { ...this.state.value, merchantId } });
    this.props.onChange({ factoryId: this.state.value.factoryId, merchantId });
  }

  render() {
    const { merchantList, disabled } = this.props;
    const { value: { merchantId }, defaultValue } = this.state;

    return (
      <Select
        mode="combobox"
        value={defaultValue.merchantName || merchantId || undefined}
        placeholder="请选择所属商家"
        notFoundContent={<Spin size="small" />}
        filterOption={false}
        disabled={Boolean(disabled)}
        onSearch={_.debounce(this.handleSearchMerchant, 500)}
        onChange={this.handleMerchantChange}
      >
        {
          merchantList?.dataList?.map(item => (
            <Select.Option value={item.value} key={item.value}>
              {item.label}
            </Select.Option>
          ))
        }
      </Select>
    );
  }
}
