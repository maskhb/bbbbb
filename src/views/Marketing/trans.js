/*
 * @Author: nic
 * @Date: 2018-05-05 17:59:45
 * @Last Modified by: nic
 * @Last Modified time: 2018-06-26 17:08:48
 */
import moment from 'moment';

export const dateToSec = (arr, type = 0, log = 0) => {
  let TimeStyle = '';
  let startRegTime = 0;
  let endRegTime = 0;
  let startTime = 0;
  let endTime = 0;

  if (type === 0) TimeStyle = 'YYYY-MM-DD 23:59:59.999';
  if (type === 1) TimeStyle = 'YYYY-MM-DD HH:mm:59.999';
  if (type === 2) TimeStyle = 'YYYY-MM-DD HH:mm:ss.999';

  if (arr && arr.length === 2) {
    if (log === 1) {
      startTime = moment(moment(arr[0]).format(TimeStyle)).valueOf();
      endTime = moment(moment(arr[1]).format(TimeStyle)).valueOf();
      return {
        startTime,
        endTime,
      };
    } else {
      startRegTime = moment(moment(arr[0]).format(TimeStyle)).valueOf();
      endRegTime = moment(moment(arr[1]).format(TimeStyle)).valueOf();
      return {
        startRegTime,
        endRegTime,
      };
    }
  }
};

export const transParams = ({ pageInfo, ...query }) => {
  const { createdTime, ...other } = query;


  const params = {
    businessType: 2,
    pageInfo,
    ...dateToSec(createdTime),
    ...other,
  };

  return params;
};

export const transLogParams = ({ pageInfo, operatorUserId, ...query }) => {
  const { operateTime, ...other } = query;


  const params = {
    pageInfo,
    operatorUserId: operatorUserId || null,
    ...dateToSec(operateTime, 0, 1),
    ...other,
  };

  return params;
};

export const memberStatusOptions = [
  {
    label: '已激活',
    value: 0,
  },
  {
    label: '已冻结',
    value: 1,
  },
];
export const genderOptions = [
  {
    label: '保密',
    value: 0,
  },
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 2,
  },
];

export const channelOptions = [
  {
    label: 'IOS',
    value: 1,
  },
  {
    label: 'Android',
    value: 2,
  },
  {
    label: '微信',
    value: 3,
  },
  {
    label: 'PC',
    value: 4,
  },
  {
    label: '管理员创建',
    value: 5,
  },
  {
    label: '线下导入',
    value: 6,
  },
];

export const businessTypeOptions = [
  {
    label: '密蜜电商',
    value: 1,
  },
  {
    label: '密蜜家居',
    value: 2,
  },
  {
    label: '密蜜家装',
    value: 3,
  },
  {
    label: '运营后台',
    value: 4,
  },
  {
    label: '物业后台',
    value: 5,
  },
];

export const operateTypeOptions = [
  {
    label: '新增会员',
    value: 4,
  },
  {
    label: '冻结会员',
    value: 5,
  },
  {
    label: '激活会员',
    value: 6,
  },
  {
    label: '编辑会员',
    value: 7,
  },
  {
    label: '修改密码',
    value: 8,
  },
  {
    label: '导入会员',
    value: 9,
  },
];
