import React from 'react';
import Authorized from 'utils/Authorized';
import { goTo } from 'utils/utils';
import { Button, Modal, Message, Input } from 'antd';
import styles from './Detail.less';

function showModelConfirm(status, type, me, data) {
  let genre = '';
  let main = '';
  let updateType;
  switch (type) {
    case 'up':
      genre = '上架该商家';
      main = '上架后该商家将正常可见';
      updateType = 2;
      break;
    case 'down':
      genre = '下架该商家';
      main = '下架后该商家将无法在前端显示';
      updateType = 1;
      break;
    case 'fz':
      genre = '冻结该商家';
      main = '冻结后该商家将无法在前端显示，也无法登录后台';
      updateType = 3;
      break;
    case 'unfz':
      genre = '解冻该商家';
      main = '解冻后该商家将正常可见，也可登录后台';
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
          payload: { merchantUpdateStatusVo: { merchantIdList: [data.merchantId], updateType } },
        }).then(() => {
          if (me.props.business.updateStatusRes === 1) {
            Message.success('保存成功');
            me.query();
          }
        });
      } else if (updateType === 9) {
        return me.props.dispatch({
          type: 'business/disunionMerchant',
          payload: {
            merchantId: data.merchantId,
          },
        }).then(() => {
          if (me.props.business.disunionMerchantRes === 1) {
            Message.success('解除成功');
            me.query();
          }
        });
      }
    },
    okText: '确定',
    cancelText: '取消',
  });
}

function goEdit(merchantId, type) {
  goTo(`/business/list/edit/${merchantId}&${type}`);
}

function asso(status, data, me) {
  Modal.confirm({
    width: '535px',
    okText: '确定',
    cancelText: '取消',
    content: renderContent(status, data, me),
    onOk: handleModalOk.bind(this, me, data),
  });
}

function renderContent(status, data, me) {
  return (
    <div ref={(inst) => { me.currModal = inst; }}>{/* eslint-disable-line */}
      <p>当前商家: {data.merchantName}</p>
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
                merchantId: data.merchantId,
                unionMerchantId: me.currModal.children[1].value,
              },
            },
    }).then(() => {
      const res = me.props.business.validateUnionRes;
      console.log(res) //eslint-disable-line
      if (res === 1) {
        return me.props.dispatch({
            type: 'business/queryDetail',
            payload: { merchantId: me.currModal.children[1].value },
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

function handleModalOk(me, data) {
  const { checkFlag = false } = me.state;
  if (!checkFlag) {
    Message.error('请先校验商家后，再提交');
  } else {
    console.log(me.props.dispatch) //eslint-disable-line
    return me.props.dispatch({
      type: 'business/unionMerchant',
      payload: { merchantUnionVo: {
        merchantId: data.merchantId,
        unionMerchantId: me.currModal.children[1].value,
      } },
    }).then(() => {
      if (me.props.business.unionMerchantRes === 1) {
        Message.success('关联成功');
        me.query();
      }
    });
  }
}

function renderButton(data, me) {
  // data == merchantBaseVo
  const status = data?.status;//eslint-disable-line
  const merchantType = data?.merchantType;//eslint-disable-line
  const unionMerchantId = data?.unionMerchantId;//eslint-disable-line

  return (
    <div className={styles.btnBox} style={{ display: 'inline' }}>

      {status && status === 2 ? (
      // 上架
        <div className={styles.btnBox} style={{ display: 'inline' }}>
          <Authorized authority={['OPERPORT_JIAJU_PRODUCTLIST_UNPUBLISH']}>

            <Button
              type="primary"
              onClick={showModelConfirm.bind(this, status, 'down', me, data)}
            >
        下架
            </Button>
          </Authorized>

          <Authorized authority={['OPERPORT_JIAJU_SHOP_FREEZE']}>
            <Button
              type="primary"
              onClick={showModelConfirm.bind(this, status, 'fz', me, data)}
            >
      冻结
            </Button>
          </Authorized>
        </div>
      ) : (
        status !== 3 ? (

          <div className={styles.btnBox} style={{ display: 'inline' }}>

            <Authorized authority={['OPERPORT_JIAJU_PRODUCTLIST_PUBLISH']}>
              <Button
                type="primary"
                onClick={showModelConfirm.bind(this, status, 'up', me, data)}
              >
            上架
              </Button>
            </Authorized>

            <Authorized authority={['OPERPORT_JIAJU_SHOP_FREEZE']}>
              <Button
                type="primary"
                onClick={showModelConfirm.bind(this, status, 'fz', me, data)}
              >
            冻结
              </Button>
            </Authorized>

          </div>
        ) : ''
      )}
      {status && status === 3 ? (
        // 冻结
        <Authorized authority={['OPERPORT_JIAJU_SHOP_UNFREEZE']}>
          <Button
            type="primary"
            onClick={showModelConfirm.bind(this, status, 'unfz', me, data)}
          >
        解冻
          </Button>
        </Authorized>
      ) : ''}

      {merchantType && merchantType === 2 ? (
        unionMerchantId ? (
          <Authorized authority={['OPERPORT_JIAJU_SHOP_UNASSOCIATE']}>
            <Button
              type="primary"
              onClick={showModelConfirm.bind(this, status, 'disa', me, data)}
            >
          解除关联
            </Button>
          </Authorized>

        ) : (
          <Authorized authority={['OPERPORT_JIAJU_SHOP_ASSOCIATE']}>
            <Button
              type="primary"
              onClick={asso.bind(this, status, data, me)}
            >
          关联厂商
            </Button>
          </Authorized>
        )

      ) : ''}


    </div>

  );
}
function renderEditBtn(merchantId, type = 'Basic') {
  return (
    <Authorized
      authority={['OPERPORT_JIAJU_SHOP_EDIT']}
    >
      <Button
        type="primary"
        onClick={() => goEdit(merchantId, type)}
      >
        编辑
      </Button>
    </Authorized>
  );
}
export {
  renderButton,
  renderEditBtn,
};
