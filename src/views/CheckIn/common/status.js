import _ from 'lodash';

// 客单状态: 1、待入住 2、在住 3、离店 4、 取消  5、 失约(no show)  6、部分入住
// 修改,添加费用,退房,联房,延住,开发票,打印, 补结账,开发票,打印
// 排房号,入住,取消,延到,no show,查看
export const GRES_STATE = {
  willCheckIn: {
    value: 1,
    label: '待入住',
  },
  checkIn: {
    value: 2,
    label: '在住',
  },
  checkOut: {
    value: 3,
    label: '离店',
  },
  cancel: {
    value: 4,
    label: '取消',
  },
  noShow: {
    value: 5,
    label: 'no show', //  失约
  },
  partIn: {
    value: 6,
    label: '部分入住',
  },
};

export const OPERATIONS = [{
  value: 0,
  label: '修改',
}, {
  value: 1,
  label: '添加费用',
}, {
  value: 2,
  label: '退房',
}, {
  value: 3,
  label: '联房',
}, {
  value: 4,
  label: '延住',
}, {
  value: 5,
  label: '查看',
}, {
  value: 6,
  label: 'no show',
}, {
  value: 7,
  label: '补结账',
}, {
  value: 8,
  label: '开发票',
}, {
  value: 9,
  label: '打印',
}, {
  value: 10,
  label: '排房号',
}, {
  value: 11,
  label: '入住',
}, {
  value: 12,
  label: '取消',
}, {
  value: 13,
  label: '延到',
}];


// 订单状态：[可以操作的功能]
export const STATUS_TO_OPERATION = {
  // 预订单管理
  order: {
    // 待入住1: 修改0，排房号10，入住11，取消12，延到13，，noShow 6
    [GRES_STATE.willCheckIn.value]: [0, 10, 11, 12, 13, 6],
    // 部分入住6: 修改0，排房号10，入住11
    [GRES_STATE.partIn.value]: [0, 10, 11],
    // 已入住2/已取消4/noShow5 : 查看5，
    [GRES_STATE.checkIn.value]: [5],
    [GRES_STATE.cancel.value]: [5],
    [GRES_STATE.noShow.value]: [5],
  },

  // 团队预订及登记
  team: {
    // 待入住1: 修改0，排房号10，入住11，取消12，延到13，noShow 6
    [GRES_STATE.willCheckIn.value]: [0, 10, 11, 12, 13, 6],
    // 部分入住6: 修改0，排房号10，入住11，退房2
    [GRES_STATE.partIn.value]: [0, 10, 11, 2],
    // 已入住2: 查看5，，退房2，开发票8
    [GRES_STATE.checkIn.value]: [5, 2, 8],
    // 已离店3: 查看5，，开发票8，补结账7
    [GRES_STATE.checkOut.value]: [5, 8/*, 7*/], // 团队的不能补结账
    // 已取消4/noShow5: 查看5，
    [GRES_STATE.cancel.value]: [5],
    [GRES_STATE.noShow.value]: [5],
  },

  // 入住登记单管理
  checkIn: {
    // 在住2: 修改0，添加费用1，退房2，联房3，延住4，开发票8，
    [GRES_STATE.checkIn.value]: [0, 1, 2, 3, 4, 8],
    // 离店3: 补结账7，开发票8，
    [GRES_STATE.checkOut.value]: [7, 8],
  },
};

// order 预订单搜索可选状态: 待入住，部分入住，已入住，离店, 已取消，No Show；
export const orderStatus = [
  GRES_STATE.willCheckIn, GRES_STATE.partIn,
  GRES_STATE.checkIn, GRES_STATE.checkOut,
  GRES_STATE.cancel, GRES_STATE.noShow,
];
// teamBooking 团队搜索可选状态: 待入住，部分入住，已入住，已离店，已取消，No Show
export const teamBookingStatus = [
  GRES_STATE.willCheckIn, GRES_STATE.checkIn,
  GRES_STATE.checkOut, GRES_STATE.cancel,
  GRES_STATE.noShow, GRES_STATE.partIn,
];
// checkIn 入住搜索可选状态: 在住I、离店O
export const checkInStatus = [GRES_STATE.checkIn, GRES_STATE.checkOut];

// 客单类别：0 不区分 ，1 散客， 2 团体
export const RES_TYPE = {
  all: {
    value: 0,
    label: '团体与散客',
  },
  person: {
    value: 1,
    label: '散客',
  },
  team: {
    value: 2,
    label: '团体',
  },
};

// 单据类型：1 预订单 2 入住单
export const GRES_TYPE = {
  order: {
    value: 1,
    label: '预订单',
  },
  checkIn: {
    value: 2,
    label: '入住单',
  },
};

export const QUERY_STATE = {
  In: {
    value: 'In',
    label: '在住',
  },
  All: {
    value: 'All',
    label: '所有登记单',
  },
  TodayWillIn: {
    value: 'TodayWillIn',
    label: '今日预抵',
  },
  TodayIn: {
    value: 'TodayIn',
    label: '今日已到',
  },
  TodayWillOut: {
    value: 'TodayWillOut',
    label: '今日预离',
  },
  TodayOut: {
    value: 'TodayOut',
    label: '今日已离',
  },
};

export const BATCH = {
  GroupTodayIn: QUERY_STATE.TodayIn.value,
  GroupTodayWillIn: QUERY_STATE.TodayWillIn.value,
  In: QUERY_STATE.In.value,
  PersonTodayIn: QUERY_STATE.TodayIn.value,
  PersonTodayWillIn: QUERY_STATE.TodayWillIn.value,
  TodayWillOut: QUERY_STATE.TodayWillOut.value,
};

export const CHECKOUT_STATE = [{
  value: 1,
  label: '现结',
},
{
  value: 2,
  label: '临时挂账',
},
{
  value: 3,
  label: '协议单位挂账',
},
];

export const INVOICE_HEADER = [{
  value: 1,
  label: '个人',
}, {
  value: 2,
  label: '公司',
}];
