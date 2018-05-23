const format = 'YYYY-MM-DD HH:mm:ss';
const formatBirthDay = 'YYYY-MM-DD';
const d3Col0 = { lg: 6, md: 12, sm: 24 };
const d3Col1 = { xl: { span: 6, offset: 2 }, lg: 8, md: 12, sm: 24 };
const d3Col2 = { xl: { span: 14, offset: 2 }, lg: 8, md: 12, sm: 24 };

const d2Col = { lg: 12, md: 12, sm: 24 };
const expressCompanyListOptions = [{
//   label: 'EMS快递',
//   value: 1,
// }, {
//   label: '顺丰速运',
//   value: 2,
// }, {
//   label: '申通快递',
//   value: 3,
// }, {
//   label: '圆通速递',
//   value: 4,
// }, {
//   label: '中通快递',
//   value: 5,
// }, {
//   label: '百世汇通快递',
//   value: 6,
// }, {
//   label: '韵达快递',
//   value: 7,
// }, {
//   label: '宅急送',
//   value: 8,
// }, {
//   label: '天天快递',
//   value: 9,
// }, {
//   label: '德邦物流',
//   value: 10,
// }, {
//   label: '全峰快递',
//   value: 11,
// }, {
//   label: '京东快递',
//   value: 12,

  label: 'EMS快递',
  value: 'ems',
}, {
  label: '顺丰速运',
  value: 'shunfeng',
}, {
  label: '申通快递',
  value: 'shentong',
}, {
  label: '圆通快递',
  value: 'yuantong',
}, {
  label: '中通快递',
  value: 'zhongtong',
}, {
  label: '百世汇通',
  value: 'huitongkuaidi',
}, {
  label: '韵达快递',
  value: 'yunda',
}, {
  label: '宅急送',
  value: 'zhaijisong',
}, {
  label: '天天快递',
  value: 'tiantian',
}, {
  label: '德邦物流',
  value: 'debangwuliu',
}, {
  label: '全峰快递',
  value: 'quanfengkuaidi',
}, {
  label: '京东快递',
  value: 'jd',
}, {
  label: '联邦快递',
  value: 'lianbangkuaidi',
}, {
  label: '优速快递',
  value: 'yousuwuliu',
}, {
  label: '快捷快递',
  value: 'kuaijiesudi',
}, {
  label: '中国邮政',
  value: 'youzhengguonei',
}, {
  label: '微特派',
  value: 'weitepai',
}, {
  label: '龙邦速递',
  value: 'longbangwuliu',
}, {
  label: '速尔快递',
  value: 'suer',
}, {
  label: '万象物流',
  value: 'wanxiangwuliu',
}, {
  label: '大洋物件',
  value: 'dayangwuliu',
}, {
  label: 'DHL',
  value: 'dhl',
}, {
  label: '国通快递',
  value: 'guotongkuaidi',
}, {
  label: '增益快递',
  value: 'zengyisudi',
}, {
  label: '中铁物流',
  value: 'ztky',
}, {
  label: '中铁快运',
  value: 'zhongtiewuliu',
}, {
  label: '能达快递',
  value: 'ganzhongnengda',
}, {
  label: '如风达快递',
  value: 'rufengda',
}, {
  label: '赛澳递',
  value: 'saiaodimmb',
}, {
  label: '海红网送',
  value: 'haihongwangsong',
}, {
  label: '通和天下',
  value: 'tonghetianxia',
}, {
  label: '郑州建华',
  value: 'zhengzhoujianhua',
}, {
  label: '红马甲',
  value: 'sxhongmajia',
}, {
  label: '芝麻开门',
  value: 'zhimakaimen',
}, {
  label: '乐捷递',
  value: 'lejiedi',
}, {
  label: '立即送',
  value: 'lijisong',
}, {
  label: '银捷',
  value: 'yinjiesudi',
}, {
  label: '门对门',
  value: 'menduimen',
}, {
  label: '河北建华',
  value: 'hebeijianhua',
}, {
  label: '风行天下',
  value: 'fengxingtianxia',
}, {
  label: '尚橙',
  value: 'shangcheng',
}, {
  label: '新蛋奥硕',
  value: 'neweggozzo',
}, {
  label: '佳吉快运',
  value: 'jiejiwuliu',
}, {
  label: '安能物流',
  value: 'annengwuliu',
}];

export {
  format,
  formatBirthDay,
  d3Col0,
  d3Col1,
  d3Col2,
  d2Col,
  expressCompanyListOptions,
};
