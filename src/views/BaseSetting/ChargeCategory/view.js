/*
 * @Author: wuhao
 * @Date: 2018-09-20 09:52:33
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-10-15 15:37:53
 *
 * 基础设置 -- 收费类目设置
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList from 'components/PanelList';
import { Card } from 'antd';

import SearchHeader from './components/SearchHeader';
import OperTable from './components/OperTable';

@connect(({ paymentItem, loading }) => ({
  paymentItem,
  pageLoading: loading.effects['paymentMethod/page'],
}))
class ChargeCategory extends PureComponent {
  static defaultProps = {
    searchDefault: { },
  };

  state = {}

  render() {
    const { searchDefault, pageLoading, dispatch, paymentItem } = this.props;
    const resData = paymentItem?.page || {};
    return (
      <PageHeaderLayout>
        <Card
          title="收费类目设置"
          extra={(
            <span>如需要新增收费类目，请联系恒腾</span>
          )}
        >
          <PanelList>
            <SearchHeader
              searchDefault={searchDefault}
              loading={pageLoading}
              dispatch={dispatch}
            />
            <OperTable
              searchDefault={searchDefault}
              loading={pageLoading}
              dispatch={dispatch}
              data={resData}
              paymentItem={paymentItem}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ChargeCategory;
