import moment from 'moment';


// 更改数据符合接口定义
export const formatter = (list = [null, null]) => {
  const [start, end] = list;
  return start && end ? [moment(start).valueOf(), moment(end).valueOf()] : [];
};
