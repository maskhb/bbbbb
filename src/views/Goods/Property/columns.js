import React from 'react';
import { format } from 'components/Const';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import * as P from 'config/permission';
import { Popconfirm } from 'antd';
import { Link } from 'dva/router';
import TextBeyond from 'components/TextBeyond';
import styles from './columns.less';
import { statuses, inputTypes, STATUS_DISABLE, STATUS_ENABLE, STATUS_DRAFT } from './const';


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
        dataIndex: 'createdName',
      },
      {
        title: '操作',
        render(val) {
          const btns = [];
          btns.push((
            <Authorized
              key="000"
              authority={val.type === 1 ?
              P.OPERPORT_JIAJU_BASICPROPERTYLIST_EDIT : P.OPERPORT_JIAJU_SALESPROPERTYLIST_EDIT
            }
            >
              <a key="004" onClick={() => self.handleModalShow(val)}>编辑</a>
            </Authorized>
          ));
          if (val.status !== STATUS_ENABLE) {
            btns.push((
              <Authorized
                key="111"
                authority={
                  val.type === 1 ?
                  P.OPERPORT_JIAJU_BASICPROPERTYLIST_EDIT : P.OPERPORT_JIAJU_SALESPROPERTYLIST_EDIT
                }
              >
                <Popconfirm
                  placement="top"
                  title={`是否确认 ${statuses[STATUS_ENABLE]}?`}
                  onConfirm={
                    () => self.popConfirmStatus(val, STATUS_ENABLE, statuses[STATUS_ENABLE])
                  }
                >
                  <a>{ statuses[STATUS_ENABLE] }</a>
                </Popconfirm>
              </Authorized>
            ));
          } else {
            btns.push((
              <Authorized
                key="2111"
                authority={
                  val.type === 1 ?
                  P.OPERPORT_JIAJU_BASICPROPERTYLIST_EDIT : P.OPERPORT_JIAJU_SALESPROPERTYLIST_EDIT
                }
              >
                <Popconfirm
                  placement="top"
                  title={`是否确认 ${statuses[STATUS_DISABLE]}?`}
                  onConfirm={() => (
                      self.popConfirmStatus(val, STATUS_DISABLE, statuses[STATUS_DISABLE])
                    )}
                >
                  <a>{ statuses[STATUS_DISABLE] }</a>
                </Popconfirm>
              </Authorized>
            ));
          }
          btns.push((
            <Authorized
              key="3111"
              authority={
                val.type === 1 ?
                  P.OPERPORT_JIAJU_BASICPROPERTYLIST_DELETE :
                  P.OPERPORT_JIAJU_SALESPROPERTYLIST_DELETE
              }
            >
              { val.status === STATUS_DRAFT && (
                <Popconfirm placement="top" title="是否确认删除该属性组？" onConfirm={() => self.popConfirmRemove(val)}>
                  <a>删除</a>
                </Popconfirm>
              )}
            </Authorized>
          ));
          btns.push((
            <Authorized
              key="4111"
              authority={
                val.type === 1 ?
                  P.OPERPORT_JIAJU_BASICPROPERTYLIST_SETVALUE :
                  P.OPERPORT_JIAJU_SALESPROPERTYLIST_SETVALUE
              }
            >
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
        return inputTypes[val];
      },
    },
    {
      title: '是否必填',
      dataIndex: 'isRequiredName',
    },
    {
      title: '是否筛选',
      dataIndex: 'isFilterName',
    },
    {
      title: '是否支持自定义值',
      dataIndex: 'isCustmerName',
      className: self.isBaisc() ? 'is-basic' : '',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '标准值',
      dataIndex: 'propertyValuesAll',
      render(values) {
        return (
          <TextBeyond content={values || ''} />
        );
      },
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
            <a onClick={() => self.handleModalValueShow(val)}>管理标准值</a>
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
          // console.log(editableIds);
          return (
            <div className={styles.operator}>
              {
                editableIds.includes(record.propertyValueId) ? (
                  <span key="000">
                    <a onClick={() => self.editDone(index, 'save')}>保存</a>
                    <Popconfirm title="确认取消修改?" onConfirm={() => self.editDone(index, 'cancel')}>
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                  ) : ([
                    <span key="000">
                      <a onClick={() => self.edit(index)}>编辑</a>
                    </span>,
                    <Popconfirm key="111" title="确认要删除修改?" onConfirm={() => self.handleRemove(record, index)}>
                      <a>删除</a>
                    </Popconfirm>,
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
