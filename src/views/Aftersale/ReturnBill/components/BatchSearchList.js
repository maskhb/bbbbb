/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:19:52
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-12 15:28:21
 *
 * 退货单列表操作
 */

import React, { PureComponent } from 'react';

import Authorized from 'utils/Authorized';
import { Batch } from 'components/PanelList';
import ModalExportBusiness from 'components/ModalExport/business';
import { transformObjectToTSModal } from 'utils/transform/aftersale';
import * as viewModels from 'viewmodels/AfterSale';

class BatchSearchList extends PureComponent {
  static defaultProps = {};

  state = {}

  /**
   * 导出参数转换
   */
  convertExportParam = async () => {
    const { searchDefault, stateOfSearch, aftersale } = this.props;
    const { pageInfo, ...otherSearch } = stateOfSearch || {};
    const { queryReturnExchangeList } = aftersale || {};

    const reqParam = {
      ...searchDefault,
      ...otherSearch,
      pageInfo: {
        currPage: 1,
        pageSize: 500,
      },
    };

    return {
      param: {
        param: {
          ...transformObjectToTSModal(reqParam, new viewModels.ReturnExchangeQueryVO()),
        },
      },
      totalCount: queryReturnExchangeList?.pagination?.total || 0,
      dataUrl: '/ht-mj-aftersale-server/aftersale/query/export/returnOrder',
      prefix: 807001,
    };
  }

  render() {
    return (
      <Batch {...this.props}>
        <div>
          <Authorized authority={['OPERPORT_JIAJU_RETURNSLIST_EXPORTREPORT']}>
            <ModalExportBusiness
              {...this.props}
              title="退货单"
              btnTitle="导出退货单"
              convertParam={this.convertExportParam}
              exportModalType={0}
            />
          </Authorized>
        </div>
      </Batch>
    );
  }
}

export default BatchSearchList;
