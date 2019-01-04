import React from 'react';
import moment from 'moment';
import { Icon, Popover } from 'antd';
import TextBeyond from 'components/TextBeyond';
import { fenToYuan } from 'utils/money';
import Authorized from 'utils/Authorized';
import styles from './styles.less';
import { div, mul } from 'utils/number';

export default (mainClass, me) => {
  return [
    {
      title: '服务项名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 110,
    },
    {
      title: '在住/预留 房间号',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 170,
    },
    {
      title: '客户关联信息',
      dataIndex: 'gresInfo',
      key: 'gresInfo',
      width: 170,
    },
    {
      title: '对客单价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: val => fenToYuan(val || 0),
      width: 110,
    },
    {
      title: '数量',
      dataIndex: 'totalQty',
      key: 'totalQty',
      width: 110,
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: val => fenToYuan(mul(val, 100) || 0),
      width: 110,
    },
    {
      title: '服务营业日',
      dataIndex: 'businessDay',
      key: 'businessDay',
      render: val => moment(val).format('YYYY-MM-DD'),
      width: 170,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 170,
    },
    {
      title: '操作',
      width: 110,
      render: (data) => {
        return (
          <div className={styles.delete}>
            <Popover
              title=""
              placement="top"
              content={(<h5>点击删除此条数据</h5>)}
            >
              <Icon type="close" onClick={() => mainClass.handleDelete(data, 0, 'child', me.successDelete(data))} />
            </Popover>
          </div>
        );
      },
    },
  ];
};
