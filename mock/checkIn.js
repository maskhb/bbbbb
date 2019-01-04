function checkIn(req, res) {
  const result = {
    name: 'test',
    userid: '00000001',
    notifyCount: 12,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function sourceList(req, res) {
  const result = [{
    channelId: 123,
    createdBy: 'czn',
    createdTime: new Date().getTime(),
    sourceId: 111,
    sourceName: '业务来源1',
  }, {
    channelId: 123,
    createdBy: 'czn',
    createdTime: new Date().getTime(),
    sourceId: 112,
    sourceName: '员工推荐',
  }];

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function rateCodePage(req, res) {
  const result = [{
    createdBy: 'czn',
    createdTime: new Date().getTime(),
    rateCodeId: 111,
    rateCodeName: '业务来源1',
  }, {
    createdBy: 'czn',
    createdTime: new Date().getTime(),
    rateCodeId: 112,
    rateCodeName: '员工推荐',
  }];

  if (res && res.json) {
    res.json({
      currPage: 1,
      dataList: result,
      totalCount: 999,
    });
  } else {
    return result;
  }
}

function gresSelectRoomType(req, res) {
  const result = [{
    rate: 1000,
    roomQty: 1000,
    roomTypeId: 1000,
    roomTypeName: '海景房一号',
  }, {
    rate: 1900,
    roomQty: 1000,
    roomTypeId: 1001,
    roomTypeName: '海景房一号1',
  }, {
    rate: 11910,
    roomQty: 1000,
    roomTypeId: 1002,
    roomTypeName: '海景房一号2',
  }];

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function gresDetails(req, res) {
  const result = {
    gresId: 1,
    parentGresNo: 0,
    gresNo: 0,
    orgId: 7,
    guestName: '刘先生',
    groupName: null,
    phone: '18688888888',
    arrivalDate: new Date().getTime(),
    beginArrivalDate: 0,
    endArrivalDate: 0,
    departureDate: new Date().getTime(),
    beginDepartureDate: 0,
    endDepartureDate: 0,
    remainTime: new Date().getTime(),
    sourceId: 1,
    rateCodeId: 1,
    salesDeptId: 1,
    man: 1,
    woman: 0,
    children: 0,
    gender: 'M',
    resType: 1,
    gresType: 0,
    memo: null,
    status: '1',
    roomId: 0,
    roomNo: '101',
    roomRate: null,
    parentId: 0,
    linkId: 0,
    linkRooms: null,
    isDelete: 0,
    createdTime: 0,
    beginCreatedTime: 0,
    endCreatedTime: 0,
    updatedTime: 0,
    createdBy: 0,
    updatedBy: 0,
    gresRoomTypeVOs: [{
      bedPrice: 123,
      mealPrice: 1230,
      bedQty: 1,
      mealQty: 1,
      createdBy: 1,
      isDelete: 0,
      gresId: 12,
      gresRoomTypeId: 1001,
      businessDay: new Date().getTime(),
      createdTime: new Date().getTime(),
      updatedTime: new Date().getTime(),
      realPrice: 12000,
      roomQty: 2,
      roomStock: 12,
      roomTypeId: 1001,
      roomTypeName: '231232',
      stdPrice: 12100,
      updatedBy: 12100,
    }],
    gresGuestVOs: [{
      createdBy: 123,
      updatedBy: 123,
      createdTime: new Date().getTime(),
      updatedTime: new Date().getTime(),
      docNo: '11111111111111111111',
      docType: '',
      gender: 'F',
      gresGuestId: 123,
      gresId: 12,
      guestName: '陈卓囡',
      mobile: '13692699514',
      isDelete: 0,
    }],
    roomBookingVOs: null,
    roomBookingTotalVOs: [{
      orgId: 12,
      remainQty: 123,
      roomId: 1,
      roomQty: 1,
      roomTypeId: 1001,
      roomTypeName: '海景房',
      rooms: 2,
      list: [{
        arrivalDate: new Date().getTime(),
        createdTime: new Date().getTime(),
        departureDate: new Date().getTime(),
        updatedTime: new Date().getTime(),
        createdBy: 123,
        gresId: 12,
        isDelete: 0,
        orgId: 12,
        roomBookingId: 123,
        roomId: 12,
        roomNo: 12,
        roomRate: 1200,
        roomTypeId: 1001,
        status: 1,
        gresStatus: 'PI',
        updatedBy: 1,
      }, {
        arrivalDate: new Date().getTime(),
        createdTime: new Date().getTime(),
        departureDate: new Date().getTime(),
        updatedTime: new Date().getTime(),
        createdBy: 123,
        gresId: 12,
        isDelete: 0,
        orgId: 12,
        roomBookingId: 123,
        roomId: 13,
        roomNo: 121,
        roomRate: 1200,
        roomTypeId: 1001,
        status: 1,
        gresStatus: 'I',
        updatedBy: 1,
      }],
    }],
    gresAccountTotalVOs: [{
      accType: 2, // 账务类型 1 费用 2 收款 3 退款
      rate: 12300,
      accountDetails: [{
        accType: 2, // 账务类型 1 费用 2 收款 3 退款
        accountDate: new Date().getTime(),
        accountNo: new Date().getTime(),
        businessDay: new Date().getTime(),
        gresAccountId: new Date().getTime(),
        gresId: 12,
        itemId: 1,
        itemName: '',
        memo: '123ds',
        rate: 12300,
        userId: 12300,
        userName: '陈美女',
      }],
    }],
    gresAccountVOs: null,
    gresLogVOs: [{
      content: '你好，帅哥1111111111111111111111111111111111111111111111111111111111111111111111111',
      time: new Date().getTime(),
      type: 1,
      userName: '陈卓囡',
    }],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

const gresSelectRoom = (req, res) => {
  const result = [{
    buildingId: 1,
    floorId: 1,
    frontState: 'A',
    hkState: 'C',
    orgId: 12,
    phone: '13692699514',
    roomId: 12,
    roomNo: '12',
    roomTags: '123',
    status: 1,
  }, {
    buildingId: 1,
    floorId: 1,
    frontState: 'A',
    hkState: 'C',
    orgId: 12,
    phone: '13692699514',
    roomId: 13,
    roomNo: '13',
    roomTags: '123',
    status: 1,
  }, {
    buildingId: 1,
    floorId: 1,
    frontState: 'A',
    hkState: 'C',
    orgId: 14,
    phone: '13692699514',
    roomId: 14,
    roomNo: '14',
    roomTags: '123',
    status: 1,
  }];

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

export default {
  checkIn,
  sourceList,
  rateCodePage,
  gresSelectRoomType,
  gresDetails,
  gresSelectRoom,
};
