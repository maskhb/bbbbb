import React from 'react';
import { Divider, Popconfirm, Badge, message } from 'antd';
import styles from './view.less';

const STATUS = [
  '草稿',
  '已启用',
  '已禁用',
];

const STATUSOBJECT = {
  0: '草稿',
  1: '已启用',
  2: '已禁用',
};

const STATUSLEVELS = [
  'default',
  'success',
  'error',
];

export {
  STATUS,
  STATUSOBJECT,
  STATUSLEVELS,
};

export default (me) => {
  return [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      render(text) {
        return (
          <div className={styles.nowrap}>
            {text}
          </div>
        );
      },
    },
    {
      title: '别名',
      dataIndex: 'categoryAliasName',
      render(text) {
        return (
          <div className={styles.nowrap}>
            {text}
          </div>
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'categoryId',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '计到货时间（天）',
      dataIndex: 'arrivalTime',
    },
    {
      title: '是否允许使用家居券及预存款',
      dataIndex: 'isAllowUseDiscount',
      render(val) {
        return (
          <div>
            { val === 1 ? '是' : '否' }
          </div>
        );
      },
    },
    {
      title: '是否支持全国配送',
      dataIndex: 'isArrivalAll',
      render(val) {
        return (
          <div>
            { val === 1 ? '是' : '否' }
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val, record) {
        const confirmText = val === 0 || val === 2 ? '启用' : '禁用';
        const text = (
          <Popconfirm
            placement="top"
            title={`确认${confirmText}？`}
            onConfirm={me.popConfirm.bind(me, val, record, confirmText)}
            okText="确认"
            cancelText="取消"
          >
            <a>{STATUS[val]}</a>
          </Popconfirm>
        );

        return <Badge status={STATUSLEVELS[val]} text={text} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <a href={`#/goods/category/add/${record.categoryId}`}>添加子分类</a>
            <Divider type="vetical" />
            <a href={`#/goods/category/detail/${record.categoryId}`}>编辑</a>
            {record.status === 0 ? <Divider type="vetical" /> : ''}
            {record.status === 0 ? (!record.children) ? (
              <Popconfirm placement="top" title="确认删除？" onConfirm={me.handleRemove.bind(me, [record.categoryId], 'goodsCategory')} okText="确认" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
                ) : (
                  <a onClick={() => { message.warn('请先删除子分类！'); }}>删除</a>
            ) : ''}
            {record.parentId === 0 ? <Divider type="vetical" /> : ''}
            {record.parentId === 0 ? <a href={`/goods/category/brand/${record.categoryId}`}>设置品牌</a> : ''}
          </div>
        );
      },
    },
  ];
};
