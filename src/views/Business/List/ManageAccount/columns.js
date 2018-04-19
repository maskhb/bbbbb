
import React from 'react';
import { Link } from 'dva/router';
import styles from './style.less';


export default () => {
  return [
    {
      title: '帐号名',
      dataIndex: 'name',
    },
    {
      title: '管理员',
      dataIndex: 'admin',
      render(val) {
        return (
          <div style={{
            width: 80,
            height: 50,
            backgroundImage: `url(${val})`,
            backgroundSize: 'cover',
            }}
          />
        );
      },
    },
    {
      title: '密码状态',
      dataIndex: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
    },
    {
      title: '真实姓名',
      dataIndex: 'realname',
    },
    {
      title: '联系电话',
      dataIndex: 'tel',
    },

    {
      title: '启用状态',
      dataIndex: 'Enabled',
    },
    {
      title: '操作',
      render: val => (
        <div className={styles.operating}>
          <a>
            重置密码
          </a>
          <a>
            编辑
          </a>
          <Link to={`/business/list/setPermissions/${val.id || '0'}`}>
            设置权限
          </Link>
          <a>
            删除
          </a>
        </div>
      ),
    },
  ];
};
