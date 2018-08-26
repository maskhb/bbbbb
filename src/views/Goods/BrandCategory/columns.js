import React from 'react';
import { Divider, Popconfirm, message } from 'antd';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';

export default (me) => {
  return [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      width: 300,
      render(text) {
        return (
          <span style={{ whiteSpace: 'nowap' }}>
            {text}
          </span>
        );
      },
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
      title: '操作',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <Authorized authority={[permission.OPERPORT_JIAJU_BRANDCATEGORYLIST_ADDSUBCAT]}>
              {record.level < 5 ? (
                <React.Fragment>
                  <a onClick={me.handleAdd.bind(me, record.categoryId)}>添加子分类</a>
                  <Divider type="vetical" />
                </React.Fragment>
                ) : null}
            </Authorized>
            <Authorized authority={[permission.OPERPORT_JIAJU_BRANDCATEGORYLIST_EDIT]}>
              <a onClick={me.handleEdit.bind(me, record)}>编辑</a>
              <Divider type="vetical" />
            </Authorized>
            <Authorized authority={[permission.OPERPORT_JIAJU_BRANDCATEGORYLIST_DELETE]}>
              {(!record.children) ? (
                <Popconfirm
                  placement="top"
                  title={(
                    <div style={{ marginBottom: -12 }}>
                      <h3>是否确认删除该分类?</h3>
                      <p style={{ color: 'red' }}>
                        已关联该分类的所有品牌的分类
                        <br />
                        将会被清空!
                      </p>
                    </div>
                  )}
                  onConfirm={me.handleRemove.bind(me, [record.categoryId], 'brandCategory')}
                  okText="确认"
                  cancelText="取消"
                >
                  <a>删除</a>
                </Popconfirm>
                ) : (
                  <a onClick={() => { message.warn('请先删除子分类！'); }}>删除</a>
            )}
            </Authorized>
          </div>
        );
      },
    },
  ];
};
