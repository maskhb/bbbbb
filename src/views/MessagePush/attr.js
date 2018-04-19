const messagePushOptions = {
  FGYHSJ: [
    { label: '用户', value: '1', key: 1 },
    { label: '商家', value: '2', key: 2 },
  ],
  CFTJ: [
    { label: '注册或登录发验证码', value: '1', key: 1 },
    { label: '找回密码发验证码', value: '2', key: 2 },
    { label: '下单支付成功通知用户', value: '3', key: 3 },
    { label: '定制商品订单通知用户', value: '4', key: 4 },
    { label: '定制商品订单通知商家', value: '5', key: 5 },
    { label: '下单支付成功通知商家', value: '6', key: 6 },
    { label: '退款成功通知用户', value: '7', key: 7 },
  ],
  YWLX: [
    { label: '家居', value: '1', key: 1 },
    { label: '密蜜', value: '2', key: 2 },
  ],
  TSJD: [
    { label: '计划推送', value: '1', key: 1 },
    { label: '正在推送', value: '2', key: 2 },
    { label: '推送完成', value: '3', key: 3 },
  ],
  YXJ: [
    { label: '高', value: '1', key: 1 },
    { label: '中', value: '2', key: 2 },
    { label: '低', value: '3', key: 3 },
  ],
  MBYH: [
    { label: '单个用户', value: '1', key: 1 },
    { label: '指定手机列表', value: '2', key: 2 },
  ],
  getLabelByValue: (name, value) => {
    if (this[name]) {
      this[name].forEach((v) => {
        if (Number(v.value) === Number(value)) {
          return v.label;
        }
      });
    }
  },
};

export default messagePushOptions;
