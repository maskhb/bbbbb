import React, { Component } from 'react';
import { Form, Select, Icon, Button, Input, message } from 'antd';
import _ from 'lodash';

export default class DynamicSelect extends Component {
  state = {
    lastFilters: [],
    filters: [],
  }

  componentWillMount() {
    const { filters } = this.props;
    this.setState({
      lastFilters: [],
      filters: filters || [],
    });
  }

  handleCustomBlur = (value, e) => {
    const { filters, lastFilters } = this.state;

    if (!e.target.value) {
      this.setState({
        filters: lastFilters,
        lock: false,
      });

      return;
    }

    // 输入的值重复了
    if (filters.map(f => f.label).includes(e.target.value)) {
      message.error('自定义值不能重复');
      return;
    }

    const { onChangeFilters } = this.props;

    const newFilters = filters.map((f) => {
      const temp = f;
      if (temp.value === value) {
        temp.label = e.target.value;
      }
      return temp;
    });

    this.setState({
      filters: newFilters,
      lock: false,
    });

    onChangeFilters(newFilters);
  }

  handleCustom = () => {
    if (this.state.lock) {
      return;
    }

    const { filters } = this.state;

    const value = (_.maxBy(filters, o => o.value)?.value || 0) + 1;
    this.setState({
      lastFilters: filters,
      filters: filters.concat({
        value,
        label: <Input
          size="small"
          style={{ width: '140px' }}
          autoFocus
          onBlur={this.handleCustomBlur.bind(this, value)}
        />,
        isCustmer: true,
      }),
      lock: true,
    });
  }

  render() {
    const { form, label, value, required,
      custom, filedId, showSearch, disabled } = this.props;
    const { filters } = this.state;

    const options = filters;
    const labelContent = (
      custom
        ? (
          <span>
            {label}
            <Button
              disabled={disabled}
              type="dashed"
              size="small"
              style={{ float: 'right' }}
              onClick={this.handleCustom.bind(this)}
            >
              <Icon type="plus" />自定义
            </Button>
          </span>
        )
        : label
    );

    return (
      <Form.Item label={labelContent}>
        {form.getFieldDecorator(filedId, {
          rules: [{
            required, message: `请选择${label}`,
          }],
          initialValue: _.isArray(value) ? value[0] : value,
        })(
          <Select
            showSearch={showSearch}
            disabled={disabled}
            filterOption={(input, option) => (
              (option.props.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            )}
          >
            {Object.values(options).map(option => (
              <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  }
}
