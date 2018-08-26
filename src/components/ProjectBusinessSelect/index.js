import React from 'react';
import { Select, Row, Col } from 'antd';
import _ from 'lodash';
import { d2Col } from 'components/Const';

export default class ProjectSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        factoryId: '',
        merchantId: '',
        ...props.value,
      },
      defaultValue: {
        ...props.value,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { factoryId, merchantId, factoryName, merchantName } = this.state.defaultValue || {};
    const { value } = nextProps;
    if (value?.factoryId !== factoryId
      || value?.merchantId !== merchantId
      || value?.factoryName !== factoryName
      || value?.merchantName !== merchantName
    ) {
      this.setState({ value, defaultValue: { ...value } });
    }
  }

  handleSearchFactory = (merchantName) => {
    if (!merchantName) {
      return;
    }

    this.props.handleSearchFactory({
      merchantName,
      merchantTypeList: [1, 3],
      keyName: 'factoryList',
    });
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

  handleFactoryChange = (factoryId) => {
    this.setState({ value: { factoryId, merchantId: '', factoryName: '', merchantName: '' } });
    this.props.onChange({ factoryId, merchantId: '' });
    this.props.resetMerchant();
  }

  handleMerchantChange = (merchantId) => {
    this.setState({ value: { ...this.state.value, merchantId } });
    this.props.onChange({ factoryId: this.state.value.factoryId, merchantId });
  }

  render() {
    const { factoryList, merchantList, disabled } = this.props;
    const { value: { factoryId, merchantId }, defaultValue } = this.state;

    return (
      <Row gutter={16}>
        <Col {...d2Col}>
          <Select
            optionFilterProp="children"
            showSearch
            onSearch={_.debounce(this.handleSearchFactory, 500)}
            onChange={this.handleFactoryChange}
            value={defaultValue.factoryName || factoryId || undefined}
            disabled={disabled}
            placeholder="请选择所属厂商"
          >
            {
              factoryList?.dataList?.map(item => (
                <Select.Option
                  value={item.value}
                  key={item.value}
                >
                  {item.label}
                </Select.Option>
              ))
            }
          </Select>
        </Col>
        <Col {...d2Col}>
          <Select
            optionFilterProp="children"
            showSearch
            onSearch={_.debounce(this.handleSearchMerchant, 500)}
            value={defaultValue.merchantName || merchantId || undefined}
            onChange={this.handleMerchantChange}
            disabled={Boolean(!factoryId || disabled)}
            placeholder="请选择所属商家"
          >
            {
              merchantList?.dataList?.map(item => (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              ))
            }
          </Select>
        </Col>

      </Row>
    );
  }
}
