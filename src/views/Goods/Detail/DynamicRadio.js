import React, { Component } from 'react';
import { Form, Radio, Icon, Button, Input, message } from 'antd';
import _ from 'lodash';
import './DynamicCheckbox.less';

export default class DynamicRadio extends Component {
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

  handleInput = (value, e) => {
    if (e.target.value && e.target.value.match(',')) {
      e.target.value = e.target.value.replace(/,/g, '');
    }
  }

  handleEditClick = (option, e) => {
    e.preventDefault();

    if (this.state.lock) {
      return;
    }

    const { filters } = this.state;

    this.setState({
      lastFilters: filters,
      filters: filters.map((f) => {
        const r = f;

        if (r.value === option.value) {
          r.label = (
            <Input
              size="small"
              style={{ width: '140px' }}
              autoFocus
              onBlur={this.handleCustomBlur.bind(this, r.value)}
              onInput={this.handleInput.bind(this, r.value)}
              defaultValue={r.label}
            />
          );
        }

        return r;
      }),
      lock: true,
    });
  }

  handleDeleteClick = (option, e) => {
    e.preventDefault();

    if (this.state.lock) {
      return;
    }

    const { filters } = this.state;

    this.setState({
      lastFilters: filters,
      filters: filters.filter(f => f.value !== option.value),
    });
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
    const { form, label, required, custom, filedId, disabled, value } = this.props;
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
          <Radio.Group disabled={disabled}>
            {Object.values(options).map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
                {
                  custom && option.isCustmer
                    ? <Icon type="edit" styleName="edit" onClick={this.handleEditClick.bind(this, option)} />
                    : ''
                }
                {
                  custom && option.isCustmer
                    ? <Icon type="delete" onClick={this.handleDeleteClick.bind(this, option)} />
                    : ''
                }
              </Radio>))}
          </Radio.Group>
        )}
      </Form.Item>
    );
  }
}
