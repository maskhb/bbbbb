import React, { Component } from "react";
import { Select } from "antd";
import channelRequest from "services/channelRequest";
import { orgId } from "utils/getParams";

const { Option } = Select;

class AsyncSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: []
    };
  }

  async componentDidMount() {
    const children = [];
    const { type = "source" } = this.props;
    const self = this;
    if (type === "source") {
      /* 请求数据 */
      const res = await channelRequest.querySourceList({ orgId: orgId() });
      if (res) {
        res.dataList?.forEach(v => {
          children.push(<Option key={v.sourceId} title={v.sourceName}>{v.sourceName}</Option>);
        });
        children.unshift(<Option key={0}>全部</Option>);
        self.setState({ children });
      }
    } else {
      // type=channel
      const res = await channelRequest.queryChannelList();
      const channelChildren = [];
      res?.forEach(v => {
        channelChildren.push(
          <Option key={v.channelId} title={v.channelName}>{v.channelName}</Option>
        );
      });
      self.setState({ children: channelChildren });
    }
  }
  onChange = (channelId, channelName) => {
    const { onSel = () => {} } = this.props;
    onSel(channelId, channelName);
    this.props.onChange(channelId, channelName);
  };

  render() {
    const { children } = this.state;
    // console.log('props...', this.props);
    const { ...other } = this.props;
    // console.log('seelct', value, children);
    return (
      <div>
        {children &&
          children.length > 0 && (
            <Select
              {...other}
              // labelInValue
              // mode="multiple"
              style={{ width: "100%" }}
              placeholder="请选择"
              // onChange={this.props.onChange}
              onChange={this.onChange}
              showSearch
              optionFilterProp="children"  
              // defaultValue={this.props.defaultValue || value}
            >
              {children}
            </Select>
          )}
      </div>
    );
  }
}

export default AsyncSelect;
