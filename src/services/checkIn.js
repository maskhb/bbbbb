import request from '../utils/request';
// import moment from 'moment';

export const gresAdd = (params) => {
  return request('/fc/ht-fc-pms-server/gres/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresCancel = (params) => {
  return request('/fc/ht-fc-pms-server/gres/cancel', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresCancelLinkRoom = (params) => {
  return request('/fc/ht-fc-pms-server/gres/cancelLinkRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresAppendCheckOut = (params) => {
  return request('/fc/ht-fc-pms-server/gres/appendCheckOut', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresCheckOut = (params) => {
  return request('/fc/ht-fc-pms-server/gres/checkOut', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresDelay = (params) => {
  return request('/fc/ht-fc-pms-server/gres/delay', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresDelayArrivals = (params) => {
  return request('/fc/ht-fc-pms-server/gres/delayArrivals', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresDetails = (params) => {
  return request('/fc/ht-fc-pms-server/gres/details', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresDisableInvoice = (params) => {
  return request('/fc/ht-fc-pms-server/gres/disableInvoice', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresEditInvoice = (params) => {
  return request('/fc/ht-fc-pms-server/gres/editInvoice', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresInvoice = (params) => {
  return request('/fc/ht-fc-pms-server/gres/invoice', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresInvoiceList = (params) => {
  return request('/fc/ht-fc-pms-server/gres/invoiceList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresLinkRoom = (params) => {
  return request('/fc/ht-fc-pms-server/gres/linkRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresDirectLinkRoom = (params) => {
  return request('/fc/ht-fc-pms-server/gres/directLinkRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresGetLinkRooms = (params) => {
  return request('/fc/ht-fc-pms-server/gres/getLinkRooms', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresGetDepositInfo = (params) => {
  return request('/fc/ht-fc-pms-server/gres/getDepositInfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresNoshow = (params) => {
  return request('/fc/ht-fc-pms-server/gres/noshow', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresPreCheckOut = (params) => {
  return request('/fc/ht-fc-pms-server/gres/preCheckOut', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresSelectRoom = (params) => {
  return request('/fc/ht-fc-pms-server/gres/selectRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresSelectRoomType = (params) => {
  return request('/fc/ht-fc-pms-server/gres/selectRoomType', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresUpdate = (params) => {
  return request('/fc/ht-fc-pms-server/gres/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresListByPage = (params) => {
  // console.log(234, params.gresVO)
  //   let {arrivalDate, departureDate} = params?.gresVO;
  //   console.log(arrivalDate);

  // let a = arrivalDate[0]?.valueOf();
  // let b = departureDate[0]?.valueOf();
  // console.log(a,b)


  return request('/fc/ht-fc-pms-server/gres/listByPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const sourceList = (params) => {
  return request('/fc/ht-fc-pms-server/source/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const rateCodePage = (params) => {
  return request('/fc/ht-fc-pms-server/rateCode/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const roomPage = (params) => {
  return request('/fc/ht-fc-pms-server/room/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresRemainRoom = (params) => {
  return request('/fc/ht-fc-pms-server/gres/remainRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresSave = (params) => {
  return request('/fc/ht-fc-pms-server/gres/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const roomTypePage = (params) => {
  return request('/fc/ht-fc-pms-server/roomType/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const paymentItemPage = (params) => {
  return request('/fc/ht-fc-pms-server/paymentItem/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresPreCheckIn = (params) => {
  return request('/fc/ht-fc-pms-server/gres/preCheckIn', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresGetRoomRate = (params) => {
  return request('/fc/ht-fc-pms-server/gres/getRoomRate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const gresSearchRoom = (params) => {
  return request('/fc/ht-fc-pms-server/gres/searchRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const paymentMethodPage = (params) => {
  return request('/fc/ht-fc-pms-server/paymentMethod/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const businessTime = (params) => {
  return request('/fc/ht-fc-pms-server/nightAuditRecord/businessTime', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const transferAccount = (params) => {
  return request('/fc/ht-fc-pms-server/gres/transferAccount', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const preTransfer = (params) => {
  return request('/fc/ht-fc-pms-server/gres/preTransfer', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const selectDateRoomType = (params) => {
  return request('/fc/ht-fc-pms-server/gres/selectDateRoomType', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const sourcePage = (params) => {
  return request('/fc/ht-fc-pms-server/source/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export const serviceItemList = (params) => {
  return request('/fc/ht-fc-pms-server/serviceItem/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

//  服务单管理


// /serviceOrder/delete 根据条件删除数据(参数传serviceOrderId即可) 1
export const deleteServiceOrder = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/delete', {
    body: {
      ...params,
    },
  });
};

// /serviceOrder/details 查询详情 2
export const queryServiceOrderDetail = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/details', {
    body: {
      ...params,
    },
  });
};
// /serviceOrder/export 服务单导出 3

// 列表查询 4
export const queryServiceOrder = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/page', {
    body: {
      ...params,
    },
    pagination: true,
  });
};

// 分页获取在住/预留房间 4
export const queryRoomStayInAndReservePage = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/roomStayInAndReservePage', {
    body: {
      ...params,
    },
    pagination: true,
  });
};

// 新增 5
export const addServiceOrder = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/save', {
    body: {
      ...params,
    },
  });
};


// /serviceOrder/updateCompleted 更新完成状态(参数传serviceOrderId和isCompleted即可) 6
export const updateCompleted = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/updateCompleted', {
    body: {
      ...params,
    },
  });
};

// /serviceOrder/updateRemark 更新备注(参数传serviceOrderId和remark即可) 7
export const updateRemark = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/updateRemark', {
    body: {
      ...params,
    },
  });
};

// /serviceItem/list 查询服务项列表
export const queryServiceItemList = (params) => {
  return request('/fc/ht-fc-pms-server/serviceItem/list', {
    body: {
      ...params,
    },
  });
};

// 根据条件批量删除数据
export const batchDelete = (params) => {
  return request('/fc/ht-fc-pms-server/serviceOrder/batchDelete', {
    body: {
      ...params,
    },
  });
};
