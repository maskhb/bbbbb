import React from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { getOptionLabelForValue } from 'utils/utils';
import { fenToYuan } from 'utils/money';
import InvoiceModal from 'views/CheckIn/common/InvoiceModal';
import CancelModal from 'views/CheckIn/common/CancelModal';
import Authorized from 'utils/Authorized';
import checkOptions from '../attr';

const format = 'YYYY-MM-DD';

const permissionArr = [{ // 散客入住
  cancel: 'PMS_CHECKIN_INDIVIDUALRESERVATION_CANCEL', // 取消
  delay: 'PMS_CHECKIN_INDIVIDUALRESERVATION_DELAY', // 延到
  noShow: 'PMS_CHECKIN_INDIVIDUALRESERVATION_NOSHOW', // noShow
  edit: 'PMS_CHECKIN_INDIVIDUALRESERVATION_EDIT', // 修改、入住、排房号
  returnHouse: 'FALSE', // 退房
  delayArrival: 'FALSE', // 延住
  link: 'FALSE', // 联房
  ticket: 'FALSE', // 开发票
  add: 'FALSE', // 补结账
}, { // 团队预定
  returnHouse: 'FALSE', // 退房
  delayArrival: 'FALSE', // 延住
  cancel: 'PMS_CHECKIN_GROUPRESERVATION_CANCEL', // 取消
  delay: 'PMS_CHECKIN_GROUPRESERVATION_DELAY', // 延到
  noShow: 'PMS_CHECKIN_GROUPRESERVATION_NOSHOW', // noShow
  edit: 'PMS_CHECKIN_GROUPRESERVATION_EDIT', // 修改、入住、排房号
  link: 'FALSE', // 联房
  ticket: 'PMS_CHECKIN_GROUPRESERVATION_INVOICE', // 开发票
  add: 'PMS_CHECKIN_GROUPRESERVATION_SUPPLYACCOUNT', // 补结账
}, { // 入住
  cancel: 'FALSE', // 取消
  delay: 'FALSE', // 延到
  returnHouse: 'PMS_CHECKIN_CHECKINREGISTER_VACATE', // 退房
  delayArrival: 'PMS_CHECKIN_CHECKINREGISTER_EXTEND', // 延住
  noShow: 'FALSE', // noShow
  edit: 'PMS_CHECKIN_CHECKINREGISTER_EDIT', // 修改、添加费用
  link: 'PMS_CHECKIN_CHECKINREGISTER_UNITEROOMS', // 联房
  ticket: 'PMS_CHECKIN_CHECKINREGISTER_INVOICE', // 开发票
  add: 'PMS_CHECKIN_CHECKINREGISTER_SUPPLYACCOUNT', // 补结账
}];
export default (obj, type) => {
  const columns = [
    {
      title: type === 1 ? '预订单号' : '登记单号',
      dataIndex: 'gresNo',
    },
    {
      title: '团队名称',
      dataIndex: 'groupName',
    },
    {
      title: type === 3 ? '入住人' : '预订人',
      dataIndex: 'guestName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: type === 3 ? '房间' : '房型',
      dataIndex: 'roomTypeNo',
    },
    {
      title: '总价（元）',
      dataIndex: 'roomRate',
      render: (val) => {
        return fenToYuan(val);
      },
    },
    {
      title: '入离店日期',
      dataIndex: 'arrivalDate',
      render: (val, row) => {
        return `${moment(row.arrivalDate).format(format)}～${moment(row.departureDate).format(format)}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: getOptionLabelForValue(checkOptions.ZT),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (val, row) => {
        const showEdit = row.status === 1 || row.status === 2 || row.status === 6; // 待入住、在住、部分入住
        // 待入住、部分入住且type为应到未到（散客和团队） type = 1,2; status = 1,6 显示排房号、入住、no-show
        const showOrder = type !== 3 && (row.status === 1 || row.status === 6);
        // type = 1, status = 1,2; type = 2, status = 1 显示取消
        const showCancel = (type === 1 && (row.status === 1 || row.status === 2)) ||
          (type === 2 && row.status === 1);
        // 显示延到
        const showDelayArr = type !== 3 && row.status === 1;
        // type = 2, status = 2,6; type = 3, status = 2 显示退房
        const showReturn = (type === 2 && (row.status === 2 || row.status === 6)) ||
          (type === 3 && row.status === 2);
        const showGetTicket = (type === 2 && row.status === 3) || type === 3; // 显示开发票
        const showDelay = type === 3 && row.status === 2; // 显示延住、添加费用
        const showAddFee = type !== 1 && row.status === 3; // 显示补结账
        const edit = showEdit ? <Link to={`/checkin/${type === 3 ? 'checkinform' : 'orderform'}/edit/${row.gresId}`}><a style={{ marginRight: 10 }}>修改</a></Link> : '';
        const order = showOrder ? <Link to={`/checkin/${type === 1 ? 'orderform' : 'teambooking'}/edit/${row.gresId}?type=BookRoomList`}><a style={{ marginRight: 10 }}>排房号</a></Link> : '';
        const inHouse = showOrder ? <Link to={`/checkin/${type === 1 ? 'orderform' : 'teambooking'}/edit/${row.gresId}?type=BookRoomList`}><a style={{ marginRight: 10 }}>入住</a></Link> : '';
        const cancel = ( // 取消
          showCancel ? (
            <Authorized authority={[permissionArr[type - 1].cancel]}>
              <span style={{ marginRight: 10 }}>
                <CancelModal
                  gresId={row.gresId}
                  dispatch={obj.props.dispatch}
                  checkIn={obj.props.checkIn}
                  onOk={obj.search && obj.search.handleSearch}
                />
              </span>
            </Authorized>
          ) : ''
        );
        const delay = ( // 延到
          showDelayArr ? (
            <Authorized authority={[permissionArr[type - 1].delay]}>
              <a
                style={{ marginRight: 10 }}
                onClick={obj.delayModalShow.bind(obj, row, 'delay')}
              >
                延到
              </a>
            </Authorized>
          ) : ''
        );
        const noShow = (
          showOrder ? (
            <Authorized authority={[permissionArr[type - 1].noShow]}>
              <a
                style={{ marginRight: 10 }}
                onClick={obj.cancelModalShow.bind(obj, row, 'noShow')}
              >
                No Show
              </a>
            </Authorized>
          ) : ''
        );
        const addFee = showDelay ? (
          <Authorized authority={[permissionArr[type - 1].edit]}>
            <Link to={`/checkin/checkinform/edit/${row.gresId}?type=AccountInfo`} style={{ marginRight: 10 }}>添加费用</Link>
          </Authorized>
        ) : '';
        const backHouse = showReturn ? (
          <Authorized authority={[permissionArr[type - 1].returnHouse]}>
            <a
              style={{ marginRight: 10 }}
              onClick={obj.returnModalShow.bind(obj, row, 'return')}
            >
              退房
            </a>
          </Authorized>
        ) : '';
        const appendBtn = showAddFee ? (
          <Authorized authority={[permissionArr[type - 1].add]}>
            <a
              style={{ marginRight: 10 }}
              onClick={obj.returnModalShow.bind(obj, row, 'appendCheckOut')}
            >
              补结账
            </a>
          </Authorized>
        ) : '';
        const addTime = showDelay ? (
          <Authorized authority={[permissionArr[type - 1].delayArrival]}>
            <a
              style={{ marginRight: 10 }}
              onClick={obj.delayModalShow.bind(obj, row, 'stayLong')}
            >
              延住
            </a>
          </Authorized>
        ) : '';
        const connectHouse = (type === 3 && row.resType === 1 && row.status === 2) ? (
          <Authorized authority={[permissionArr[type - 1].link]}>
            <a
              style={{ marginRight: 10 }}
              onClick={obj.linkModalShow.bind(obj, row)}
            >
              联房
            </a>
          </Authorized>
        ) : '';
        const getTicket = showGetTicket ? (
          <Authorized authority={[permissionArr[type - 1].ticket]}>
            <InvoiceModal
              gresId={row.gresId}
              dispatch={obj.props.dispatch}
            />
          </Authorized>
        ) : '';
        return (
          <div>
            { edit }
            { order }
            { inHouse }
            { cancel }
            { delay }
            { addFee }
            { backHouse }
            { appendBtn }
            { addTime }
            { connectHouse }
            { getTicket }
            { noShow }
          </div>
        );
      },
    },
  ];
  if (type !== 3) {
    columns.splice(5, 1);
  }
  if (type === 2) {
    columns.splice(0, 1);
  } else {
    columns.splice(1, 1);
  }
  return columns;
};
