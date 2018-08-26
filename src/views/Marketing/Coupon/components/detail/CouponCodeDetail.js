import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Alert, Row, Col } from 'antd';
import emitter from 'utils/events';
import PanelList from 'components/PanelList';
import Table from 'components/TableStandard';
import SearchCodeHeader from './../SearchCodeList';
import getColumns from '../../../columns';


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
    const { couponCodeList, couponCount } = marketing || {};
    const { actCount, deleteCount, remainCount, totalCount, useCount } = couponCount;

    return (
      <Card>
        <PanelList>
          <SearchCodeHeader
            {...this.props}
          />
          <Alert
            message={(
              <Row type="flex">
                <Col>
                  <span style={{ color: 'red', marginRight: 20 }}>总数: {totalCount}</span>
                  <span style={{ color: 'red', marginRight: 20 }}>已激活: {actCount}</span>
                  <span style={{ color: 'red', marginRight: 20 }}>已核销: {useCount}</span>
                  <span style={{ color: 'red', marginRight: 20 }}>已注销: {deleteCount}</span>
                  <span style={{ color: 'red', marginRight: 20 }}>剩余：{remainCount}</span>
                </Col>
              </Row>
            )}
            type="info"
            showIcon
          />
          <Table
            ref={(inst) => { this.searchTable = inst; }}
            columns={getColumns(this, searchDefault).codeList}
            searchDefault={searchDefault}
            disableRowSelection
            rowKey="codeId"
            loading={loading}
            dataSource={couponCodeList?.list}
            pagination={couponCodeList?.pagination}
          />
        </PanelList>
      </Card>
    );
  }
}
