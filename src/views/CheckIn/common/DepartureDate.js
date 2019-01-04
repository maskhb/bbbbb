import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { DatePicker, message } from 'antd';
import { transformArrivalDate, transformDepartureDate } from 'viewmodels/GresDetailResp';
import '../index.less';

const { RangePicker } = DatePicker;

export default class DepartureDate extends React.Component {
  handleChange=(time) => {
    // debugger; 为啥time跨月选择顺序会反过来？？？
    if (time[0] > time[1]) {
      time = [time[1], time[0]];
    }
    if (time[0].format('YYYYMMDD') === time[1].format('YYYYMMDD')) {
      return message.error('入店时间不能等于离店时间');
    }

    const { gresDetails } = this.props?.checkIn || {};
    const { preRoomList } = gresDetails || {};
    let minCreatedTime;
    let maxDepartureDate;
    _.forEach(preRoomList, (item) => {
      _.forEach(item.list, (room) => {
        if (!minCreatedTime || minCreatedTime > room.arrivalDate) {
          minCreatedTime = room.arrivalDate;
        }
        if (!maxDepartureDate || maxDepartureDate < room.departureDate) {
          maxDepartureDate = room.departureDate;
        }
      });
    });

    const arrivalDate = transformArrivalDate(time[0]).valueOf();
    const departureDate = transformDepartureDate(time[1]).valueOf();

    if (minCreatedTime && maxDepartureDate) {
      if (arrivalDate > minCreatedTime) {
        return message.error('入店时间不能晚于预留房间的最早时间，如需修改，请先取消预留的房间');
      } else if (departureDate < maxDepartureDate) {
        return message.error('离店时间不能早于预留房间的最晚时间，如需修改，请先取消预留的房间');
      }
    }

    this.props.onChange(time);
  }

  render() {
    const { onChange, ...others } = this.props;

    const { checkIn: { gresDetails } } = others;
    return (
      <RangePicker
        format="YYYY-MM-DD"
        disabledDate={(current) => {
          return current && current < moment(gresDetails?.arrivalDate || new Date()).startOf('day');
        }}
        allowClear={false}
        {...others}
        onChange={this.handleChange}
      />
    );
  }
}
