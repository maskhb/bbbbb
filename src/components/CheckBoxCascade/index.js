import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, InputNumber, DatePicker } from 'antd';
import GoodsCategory from '../GoodsCategory';

const { RangePicker } = DatePicker;

class CheckboxCascade extends Component {
  static getIndexByValue(arr, value) {
    let resultValue;
    arr.forEach((v, i) => {
      if (Number(v.value) === Number(value)) {
        resultValue = i;
      }
    });
    return resultValue;
  }
  constructor(props) {
    super(props);
    this.state = {
      name: props?.name || '', // 左侧下拉框对应的字段名
      selectOptions: props?.selectOptions || [], // 子组件的信息，数组
      showChildren: false, // 是否显示子组件
      currentIndex: null, // 左侧下拉框当前选中的序号
      leftValue: props?.value || null, // 左侧下拉框当前选中的值
    };
  }
  componentWillMount() {
    const { selectOptions, leftValue } = this.state;
    if (leftValue) {
      this.setState({
        currentIndex: CheckboxCascade.getIndexByValue(selectOptions, leftValue),
        showChildren: true,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { selectOptions, leftValue } = this.state;
    if (!nextProps.value) {
      this.setState({
        currentIndex: null,
        leftValue: null,
        showChildren: false,
      });
    } else if (typeof nextProps.value === 'number' && nextProps.value !== leftValue) {
      this.setState({
        currentIndex: CheckboxCascade.getIndexByValue(selectOptions, nextProps.value),
        leftValue: nextProps.value,
        showChildren: true,
      });
    }
  }
  handleChange(value) {
    const that = this;
    const { selectOptions, name } = this.state;
    const resultIndex = CheckboxCascade.getIndexByValue(selectOptions, value);
    const currentChildren = selectOptions[resultIndex];
    if (value === 0 || value) {
      that.setState({
        showChildren: true,
        currentIndex: resultIndex,
        leftValue: value,
        childrenType: currentChildren.childrenType,
      });
      that.props.onChange({
        [name]: value,
      });
    }
  }
  handleChildrenChange(type, ...args) {
    const that = this;
    const { selectOptions, currentIndex, leftValue, name } = this.state;
    const currentChildren = selectOptions[currentIndex];
    let rightResult;
    switch (type) {
      case 1:
        rightResult = args[0].target.value;
        break;
      case 3:
        rightResult = Number(args[0]);
        break;
      case 4:
        rightResult = new Date(args[0]).getTime();
        break;
      case 5:
        rightResult = [];
        args[0].forEach((v) => {
          rightResult.push(new Date(v).getTime());
        });
        break;
      default:
    }
    that.props.onChange({
      [name]: leftValue, [currentChildren.childrenName]: rightResult,
    });
  }
  renderChildrenComponent() {
    const that = this;
    const { selectOptions, showChildren, currentIndex } = this.state;
    if (typeof currentIndex === 'number' && showChildren) {
      let reactDom;
      const currentChildren = selectOptions[currentIndex];
      switch (currentChildren.childrenType) {
        // 不需要子组件
        case 0:
          break;
        // input输入框
        case 1:
          reactDom = (
            <Input
              style={Object.assign({ width: '100%' }, (currentChildren?.childrenProps?.style || {}))}
              placeholder={currentChildren?.childrenProps?.placeholder || ''}
              onChange={that.handleChildrenChange.bind(that, currentChildren.childrenType)}
            />
          );
          break;
        // 文件上传框
        case 2:
          break;
        // 数字输入框
        case 3:
          reactDom = (
            <InputNumber
              style={Object.assign({ width: '100%' }, (currentChildren?.childrenProps?.style || {}))}
              min={currentChildren?.childrenProps?.min}
              max={currentChildren?.childrenProps?.max}
              defaultValue={currentChildren?.childrenProps?.defaultValue}
              onChange={that.handleChildrenChange.bind(that, currentChildren.childrenType)}
            />
          );
          break;
        case 4:
          reactDom = (
            <DatePicker
              style={Object.assign({ width: '100%' }, (currentChildren?.childrenProps?.style || {}))}
              showTime={currentChildren?.childrenProps?.showTime}
              format={currentChildren?.childrenProps?.format}
              placeholder={currentChildren?.childrenProps?.placeholder || ''}
              onChange={that.handleChildrenChange.bind(that, currentChildren.childrenType)}
            />
          );
          break;
        case 5:
          reactDom = (
            <RangePicker
              style={Object.assign({ width: '100%' }, (currentChildren?.childrenProps?.style || {}))}
              showTime={currentChildren?.childrenProps?.showTime}
              format={currentChildren?.childrenProps?.format}
              placeholder={currentChildren?.childrenProps?.placeholder || ['', '']}
              onChange={that.handleChildrenChange.bind(that, currentChildren.childrenType)}
            />
          );
          break;
        default:
      }
      return reactDom;
    }
  }
  render() {
    const that = this;
    const { selectOptions, showChildren, leftValue } = that.state;
    // const {  } = this.props;
    return (
      <div>
        <Select
          style={{ width: '40%' }}
          onChange={this.handleChange.bind(this)}
          value={leftValue}
        >
          {selectOptions.map(v =>
            <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
          )}
        </Select>
        {
          (showChildren) ? (
            <div style={{ display: 'inline-block', marginLeft: '5%', width: '55%' }}>
              {this.renderChildrenComponent()}
            </div>
          ) : ''
        }
      </div>
    );
  }
}
CheckboxCascade.propTypes = Object.assign({}, GoodsCategory.propTypes, {
  name: PropTypes.string.isRequired, // 下拉列表获得值对应的字段名
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]), // 默认选中的选项
  selectOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired, // 下拉列表选项对应的value
    label: PropTypes.string.isRequired, // 下拉列表选项内容
    key: PropTypes.number.isRequired, // key值
    // 子组件类型
    // 0：不需要子组件 1：Input 2：文件上传组件 3：数字输入框
    // 4：日期（时间）选择组件 2018-04-10 或 2018-04-10 20:11
    // 5：日期（时间）范围选择组件 2018-04-10~2018-04-11 或 2018-04-10 20:11~2018-04-10 20:12
    childrenType: PropTypes.number.isRequired,
    childrenName: PropTypes.string.isRequired, // 子组件获得值对应的字段名
    childrenProps: PropTypes.object, // 子组件用到的参数，按ant design 相应组件的参数规范传入即可
  })).isRequired,
});

export default CheckboxCascade;
