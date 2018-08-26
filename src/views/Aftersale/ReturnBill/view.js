/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:20:36
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-22 14:21:09
 *
 * 退货单列表
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Card } from 'antd';
import classNames from 'classnames';

import emitter from 'utils/events';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList from 'components/PanelList';
import Table from 'components/TableStandard';


import SearchHeader from './components/SearchHeader';
import BatchSearchList from './components/BatchSearchList';

import getColumns from './columns';

import styles from './index.less';

@connect(({ aftersale, loading }) => ({
  aftersale,
  loading: loading.effects['aftersale/queryReturnExchangeList'],
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {

    },
  };

  state = {}

  /**
   * 刷新列表
   */
  refreshTable = () => {
    const { stateOfSearch, uuid } = this.searchTable?.props || {};
    emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
  }


  render() {
    const { loading, searchDefault, aftersale } = this.props;
    const { queryReturnExchangeList } = aftersale || {};

    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_aftersale_returnbill_list)}>
        <Card>

          <PanelList>
            <SearchHeader
              {...this.props}
            />
            <BatchSearchList
              {...this.props}
            />
            <Table
              ref={(inst) => { this.searchTable = inst; }}
              loading={loading}
              columns={getColumns(this)}
              searchDefault={searchDefault}
              disableRowSelection
              rowKey="applyOrderId"
              dataSource={queryReturnExchangeList?.list}
              pagination={queryReturnExchangeList?.pagination}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
