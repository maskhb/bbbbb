import React, { Component } from 'react';
import { Select } from 'antd';
import AsyncSelectReq from 'services/AsyncSelectReq';

const { Option } = Select;


class AsyncSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
    };
  }

  componentWillMount() {
    const children = [];
    /* 请求数据 */
    AsyncSelectReq.queryListAndHasChild({}).then((res) => {
      res?.forEach((v) => {
        if (v.status === 1) {
          children.push(<Option key={v.categoryId}>{v.categoryName}</Option>);
        }
      });
      this.setState({ children });
    });
  }


  render() {
    const { children } = this.state;
    // console.log('props...', this.props);
    const { ...other } = this.props;
    // console.log('seelct', value, children);
    return (
      <div>
        {children && children.length > 0 && (
          <Select
            {...other}
            // labelInValue
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择"
            // onChange={this.props.onChange}
            // onSelect={this.props.onSelect}
            // defaultValue={this.props.defaultValue || value}
          >
            {children}
          </Select>
        )
      }
      </div>
    );
  }
}

export default AsyncSelect;
