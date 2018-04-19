/*
 * @Author: wuhao
 * @Date: 2018-04-18 09:34:14
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-18 15:23:05
 *
 * 导出弹框 业务组件
 */

import React, { PureComponent } from 'react';

import ModalExport from './index';

class ModalExportBusiness extends PureComponent {
   static defaultProps = {};

   state = {}

   handleOk = async (values) => {
     const { dispatch, prefix: pubPrefix, dataUrl: pubDataUrl, convertParam } = this.props;
     const { exportFileName, prefix, totalCount, ...param } = values;

     // repParam prefix dataUrl param page
     let cParam = {};
     if (convertParam) {
       cParam = convertParam(values);
     }

     const repParam = {
       dataUrl: cParam?.dataUrl || pubDataUrl,
       prefix: cParam?.prefix || prefix || pubPrefix,
       param: JSON.stringify({
         ...(cParam?.param || param),
       }),
       page: {
         pageSize: 500,
         totalCount: cParam?.totalCount || totalCount || 1,
       },
     };

     await dispatch({
       type: 'exports/startExportFile',
       payload: repParam,
     });

     const { exports } = this.props;
     const { startExportFile } = exports;

     return {
       ...startExportFile,
       totalCount: totalCount || cParam?.totalCount || 1,
       sucTitle: cParam?.sucTitle,
     };
   }

   render() {
     return (
       <ModalExport
         {...this.props}
         onOk={this.handleOk}
       />
     );
   }
}

export default ModalExportBusiness;
