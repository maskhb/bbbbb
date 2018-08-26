import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import { Modal, Message } from 'antd';
import { goTo } from 'utils/utils';
import moment from 'moment';
import React from 'react';
import styles from './style.less';


export default (me) => {
  function showModelConfirm(type, val) {
    let genre = '';
    let main = '';
    let updateType;
    switch (type) {
      case 'reset':
        genre = '重置该账号密码';
        main = '重置后该账号登录密码将修改为默认密码';
        updateType = 4;
        break;
      case 'edit':
        genre = '编辑';
        main = '';
        updateType = 6;
        break;
      case 'del':
        genre = '删除该账号';
        main = '删除后该账号将无法找回';
        updateType = 1;
        break;
      case 'start':
        genre = '启用该账号';
        main = '启用后该账号可正常登录';
        updateType = 2;
        break;
      case 'disable':
        genre = '禁用该账号';
        main = '禁用后该账号将无法登录';
        updateType = 3;
        break;
      case 'admin':
        genre = '设置该账号为管理员';
        main = '设置为管理员后，可管理所有账号';
        updateType = 5;
        break;
      default:
        genre = '';
        main = '';
        break;
    }
    if ([1, 2, 3, 4, 5].includes(updateType)) {
      Modal.confirm({
        title: `确定要${genre}？`,
        content: main,
        onOk() {
          if (updateType) {
            me.props.dispatch({
              type: 'businessAccount/updateStatus',
              payload: {
                merchantAccountUpdateStatusVo: {
                  merchantAccountIdList: [val.accountId],
                  updateType,
                },
              },
            }).then(() => {
              const { updateRes } = me?.props?.businessAccount;
              if (updateRes === 1) {
                Message.success('保存成功');
                const { info } = me.props.match.params;
                me.query(info);
              }
            });
          }
        },
        okText: '确定',
        cancelText: '取消',
      });
    } else if (updateType === 6) {
      goTo(`/business/list/editAccount/${val.accountId}`);
    }
  }
  function handleJumpToManageAccount(val) {
    me.props.dispatch({
      type: 'business/savePageInfo',
      payload: val,
    });
    goTo(`/business/list/setPermissions/${val.accountId}`);
  }


  return [
    {
      title: '账号名',
      dataIndex: 'accountName',
    },
    {
      title: '管理员',
      dataIndex: 'adminFlag',
      render: v => ['', '管理员'][v],
    },
    {
      title: '密码状态',
      dataIndex: 'passwordStatus',
      render: v => ['初始密码', '自定义密码'][v],
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '真实姓名',
      dataIndex: 'accountFullName',
    },
    {
      title: '联系电话',
      dataIndex: 'accountPhoneNumber',
    },

    {
      title: '启用状态',
      dataIndex: 'status',
      render: v => ['启用', '禁用'][v - 1],

    },
    {
      title: '操作',
      render: val => (
        <div className={styles.operating}>
          <Authorized authority={['OPERPORT_JIAJU_SHOP_RESETACCOUNTPASSWORDS']}>
            <a onClick={showModelConfirm.bind(this, 'reset', val)}>
            重置密码
            </a>
          </Authorized>
          <Authorized authority={['OPERPORT_JIAJU_SHOP_EDITACCOUNT']}>
            <a onClick={showModelConfirm.bind(this, 'edit', val)}>
            编辑
            </a>
          </Authorized>

          {val.status === 1 ? (
            // 启用状态
              val.adminFlag === 0 ? (
                /* 管理员账号不显示禁用、删除按钮 */
                <Authorized authority={['OPERPORT_JIAJU_SHOP_ACTIVATEACCOUNT']}>
                  <a onClick={showModelConfirm.bind(this, 'disable', val)}>
              禁用
                  </a>
                </Authorized>
        ) : ''
          ) : (
            <div style={{ display: 'inline' }}>
              <Authorized authority={['OPERPORT_JIAJU_SHOP_ACTIVATEACCOUNT']}>
                <a onClick={showModelConfirm.bind(this, 'start', val)}>
            启用
                </a>
              </Authorized>
              {val.adminFlag === 0 ? (
                /* 管理员账号不显示禁用、删除按钮 */
                <Authorized authority={['OPERPORT_JIAJU_SHOP_DELETEACCOUNT']}>
                  <a onClick={showModelConfirm.bind(this, 'del', val)}>
            删除
                  </a>
                </Authorized>
        ) : ''}
            </div>
          )}
          {val.adminFlag === 0 && val.status === 1 ? (
            <Authorized authority={['OPERPORT_JIAJU_SHOP_ACCOUNTADMINISTATORSETTING']}>
              <a onClick={showModelConfirm.bind(this, 'admin', val)}>
            设为管理员
              </a>
            </Authorized>
        ) : ''}
          {val.adminFlag === 0 ? (
            <Authorized authority={['OPERPORT_JIAJU_SHOP_ACCOUNTAUTHORIZATION']}>
              <a onClick={() => handleJumpToManageAccount(val)}>
                设置权限
              </a>
            </Authorized>
          ) : ''}

        </div>
      ),
    },
  ];
};
