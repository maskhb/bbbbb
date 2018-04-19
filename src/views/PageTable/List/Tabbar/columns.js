/**
 * Created by rebecca on 2018/4/5.
 */
import React from 'react';
import { Divider } from 'antd';

export default (me) => {
  return [
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: '10%',
      render: (row) => {
        switch (row) {
          case 1:
            return '是';
          case 0:
            return '否';
          default:
            break;
        }
      },
    },
    {
      title: '图片',
      dataIndex: 'picUrl',
      key: 'picUrl',
      width: '20%',
      render: (row) => {
        return (
          <a target="_blank" href={row}>
            <div style={{
              width: 80,
              height: 50,
              backgroundImage: `url(${row})`,
              backgroundSize: 'cover',
            }}
            />
          </a>);
      },
    },
    {
      title: '栏目名称',
      dataIndex: 'adName',
      key: 'adName',
      width: '20%',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: '20%',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => me.edit(record)}>编辑</a>
            <Divider type="vetical" />
            <a onClick={() => me.delete(record)}>删除</a>
            {
              record.isDefault === 0 ? (<Divider type="vetical" />) : ''
            }
            {
              record.isDefault === 0 ? (<a onClick={() => me.setdefault(record)}>设为默认</a>) : ''
            }
          </div>
        );
      },
    },
  ];
};
