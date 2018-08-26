/*
 * @Author: jone
 * @Date: 2018-7-8
 *
 * 电子收据导出
 */

import React, { PureComponent } from 'react';

import Authorized from 'utils/Authorized';
import { Batch } from 'components/PanelList';
import ModalExportBusiness from 'components/ModalExport/business';

class BatchSearchList extends PureComponent {
  static defaultProps = {};

  state = {}

  /**
   * 导出参数转换
   */
  convertExportParam = async () => {
    const { searchDefault, stateOfSearch } = this.props;
    const { pageInfo, ...otherSearch } = stateOfSearch || {};

    const reqParam = {
      OrderEleReceiptMultipQueryVO: {
        ...searchDefault,
        ...otherSearch,
        pageInfo: {
          currPage: 1,
          pageSize: 500,
        },
      },
    };

    return {
      param: {
        param: {
          ...reqParam,
        },
      },
      totalCount: 1,
      dataUrl: '/ht-mj-order-server/order/eleReceipt/list/export',
      prefix: 0,
    };
  }

  render() {
    return (
      <Batch {...this.props}>
        <div>
          <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_EXPORT']}>
            <ModalExportBusiness
              {...this.props}
              title="导出电子收据"
              btnTitle="导出"
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

