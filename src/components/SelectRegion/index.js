/*
 * @Author: wuhao
 * @Date: 2018-05-05 14:25:17
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-29 09:48:19
 *
 * 地区选择下拉组件
 */
import React, { PureComponent } from 'react';

import { Cascader } from 'antd';

class SelectRegion extends PureComponent {
  static defaultProps = {};

  state = {
    data: [],
    depth: this.props.depth || 4,
    value: this.props?.defValue || null,
  }

  componentDidMount() {
    const { value } = this.state;
    this.initRegionList(value);
  }

  componentWillReceiveProps(nextProps) {
    if ('defValue' in nextProps) {
      const { defValue } = nextProps;
      if (!defValue) {
        this.setState({
          value: null,
        });
      } else if (defValue instanceof Array) {
        const { onChange } = this.props;
        if (onChange) {
          onChange({
            value: defValue,
          });
        }
        this.setState({
          value: defValue,
        });
        this.initRegionList(defValue);
      }
    }
  }

  initOptionsChilrend = async (options, value, level) => {
    const { depth } = this.state;
    if (options && value && depth > level) {
      const optionChilrend = await this.props?.callback({ value, level });
      return optionChilrend;
    }

    return null;
  }

  initValueFindOption = (options, value) => {
    return options?.find((item) => {
      return item.value === value;
    });
  }

  initValueToChange = (options, value) => {
    const [val1, val2, val3, val4] = value || [];
    const [options1, options2, options3, options4] = options || [];

    if (val1) {
      const sOpt1 = this.initValueFindOption(options1, val1);
      const sOpt2 = this.initValueFindOption(options2, val2);
      const sOpt3 = this.initValueFindOption(options3, val3);
      const sOpt4 = this.initValueFindOption(options4, val4);

      const selectedOptions = [sOpt1, sOpt2, sOpt3, sOpt4].filter((item) => {
        return !!item;
      });

      const { onChange } = this.props;
      if (onChange) {
        onChange({
          value: selectedOptions?.map((item) => {
            return item.value;
          }),
          selectedOptions,
        });
      }
    }
  }

  initOptionsChildrendMap = (options, value, options2) => {
    return options?.map((elm) => {
      const item = elm;
      if (value === item.value) {
        item.children = options2;
      }

      return item;
    });
  }

  initRegionList = async (value) => {
    const [val1, val2, val3] = value || [];
    const options = await this.props?.callback();
    const options2 = await this.initOptionsChilrend(options, val1, 1);
    const options3 = await this.initOptionsChilrend(options2, val2, 2);
    const options4 = await this.initOptionsChilrend(options3, val3, 3);

    this.initOptionsChildrendMap(options3, val3, options4);
    this.initOptionsChildrendMap(options2, val2, options3);
    this.initOptionsChildrendMap(options, val1, options2);


    this.initValueToChange([options, options2, options3, options4], value);

    this.setState({
      data: [...(options || [])],
      value,
    });
  }

  handleLoadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const options = await this.props?.callback(targetOption);
    targetOption.children = options;
    targetOption.loading = false;

    this.setState(prevState => ({
      data: [...prevState?.data],
    }));
  }

  handleChange = (value, selectedOptions) => {
    this.setState({
      value,
    });

    const { onChange } = this.props;
    if (onChange) {
      onChange({
        value,
        selectedOptions,
      });
    }
  }

  render() {
    const { data, value } = this.state;
    const { dataSource, loadData, callback, defValue, dispatch, ...other } = this.props;
    return (
      <Cascader
        {...other}
        options={data}
        loadData={this.handleLoadData}
        changeOnSelect
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

export default SelectRegion;
