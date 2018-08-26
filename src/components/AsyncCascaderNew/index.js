import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import AsyncCascaderReq from 'services/AsyncCascaderReq.js';

class AsyncCascaderNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      data: [],
    };
  }
  componentWillMount() {
    this.init();
  }
  init() {
    const that = this;
    const { asyncType } = this.props;
    const { params, labelParam, filter } = this.props;

    if (asyncType && params) {
      AsyncCascaderReq[asyncType](params).then((res) => {
        const options = [];
        this.state.data = res;
        if (res && Array.isArray(res) && res.length > 0) {
          res.forEach((v) => {
            if (filter(v)) {
              const tempArr = [];
              if (v.childrenList && Array.isArray(v.childrenList) && v.childrenList.length > 0) {
                v.childrenList.forEach((value) => {
                  if (filter(value)) {
                    tempArr.push({
                      value: value[labelParam.value],
                      label: value[labelParam.label],
                    });
                  }
                });
              }
              const tempObj = {
                value: v[labelParam.value],
                label: v[labelParam.label],
                children: tempArr,
              };
              options.push(tempObj);
            }
          });
          that.setState({ options });
        }
      });
    }
  }
  handleChange(value) {
    this.props.onChange(
      Array.isArray(value) && value.length >= 1 ? value[value.length - 1] : (
        Array.isArray(value) && value.length === 0 ? null : value
      )
    );
  }

  toCasValue = (value) => {
    let values = [];
    const getValue = (cate, val, parents = []) => {
      if (cate.categoryId === val) {
        values = parents.map(pt => pt.categoryId);
        values.push(val);
      } else if (cate.childrenList && cate.childrenList.length > 0) {
        parents.push(cate);
        cate.childrenList.forEach((ct) => {
          getValue(ct, val, JSON.parse(JSON.stringify(parents)));
        });
      }
    };

    if (value && this.state.data.length > 0) {
      for (const dt of this.state.data) {
        getValue(dt, value, []);
        if (values.length > 0) {
          return values;
        }
      }
    }
    return [value];
  }

  render() {
    const { placeholder, resetFields } = this.props;
    const value = this.props.defaultValue || this.props.value;
    const casValue = this.toCasValue(value);
    return (
      <div>
        {this.state.options && this.state.options.length > 0 && (
          <Cascader
            value={casValue}
            placeholder={placeholder}
            options={this.state.options}
            changeOnSelect
            resetFields={resetFields}
            onChange={this.handleChange.bind(this)}
          />
        )}
      </div>
    );
  }
}
AsyncCascaderNew.defaultProps = {
  params: {},
  filter: () => true,
};
AsyncCascaderNew.propTypes = {
  ...AsyncCascaderNew.propTypes,
  asyncType: PropTypes.string.isRequired,
  params: PropTypes.object,
  filter: PropTypes.func, /* 筛选器 */
  labelParam: PropTypes.object.isRequired, /* 定义option的label和value */
};


export default AsyncCascaderNew;
