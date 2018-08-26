import React from 'react';
import { Modal, message } from 'antd';
import { Link } from 'dva/router';
import Authorized from 'utils/Authorized';
import moment from 'moment';
import { format } from 'components/Const';
import emitter from 'utils/events';
import ModalExportBusiness from 'components/ModalExport/business';
import { fenToYuan } from 'utils/money';
import Download from '../../components/Download';

export default (me) => {
  function activation(val, del, type) {
    const { dispatch } = me.props;
    const { stateOfSearch, uuid } = me.searchTable?.props || {};
    if (type !== 'codeList') {
      if (del && val.status === 1) {
        Modal.confirm({
          title: '是否确认删除该优惠券?',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'marketing/couponStatus',
              payload: {
                isDelete: 1, // 1：删除
                couponId: val.couponId,
              },
            }).then(() => {
              const { couponStatus } = me.props?.marketing;
              if (couponStatus !== null) {
                message.success('删除成功！');
                emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
              } else {
                message.error('删除失败！');
              }
            });
          },
        });
      } else if (val.status === 2 || val.status === 4) {
        Modal.confirm({
          title: '是否确认禁用该优惠券?',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'marketing/couponStatus',
              payload: {
                status: 3, // 1：未启用、2：已启用
                couponId: val.couponId,
              },
            }).then(() => {
              const { couponStatus } = me.props?.marketing;
              if (couponStatus !== null) {
                message.success('禁用成功！');
                emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
              } else {
                message.error('禁用失败！');
              }
            });
          },
        });
      } else {
        dispatch({
          type: 'marketing/couponStatus',
          payload: {
            status: 2, // 1：未启用、2：已启用
            couponId: val.couponId,
          },
        }).then(() => {
          const { couponStatus } = me.props?.marketing;
          if (couponStatus !== null) {
            message.success('启用成功。');
            emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
          } else {
            message.error('启用失败。');
          }
        });
      }
    } else if (val.status === 1 || val.status === 2) {
      Modal.confirm({
        title: '是否确认注销该券码?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'marketing/couponCodeStatus',
            payload: {
              status: 4, // 4: 注销、5：还原,
              codeId: val.codeId,
            },
          }).then(() => {
            const { couponCodeStatus } = me.props?.marketing;
            if (couponCodeStatus !== null) {
              message.success('注销成功！');
              emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
            } else {
              message.error('注销失败！');
            }
          });
        },
      });
    } else if (val.status === 4) {
      Modal.confirm({
        title: '是否确认还原该券码?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'marketing/couponCodeStatus',
            payload: {
              status: 6, // 4: 注销、6：还原,
              codeId: val.codeId,
            },
          }).then(() => {
            const { couponCodeStatus } = me.props?.marketing;
            if (couponCodeStatus !== null) {
              message.success('还原成功！');
              emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
            } else {
              message.error('还原失败！');
            }
          });
        },
      });
    }
  }


  function convertExportParam(val) {
    // const { pagination } = me.props?.marketing?.couponList?.list;
    return {
      param: {
        param: {
          couponId: val.couponId,
          prefix: 806001,
        },
      },
      totalCount: 1,
      dataUrl: '/ht-mj-promotion-server/promotionExport/exportData',
      prefix: 806001,
    };
  }
  return {
    list: [
      {
        title: 'ID',
        dataIndex: 'couponId',
      },
      {
        title: '优惠券名称',
        dataIndex: 'couponName',
        width: 300,
        render: (text, record) => {
          return (
            <div>
              <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_VIEW']}>
                <p>
                  <Link target="_blank" to={`/marketing/coupon/Info/detail/${record.couponId}`}>
                    {text}
                  </Link>
                </p>
              </Authorized>
              <p>数量：{record.number}</p>
              <p>{record.belongTypeName}</p>
            </div>
          );
        },
      },
      {
        title: '派发形式',
        dataIndex: 'receiveMethodName',
      },
      {
        title: '适用渠道',
        dataIndex: 'clientTypeName',
      },
      {
        title: '适用范围',
        dataIndex: 'scopeTypeName',
      },
      {
        title: '使用条件',
        dataIndex: 'conditionAmount',
        render: text => <span>{fenToYuan(text, true)}</span>,
      },
      {
        title: '面额',
        dataIndex: 'amount',
        render: text => <span>{fenToYuan(text, true)}</span>,
      },
      {
        title: '使用有效期',
        dataIndex: 'startTime',
        render: (text, record) => {
          return (
            <span>
              {moment(text).format(format)} <br /> ~ <br /> {moment(record.endTime).format(format)}
            </span>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        render: val => <span>{val}</span>,
      },
      {
        title: '操作',
        width: '120px',
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <div className="view_coupon_list_column_oper">
              {
              text === 1 || text === 3 || text === 5 ? (
                <div className="view_coupon_list_column_oper">
                  <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_EDIT']}>
                    <Link target="_blank" to={`/marketing/coupon/info/edit/${record.couponId}`}>
                      编辑
                    </Link>
                  </Authorized>
                  <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_ENABLE']}>
                    <a onClick={() => { activation(record); }}>
                      启用
                    </a>
                  </Authorized>
                </div>) : (
                  <div className="view_coupon_list_column_oper">
                    <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_VIEW']}>
                      <Link target="_blank" to={`/marketing/coupon/info/detail/${record.couponId}`}>
                      查看
                      </Link>
                    </Authorized>
                    <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_DISABLE']}>
                      <a onClick={() => { activation(record); }}>
                      禁用
                      </a>
                    </Authorized>
                  </div>)
              }
              {
                ((text === 2 || text === 4) && record.receiveMethod === 3) ? (
                  <Authorized authority={null} className="view_coupon_list_column_oper">
                    <ModalExportBusiness
                      {...me.props}
                      btnElm={(
                        <a>导出激活码</a>
                      )}
                      title="优惠券"
                      content={(
                        <div>
                            已成功创建导出任务，导出成功后请在导出管理中下载!
                        </div>
                      )}
                      convertParam={() => {
                        return convertExportParam(record);
                        }}
                      exportModalType={0}
                    />
                  </Authorized>) : ''
              }
              {
                text === 1 ? (
                  <Authorized authority={['OPERPORT_JIAJU_COUPONLIST_DELETE']} className="view_coupon_list_column_oper">
                    <a onClick={() => { activation(record, true); }}>
                      删除
                    </a>
                  </Authorized>) : ''
              }
            </div>
          );
        },
      },
    ],
    codeList: [
      {
        title: 'ID',
        dataIndex: 'codeId',
      },
      {
        title: '券码',
        dataIndex: 'couponCode',
      },
      {
        title: '状态',
        dataIndex: 'statusName',
      },
      {
        title: '用户',
        dataIndex: 'userPhone',
        render: text => <span>{ text || ''}</span>,
      },
      {
        title: '派发渠道',
        dataIndex: 'receiveMethod',
        render: () => <span>{me.props?.detailVO?.receiveMethodName}</span>,
      },
      {
        title: '领取/激活时间',
        dataIndex: 'acceptTime',
        render: text => <span>{ text === 0 ? '' : moment(text).format(format)}</span>,
      },
      {
        title: '使用时间',
        dataIndex: 'useTime',
        render: text => <span>{ text === 0 ? '' : moment(text).format(format)}</span>,
      },
      {
        title: '使用订单',
        dataIndex: 'orderId',
        render: text => <span>{ text || ''}</span>,
      },
      {
        title: '操作',
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <div className="view_coupon_list_column_oper">
              {
                text === 1 || text === 2 ? (
                  <Authorized authority={null} className="view_coupon_list_column_oper">
                    <a onClick={() => { activation(record, false, 'codeList'); }}>
                      注销
                    </a>
                  </Authorized>) : ''
              }
              {
                text === 4 ? (
                  <Authorized authority={null} className="view_coupon_list_column_oper">
                    <a onClick={() => { activation(record, false, 'codeList'); }}>
                      还原
                    </a>
                  </Authorized>) : ''
              }
            </div>
          );
        },
      },
    ],
    logList: [
      {
        title: '操作时间',
        dataIndex: 'createdTime',
        render: text => <span>{moment(text).format(format)}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'loginName',
      },
      {
        title: '操作类型',
        dataIndex: 'subtypesName',
      },
      {
        title: '操作前',
        dataIndex: 'beforeOperation',
      },
      {
        title: '操作后',
        dataIndex: 'afterOperation',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
      },
    ],
    batchDistributeLog: [
      {
        title: 'ID',
        dataIndex: 'logId',
      },
      {
        title: '操作人',
        dataIndex: 'uploadBy',
      },
      {
        title: '操作时间',
        dataIndex: 'createdTime',
        render: text => <span>{moment(text).format(format)}</span>,
      },
      {
        title: '派发优惠券',
        dataIndex: 'result',
      },
      {
        title: '结果',
        dataIndex: 'fileName',
        render: (text, record) => {
          const file = text || record.result;
          return (
            <Download
              baseUrl="/ht-mj-log-server/downloadResultFile"
              query={{ fileUrl: record.fileUrl, fileName: text }}
              title={file}
            />
          );
        },
      },
    ],
  };
};
