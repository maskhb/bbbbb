import React from 'react';
import { Badge, Popconfirm, Divider, Popover } from 'antd';
import moment from 'moment';
import { format } from 'components/Const';
import { handleRemove } from 'components/Handle';
import AUDITSTATUS from 'components/AuditStatus/PackageAuditStatus';
import TextBeyond from 'components/TextBeyond';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import ModalCover from '../Detail/ModalCover';
import AuditForm from './AuditForm';
import * as status from './status';
import styles from '../package.less';

const canOperateTop = (record) => {
  return record.status === 1;
};

const canOperateDel = (record) => {
  return record.status === 0;
};

const canOperateDetail = () => {
  return true;
};

const isAuditFail = (record/* , pageType */) => {
  return record.auditStatus === 2/* && status.LIST === pageType */;
};

const canOperateEdit = (record) => {
  return [0, 2].indexOf(record.status) !== -1;
};

export default (me, searchDefault, audit) => {
  // const pageType = me.props.location.pathname;
  const arrOperate = [
    {
      title: 'ID',
      dataIndex: 'packageId',
      // render(val, record) {
      //   return canOperateDetail(record) ? (
      //     <Authorized authority={[permission.OPERPORT_JIAJU_PACKAGELIST_VIEW]} noMatch={val}>
      //       <a href={`#/goods/package/list/detail/${val}`} target="_blank">{val}</a>
      //     </Authorized>
      //   ) : val;
      // },
    },
    {
      title: '套餐主图',
      dataIndex: 'mainImgUrl',
      render(val) {
        return (
          <a rel="noopener noreferrer" target="_blank" href={val}>
            <div style={{
              width: 86,
              height: 86,
              backgroundImage: `url(${val})`,
              backgroundSize: 'cover',
            }}
            />
          </a>
        );
      },
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName',
      render(val, record) {
        return (
          <div className={styles['package-column']}>
            {record.isTop ? <span className={styles.top}>置顶</span> : null}
            {canOperateDetail(record) ? (
              <Authorized authority={[permission.OPERPORT_JIAJU_PACKAGELIST_VIEW]} noMatch={<TextBeyond content={val} maxLength="36" width="300px" />}>
                <p>
                  <a
                    rel="noopener noreferrer"
                    href={`#/goods/package/list/detail/${record.packageId}`}
                    target="_blank"
                  >
                    <TextBeyond content={val} maxLength="36" width="300px" />
                  </a>
                </p>
              </Authorized>
            ) : <TextBeyond content={val} maxLength="36" width="300px" />}
            <p>{record.merchantName}</p>
          </div>
        );
      },
      width: 300,
    },
    {
      title: '适用户型',
      dataIndex: 'houseTypeShow',
      render(val) {
        return val?.map(item => item.tagName).join('；');
      },
    },
    {
      title: '风格',
      dataIndex: 'decorateStyleTShow',
      render(val) {
        return val?.map(item => item.tagName).join('；');
      },
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val, record) {
        const confirmText = status.STATUS[val === 0 ? 1 : val === 1 ? 2 : val === 2 ? 1 : ''];
        const value = (val === 0 || val === 2) ? 1 : 2;
        const onConfirm = me.popConfirm.bind(me, value, record, confirmText);
        const text = (
          !audit && audit !== 0
            ? (
              <Authorized
                authority={
                  [val === 1 ? permission.OPERPORT_JIAJU_PACKAGELIST_UNPUBLISH
                    : permission.OPERPORT_JIAJU_PACKAGELIST_PUBLISH]
                }
                noMatch={status.STATUS[val]}
              >
                <Popconfirm
                  placement="top"
                  title={`确认${confirmText}？`}
                  onConfirm={onConfirm}
                  okText="确认"
                  cancelText="取消"
                >
                  <a>{status.STATUS[val]}</a>
                </Popconfirm>
              </Authorized>
            )
            : status.STATUS[val]
        );

        return <Badge status={status.STATUSLEVELS[val]} text={text} />;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      filters: Object.values(AUDITSTATUS).filter(v => (
        audit
          ? audit === v
          : audit === AUDITSTATUS.WAIT.value
            ? v === AUDITSTATUS.WAIT.value
            : true)),
      filteredValue: (String(
        me.search?.props.stateOfSearch.auditStatus === 0
          ? 0
          : me.search?.props.stateOfSearch.auditStatus || searchDefault.auditStatus).split(',')).map((item) => {
        return item;
      }),
      render(val, record) {
        return (
          <div>
            {isAuditFail(record) ? (
              <Popover content={<p style={{ maxWidth: 300 }}>{record.auditOpinion}</p>}>
                <span className={styles['audit-warn-icon']}>!</span>
                <br />
              </Popover>) : null}
            {status.STATUS_AUDIT[val]}
          </div>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{val === 0 ? '' : moment(val).format(format)}</span>,
    },
  ];

  const operate = {
    title: '操作',
    render: (val, record) => {
      const arr = [];
      const handleTop = record.isTop ? me.cancelTopConfirm : me.topConfirm;

      if (canOperateDel(record) && audit !== AUDITSTATUS.WAIT.value) {
        arr.push({
          id: 'delete',
          node: (
            <Authorized authority={[
              audit === AUDITSTATUS.FAIL.value
                ? permission.OPERPORT_JIAJU_UNAPPRPACKLIST_DELETE
                : permission.OPERPORT_JIAJU_PACKAGELIST_DELETE,
              ]}
            >
              <Popconfirm
                placement="top"
                title="确认删除？"
                onConfirm={handleRemove.bind(me, [val.packageId], 'goodsPackage')}
                okText="确认"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Authorized>
          ),
        });
      }

      if (canOperateTop(record) && audit !== AUDITSTATUS.WAIT.value) {
        const confirmText = `${record.isTop ? '取消' : ''}置顶`;
        arr.push({
          id: 'top',
          node: (
            <Authorized authority={[record.isTop ?
              permission.OPERPORT_JIAJU_PACKAGELIST_CANCELTOP :
              permission.OPERPORT_JIAJU_PACKAGELIST_TOP]}
            >
              <Popconfirm
                placement="top"
                title={`确认${confirmText}？`}
                onConfirm={handleTop.bind(me, val, record, confirmText)}
                okText="确认"
                cancelText="取消"
              >
                <a>{confirmText}</a>
              </Popconfirm>
            </Authorized>
          ),
        });
      }

      if (canOperateEdit(record) && audit !== AUDITSTATUS.WAIT.value) {
        arr.push({
          id: 'edit',
          node: (
            <Authorized
              authority={[audit === AUDITSTATUS.FAIL.value
                ? permission.OPERPORT_JIAJU_UNAPPRPACKLIST_EDIT
                : permission.OPERPORT_JIAJU_PACKAGELIST_EDIT]}
            >
              <a
                rel="noopener noreferrer"
                href={`#/goods/package/list/edit/${record.packageId}`}
                target="_blank"
              >
                编辑
              </a>
            </Authorized>
          ),
        });
      }

      arr.push({
        id: 'audit',
        node:
        audit === 0 ? (
          <Authorized authority={[permission.OPERPORT_JIAJU_TOAPPRPACKLIST_APPROVE]}>
            <ModalCover
              content={<AuditForm ref={(inst) => {
                /* eslint no-param-reassign:0 */
                me.auditForm = inst;
              }}
              />}
              onOk={me.handleBathOperating.bind(me, [record])}
            >
              {(modalGoodsListShow) => {
                return (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      modalGoodsListShow();
                    }}
                  >审核
                  </a>
                );
              }}

            </ModalCover>
          </Authorized>
        ) : '',
      });

      return (
        <div>
          {
            arr.map((item, index) => {
              return (
                <React.Fragment key={`k_${item.id}`}>
                  {
                    index === 0 ? null : <Divider type="vertical" />
                  }
                  {item.node}
                </React.Fragment>
              );
            })
          }
        </div>
      );
    },
  };

  arrOperate.push(operate);
  return arrOperate;
};

// TODO: 按钮的权限控制
