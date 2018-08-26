import { getMillisecondForSecondArr } from 'utils/datetime';

/**
 * 售后申请列表搜素数据格式化
 * @param {*} param0
 */
export const transformSearchParam = ({ pageInfo, ...query }) => {
  const { payTime, finishTime, orderTime, project = [], applyTime, ...other } = query;

  // const { value: [provinceId, cityId, areaId] = [] } = region;
  const [,, communityId] = project;
  let rangeTime = {};
  // if (applyTime){
  if (applyTime) {
    rangeTime = getMillisecondForSecondArr(applyTime, '');
  }

  const params = {
    pageInfo,
    ...other,
    communityId,
    ...rangeTime,
  };


  return params;
};
