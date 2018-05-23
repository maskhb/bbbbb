import React from 'react';
import { Divider, Popconfirm, Badge, message } from 'antd';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import styles from './view.less';

const STATUS = [
  '',
  '已启用',
  '已禁用',
  '草稿',
];

const STATUS_HANDLE = {
  1: '启用',
  2: '禁用',
};

const STATUSLEVELS = [
  '',
  'success',
  'error',
  'default',
];

export {
  STATUS,
  STATUSLEVELS,
};

export default (me) => {
  return [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      width: 250,
      // render(text) {
      //   return (
      //     <div className={styles.nowrap}>
      //       {text}
      //     </div>
      //   );
      // },
    },
    {
      title: '别名',
      dataIndex: 'categoryAliasName',
      width: 180,
      // render(text) {
      //   return (
      //     <div className={styles.nowrap}>
      //       {text}
      //     </div>
      //   );
      // },
    },
    {
      title: 'ID',
      dataIndex: 'categoryId',
      width: 100,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 100,
    },
    {
      title: '预计到货时间（天）',
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
      width: 100,
      render(val) {
        return <Badge status={STATUSLEVELS[val]} text={STATUS[val]} />;
      },
    },
    {
      title: '操作',
      width: 280,
      render: (text, record) => {
        const targetVal = record.status === 1 ? 2 : 1;
        let askText = '';
        if (targetVal === 1) {
          askText = `确认${STATUS_HANDLE[targetVal]}？`;
        } else {
          askText = (
            <div>
              <div>是否确认禁用该分类？</div>
              <div className={styles.warn}>该分类下所有子分类也将被禁用！</div>
            </div>
          );
        }
        return (
          <div>
            <Authorized authority={[permission.OPERPORT_JIAJU_PROCATEGORYLIST_ADDSUBCAT]}>
              {record.level < 5 ? (
                <React.Fragment>
                  <a href={`#/goods/category/add/${record.categoryId}`}>添加子分类</a>
                  <Divider type="vetical" />
                </React.Fragment>
                ) : null}
            </Authorized>
            <Authorized authority={[permission.OPERPORT_JIAJU_PROCATEGORYLIST_EDIT]}>
              <a href={`#/goods/category/detail/${record.categoryId}`}>编辑</a>
              <Divider type="vetical" />
            </Authorized>
            <Authorized
              authority={[targetVal === 1
                ? permission.OPERPORT_JIAJU_PROCATEGORYLIST_ENABLE
                : permission.OPERPORT_JIAJU_PROCATEGORYLIST_DISABLE]}
            >
              <Popconfirm
                placement="top"
                title={askText}
                onConfirm={me.popConfirm.bind(me, targetVal, record, STATUS_HANDLE[targetVal])}
                okText="确认"
                cancelText="取消"
              >
                <a>{STATUS_HANDLE[targetVal]}</a>
              </Popconfirm>
              <Divider type="vetical" />
            </Authorized>
            <Authorized authority={[permission.OPERPORT_JIAJU_PROCATEGORYLIST_DELETE]}>
              {record.status === 3 ? (!record.children) ? [
                <Popconfirm placement="top" title="确认删除？" onConfirm={me.handleRemove.bind(me, record.categoryId, 'goodsCategory')} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>,
                <Divider type="vetical" />,
                  ] : [
                    <a onClick={() => { message.warn('请先删除子分类！'); }}>删除</a>,
                    <Divider type="vetical" />,
              ] : ''}
            </Authorized>
            <Authorized authority={[permission.OPERPORT_JIAJU_PROCATEGORYLIST_SETBRAND]}>
              {record.parentId === 0 ? <a href={`#/goods/category/brand/${record.categoryId}`}>设置品牌</a> : ''}
            </Authorized>
          </div>
        );
      },
    },
  ];
};
