/*
 * @Author: wuhao
 * @Date: 2018-09-21 10:13:43
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-10-18 10:56:56
 *
 * 房源管理 - 房型管理
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import Authorized from 'utils/Authorized';
import {
  PMS_ROOMRESOURCES_ROOMTYPES_ADD,
} from 'config/permission';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList from 'components/PanelList';
import { Card } from 'antd';

import SearchHeader from './components/SearchHeader';
import OperTable from './components/OperTable';
import ModalAdd from './components/ModalAdd';

import { isStoreOrg } from '../../../utils/getParams';

@connect(({ roomType, room, floor, building, tag, loading }) => ({
  roomType,
  room,
  floor,
  building,
  tag,
  pageLoading: loading.effects['room/page'],
}))
class view extends PureComponent {
  static defaultProps = {
    searchDefault: { },
  };

  state = {}

  refreshTable = () => {
    this.searchTable?.refreshTable();
  }

  render() {
    const { searchDefault, pageLoading, dispatch, roomType } = this.props;
    const resData = roomType?.page || {};
    return (
      <PageHeaderLayout>
        <Card
          title="房型管理"
          extra={isStoreOrg() && (
            <Authorized authority={[PMS_ROOMRESOURCES_ROOMTYPES_ADD]}>
              <ModalAdd {...this.props} refreshTable={this.refreshTable} />
            </Authorized>
          )}
        >
          <PanelList>
            <SearchHeader
              searchDefault={searchDefault}
              loading={pageLoading}
              dispatch={dispatch}
            />
            <OperTable
              ref={(inst) => { this.searchTable = inst; }}
              searchDefault={searchDefault}
              loading={pageLoading}
              dispatch={dispatch}
              data={resData}
              roomType={roomType}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default view;
