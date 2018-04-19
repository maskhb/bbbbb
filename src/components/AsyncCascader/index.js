import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import AsyncCascaderReq from 'services/AsyncCascaderReq.js';

class AsyncCascader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }
  componentWillMount() {
    const that = this;
    const { asyncType } = this.props;
    const { params, labelParam, filter } = this.props;
    if (asyncType && params) {
      AsyncCascaderReq[asyncType](params).then((res) => {
        const options = [];
        if (res && res.length > 0) {
          res.forEach((v) => {
            if (filter(v)) {
              options.push({
                value: v[labelParam.value],
                label: v[labelParam.label],
                isLeaf: Boolean(!v.isHasChild),
              });
            }
          });
          that.setState({ options });
        }
      });
    }
  }

  handleChange(value, selectedOptions) {
    // debugger;
    console.log(value, selectedOptions);//eslint-disable-line
    this.props.onChange(Array.isArray(value) && value.length === 1 ? value[0] : value);
  }


  render() {
    return (
      <Cascader
        placeholder={this.props.placeholder}
        options={this.state.options}
        changeOnSelect
        resetFields={this.props.resetFields}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
AsyncCascader.defaultProps = {
  params: {},
  filter: () => true,
};
AsyncCascader.propTypes = {
  ...AsyncCascader.propTypes,
  asyncType: PropTypes.string.isRequired,
  params: PropTypes.object,
  filter: PropTypes.func, /* 筛选器 */
  labelParam: PropTypes.object.isRequired, /* 定义option的label和value */
};


export default AsyncCascader;
