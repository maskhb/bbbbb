/*
 * @Author: wuhao
 * @Date: 2018-04-18 09:34:14
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-17 15:15:29
 *
 * 导出弹框 业务组件
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { message } from 'antd';

import { goTo } from 'utils/utils';

import { toFullPath } from 'utils/request/utils';

import ModalExport from './index';
import ResultHint from './ResultHint';
import ResultPrompt from './ResultPrompt';
import AdvancePrompt from './AdvancePrompt';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class ModalExportBusiness extends PureComponent {
   static defaultProps = {};

   state = {}

   getEnvs = () => {
     return [
       'dev',
       'sit',
       'stg',
       'test',
       'fix',
       'stress',
     ];
   }

   getPrefix = (dataUrl = '', oldServiceUrl) => {
     if (dataUrl.indexOf('http') === 0) {
       return dataUrl;
     }
     const { hostname } = location;

     let env = 'prd';
     const envList = this.getEnvs();
     envList.forEach((item) => {
       if (hostname?.indexOf(item) > -1) {
         env = item;
       }
     });

     if (hostname === 'localhost') {
       env = 'dev';
     } else if (env === 'prd' && oldServiceUrl) {
       env = 'release';
     }

     if (oldServiceUrl) {
       if (env === 'release') {
         return `http://ht-${oldServiceUrl}.htmimi.com${dataUrl.indexOf('/') === 0 ? '' : '/'}${dataUrl}`;
       } else if (env === 'stg') {
         return `http://ht-${oldServiceUrl}-${env}.htmimi.com${dataUrl.indexOf('/') === 0 ? '' : '/'}${dataUrl}`;
       } else {
         return `http://${env}.${oldServiceUrl}.hd${dataUrl.indexOf('/') === 0 ? '' : '/'}${dataUrl}`;
       }
     } else {
       return `http://zuul-internal-${env}.hd${dataUrl.indexOf('/') === 0 ? '' : '/'}${dataUrl}`;
     }
   }

   getExportParams = (params = {}) => {
     const newParams = [];

     for (const [key, value] of Object.entries(params)) {
       newParams.push(`${key}=${JSON.stringify(value)}`);
     }

     return newParams.length > 0 ? newParams.join('&') : '';
   }

   handleSkip = async () => { // values
     //  const { prefix: pubPrefix, convertParam } = this.props;
     //  const { prefix } = values;

     //  let cParam = {};
     //  if (convertParam) {
     //    cParam = await convertParam(values);
     //  }

     //  const prefixUrl = '/';
     const url = '#/exportmanage/export';
     const fullUrl = toFullPath(url);
     const { isOpen = false } = this.props;
     if (isOpen) {
       goTo(url);
     } else {
       //  window.open(`${fullUrl}?prefix=${cParam?.prefix || prefix || pubPrefix}`, '_blank');
       window.open(`${fullUrl}`, '_blank');
     }
   }

   handleOk = async (values) => {
     const {
       dispatch,
       prefix: pubPrefix,
       dataUrl: pubDataUrl,
       oldServiceUrl: pubOldServiceUrl,
       convertParam,
       exportInstruction,
     } = this.props;
     const {
       exportFileName: fileName,
       prefix,
       dataUrl,
       totalCount,
       oldServiceUrl,
       ...param
     } = values;

     let cParam = {};
     if (convertParam) {
       cParam = await convertParam(values);
     } else {
       cParam = {
         ...param,
         fileName,
       };
     }

     // 需导出数量为0时，结束并提示
     if ((cParam?.totalCount || totalCount || 0) < 1) {
       message.error('查询无结果，无法导出，请重新查询');
       return {
         succ: false,
         totalCount: 0,
         sucTitle: cParam?.sucTitle,
       };
     }

     const reqParam = {
       dataUrl: this.getPrefix(
         cParam?.dataUrl || dataUrl || pubDataUrl,
         cParam?.oldServiceUrl || oldServiceUrl || pubOldServiceUrl
       ),
       prefix: cParam?.prefix || prefix || pubPrefix,
       param: this.getExportParams(cParam?.param || param),
       page: {
         pageSize: 500,
         totalCount: cParam?.totalCount || totalCount || 1,
       },
       exportExtendedParam: {
         platformType: 2,
       },
       exportInstruction,
     };


     await dispatch({
       type: 'common/startExportFile',
       payload: reqParam,
     });

     const { common } = this.props;
     const { startExportFile } = common;

     return {
       succ: startExportFile || false,
       totalCount: totalCount || cParam?.totalCount || 1,
       sucTitle: cParam?.sucTitle,
     };
   }

   renderModalExport = () => {
     const { params } = this.props;
     return (
       <ModalExport
         {...this.props}
         onOk={this.handleOk}
         onSkip={this.handleSkip}
         tabOptions={params}
       />
     );
   }

   renderResultHint = () => {
     const { params } = this.props;

     return (
       <ResultHint
         {...this.props}
         onOk={this.handleOk}
         onSkip={this.handleSkip}
         params={params?.[0]}
       />
     );
   }

   renderResultPrompt = () => {
     const { params } = this.props;
     return (
       <ResultPrompt
         {...this.props}
         onOk={this.handleOk}
         onSkip={this.handleSkip}
         params={params?.[0]}
       />
     );
   }

   renderAdvancePrompt = () => {
     const { params } = this.props;
     return (
       <AdvancePrompt
         {...this.props}
         onOk={this.handleOk}
         onSkip={this.handleSkip}
         params={params?.[0]}
       />
     );
   }

   render() {
     const { exportModalType } = this.props;
     if (exportModalType === 1) {
       return this.renderModalExport();
     } else if (exportModalType === 2) {
       return this.renderResultHint();
     } else if (exportModalType === 3) {
       return this.renderAdvancePrompt();
     } else {
       return this.renderResultPrompt();
     }
   }
}

export default ModalExportBusiness;
