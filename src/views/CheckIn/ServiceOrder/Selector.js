import React, { Component } from 'react';
import { Select } from 'antd';
import {
  paymentItemPage,
  queryServiceItemList,
  queryRoomStayInAndReservePage,
} from 'services/checkIn';

import { orgId } from 'utils/getParams';

const { Option } = Select;

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      tempData: [],
    };
  }

  async componentDidMount() {
    const children = [];
    const { type = 'paymentItem' } = this.props;
    /* 请求数据 */
    // 收费类目
    let res;
    if (type === 'paymentItem') {
      res = await paymentItemPage({
        paymentItemQueryVO: {
          status: 1,
          currPage: 1,
          pageSize: 9999,
        },
      });

      if (res) {
        const { dataList } = res;
        dataList.forEach((v) => {
          children.push(
            <Option key={v.paymentItemId} title={v.paymentItemName}>
              {v.paymentItemName}
            </Option>
          );
        });
        this.setState({ children });
      }
    } else if (type === 'serviceItem') {
      // 服务项名称：
      res = await queryServiceItemList({ serviceItemVO: { orgId: orgId(), source: 1, status: 1, isDelete: 0 } });
      res.forEach((v) => {
        children.push(
          <Option key={v.serviceItemId} title={v.serviceName} dataOrigin={v}>
            {v.serviceName}
          </Option>
        );
      });
      this.setState({ children });
    } else if (type === 'RoomStayInAndReserve') {
      // 在住/预留 房间号
      res = await queryRoomStayInAndReservePage({ currPage: 1, pageSize: 999 });
      if (!res) return false;
      /** 格式化+拼接数据 */
      const optionData = [...new Set(res.list)];
      const idList = [];
      const dtRes = [];
      optionData.forEach((item) => {
        if (idList.includes(item.roomId)) {
          // 如果有ID重复(多个时间,不同的入住人)
          const repIdx = dtRes.findIndex(i => i.roomId === item.roomId); // 重复id在 拼接数据dtRes中的索引
          // 重复id的 dtRes数据
          dtRes[repIdx].mutliInfo.push({
            gresInfo: item.gresInfo,
            sourceInfo: item.sourceInfo,
            beginTime: item.beginTime,
            endTime: item.endTime,
          });
        } else {
          // 没有重复 直接添加数据 重复数据mutliInfo length===1
          idList.push(item.roomId);
          dtRes.push({ ...item,
            mutliInfo: [{
              gresInfo: item.gresInfo,
              sourceInfo: item.sourceInfo,
              beginTime: item.beginTime,
              endTime: item.endTime,
            }] });
        }
      });
      console.log({ idList, dtRes, type: '房间号' });
      dtRes.forEach((v) => {
        console.log(`${v.buildingName} ${v.roomNo} ${v.roomTypeName}`);
        children.push(
          <Option
            key={v.roomId}
            title={`${v.buildingName} ${v.roomNo} ${v.roomTypeName}`}
          >
            {`${v.buildingName} ${v.roomNo} ${v.roomTypeName}`}
          </Option>
        );
      });
      this.setState({ children, dtRes });
    }
  }

  onChange = (id, name) => {
    const { onSel = () => {} } = this.props;
    onSel(id, name, this.state.dtRes);
    this.props.onChange(id, name);
  };

  // calcChildren = () => {
  //   console.log(this.props);
  //   const children = [];
  //   const { mutliInfo = [] } = this.props;
  //   mutliInfo.forEach(v =>
  //     children.push(
  //       <Option key={v.sourceInfo + v.gresInfo} title={v.gresInfo} dataOrigin={v}>
  //         {`${v.sourceInfo} ${v.gresInfo}`}
  //       </Option>
  //     ));
  //   this.setState({ children });
  // };
  static getDerivedStateFromProps(nextProps, prevState) {
    // 没错，这是一个static
    if (nextProps.mutliInfo && nextProps.mutliInfo.length) {
      // console.log('进入', { nextProps, prevState });
    }
  }

  render() {
    const { children } = this.state;
    const { type = 'paymentItem' } = this.props;
    if (type === 'gresInfoList') {
      const gresChild = [];
      console.log({ mutliInfo: this.props.mutliInfo });

      this.props.mutliInfo.forEach(v =>
        gresChild.push(
          <Option key={v.sourceInfo + v.gresInfo + v.beginTime + v.endTime} title={v.gresInfo} dataOrigin={v}>
            {`${v.sourceInfo} ${v.gresInfo}`}
          </Option>
        ));
      return (
        <Select
          placeholder="请选择"
          style={{ width: '100%' }}
          {...this.props}
          onChange={this.onChange}
        >
          {gresChild}
        </Select>
      );
    } else {
      return (
        <Select
          placeholder="请选择"
          style={{ width: '100%' }}
          {...this.props}
          onChange={this.onChange}
        >
          {children}
        </Select>
      );
    }
  }
}

export default View;
