/*
 * @Author: wuhao
 * @Date: 2018-04-18 09:48:09
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-18 11:10:50
 *
 * 导出接口
 */
import request from '../utils/request';

/**
 * 公共异步导出接口
 * @param {prefix:Number,dataUrl:String,param:String,page:Object} params
 *
 * prefix 业务码
 * dataUrl 业务方提供的Http Controller API接口
 * param 查询参数
 * page 分页参数
 *    {pageSize:Number,totalCount:Number}
 *    pageSize 每页记录数 一般每页不超过500条
 *    totalCount 估计总记录数
 */
async function startExportFile(params) {
  return request('/json/pub-export-api/export/startExportFile', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  startExportFile,
};
