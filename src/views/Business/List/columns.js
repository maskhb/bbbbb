import { Modal, Form, Input, Button } from 'antd';

import React from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { format } from 'components/Const';
import styles from './view.less';

const { FormItem } = Form;

export default () => {
  function asso(status) {
    Modal.info({
      title: '关联厂商',
      content: (
        /* FIXME:内容报错 */
        <div>
          <Form>
            <FormItem label="当前商家：">
              {status.unionMerchantName}
            </FormItem>
            <FormItem label="关联厂商：">
              <Input placeholder="请输入ID" />
              <Button type="primary">
                校验
              </Button>
            </FormItem>
          </Form>
        </div>
      ),
      onOk() {
        console.log(status);// eslint-disable-line
      },
    });
  }
  function showModelConfirm(status, type) {
    let genre = '';
    let main = '';
    switch (type) {
      case 'up':
        genre = '上架该商家';
        main = '上架后该商家将正常可见，也可登陆后台';
        break;
      case 'down':
        genre = '下架该商家';
        main = '下架后该商家将无法在前端显示，也无法登陆后台';
        break;
      case 'fz':
        genre = '冻结该商家';
        main = '冻结后该商家将无法在前端显示';
        break;
      case 'unfz':
        genre = '解冻该商家';
        main = '解冻后该商家将正常可见';
        break;
      case 'disa':
        genre = '解除关联';
        main = '是否解除与厂商的关联关系';
        break;
      default:
        genre = '';
        main = '';
        break;
    }
    console.log(status, type);// eslint-disable-line
    Modal.confirm({
      title: `确定要${genre}？`,
      content: main,
      onOk() {
        console.log('ok');// eslint-disable-line
      },
      okText: '确定',
      cancelText: '取消',
    });
  }
  function renderOperat(val, data) {
    const { status } = val;
    switch (status) {
      case 1:
        return (
          <div className={styles.operating}>
            <a >查看详情</a>
            <a >编辑信息</a>
            {data.merchantType === 2 ? (!data.unionMerchantId ? <a onClick={() => asso(status)}>关联厂商</a> : <a onClick={() => showModelConfirm(status, 'disa')}>解除关联</a>) : null}
            <Link to={`/business/list/manageAccount/${val.merchantName || 'hahahah'}`}>
              管理帐号
            </Link>
            <a >商家后台</a>
            <a onClick={showModelConfirm.bind(this, status, 'up')}>上架</a>
            <a onClick={showModelConfirm.bind(this, status, 'fz')}>冻结</a>
          </div>
        );

      case 2:
        return (
          <div className={styles.operating}>
            <a>查看详情</a>
            <a>编辑信息</a>
            {data.merchantType === 2 ? (!data.unionMerchantId ? <a onClick={() => asso(status)}>关联厂商</a> : <a onClick={() => showModelConfirm(status, 'disa')}>解除关联</a>) : null}
            <a>管理帐号</a>
            <a>商家后台</a>
            <a onClick={showModelConfirm.bind(this, status, 'down')}>下架</a>
            <a onClick={showModelConfirm.bind(this, status, 'fz')}>冻结</a>
          </div>
        );

      case 3:
        return (
          <div className={styles.operating}>
            <a>查看详情</a>
            <a>编辑信息</a>
            {data.merchantType === 2 ? (!data.unionMerchantId ? <a>关联厂商</a> : <a>解除关联</a>) : null}
            <a>管理帐号</a>
            <a>商家后台</a>
            <a onClick={showModelConfirm.bind(this, status, 'down')}>下架</a>
            <a onClick={showModelConfirm.bind(this, status, 'unfz')}>解冻</a>
          </div>
        );

      default:
        return '全部';
    }
  }

  return [
    {
      title: '商家ID  ',
      dataIndex: 'merchantId',
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
    },
    {
      title: '关联厂家',
      dataIndex: 'unionMerchantName',

    },
    {
      title: '类型',
      dataIndex: 'merchantType',
      render: (val) => {
        switch (val) {
          case 1:
            return '厂商';
          case 2:
            return '经销商';
          case 3:
            return '小商家';
          default:
            return '全部';
        }
      },
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
    },
    {
      title: '经营范围',
      dataIndex: 'operateScopeIdList',
    },

    {
      title: '关联项目',
      dataIndex: 'communityIdList',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => {
        switch (val) {
          case 1:
            return '已下架';
          case 2:
            return '已开通';
          case 3:
            return '已冻结';
          default:
            return '全部';
        }
      },
    },
    {
      title: '操作',
      render: (val, data) => renderOperat(val, data),
    },
  ];
};
