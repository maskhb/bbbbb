
import React, { PureComponent } from 'react';

import { Card, Button, Modal, Message, Divider } from 'antd';
import { connect } from 'dva';

import PanelList, { Batch } from 'components/PanelList';
import Table from 'components/TableStandard';
import CalendarModal from 'components/ModalCalendar';
import moment from 'moment';
import { goTo } from 'utils/utils';
import Authorized from 'utils/Authorized';
import cookie from 'cookies-js';
import { getPrefix } from 'utils/attr/exportFile';

import SearchHeader from './components/SearchHeader';

import getColumns from './column';
import AddModal from './addModal';


@connect(({ houseStatus, exportFile, housing }) => ({
  houseStatus, exportFile, housing,
}))

class View extends PureComponent {
   static defaultProps = {};

   state = {
     repairId: 0,
     calendarVisible: false,
     modalVisible: false,
     confirmLoading: false,
   };

   onCancel() {
     this.setState({
       modalVisible: false,
     });
   }

   onOk() {
     const { dispatch } = this.props;
     const { repairId } = this.state;
     const { addModal } = this;
     addModal.validateFields((err, values) => {
       if (err) {
         return;
       }
       const postData = Object.assign({}, values);
       if (postData.startTime) {
         postData.startTime = moment(postData.startTime).valueOf();
       }
       if (postData.endTime) {
         postData.endTime = moment(postData.endTime).valueOf();
       }
       if (postData.buildingId) {
         delete postData.buildingId;
       }
       this.setState({ confirmLoading: true }, () => {
         /* 新增 */
         if (repairId === 0) {
           dispatch({
             type: 'houseStatus/repairSave',
             payload: postData,
           }).then((suc) => {
             if (suc) {
               Message.success('新增成功');
               this.refreshTable();
               this.setState({ confirmLoading: false, modalVisible: false });
             } else {
               this.setState({ confirmLoading: false });
             }
           });
         } else if (repairId > 0) {
           postData.repairId = repairId;
           dispatch({
             type: 'houseStatus/repairUpdate',
             payload: postData,
           }).then((suc) => {
             if (suc) {
               Message.success('修改成功');
               this.refreshTable();
               this.setState({ confirmLoading: false, modalVisible: false });
             } else {
               this.setState({ confirmLoading: false });
             }
           });
         }
       });
     });
   }

   onCalendarCancel() {
     this.setState({
       calendarVisible: false,
     });
   }

   onCalendarOk() {
     this.setState({
       calendarVisible: false,
     });
   }


   /**
   * 刷新列表
   */
  refreshTable = () => {
    const { stateOfSearch } = this.searchTable?.props || {};
    this.toSearch(stateOfSearch);
  };

  toSearch = (values) => {
    const postData = {
      repairCondition: values,
    };
    if (values.currPage) {
      postData.currPage = values.currPage;
      delete postData.repairCondition.currPage;
    }
    if (values.pageSize) {
      postData.pageSize = values.pageSize;
      delete postData.repairCondition.pageSize;
    }
    if (values.repairTime && values.repairTime.length === 2) {
      postData.repairCondition.startTime = moment(values.repairTime?.[0]).valueOf();
      postData.repairCondition.endTime = moment(values.repairTime?.[1]).valueOf();
      delete postData.repairCondition.repairTime;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'houseStatus/queryRepairList',
      payload: postData,
    });
  };


  /* 新增维修 */
  addRepair() {
    this.addModal.resetFields();
    this.setState({
      repairId: 0,
      modalVisible: true,
    });
  }

  /* 修改维修 */
  editRepair(id) {
    this.addModal.resetFields();

    const { dispatch } = this.props;
    dispatch({
      type: 'houseStatus/repairDetail',
      payload: {
        repairId: id,
      },
    }).then((suc) => {
      if (suc) {
        this.setState({
          repairId: id,
          modalVisible: true,
        });
      }
    });
  }

  /* 取消维修 */
  cancelRepair(repairId) {
    const that = this;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定要取消维修？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'houseStatus/repairCancel',
          payload: {
            repairId,
          },
        }).then((suc) => {
          if (suc) {
            Message.success('操作成功!');
            that.refreshTable();
          } else {
            Message.error('操作失败!');
          }
        });
      },
    });
  }

  /* 完成维修 */
  complateRepair(repairId) {
    const that = this;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定要完成维修？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'houseStatus/repairFinish',
          payload: {
            repairId,
          },
        }).then((suc) => {
          if (suc) {
            Message.success('操作成功!');
            that.refreshTable();
          } else {
            Message.error('操作失败!');
          }
        });
      },
    });
  }

  /* 导出 */
  exportFile() {
    const { stateOfSearch } = this.searchTable?.props || {};
    const { dispatch, houseStatus } = this.props;
    const { queryRepairList } = houseStatus || {};
    const exportData = {
      prefix: 900001,
      page: {
        pageSize: 500,
        totalCount: queryRepairList?.pagination?.total,
      },
      // param: JSON.stringify({ param: stateOfSearch }),
      param: `param=${JSON.stringify(stateOfSearch)}`,
      dataUrl: getPrefix('ht-fc-pms-server/repair/export'),
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
            goTo('/export/export/900001');
          },
        });
      }
    });
  }

  /* 打开日历 */
  showCalendar(startTime) {
    const beginDate = moment(startTime).startOf('month').valueOf();
    const endDate = moment(startTime).add(1, 'months').endOf('month').valueOf();
    // endDate = moment(endDate).add(1, 'months').valueOf();

    // let beginDate = moment(startTime).subtract(1, 'months');
    // beginDate = moment(beginDate).startOf('month').valueOf();
    // const endDate = moment(startTime).endOf('month').valueOf();

    const { dispatch } = this.props;
    const searchForm = {
      beginDate,
      endDate,
      rateCodeId: 1,
      roomTypeId: 1,
    };
    dispatch({
      type: 'housing/calendarPrice',
      payload: searchForm,
    }).then((suc) => {
      if (suc) {
        this.setState({
          calendarVisible: true,
        });
      }
    });
  }

  /* 弹出框 */
  renderModal() {
    const { modalVisible, repairId, confirmLoading } = this.state;
    return (
      <AddModal
        ref={(inst) => { this.addModal = inst; }}
        repairId={repairId}
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={this.onCancel.bind(this)}
        onOk={this.onOk.bind(this)}
      />
    );
  }

  /* 日历弹框 */
  renderCalendarModal() {
    const { calendarVisible } = this.state;
    return (
      <CalendarModal
        ref={(inst) => { this.calendarModal = inst; }}
        title="标准大床房（美团价）"
        visible={calendarVisible}
        onCancel={this.onCalendarCancel.bind(this)}
        onOk={this.onCalendarOk.bind(this)}
      />
    );
  }


  render() {
    const { loading, houseStatus } = this.props;
    const { queryRepairList } = houseStatus || {};
    return (
      <Card>
        { this.renderModal() }
        { this.renderCalendarModal() }
        <h3>
          <span>维修单</span>
          <div className="fl_r">
            <Batch>
              <Authorized authority="PMS_ROOMSTATUS_MAINTENANCEBILL_ADD">
                <Button type="gray" onClick={this.addRepair.bind(this)}>+ 新增维修</Button>
              </Authorized>
              <Authorized authority="PMS_ROOMSTATUS_MAINTENANCEBILL_EXPORT">
                <Button type="gray" onClick={this.exportFile.bind(this)}>导出</Button>
              </Authorized>
            </Batch>
          </div>
        </h3>
        <Divider />
        <PanelList>
          <SearchHeader {...this.props} />
          <Table
            ref={(inst) => { this.searchTable = inst; }}
            loading={loading}
            columns={getColumns(this)}
            disableRowSelection
            rowKey="repairId"
            dataSource={queryRepairList?.list}
            pagination={queryRepairList?.pagination}
          />
        </PanelList>
      </Card>
    );
  }
}

export default View;
