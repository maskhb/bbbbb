function current(req, res) {
  const result = {
    name: '张鹏',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    notifyCount: 12,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

function login(req, res) {
  const result = {
    msgCode: 200,
    status: 'ok',
    data: {
      result: process.env.DETAULT_TOKEN || 'fdspfdps',
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  current,
  login,
};
