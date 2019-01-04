/**
 * 房间类型
 */
export const houseTypeList = [
  { value: '', label: '全部', color: 'none', checked: false },
  { value: 1002, label: '预订房', color: 'blue', checked: false },
  { value: 1004, label: '今日离', color: 'violet', checked: false },
  { value: 1003, label: '在住房', color: 'green', checked: false },
  { value: 1001, label: '空房', color: 'white', checked: false },
  { value: 1005, label: '维修房', color: 'red', checked: false },
  { value: 1006, label: '自留房', color: 'black', checked: false },
];

/**
 * 房间类型-远期房态
 */
export const forwardHouseTypeList = [
  { value: 10021, label: '团队预订', color: 'lightBlue' },
  { value: 10022, label: '散客预订', color: 'blue' },
  { value: 1003, label: '在住房', color: 'green' },
  { value: 1005, label: '维修房', color: 'red' },
  { value: 1006, label: '自留房', color: 'black' },
];

/**
 * 房态标签
 */
export const statusList = [
  // { value: 1, label: '脏房' },
  // { value: 2, label: '散客入住' },
  // { value: 3, label: '团队入住' },
  // { value: 4, label: '欠款' },
  // { value: 5, label: '叫醒' },
  // { value: 6, label: '今日离' },
  // { value: 7, label: '锁定' },
  // { value: 8, label: '维修' },
  // { value: 9, label: '自留占用' },
  // { value: 10, label: '未来预订' },
  { value: '3001', label: '脏房', iconNum: 1 },
  { value: '3002', label: '散客入住', iconNum: 2 },
  { value: '3003', label: '团队入住', iconNum: 3 },
  { value: '3004', label: '欠款', iconNum: 4 },
  { value: '3007', label: '叫醒', iconNum: 5 },
  { value: '3010', label: '今日离', iconNum: 6 },
  { value: '3008', label: '锁定', iconNum: 7 },
  { value: '3006', label: '维修', iconNum: 8 },
  { value: '3005', label: '自留占用', iconNum: 9 },
  { value: '3009', label: '未来预订', iconNum: 10 },
];

/* 今日房态操作列表 */
export const menuList = [
  { label: '散客步入', value: 1, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_INDIVIDUALCHECKIN' },
  { label: '房间维修', value: 2, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_MAINTENANCE' },
  { label: '修改维修', value: 3, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_REVISEMAINTENANCE' },
  { label: '完成维修', value: 4, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_REVISEMAINTENANCE' },
  { label: '房间自留', value: 5, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_RETENTION' },
  { label: '修改自留占用', value: 6, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_REVISERETENTION' },
  { label: '结束自留占用', value: 7, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_REVISERETENTION' },
  { label: '散客预订', value: 8, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_INDIVIDUALRESERVE' },
  { label: '查看预订详情', value: 9, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_RESERVATIONDETAILS' },
  { label: '预订抵达', value: 10, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_ARRIVEL' },
  { label: '取消预订', value: 11, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_CANCEL' },
  { label: '查看登记详情', value: 12, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_CHECKINDETAILS' },
  { label: '房间延住', value: 13, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_EXTEND' },
  { label: '结账退房', value: 14, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_VACATE' },
  { label: '设置为脏房', value: 15, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_CLEAN' },
  { label: '打扫干净', value: 16, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_CLEAN' },
  { label: '新增叫醒', value: 17, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_WAKEUP' },
  { label: '取消叫醒', value: 18, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_WAKEUP' },
  { label: '房间锁定', value: 19, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_LOCK' },
  { label: '解除锁定', value: 20, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_LOCK' },
  { label: '查看未来预订单', value: 21, permiss: 'PMS_ROOMSTATUS_TODAYROOMSTATUS_FUTURERESERVATION' },
];

/* 远期房态操作列表 */
export const forwardMenuList = [
  { label: '房间维修', value: 1, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_MAINTENANCE' },
  { label: '房间自留', value: 2, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_RETENTION' },
  { label: '散客预订', value: 3, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_ROOMRESERVATION' },
  { label: '查看预订详情', value: 4, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_RESERVATIONDETAILS' },
  { label: '预订抵达', value: 5, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_ARRIVEL' },
  { label: '取消预订', value: 6, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_CANCEL' },
  { label: '查看登记详情', value: 7, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_REGISTERDETAILS' },
  { label: '房间延住', value: 8, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_EXTEND' },
  { label: '结账退房', value: 9, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_VACATE' },
  { label: '完成维修', value: 10, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_REVISEMAINTENANCE' },
  { label: '结束占用', value: 11, permiss: 'PMS_ROOMSTATUS_FORWARDROOMSTATUS_REVISERETENTION' },
];

export const getColor = (type) => {
  let color = 'white';
  switch (parseInt(type, 10)) {
    case 1001:
      color = 'white';
      break;
    case 1002:
      color = 'blue';
      break;
    case 10021:
      color = 'lightBlue';
      break;
    case 10022:
      color = 'blue';
      break;
    case 1003:
      color = 'green';
      break;
    case 1004:
      color = 'violet';
      break;
    case 1005:
      color = 'red';
      break;
    case 1006:
      color = 'black';
      break;
    default:
      color = 'white';
      break;
  }
  return color;
};

/* 过滤房态 */
export const isShow = (roomStatusCode, typeList) => {
  let visiable = true;
  const typeArr = [];
  typeList.map((v) => {
    if (v.checked) {
      visiable = false;
      typeArr.push(v.value);
    }
    return v;
  });
  if (visiable === false) {
    visiable = typeArr.includes(parseInt(roomStatusCode, 10));
  }
  return visiable;
};

/* 过滤没有子房态的类型 */
export const hasChild = (arr, typeList) => {
  let visiable = false;
  arr.map((v) => {
    if (isShow(v.roomStatusCode, typeList)) {
      visiable = true;
    }
    return v;
  });
  return visiable;
};

/* 获取房间数量 */
export const getHouseNum = (statusCode, statusCounts) => {
  let count = 0;
  if (statusCounts && statusCounts.length > 0) {
    if (statusCode) {
      statusCounts.map((v) => {
        if (statusCode === parseInt(v.statusCode, 10)) {
          count = v.count;
        }
        return v;
      });
    } else {
      statusCounts.map((v) => {
        count += v.count;
        return count;
      });
    }
  }
  return count;
};

/* 获取相应菜单 */
export const getMenuList = (house) => {
  const arrayRemove = (arr, valList) => {
    valList.map((v) => {
      const index = arr.indexOf(v);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return '';
    });
    return arr;
  };

  let menuIndexArr = [];
  const btnList = [];
  switch (parseInt(house.roomStatusCode, 10)) {
    case 1001:
      menuIndexArr = [1, 2, 5, 8, 15, 19];
      if (house.roomStatusTagCodeList) {
        house.roomStatusTagCodeList.map((v) => {
          switch (v) {
            case '3001':
              menuIndexArr.push(16);
              menuIndexArr = arrayRemove(menuIndexArr, [1, 15, 19]);
              break;
            case '3008':
              menuIndexArr.push(20);
              menuIndexArr = arrayRemove(menuIndexArr, [1, 2, 5, 8, 19]);
              break;
            case '3009':
              menuIndexArr.push(21);
              break;
            default:
              break;
          }
          return v;
        });
      }
      break;
    case 1002:
      menuIndexArr = [8, 9, 10, 11, 15];
      if (house.roomStatusTagCodeList) {
        house.roomStatusTagCodeList.map((v) => {
          switch (v) {
            case '3001':
              menuIndexArr.push(16);
              menuIndexArr = arrayRemove(menuIndexArr, [15]);
              break;
            case '3009':
              menuIndexArr.push(21);
              break;
            default:
              break;
          }
          return v;
        });
      }
      break;
    case 1003:
    case 1004:
      menuIndexArr = [8, 12, 13, 14, 15, 17];
      if (house.gresParentId) {
        menuIndexArr = [8, 9, 12, 13, 14, 15, 17];
      }
      if (house.roomStatusTagCodeList) {
        house.roomStatusTagCodeList.map((v) => {
          switch (v) {
            case '3001':
              menuIndexArr.push(16);
              menuIndexArr = arrayRemove(menuIndexArr, [15]);
              break;
            case '3007':
              menuIndexArr.push(18);
              menuIndexArr = arrayRemove(menuIndexArr, [17]);
              break;
            case '3009':
              menuIndexArr.push(21);
              break;
            default:
              break;
          }
          return v;
        });
      }
      break;
    case 1005:
      menuIndexArr = [3, 4, 8, 15];
      if (house.roomStatusTagCodeList) {
        house.roomStatusTagCodeList.map((v) => {
          switch (v) {
            case '3001':
              menuIndexArr.push(16);
              menuIndexArr = arrayRemove(menuIndexArr, [15]);
              break;
            case '3009':
              menuIndexArr.push(21);
              break;
            default:
              break;
          }
          return v;
        });
      }
      break;
    case 1006:
      menuIndexArr = [6, 7, 8, 15];
      if (house.roomStatusTagCodeList) {
        house.roomStatusTagCodeList.map((v) => {
          switch (v) {
            case '3001':
              menuIndexArr.push(16);
              menuIndexArr = arrayRemove(menuIndexArr, [15]);
              break;
            case '3009':
              menuIndexArr.push(21);
              break;
            default:
              break;
          }
          return v;
        });
      }
      break;
    default:
      menuIndexArr = [];
      break;
  }
  menuIndexArr.map((v) => {
    btnList.push(menuList[v - 1]);
    return v;
  });
  return btnList;
};

/* 获取远期房态相应菜单 */
export const getForwardMenuList = (code, room) => {
  let menuIndexArr = [];
  const btnList = [];
  switch (parseInt(code, 10)) {
    case 1001:
      menuIndexArr = [1, 2, 3];
      break;
    case 10021:
    case 10022:
      menuIndexArr = [4, 5, 6];
      break;
    case 1003:
      menuIndexArr = [7, 8, 9];
      if (room.gresParentId) {
        menuIndexArr = [4, 7, 8, 9];
      }
      break;
    case 1005:
      menuIndexArr = [10];
      break;
    case 1006:
      menuIndexArr = [11];
      break;
    default:
      menuIndexArr = [1, 2, 3];
      break;
  }
  menuIndexArr.map((v) => {
    btnList.push(forwardMenuList[v - 1]);
    return v;
  });
  return btnList;
};

export const getWeekStr = (time) => {
  let str = '';
  let num = -1;
  if (time) {
    num = new Date(time).getDay();
    switch (num) {
      case 0:
        str = '周日';
        break;
      case 1:
        str = '周一';
        break;
      case 2:
        str = '周二';
        break;
      case 3:
        str = '周三';
        break;
      case 4:
        str = '周四';
        break;
      case 5:
        str = '周五';
        break;
      case 6:
        str = '周六';
        break;
      default:
        break;
    }
  }
  return str;
};

export const getForwardStyle = (time, startTime, endTime, roomStatusCode) => {
  const dayTime = 24 * 60 * 60 * 1000;
  let startCount = parseInt((startTime - time) / dayTime, 10);
  let endCount = parseInt((endTime - time) / dayTime, 10);
  // console.log({ startCount, endCount });
  if (startTime < time) {
    startCount = -1;
  }
  const statusCode = parseInt(roomStatusCode, 10);
  if (startCount === endCount) {
    endCount += 1;
  } else if (statusCode !== 10021 && statusCode !== 10022 && statusCode !== 1003) {
    endCount += 1;
  }
  if (startCount <= 0) {
    startCount = 0;
  }
  if (endCount <= 0) {
    endCount = 0;
  }
  return {
    left: startCount * 50,
    width: (endCount - startCount) * 50,
  };
};
