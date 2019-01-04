import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import AsyncCascaderReq from './AsyncCascaderReq.js';

class AsyncCascader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }
  componentDidMount() {
    const that = this;
    const { asyncType } = this.props;
    const { params, labelParam, filter, queryPageType } = this.props;
    if (asyncType && params) {
      AsyncCascaderReq[asyncType](params).then((res) => {
        const options = [];
        if (queryPageType) {
          /* eslint-disable-next-line */
          res = res?.dataList;
        }
        if (res && Array.isArray(res) && res.length > 0) {
          // console.log(res) //eslint-disable-line
          res.forEach((v) => {
            if (filter(v)) {
              options.push({
                value: v[labelParam.value],
                label: v[labelParam.label],
              });
            }
          });
          that.setState({ options });
        }
      });
    }
  }

  handleChange(value) {
    this.props.onChange(Array.isArray(value) && value.length === 1 ? value[0] : (
      Array.isArray(value) && value.length === 0 ? null : value
    ));
  }


  render() {
    const { placeholder, resetFields } = this.props;
    const value = this.props.defaultValue || this.props.value;
    return (
      <div>
        {this.state.options && this.state.options.length > 0 && (
          <Cascader
            value={Array.isArray(value) ? value : [value]}
            placeholder={placeholder}
            options={this.state.options.length ? this.state.options : [{ value: '0', label: '没有数据', disabled: true }]}
            changeOnSelect
            resetFields={resetFields}
            onChange={this.handleChange.bind(this)}
          />
        )}
      </div>
    );
  }
}
AsyncCascader.defaultProps = {
  params: {},
  queryPageType: false,
  filter: () => true,
};
AsyncCascader.propTypes = {
  ...AsyncCascader.propTypes,
  asyncType: PropTypes.string.isRequired,
  queryPageType: PropTypes.bool,
  params: PropTypes.object,
  filter: PropTypes.func, /* 筛选器 */
  labelParam: PropTypes.object.isRequired, /* 定义option的label和value */
};


export default AsyncCascader;
