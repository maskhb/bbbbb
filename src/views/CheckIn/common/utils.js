import moment from 'moment';

// 将[moment(),moment()]转为时间戳 , TODO: 临时丢这里
export const parseQueryDate = (query) => {
  const parsedQuery = { ...query };
  const { arrivalDateRange, departureDateRange, createdDateRange } = query;

  delete parsedQuery.beginCreatedTime;
  delete parsedQuery.endCreatedTime;
  delete parsedQuery.beginArrivalDate;
  delete parsedQuery.endArrivalDate;
  delete parsedQuery.beginDepartureDate;
  delete parsedQuery.endDepartureDate;

  if (createdDateRange instanceof Array && createdDateRange.length) { // 创建日期
    parsedQuery.beginCreatedTime = moment(createdDateRange[0]).startOf('day').valueOf();
    parsedQuery.endCreatedTime = moment(createdDateRange[1]).endOf('day').valueOf();
    delete parsedQuery.createdDateRange;
  }
  if (arrivalDateRange instanceof Array && arrivalDateRange.length) {
    parsedQuery.beginArrivalDate = moment(arrivalDateRange[0]).startOf('day').valueOf();
    parsedQuery.endArrivalDate = moment(arrivalDateRange[1]).endOf('day').valueOf();
  }
  if (departureDateRange instanceof Array && departureDateRange.length) {
    parsedQuery.beginDepartureDate = moment(departureDateRange[0]).startOf('day').valueOf();
    parsedQuery.endDepartureDate = moment(departureDateRange[1]).endOf('day').valueOf();
  }

  delete parsedQuery.createdDateRange;
  delete parsedQuery.departureDateRange;
  delete parsedQuery.arrivalDateRange;

  return parsedQuery;
};
