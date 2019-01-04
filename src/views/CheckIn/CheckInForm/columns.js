import React from "react";
import moment from "moment";
import _ from "lodash";
import Collecter from "components/Collecter";
import {
  GRES_STATE,
  STATUS_TO_OPERATION,
  GRES_TYPE,
  RES_TYPE
} from "../common/status";
import { getOperates } from "../common/OperatesBar";
import { fenToYuan } from "utils/money";

export default (me, searchDefault, checkIn) => {
  const arrOperate = [
    {
      title: "登记单号",
      dataIndex: "gresNo",
      key: "gresNo",
      render: (val, record) => (
        <a
          title={`订单来源：${
            record.resType == RES_TYPE.team.value ? "团队" : "散客"
          }`}
          href={`#/checkin/checkinform/edit/${record.gresId}`}
        >
          {val}
        </a>
      )
    },
    {
      title: "入住人",
      dataIndex: "guestName"
    },
    {
      title: "手机号",
      dataIndex: "phone"
    },
    {
      title: "房间",
      dataIndex: "roomTypeNo"
    },
    {
      title: "总价(元)",
      render: (val, record) => fenToYuan(record.roomRate)
    },
    {
      title: "入离店日期",
      render: (val, record) => {
        return (
          <span>
            {moment(new Date(record.arrivalDate)).format("YYYY-MM-DD")}
            <span style={{ color: "#ccc" }}> ~ </span>
            {moment(new Date(record.departureDate)).format("YYYY-MM-DD")}
          </span>
        );
      },
      sorter: (a, b) =>
        a.arrivalDate - b.arrivalDate || a.departureDate - b.departureDate
    },
    {
      title: "状态",
      render: (val, record) => {
        const obj = _.find(GRES_STATE, item => item.value == record.status);
        return <span> {obj?.label} </span>;
      }
    },
    {
      title: "操作",
      render: (val, record) => (
        <Collecter list={filterOperates(val, record)("checkIn")} />
      )
    }
  ];

  /**
   * @param {*} val
   * @param {*} record
   * @param {string} page 取值 'order/team/checkIn'
   * @param {number} status
   */
  const filterOperates = (val, record) => page => {
    const list = getOperates(me, record, checkIn);
    let pageOperations = STATUS_TO_OPERATION[page][record.status]?.slice(); // 复制一份，避免污染

    const linkRoomIndex = pageOperations?.indexOf(3);
    // return list;
    if (+record.status == 0) {
      return [];
    }
    if (
      (linkRoomIndex > -1 && record.resType == RES_TYPE.team.value) ||
      record.linkId
    ) {
      // 团体进来的订单不能联房 或 已被关联房间的房子 不能联房
      pageOperations?.splice(linkRoomIndex, 1);
    }
    const res = pageOperations?.map(item => list[item]);
    
    // debugger
    return res;
  };

  return arrOperate;
};
