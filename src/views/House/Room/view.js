/*
 * 房源管理 - 房间管理
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import Authorized from 'utils/Authorized';

import {
  PMS_ROOMRESOURCES_ROOMMANAGEMENT_ADD,
  PMS_ROOMRESOURCES_ROOMMANAGEMENT_EXPORT,
} from 'config/permission';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList from 'components/PanelList';
import { Card, Button, Modal } from 'antd';
import cookie from 'cookies-js';
import { goToNewWin, goTo } from 'utils/utils';
import { getPrefix } from 'utils/attr/exportFile';

import SearchHeader from './components/SearchHeader';
import OperTable from './components/OperTable';

import { isStoreOrg } from '../../../utils/getParams';

@connect(({ room, exportFile, loading }) => ({
  room,
  exportFile,
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

    /* 导出 */
    exportFile= () => {
      const { stateOfSearch: { _status, ...other } } = this.searchTable?.props || {};
      const { room, dispatch } = this.props;
      const roomList = room?.page || {};

      const roomQueryVO = {
        ...other,
        status: _status,
      };


      const exportData = {
        prefix: 900004,
        page: {
          pageSize: 999,
          totalCount: roomList?.pagination?.total,
        },
        param: `param=${JSON.stringify({ ...roomQueryVO })}`,
        dataUrl: getPrefix('ht-fc-pms-server/room/exportRoomList'),
        token: cookie.get('x-manager-token'),
        loginType: 7,
      };

      dispatch({
        type: 'exportFile/startExportFileByToken',
        payload: exportData,
      }).then((suc) => {
        if (suc) {
          Modal.success({
            title: '导出',
            content: '发起导出成功，请点击按钮查看',
            okText: '前往查看',
            maskClosable: true,
            onOk() {
              goTo('/export/export/900004');
            },
          });
        }
      });
    }

    render() {
      const { searchDefault, pageLoading, dispatch, room } = this.props;
      const resData = room?.page || {};

      return (
        <PageHeaderLayout>
          <Card
            title="房间管理"
            extra={(
              <div>
                {
                  isStoreOrg() ? (
                    <Authorized authority={[PMS_ROOMRESOURCES_ROOMMANAGEMENT_ADD]}>
                      <Button
                        type="gray"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                      goToNewWin('#/house/room/add/');
                      }}
                      >
                    +新增房间
                      </Button>
                    </Authorized>
                  ) : null
                }

                <Authorized authority={[PMS_ROOMRESOURCES_ROOMMANAGEMENT_EXPORT]}>
                  <Button type="primary" onClick={this.exportFile.bind(this)}>导出</Button>
                </Authorized>
              </div>
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
              />
            </PanelList>
          </Card>
        </PageHeaderLayout>
      );
    }
}

export default view;
