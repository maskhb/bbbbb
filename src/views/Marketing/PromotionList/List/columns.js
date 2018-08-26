import React from 'react';
import { Popconfirm, message } from 'antd';
import Authorized from 'utils/Authorized';
import moment from 'moment';
import { format } from 'components/Const';

export default function () {
  const { dispatch } = this.props;

  return [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'promotionId',
    },
    {
      title: '规则名称',
      width: 200,
      dataIndex: 'promotionName',
      render: (val, record) => {
        return (
          <Authorized authority={['OPERPORT_JIAJU_PROMOTIONLIST_VIEW']} noMatch={val}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`#/marketing/promotionlist/list/detail/${record.promotionId}`}
            >{val}
            </a>
          </Authorized>
        );
      },
    },
    {
      title: '规则类型',
      width: 100,
      dataIndex: 'conditionTypeName',
    },
    {
      title: '适用范围',
      width: 100,
      dataIndex: 'scopeTypeName',
    },
    {
      title: '促销方案',
      dataIndex: 'allCondition',
      width: 300,
    },
    {
      title: '生效时间',
      width: 200,
      dataIndex: 'startTime',
      render: (val, record) => {
        return (
          <span>
            {moment(val)
              .format(format)} <br /> ~ <br /> {moment(record.endTime)
            .format(format)}
          </span>
        );
      },
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'statusName',
    },
    {
      title: '操作',
      width: 160,
      render: (val, record) => {
        const edit = (
          <Authorized authority={['OPERPORT_JIAJU_PROMOTIONLIST_EDIT']}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`#/marketing/promotionlist/list/edit/${record.promotionId}`}
            >
              编辑
            </a>
          </Authorized>);
        const enable = (
          <Authorized authority={['OPERPORT_JIAJU_PROMOTIONLIST_ENABLE']}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                await dispatch({
                  type: 'promotionRules/updateStatus',
                  data: {
                    promotionRuleVoUStatus: {
                      promotionId: record.promotionId,
                      status: 2,
                    },
                  },
                });

                if (this.props?.promotionRules?.updateStatus) {
                  message.success('启用成功！');
                  this.search.handleSearch();
                }
              }}
            >
              启用
            </a>
          </Authorized>
        );
        const disable = (
          <Authorized authority={['OPERPORT_JIAJU_PROMOTIONLIST_DISABLE']}>
            <a onClick={async () => {
              await dispatch({
                type: 'promotionRules/updateStatus',
                data: {
                  promotionRuleVoUStatus: {
                    promotionId: record.promotionId,
                    status: 3,
                  },
                },
              });
              if (this.props?.promotionRules?.updateStatus) {
                message.success('禁用成功！');
                this.search.handleSearch();
              }
            }}
            >禁用
            </a>
          </Authorized>
        );
        const del = (
          <Authorized authority={['OPERPORT_JIAJU_PROMOTIONLIST_DELETE']}>
            <Popconfirm
              placement="top"
              title="是否确认删除该促销规则？"
              onConfirm={
                async () => {
                  await dispatch({
                    type: 'promotionRules/updateStatus',
                    data: {
                      promotionRuleVoUStatus: {
                        promotionId: record.promotionId,
                        isDelete: 1,
                      },
                    },
                  });

                  if (this.props?.promotionRules?.updateStatus) {
                    message.success('删除成功！');
                    this.search.handleSearch();
                  }
                }}
              okText="确认"
              cancelText="取消"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
              >删除
              </a>
            </Popconfirm>
          </Authorized>
        );
        const detail = (
          <Authorized authority={['OPERPORT_JIAJU_PROMOTIONLIST_VIEW']}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`#/marketing/promotionlist/list/detail/${record.promotionId}`}
            >
              查看
            </a>
          </Authorized>
        );

        if (record.status === 1) {
          return <div>{edit} {enable} {del}</div>;
        }
        if (record.status === 2) {
          return <div>{detail} {disable}</div>;
        }
        if (record.status === 3) {
          return <div>{edit} {enable}</div>;
        }
        if (record.status === 4) {
          return <div>{detail} {disable}</div>;
        }
        if (record.status === 5) {
          return <div>{detail}</div>;
        }
      },
    },
  ];
}
