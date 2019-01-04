/*  退房或补结账操作弹窗  */
import React, { Component } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

class WeekdayCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plainOptions: [
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周日', value: 7 },
      ],
      options: [],
      btnArr: ['全选', '只选工作日', '只选周末', '周一~周四', '周五~周日', '周日~周四', '周五~周六'],
    };
  }
  onChange(checkedValues) {
    this.setState({
      options: checkedValues,
    });
    this.props.onChange(checkedValues.join('_'));
  }
  handleClick(i) {
    let resultArr;
    switch (i) {
      case 0:
        resultArr = [1, 2, 3, 4, 5, 6, 7];
        break;
      case 1:
        resultArr = [1, 2, 3, 4, 5];
        break;
      case 2:
        resultArr = [6, 7];
        break;
      case 3:
        resultArr = [1, 2, 3, 4];
        break;
      case 4:
        resultArr = [5, 6, 7];
        break;
      case 5:
        resultArr = [1, 2, 3, 4, 7];
        break;
      case 6:
        resultArr = [5, 6];
        break;
      default:
    }
    this.setState({
      options: resultArr,
    });
    this.props.onChange(resultArr.join('_'));
  }
  render() {
    const { plainOptions, options, btnArr } = this.state;
    return (
      <div>
        <CheckboxGroup options={plainOptions} value={options} onChange={this.onChange.bind(this)} />
        <div>
          {
            btnArr.map((v, i) => (
              <a
                key={`${i}_xixi`}
                style={{ marginRight: 20 }}
                onClick={this.handleClick.bind(this, i)}
              >
                {v}
              </a>
            ))
          }
        </div>
      </div>
    );
  }
}
// Form.childContextTypes = {
//   form: PropTypes.object, // form
// };

WeekdayCheck.propTypes = Object.assign({}, WeekdayCheck.propTypes, {
  // title: PropTypes.string.isRequired, // 弹窗的标题
  // modalSubmit: PropTypes.func.isRequired, // 弹窗提交时触发
  // modalCancel: PropTypes.func, // 弹窗取消时触发
  // initFormData: PropTypes.object.isRequired, // 初始Form值，若为空传{}
});

export default WeekdayCheck;
