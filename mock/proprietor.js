function list(req, res) {
  const result = {
    "msgCode": 200,
    "busCode": 0,
    "message": "请求成功",
    "data": {
      "result": {
        "totalCount": 3,
        "totalPage": 2,
        "pageSize": 2,
        "currPage": 1,
        "dataList": [{
          "id": 1,
          "name": "纷程平台",
          phone: '123****5555',
          room: '江门恩平恒大泉都1栋7楼707房',
          idNum: '44060219991111****'
        }, {
          "id": 2,
          "name": "纷程平台",
          phone: '123****5555',
          room: '江门恩平恒大泉都1栋7楼707房',
          idNum: '44060219991111****'
        }, {
          "id": 3,
          "name": "纷程平台",
          phone: '123****5555',
          room: '江门恩平恒大泉都1栋7楼707房',
          idNum: '44060219991111****'
        }],
        "firstPage": true,
        "lastPage": true
      }
    }
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  list,
};
