const format = 'YYYY-MM-DD HH:mm:ss';
const d3Col0 = { lg: 6, md: 12, sm: 24 };
const d3Col1 = { xl: { span: 6, offset: 2 }, lg: 8, md: 12, sm: 24 };

const expressCompanyListOptions = [{
  label: 'EMS快递',
  value: 1,
}, {
  label: '顺丰速运',
  value: 2,
}, {
  label: '申通快递',
  value: 3,
}, {
  label: '圆通速递',
  value: 4,
}, {
  label: '中通快递',
  value: 5,
}, {
  label: '百世汇通快递',
  value: 6,
}, {
  label: '韵达快递',
  value: 7,
}, {
  label: '宅急送',
  value: 8,
}, {
  label: '天天快递',
  value: 9,
}, {
  label: '德邦物流',
  value: 10,
}, {
  label: '全峰快递',
  value: 11,
}, {
  label: '京东快递',
  value: 12,
}];

export {
  format,
  d3Col0,
  d3Col1,
  expressCompanyListOptions,
};
