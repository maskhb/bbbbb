import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

export default class SelectSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.handleSearch = debounce(this.handleSearch, 800);
  }

  state = {
    data: undefined,
    fetching: false,
  }

  reset = () => {
    this.setState({
      data: [],
    });
  }

  handleSearch = (value) => {
    if (!value && value !== 0) {
      return;
    }

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const { onSearch } = this.props;
    this.setState({ data: [], fetching: true });

    onSearch?.(value).then?.((data) => {
      if (fetchId !== this.lastFetchId) { // for fetch callback order
        return;
      }

      this.setState({ data, fetching: false });
    });
  }

  handleChange = (value) => {
    this.triggerChange(value);
  };

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render() {
    const { onChange, onSearch, dataSource = [], showSearch = true, ...props } = this.props;
    const { data = dataSource.map(item => ({
      text: item.merchantName,
      value: item.merchantId,
    })), fetching } = this.state;

    return (
      <Select
        showSearch={showSearch}
        showArrow={!showSearch}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        {...props}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
      >
        {data.map(d => <Option key={d.value} value={d.value}>{d.text}</Option>)}
      </Select>
    );
  }
}
