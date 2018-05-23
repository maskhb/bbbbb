import React from 'react';
import Authorized from 'utils/Authorized';

export default (me) => {
  return [
    {
      title: '支付方式名称',
      dataIndex: 'payTypeTitle',
    },
    {
      title: '支付方式编码',
      dataIndex: 'payTypeKey',
    },
    {
      title: '状态',
      dataIndex: 'isValid',
      render: (val) => {
        switch (val) {
          case 1:
            return '已启用';
          case 0:
            return '已禁用';
          default:
            break;
        }
      },
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <div>
            {
              record.isValid === 1 ? (<Authorized authority="OPERPORT_JIAJU_PAYTYPELIST_DISABLE"><a onClick={() => me.change(record)}>禁用</a></Authorized>) :
              (<Authorized authority="OPERPORT_JIAJU_PAYTYPELIST_ENABLE"><a onClick={() => me.change(record)}>启用</a></Authorized>)
            }
          </div>
        );
      },
    },
  ];
};
