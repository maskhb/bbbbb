import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import commonService from '../../services/common';

class LocationStandard extends Component {
  // eslint-disable-next-line
  static getChildRegion(regionId, depth, cb) {
    commonService.queryRegionInfo({
      regionId,
    }).then((res) => {
      // console.log(res);
      const options = [];
      if (res) {
        res.forEach((v) => {
          options.push({
            value: v.regionId, label: v.regionName, isLeaf: v.level === depth, level: v.level,
          });
        });
      }
      if (cb && typeof cb === 'function') {
        cb(options);
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      defaultOptions: [],
      depth: props?.depth || 4,
      casValue: (props?.value?.value || []),
    };
  }

  componentWillMount() {
    // const that = this;
    this.initData();
  }
  componentWillReceiveProps(nextProps) {
    const { defaultOptions } = this.state;
    if (typeof nextProps.value === 'undefined') {
      this.setState({
        options: JSON.parse(JSON.stringify(defaultOptions)),
        casValue: [],
      });
    } else if (
      nextProps.value?.value?.length === 3 && !this.checkEqValue(
        nextProps.value, this.state.casValue)) {
      this.state.casValue = nextProps.value.value;
      this.initData();
    } else if (nextProps.value?.value !== this.props.value?.value) {
      this.state.casValue = nextProps.value?.value;
    }
  }


  onChange(value, selectedOptions) {
    const that = this;
    that.setState({
      casValue: value,
    });
    that.props.onChange({
      value, selectedOptions,
    });
  }

  checkEqValue = (oldVal, newVal) => {
    if (oldVal?.length !== newVal?.length) {
      return false;
    }
    return oldVal[0] === newVal[0] && oldVal[2] === newVal[2];
  }

  initData = () => {
    commonService.queryRegionInfo({
      regionId: 0,
    }).then((res) => {
      if (res) {
        const optionList = [];
        res.forEach((v) => {
          optionList.push({
            value: v.regionId, label: v.regionName, isLeaf: false, level: v.level,
          });
        });
        if (this.state.casValue.length === 3) {
          LocationStandard.getChildRegion(this.state.casValue[0], this.state.depth, (rs) => {
            optionList.forEach((l) => {
              if (l.value === this.state.casValue[0]) {
                // eslint-disable-next-line
                l.children = rs;
                LocationStandard.getChildRegion(
                  this.state.casValue[1], this.state.depth, (res0) => {
                    rs.forEach((r) => {
                      if (r.value === this.state.casValue[1]) {
                        // eslint-disable-next-line
                        r.children = res0;
                      }
                    });
                    this.setState({ options: optionList, defaultOptions: optionList });
                  });
              }
            });
          });
        } else {
          this.setState({ options: optionList, defaultOptions: optionList });
        }
      }
    });
  }

  loadData(selectedOptions) {
    const that = this;
    const { depth, options } = this.state;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    LocationStandard.getChildRegion(targetOption.value, depth, (res) => {
      targetOption.loading = false;
      targetOption.children = res;
      that.setState({
        options: [...options],
      });
    });
  }
  render() {
    const { placeholder = '请选择', disabled } = this.props;
    const { options, casValue } = this.state;
    return (
      <Cascader
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        value={casValue}
        loadData={this.loadData.bind(this)}
        onChange={this.onChange.bind(this)}
        changeOnSelect
      />
    );
  }
}
LocationStandard.propTypes = Object.assign({}, LocationStandard.propTypes, {
  depth: PropTypes.number, // 需要展示到的层级，1：省 2：市 3：区 4：街道   不传则默认为4
});
export default LocationStandard;
