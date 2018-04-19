import React from 'react';
import { format } from 'components/Const';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import { Popconfirm } from 'antd';
import { Link } from 'dva/router';

import styles from './columns.less';
import { statuses, STATUS_DISABLE, STATUS_ENABLE } from './const';


export default {
  basic(self) {
    return [
      {
        title: '属性ID',
        dataIndex: 'propertyGroupId',
      },
      {
        title: '属性组名称',
        dataIndex: 'propertyGroupName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return statuses[val];
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        render: val => <span>{moment(val).format(format)}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'createrName',
      },
      {
        title: '操作',
        render(val) {
          const btns = [];
          btns.push((
            <a key="004" onClick={() => self.handleModalShow(val)}>编辑</a>
          ));
          if (val.status !== STATUS_ENABLE) {
            btns.push((
              <Authorized key="000" authority="">
                <Popconfirm
                  placement="top"
                  title={`是否确认 ${statuses[STATUS_ENABLE]}?`}
                  onConfirm={() => self.popConfirmStatus(val, STATUS_ENABLE)}
                >
                  <a>{ statuses[STATUS_ENABLE] }</a>
                </Popconfirm>
              </Authorized>
            ));
          } else {
            btns.push((
              <Authorized key="001" authority="">
                <Popconfirm
                  placement="top"
                  title={`是否确认 ${statuses[STATUS_DISABLE]}?`}
                  onConfirm={() => (
                    self.popConfirmStatus(val, STATUS_ENABLE, statuses[STATUS_DISABLE])
                  )}
                >
                  <a>{ statuses[STATUS_DISABLE] }</a>
                </Popconfirm>
              </Authorized>
            ));
          }
          btns.push((
            <Authorized key="002" authority="">
              <Popconfirm placement="top" title="是否确认删除该属性组？" onConfirm={() => self.popConfirmRemove(val)}>
                <a>删除</a>
              </Popconfirm>
            </Authorized>
          ));
          btns.push((
            <Authorized key="003" authority="">
              <Link to={`/goods/property/key/${val.propertyGroupId}`}>管理属性</Link>
              {/* <a onClick={() => self.handleManage(val.id)}>管理属性</a> */}
            </Authorized>
          ));

          return (
            <div className={styles.operator}>
              {btns}
            </div>
          );
        },
      },
    ];
  },
  key(self) {
    return [{
      title: '属性ID',
      dataIndex: 'propertyKeyId',
    },
    {
      title: '属性名称',
      dataIndex: 'propertyName',
    },
    {
      title: '录入形式',
      dataIndex: 'inputType',
      render(val) {
        return statuses[val];
      },
    },
    {
      title: '是否必填',
      dataIndex: 'isRequired',
    },
    {
      title: '是否筛选',
      dataIndex: 'isFilter',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '标准值',
      dataIndex: 'values',
    },
    {
      title: '操作',
      render(val) {
        const btns = [];
        btns.push((
          <a key="004" onClick={() => self.handleModalShow(val)}>编辑</a>
        ));
        btns.push((
          <Authorized key="002" authority="">
            <Popconfirm placement="top" title="是否确认删除该属性组？" onConfirm={() => self.popConfirmRemove(val)}>
              <a>删除</a>
            </Popconfirm>
          </Authorized>
        ));
        btns.push((
          <Authorized key="003" authority="">
            <a onClick={() => self.handleModalValueShow(val)}>管理属性</a>
          </Authorized>
        ));

        return (
          <div className={styles.operator}>
            {btns}
          </div>
        );
      },
    }];
  },
  value(self) {
    return [
      {
        title: '标准值',
        width: '40%',
        dataIndex: 'propertyValue',
        render: (text, record, index) => self.renderColumns(index, 'propertyValue', text),
      },
      {
        title: '排序',
        width: '20%',
        dataIndex: 'orderNum',
        render: (text, record, index) => self.renderColumns(index, 'orderNum', text),
      },
      {
        title: '操作',
        width: '30%',
        render: (text, record, index) => {
          const { editableIds } = self.state;
          return (
            <div className={styles.operator}>
              {
                editableIds.includes(record.propertyId) ? (
                  <span>
                    <a onClick={() => self.editDone(index, 'save')}>保存</a>
                    <Popconfirm title="确认取消修改?" onConfirm={() => self.editDone(index, 'cancel')}>
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                  ) : ([
                    <span>
                      <a onClick={() => self.edit(index)}>编辑</a>
                    </span>,
                    <span >
                      <a onClick={() => self.edit(index)}>删除</a>
                    </span>,
                    ]
                  )
              }
            </div>
          );
        },
      },
    ];
  },
};
