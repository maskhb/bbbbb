import { format } from 'components/Const';
import Authorized from 'utils/Authorized';
import cookie from 'cookies-js';
import { goTo } from 'utils/utils';

import { Modal, Input, Button, Message } from 'antd';
import React from 'react';
import TextBeyond from 'components/TextBeyond';
import moment from 'moment';
import { Link } from 'dva/router';
import styles from './view.less';

export default (me) => {
  function asso(status, val) {
    Modal.confirm({
      width: '535px',
      okText: '确定',
      cancelText: '取消',
      content: renderContent(status, val),
      onOk: handleModalOk.bind(me, val),
    });
  }
  function handleModalOk(val) {
    const { checkFlag = false } = me.state;
    if (!checkFlag) {
      Message.error('请先校验商家后，再提交');
    } else {
      return me.props.dispatch({
        type: 'business/unionMerchant',
        payload: { merchantUnionVo: {
          merchantId: val.merchantId,
          unionMerchantId: me.xxx.children[1].value,
        } },
      }).then(() => {
        if (me.props.business.unionMerchantRes === 1) {
          Message.success('关联成功');
          return me.search.handleSearch();
        }
      });
    }
  }
  function renderContent(status, val) {
    return (
      <div ref={(inst) => { me.xxx = inst; }}>{/* eslint-disable-line */}
        <p>当前商家: {val.merchantName}</p>
        <Input
          placeholder="请输入ID"
          id="id"
        />
        <br />
        <Button
          type="primary"
          style={{ marginTop: 15 }}
          onClick={() => {
            return me.props.dispatch({
              type: 'business/validateUnion',
              payload: { merchantUnionVo:
                {
                  merchantId: val.merchantId,
                  unionMerchantId: me.xxx.children[1].value,
                },
              },
      }).then(() => {
        const res = me.props.business.validateUnionRes;
        console.log(res) //eslint-disable-line
        if (res === 1) {
            me.props.dispatch({
              type: 'business/queryDetail',
              payload: { merchantId: me.xxx.children[1].value },
            }).then(() => {
              const name = me.props?.business?.currentDetailRes?.merchantName;
              Message.success(`校验成功 :${name}`);
              me.setState({ checkFlag: true });
            });
        }
      });
    }}
        >
    校验
        </Button>
      </div>
    );
  }

  function showModelConfirm(status, type, val) {
    let genre = '';
    let main = '';
    let updateType;
    switch (type) {
      case 'up':
        genre = '上架该商家';
        main = '上架后该商家将正常可见，也可登陆后台';
        updateType = 2;
        break;
      case 'down':
        genre = '下架该商家';
        main = '下架后该商家将无法在前端显示，也无法登陆后台';
        updateType = 1;
        break;
      case 'fz':
        genre = '冻结该商家';
        main = '冻结后该商家将无法在前端显示';
        updateType = 3;
        break;
      case 'unfz':
        genre = '解冻该商家';
        main = '解冻后该商家将正常可见';
        updateType = 4;
        break;
      case 'disa':
        genre = '解除关联';
        main = '是否解除与厂商的关联关系';
        updateType = 9;
        break;
      default:
        genre = '';
        main = '';
        break;
    }
    Modal.confirm({
      title: `确定要${genre}？`,
      content: main,
      onOk() {
        if (updateType && [1, 2, 3, 4].includes(updateType)) {
          return me.props.dispatch({
            type: 'business/updateStatus',
            payload: { merchantUpdateStatusVo: { merchantIdList: [val.merchantId], updateType } },
          }).then(() => {
            if (me.props.business.updateStatusRes === 1) {
              me.search.handleSearch();
              Message.success('保存成功');
            }
          });
        } else if (updateType === 9) {
          return me.props.dispatch({
            type: 'business/disunionMerchant',
            payload: {
              merchantId: val.merchantId,
            },
          }).then(() => {
            if (me.props.business.disunionMerchantRes === 1) {
              Message.success('解除成功');
              return me.search.handleSearch();
            }
          });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  }
  function getUrl(val) {
    const token = encodeURIComponent(cookie.get('x-manager-token'));
    let url;
    switch (location.hostname) {
      case 'localhost':
      case 'dev':
        url = `http://ht-jj-sj-platform-dev.hd/#/crossauth?merchantId=${val.merchantId}&token=${token}`;
        break;
      case 'ht-yunying-test.htmimi.com':
      case 'test.yy-beta.hd':
        url = `http://ht-jj-sj-platform-test.hd/#/crossauth?merchantId=${val.merchantId}&token=${token}`;
        break;
      default:
        url = `http://ht-jj-sj-platform-dev.hd/#/crossauth?merchantId=${val.merchantId}&token=${token}`;
        break;
    }
    return url;
  }
  function handleJumpToManageAccount(val) {
    const params = {
      merchantName: val.merchantName,
      merchantId: val.merchantId,
    };
    me.props.dispatch({
      type: 'business/savePageInfo',
      payload: params,
    });
    goTo(`/business/list/manageAccount/${val.merchantId}`);
  }

  function renderOperat(val, data) {
    const { status } = val;
    switch (status) {
      case 1:
        return (
          <div className={styles.operating}>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_DETAILS']}>
              <Link to={`/business/list/CurrDetail/${val.merchantId}`}>查看详情</Link>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_EDIT']}>
              <Link to={`/business/list/edit/${val.merchantId}`}>编辑信息</Link>
            </Authorized>
            {data.merchantType === 2 ? (
              !data.unionMerchantId ? (
                <Authorized authority={['OPERPORT_JIAJU_SHOP_ASSOCIATE']}>
                  <a onClick={() => asso(status, val)}>关联厂商</a>
                </Authorized>

                ) : (

                  <Authorized authority={['OPERPORT_JIAJU_SHOP_UNASSOCIATE']}>
                    <a onClick={() => showModelConfirm(status, 'disa', val)}>解除关联</a>
                  </Authorized>

                )
              ) : null }
            <Authorized authority={['OPERPORT_JIAJU_SHOP_ACCOUNTLIST']}>
              <a onClick={() => handleJumpToManageAccount(val)}>
              管理帐号
              </a>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_SHOPSYSTEM']}>
              <a href={getUrl(val)} target="_blank" >商家后台 </a>
            </Authorized>

            <Authorized authority={['OPERPORT_JIAJU_PRODUCTLIST_PUBLISH']}>
              <a onClick={showModelConfirm.bind(this, status, 'up', val)}>上架</a>
            </Authorized>

            <Authorized authority={['OPERPORT_JIAJU_SHOP_FREEZE']}>
              <a onClick={showModelConfirm.bind(this, status, 'fz', val)}>冻结</a>
            </Authorized>

          </div>
        );

      case 2:
        return (
          <div className={styles.operating}>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_DETAILS']}>
              <Link to={`/business/list/CurrDetail/${val.merchantId}`}>查看详情</Link>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_EDIT']}>
              <Link to={`/business/list/edit/${val.merchantId}`}>编辑信息</Link>
            </Authorized>
            {data.merchantType === 2 ? (
              !data.unionMerchantId ? (
                <Authorized authority={['OPERPORT_JIAJU_SHOP_ASSOCIATE']}>
                  <a onClick={() => asso(status, val)}>关联厂商</a>
                </Authorized>

                ) : (

                  <Authorized authority={['OPERPORT_JIAJU_SHOP_UNASSOCIATE']}>
                    <a onClick={() => showModelConfirm(status, 'disa', val)}>解除关联</a>
                  </Authorized>

                )
              ) : null }
            <Authorized authority={['OPERPORT_JIAJU_SHOP_ACCOUNTLIST']}>
              <a onClick={() => handleJumpToManageAccount(val)}>
              管理帐号
              </a>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_SHOPSYSTEM']}>
              <a href={getUrl(val)} target="_blank" >商家后台 </a>
            </Authorized>

            <Authorized authority={['OPERPORT_JIAJU_PRODUCTLIST_UNPUBLISH']}>
              <a onClick={showModelConfirm.bind(this, status, 'down', val)}>下架</a>
            </Authorized>

            <Authorized authority={['OPERPORT_JIAJU_SHOP_FREEZE']}>
              <a onClick={showModelConfirm.bind(this, status, 'fz', val)}>冻结</a>
            </Authorized>
          </div>
        );

      case 3:
        return (
          <div className={styles.operating}>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_DETAILS']}>
              <Link to={`/business/list/CurrDetail/${val.merchantId}`}>查看详情</Link>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_EDIT']}>
              <Link to={`/business/list/edit/${val.merchantId}`}>编辑信息</Link>
            </Authorized>
            {data.merchantType === 2 ? (
              !data.unionMerchantId ? (
                <Authorized authority={['OPERPORT_JIAJU_SHOP_ASSOCIATE']}>
                  <a onClick={() => asso(status, val)}>关联厂商</a>
                </Authorized>

                ) : (

                  <Authorized authority={['OPERPORT_JIAJU_SHOP_UNASSOCIATE']}>
                    <a onClick={() => showModelConfirm(status, 'disa', val)}>解除关联</a>
                  </Authorized>

                )
              ) : null }
            <Authorized authority={['OPERPORT_JIAJU_SHOP_ACCOUNTLIST']}>
              <a onClick={() => handleJumpToManageAccount(val)}>
              管理帐号
              </a>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_SHOPSYSTEM']}>
              <a href={getUrl(val)} target="_blank" >商家后台 </a>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_SHOP_UNFREEZE']}>
              <a onClick={showModelConfirm.bind(this, status, 'unfz', val)}>解冻</a>
            </Authorized>
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
      render(val) {
        return (
          <TextBeyond content={val || ''} maxLength="11" width="300px" />
        );
      },
    },
    {
      title: '关联厂家',
      dataIndex: 'unionMerchantName',
      render(val, data) {
        return (
          <a
            target="_blank"
            href={`jj-platform#/business/list?${data.merchantId}`}
          >
            {val}
          </a>
        );
      },
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
      dataIndex: 'categoryName',
      render: val => (<span> {val} </span>),

    },
    {
      title: '经营范围',
      dataIndex: 'operateScopeNameList',
      render(val) {
        return (
          <TextBeyond content={val || ''} maxLength="15" width="300px" />
        );
      },
    },

    {
      title: '关联项目',
      dataIndex: 'communityNameList',
      render(val) {
        return (
          <TextBeyond content={val || ''} maxLength="15" width="300px" />
        );
      },
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
            return '已上架';
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
