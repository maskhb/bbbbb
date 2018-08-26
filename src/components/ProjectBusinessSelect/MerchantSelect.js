import React from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';

export default class ProjectSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleSearch = (merchantName) => {
    if (!merchantName) {
      return;
    }

    this.props.handleSearch({
      merchantName,
    });
  }

  handleChange = (value) => {
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { disabled, loading, list, placeholder } = this.props;
    const { value } = this.state;
    return (
      <Select
        optionFilterProp="children"
        showSearch
        onSearch={_.debounce(this.handleSearch, 500)}
        onChange={this.handleChange}
        value={value || undefined}
        disabled={disabled}
        notFoundContent={loading ? <Spin size="small" /> : null}
        placeholder={placeholder}
      >
        {
          list?.dataList?.map(item => (
            <Select.Option
              value={item.value}
              key={item.value}
            >
              {item.label}
            </Select.Option>
              ))
            }
      </Select>
    );
  }
}
