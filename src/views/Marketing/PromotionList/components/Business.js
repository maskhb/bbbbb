import React, { PureComponent } from 'react';
import request from 'utils/request';
import { Select } from 'antd';

const { Option } = Select;

export default class Business extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: '',
    };
  }

  componentWillMount() {
    this.fake();
  }

  fake() {
    // 根据复合条件查询商家列表
    request('/mj/ht-mj-merchant-server/merchantBase/queryList', {
      method: 'POST',
      body: {
        merchantBaseVo: {},
      },
    }).then((_data) => {
      this.setState({ data: _data.map((v) => {
        return { value: v.merchantId, text: v.merchantName };
      }) });
    });
  }

  handleChange = (value, option) => {
    if (value === option.props.children) {
      this.setState({ value });
    } else {
      this.props.onChange(value);
      this.setState({ value: option.props.children });
    }
    /*
    if (this.timeout) {
      clearTimeout(this.timeouttimeout);
      this.timeouttimeout = null;
    }

    this.timeout = setTimeout(this.fake.bind(this, value), 300);
    */
  }

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        mode="combobox"
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        onChange={this.handleChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options}
      </Select>
    );
  }
}
