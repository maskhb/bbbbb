import React from 'react';
import Authorized from 'utils/Authorized';

export default (me) => {
  return [
    {
      title: '项目ID',
      dataIndex: 'communityId',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (val, row) => {
        return row.cityName + row.communityName;
      },
    },
    {
      title: '地区',
      dataIndex: 'area',
      render: (val, row) => {
        return `${row.provinceName}-${row.cityName}-${row.areaName}-${row.streetName}`;
      },
    },
    {
      title: '地址',
      dataIndex: 'communityAddress',
    },
    {
      title: '操作',
      render: (val, row) => {
        return (
          <Authorized authority={['OPERPORT_JIAJU_COMMUNITY_SHOPSORTETTING']}>
            <a onClick={me.modalMerchantOrderShow.bind(me, row.communityId)}>设置商家排序</a>
          </Authorized>
        );
      },
    },
  ];
};
