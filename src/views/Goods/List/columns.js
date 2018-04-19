import React from 'react';
import { Badge, Popconfirm, Spin, Icon, Popover } from 'antd';
import moment from 'moment';
import { AUDITSTATUS, AUDITSTATUSLEVELS } from 'components/Status/audit';
import { ONLINESTATUS, ONLINESTATUSLEVELS } from 'components/Status/online';
import { format } from 'components/Const';
import { handleOperate, handleRemove } from 'components/Handle';
import TextBeyond from 'components/TextBeyond';

export default (me, searchDefault, categoryLoading) => {
  return [
    {
      title: 'ID',
      dataIndex: 'goodsId',
      render(val) {
        return <a href={`#/goods/list/detail/${val}`}>{val}</a>;
      },
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      render(val) {
        return (
          val
            ? (
              <Popover placement="right" title="" content={<img src={val} alt="" />} trigger="hover">
                <a target="_blank" href={val}>
                  <div style={{
                    width: 80,
                    height: 50,
                    backgroundImage: `url(${val})`,
                    backgroundSize: 'cover',
                    }}
                  />
                </a>
              </Popover>
            )
            : <div style={{ height: 50 }} />
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'goodsName',
      render(val) {
        return (
          <TextBeyond content={val} maxLength="12" width="300px" />
        );
      },
    },
    {
      title: '所属商家',
      dataIndex: 'merchantName',
      render(val) {
        return (
          <TextBeyond content={val} maxLength="12" width="300px" />
        );
      },
    },
    {
      title: (
        <span>
          所属分类
          <Spin spinning={categoryLoading} indicator={<Icon type="loading" spin style={{ fontSize: 10 }} />} />
        </span>
      ),
      dataIndex: 'goodsCategoryId',
      render(val) {
        const { goodsCategory: { list = [] } = {} } = me.props;

        const loop = (id, field = 'categoryId') => {
          for (const category of Object.values(list)) {
            if (id === category[field]) {
              return {
                id: category.categoryId,
                name: category.categoryName,
              };
            }
          }

          return {
            id: 0,
            name: '',
          };
        };
        const { name } = loop(val);
        const { id: secondId, name: secondName } = loop(val, 'parentId');
        const { name: thirdName } = loop(secondId, 'parentId');

        const content = `${thirdName}${thirdName ? ' > ' : ''}${secondName}${secondName ? ' > ' : ''}${name}`;

        return (
          <TextBeyond content={content} maxLength="12" width="300px" />
        );
      },
    },
    {
      title: '上下架状态',
      dataIndex: 'onlineStatus',
      filters: Object.values(ONLINESTATUS).map((v, k) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.onlineStatus || searchDefault.onlineStatus).split(','),
      render(val, record) {
        const targetVal = val === 0 ? 1 : val === 1 ? 2 : 1;
        const confirmText = ONLINESTATUS[targetVal];
        const text = (
          <Popconfirm placement="top" title={`确认${confirmText}？`} onConfirm={handleOperate.bind(me, { goodsId: [record.goodsId], status: targetVal }, 'goods', 'online', confirmText)} okText="确认" cancelText="取消">
            <a>{ONLINESTATUS[val]}</a>
          </Popconfirm>
        );

        return <Badge status={ONLINESTATUSLEVELS[val]} text={text} />;
      },
    },
    {
      // TODO 待审核一定是下架商品
      title: '审核状态',
      dataIndex: 'auditStatus',
      filters: Object.entries(AUDITSTATUS).map(([k, v]) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.auditStatus || searchDefault.auditStatus).split(','),
      render(val, record) {
        let text = AUDITSTATUS[val];
        if (val === 1) {
          text = (<a onClick={me.modalAuditShow.bind(me, record)}>{AUDITSTATUS[val]}</a>);
        }
        return (
          <Badge key={val} status={AUDITSTATUSLEVELS[val]} text={text} />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '操作',
      render: (record) => {
        return (
          <div>
            <Popconfirm placement="top" title="确认删除？" onConfirm={handleRemove.bind(me, { goodsId: record.goodsId }, 'goods')} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
