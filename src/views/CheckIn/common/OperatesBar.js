import LinkModal from "./LinkModal";
import CheckOutModal from "./CheckOutModal";
import AppendCheckOutModal from "./AppendCheckOutModal";
import DelayModal from "./DelayModal";
import DelayArrivalsModal from "./DelayArrivalsModal";
import InvoiceModal from "./InvoiceModal";
import NoShowModal from "./NoShowModal";
import CancelModal from "./CancelModal";
import { RES_TYPE, GRES_TYPE } from "./status";
import Authorized from "utils/Authorized";
import * as permission from "config/permission";

export const getOperates = (me, record, checkIn) => {
  const { resType, gresType } = me.state;
  const pathRoot = (() => {
    let str = "checkinform"; // 入住
    if (resType == RES_TYPE.person.value && gresType == GRES_TYPE.order.value) {
      str = "orderform"; // 预定
    }
    if (resType == RES_TYPE.team.value && gresType == GRES_TYPE.order.value) {
      str = "teambooking"; // 团队预订
    }
    return str;
  })();

  // 设置权限
  // pathRoot == 'checkinform' || 'orderform' || 'teambooking'
  const p = (() => {
    let p = {};
    if ("checkinform" == pathRoot) {
      // PMS酒店管理系统 入住管理 入住管理-入住登记 列表
      p.LIST = "PMS_CHECKIN_CHECKINREGISTER_LIST";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 散客步入
      p.INDIVIDUALCHECKIN = "PMS_CHECKIN_CHECKINREGISTER_INDIVIDUALCHECKIN";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 修改/添加费用
      p.EDIT = "PMS_CHECKIN_CHECKINREGISTER_EDIT";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 退房
      p.VACATE = "PMS_CHECKIN_CHECKINREGISTER_VACATE";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 延住
      p.EXTEND = "PMS_CHECKIN_CHECKINREGISTER_EXTEND";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 联房
      p.UNITEROOMS = "PMS_CHECKIN_CHECKINREGISTER_UNITEROOMS";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 补结账
      p.SUPPLYACCOUNT = "PMS_CHECKIN_CHECKINREGISTER_SUPPLYACCOUNT";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 开发票
      p.INVOICE = "PMS_CHECKIN_CHECKINREGISTER_INVOICE";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 打印
      p.PRINT = "PMS_CHECKIN_CHECKINREGISTER_PRINT";
      // PMS酒店管理系统 入住管理 入住管理-入住登记 导出
      p.EXPORT = "PMS_CHECKIN_CHECKINREGISTER_EXPORT";
    } else if ("teambooking" == pathRoot) {
      // PMS酒店管理系统 入住管理 入住管理-团队预订 列表
      p.LIST = "PMS_CHECKIN_GROUPRESERVATION_LIST";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 团队预定
      p.GROUPRESERVE = "PMS_CHECKIN_GROUPRESERVATION_GROUPRESERVE";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 修改/排房号/入住/查看
      p.EDIT = "PMS_CHECKIN_GROUPRESERVATION_EDIT";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 开发票
      p.INVOICE = "PMS_CHECKIN_GROUPRESERVATION_INVOICE";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 退房
      p.VACATE = "PMS_CHECKIN_GROUPRESERVATION_VACATE";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 补结账
      p.SUPPLYACCOUNT = "PMS_CHECKIN_GROUPRESERVATION_SUPPLYACCOUNT";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 取消
      p.CANCEL = "PMS_CHECKIN_GROUPRESERVATION_CANCEL";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 延到
      p.DELAY = "PMS_CHECKIN_GROUPRESERVATION_DELAY";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 打印
      p.PRINT = "PMS_CHECKIN_GROUPRESERVATION_PRINT";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 noshow
      p.NOSHOW = "PMS_CHECKIN_GROUPRESERVATION_NOSHOW";
      // PMS酒店管理系统 入住管理 入住管理-团队预订 导出
      p.EXPORT = "PMS_CHECKIN_GROUPRESERVATION_EXPORT";
    } else if ("orderform" == pathRoot) {
      // PMS酒店管理系统 入住管理 入住管理-散客预订 列表
      p.LIST = "PMS_CHECKIN_INDIVIDUALRESERVATION_LIST";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 散客预订
      p.INDIVIDUALRESERVE =
        "PMS_CHECKIN_INDIVIDUALRESERVATION_INDIVIDUALRESERVE";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 修改/排房号/入住/查看
      p.EDIT = "PMS_CHECKIN_INDIVIDUALRESERVATION_EDIT";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 取消
      p.CANCEL = "PMS_CHECKIN_INDIVIDUALRESERVATION_CANCEL";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 延到
      p.DELAY = "PMS_CHECKIN_INDIVIDUALRESERVATION_DELAY";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 打印
      p.PRINT = "PMS_CHECKIN_INDIVIDUALRESERVATION_PRINT";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 noshow
      p.NOSHOW = "PMS_CHECKIN_INDIVIDUALRESERVATION_NOSHOW";
      // PMS酒店管理系统 入住管理 入住管理-散客预订 导出
      p.EXPORT = "PMS_CHECKIN_INDIVIDUALRESERVATION_EXPORT";
    }
    return p;
  })();


  return [
    {
      value: 0,
      label: "修改",
      id: "modify",
      authority: p.EDIT,
      node: (
        <a href={`#/checkin/${pathRoot}/edit/${record.gresId}`}>修改</a>
      )
    },
    {
      value: 1,
      label: "添加费用",
      id: "addCost",
      authority: p.EDIT,
      node: (
        <a
          href={`#/checkin/${pathRoot}/edit/${record.gresId}?type=AccountInfo`}
        >
          添加费用
        </a>
      )
    },
    {
      value: 2,
      label: "退房",
      id: "checkOut",
      authority: p.VACATE,
      node: (
        <CheckOutModal
          record={record}
          checkIn={checkIn}
          dispatch={me.props.dispatch.bind(me)}
        />
      )
    },
    {
      value: 3,
      label: "联房",
      id: "unionRoom",
      authority: p.UNITEROOMS,
      node: (
        <LinkModal
          record={record}
          checkIn={checkIn}
          dispatch={me.props.dispatch}
        />
      )
    },
    {
      value: 4,
      label: "延住",
      id: "delay",
      authority: p.EXTEND,
      node: (
        <DelayModal
          departureDate={record.departureDate}
          gresId={record.gresId}
          dispatch={me.props.dispatch}
          reload={me.reload}
        />
      )
    },
    {
      value: 5,
      label: "查看",
      id: "detail",
      authority: p.EDIT,
      node: (
        <a href={`#/checkin/${pathRoot}/edit/${record.gresId}`}>查看</a>
      )
    },
    {
      value: 6,
      label: "no show",
      id: "noshow",
      authority: p.NOSHOW,
      node: (
        <NoShowModal gresId={record.gresId} dispatch={me.props.dispatch} />
      )
    },
    {
      value: 7,
      label: "补结账",
      id: "supplement",
      authority: p.SUPPLYACCOUNT,
      node: (
          <AppendCheckOutModal
            record={record}
            dispatch={me.props.dispatch.bind(me)}
          />
      )
    },
    {
      value: 8,
      label: "开发票",
      id: "bill",
      authority: p.INVOICE,
      node: (
        <InvoiceModal gresId={record.gresId} dispatch={me.props.dispatch} />
      )
    },
    {
      value: 9,
      label: "打印",
      id: "print",
      authority: p.PRINT,
      node: (
        <a>打印（没实现）</a>
      )
    },
    {
      value: 10,
      label: "排房号",
      id: "rowRoomNo",
      authority: p.EDIT,
      node: (
        <a
          href={`#/checkin/${pathRoot}/edit/${record.gresId}?type=BookRoomList`}
        >
          排房号
        </a>
      )
    },
    {
      value: 11,
      label: "入住",
      id: "checkIned",
      authority: p.EDIT,
      node: (
        <a
          href={`#/checkin/${pathRoot}/edit/${record.gresId}?type=BookRoomList`}
        >
          入住
        </a>
      )
    },
    {
      value: 12,
      label: "取消",
      id: "cancel",
      authority: p.CANCEL,
      node: (
        <CancelModal
          gresId={record.gresId}
          dispatch={me.props.dispatch}
          checkIn={checkIn}
        />
      )
    },
    {
      value: 13,
      label: "延到",
      id: "delayArrivals",
      authority: p.DELAY,
      node: (
        <DelayArrivalsModal
          departureDate={record.departureDate}
          gresId={record.gresId}
          dispatch={me.props.dispatch}
          arrivalDate={record.arrivalDate}
        />
      )
    }
  ];
};
