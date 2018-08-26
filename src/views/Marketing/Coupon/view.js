import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { Link } from 'dva/router';
import emitter from 'utils/events';
import Authorized from 'utils/Authorized';
import classNames from 'classnames';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Batch } from 'components/PanelList';
import Table from 'components/TableStandard';
import SearchHeader from './components/Search';
import getColumns from '../columns';
import styles from './index.less';


@connect(({ marketing, loading, user }) => ({
  marketing,
  user,
  loading: loading.models.marketing,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {

    },
  };

  state = {};

  /**
  * 刷新列表
  */
  refreshTable = () => {
    const { stateOfSearch, uuid } = this.searchTable?.props || {};
    emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
  }

  render() {
    const { loading, searchDefault, marketing } = this.props;
    const { couponList } = marketing || {};

    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_coupon_list)}>
        <Card>
          <PanelList>
            <SearchHeader
              type="couponList"
              {...this.props}
            />
            <Batch>
              <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_ADD']}>
                <Link to="/marketing/coupon/Info/add/0" target="_blank">
                  <Button icon="plus" type="primary">添加优惠券</Button>
                </Link>
              </Authorized>
              <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_BATCHDISTRIBUTE']}>
                <Link to="/marketing/coupon/log/" target="_blank">
                  <Button type="primary">批量派发</Button>
                </Link>
              </Authorized>
            </Batch>
            <Table
              ref={(inst) => { this.searchTable = inst; }}
              columns={getColumns(this, searchDefault).list}
              searchDefault={searchDefault}
              disableRowSelection
              rowKey="couponId"
              loading={!!loading}
              dataSource={couponList?.list}
              pagination={couponList?.pagination}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
