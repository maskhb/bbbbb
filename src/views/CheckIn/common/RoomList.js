import React from 'react';
import _ from 'lodash';
import { Table, Button, Divider, Popconfirm } from 'antd';
import { plainToClassFromExist } from 'class-transformer';
import '../index.less';
import EditRemainRoom from './EditRemainRoom';
import { RoomBookingTotalResp, getDateRange } from '../../../viewmodels/GresDetailResp';
import AssignServiceModal from './AssignServiceModal';

export default class RoomList extends React.Component {
  state = {
    curRecord: null,
  }

  handleCancel = (parentIndex, index) => {
    const { checkIn: { gresDetails } } = this.props;

    const oldRoomList = _.cloneDeep(gresDetails?.preRoomList);

    const arr = oldRoomList[parentIndex].list.splice(index, 1);
    const curRoom = arr[0];

    const remainParentIndex = _.findIndex(gresDetails?.roomBookingTotalVOs, item =>
      item.roomTypeId === oldRoomList[parentIndex]?.roomTypeId);
    if (remainParentIndex !== -1) {
      const remainIndex = _.findIndex(
        gresDetails?.roomBookingTotalVOs[remainParentIndex]?.list, item =>
          item.roomId === curRoom.roomId && item.arrivalDate === curRoom.arrivalDate
          && item.departureDate === curRoom.departureDate
      );
      if (remainIndex !== -1) {
        gresDetails?.roomBookingTotalVOs[remainParentIndex]?.list.splice(remainIndex, 1);
      }
    }

    const arrBusinessDay = getDateRange(curRoom.arrivalDate, curRoom.departureDate);
    const assginServiceOrders = _.filter(gresDetails?.assginServiceOrders, item =>
      !(item.roomId === curRoom.roomId && arrBusinessDay.indexOf(item.businessDay) !== -1));

    gresDetails.setAssignServiceOrders(assginServiceOrders);
    this.props.onChange(
      _.map(oldRoomList, item => plainToClassFromExist(new RoomBookingTotalResp(), item)),
      gresDetails
    );
  }

  handleOperateModal = (record) => {
    this.setState({ curRecord: record });
  }

  columns = () => {
    const { record: parent, index: parentIndex, ...others } = this.props;
    const { checkIn: { gresDetails } } = this.props;

    return [{
      title: '房号',
      dataIndex: 'buildingRoomNo',
    }, {
      title: '房间描述',
      dataIndex: 'roomDescription',
    }, {
      title: '入住日期',
      dataIndex: 'arrivalDateFormat',
    }, {
      title: '离店日期',
      dataIndex: 'departureDateFormat',
    }, {
      title: '状态',
      dataIndex: 'gresStatusFormat',
    }, {
      title: '操作',
      dataIndex: '',
      width: 250,
      render: (val, record, index) => {
        const showOperate = [4, 5].indexOf(gresDetails.status) === -1;
        return (
          <div>
            {
            showOperate ? (
              <div>
                {/* 只有未入住状态的预留房间，才可以操作；点击以后，跳转至生成入住登记单的页面； */}
                {(record.gresStatus === 'WI' && record.gresId) && (
                <a
                  href={`#/checkin/checkinform/add?gresId=${record.gresId}&roomId=${record.roomId}&roomNo=${record.roomNo}&buildingRoomNo=${record.buildingRoomNo}&arrivalDate=${record.arrivalDate}&departureDate=${record.departureDate}`}
                >入住
                </a>)}
                {(record.gresStatus === 'WI' && record.gresId) && <Divider type="vertical" />}
                {/* 只有未入住状态的预留房间才可以操作； */}
                {record.gresStatus === 'WI' && (
                <EditRemainRoom
                  {...others}
                  record={record}
                  index={index}
                  parentIndex={parentIndex}
                  parent={parent}
                />)}
                {record.gresStatus === 'WI' && <Divider type="vertical" />}
                {record.gresStatus === 'WI' && <Button className="link-button" onClick={() => this.handleOperateModal(record)}>分配服务</Button>}
                {record.gresStatus === 'WI' && <Divider type="vertical" />}
                {/* 只有未入住状态的预留房间才可以操作 */}
                {record.gresStatus === 'WI' && (
                <Popconfirm
                  placement="top"
                  title="是否确定取消当前预留房间？"
                  onConfirm={this.handleCancel.bind(this, parentIndex, index)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button className="link-button">取消</Button>
                </Popconfirm>
              )}
              </div>) : ''
          }
          </div>
        );
      },
    }];
  }

  render() {
    const { record = {} } = this.props;
    const { curRecord } = this.state;

    return (
      <div>
        <Table
          className="tanant-info"
          columns={this.columns()}
          dataSource={record.list || []}
          rowKey={() => Math.random()}
          pagination={false}
        />
        <AssignServiceModal
          {..._.omit(this.props, ['form', 'record'])}
          record={curRecord}
          addServiceOrders={this.props.form.getFieldValue('addServiceOrders')}
          handleOperateModal={this.handleOperateModal.bind(this)}
        />
      </div>

    );
  }
}
