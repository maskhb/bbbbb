import moment from 'moment';

/**
 * 获取开始时间毫秒值
 * @param {String} time
 * @param {Number} isTimeType 日期参数格式 0 YYYY-MM-DD  1 YYYY-MM-DD HH:MM 2 YYYY-MM-DD HH:MM:ss
 */
export function getStartMillisecond(time, isTimeType = 0) {
  let startTime = 0;

  if (time) {
    startTime = moment(moment(time).format(isTimeType === 0 ? 'YYYY-MM-DD 00:00:00.000' : (isTimeType === 1 ? 'YYYY-MM-DD HH:mm:00.000' : 'YYYY-MM-DD HH:mm:ss.000'))).valueOf();
  }

  return startTime;
}
/**
 * 获取结束时间毫秒值
 * @param {String} time
 * @param {Number} isTimeType 日期参数格式 0 YYYY-MM-DD  1 YYYY-MM-DD HH:MM 2 YYYY-MM-DD HH:MM:ss
 */
export function getEndMillisecond(time, isTimeType = 0) {
  let endTime = 0;

  if (time) {
    endTime = moment(moment(time).format(isTimeType === 0 ? 'YYYY-MM-DD 23:59:59.999' : (isTimeType === 1 ? 'YYYY-MM-DD HH:mm:59.999' : 'YYYY-MM-DD HH:mm:ss.999'))).valueOf();
  }

  return endTime;
}
/**
 * 格式化日期请求格式（开始结束时间 xxxStartTime,xxxEndTime）
 * prefix==null, startTime,endTime
 * @param {String} prefix 参数前缀
 * @param {Array} timeArr  日期参数 -- 组件获取的
 * @param {Number} isTimeType 日期参数格式 0 YYYY-MM-DD  1 YYYY-MM-DD HH:MM 2 YYYY-MM-DD HH:MM:ss
 */
export function getMillisecondForArr(timeArr, prefix, isTimeType = 0) {
  let startTime = 0;
  let endTime = 0;

  if (timeArr && timeArr.length === 2) {
    startTime = getStartMillisecond(timeArr[0], isTimeType);
    endTime = getEndMillisecond(timeArr[1], isTimeType);
  }

  if (prefix) {
    return {
      [`${prefix}StartTime`]: startTime,
      [`${prefix}EndTime`]: endTime,
    };
  } else {
    return {
      startTime,
      endTime,
    };
  }
}

/**
 * 格式化日期请求格式（开始结束时间 xxxStartTime,xxxEndTime）
 * prefix==null, startTime,endTime
 * @param {String} prefix 参数前缀
 * @param {Array} timeArr  日期参数 -- 组件获取的 格式 YYYY-MM-DD
 */
export function etMillisecondForDayArr(timeArr, prefix) {
  return getMillisecondForArr(timeArr, prefix);
}

/**
 * 格式化日期请求格式（开始结束时间 xxxStartTime,xxxEndTime）
 * prefix==null, startTime,endTime
 * @param {String} prefix 参数前缀
 * @param {Array} timeArr  日期参数 -- 组件获取的 格式 YYYY-MM-DD HH:MM
 */
export function getMillisecondForMinuteArr(timeArr, prefix) {
  return getMillisecondForArr(timeArr, prefix, 1);
}

/**
 * 格式化日期请求格式（开始结束时间 xxxStartTime,xxxEndTime）
 * prefix==null, startTime,endTime
 * @param {String} prefix 参数前缀
 * @param {Array} timeArr  日期参数 -- 组件获取的 格式 YYYY-MM-DD HH:MM:ss
 */
export function getMillisecondForSecondArr(timeArr, prefix) {
  return getMillisecondForArr(timeArr, prefix, 2);
}
