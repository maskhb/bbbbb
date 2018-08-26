
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Button, Modal, message } from 'antd';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
// import FormErrorPopover from 'components/Form/FormErrorPopover';
import TabsCard from 'components/TabsCard';
import Authorized from 'utils/Authorized';
import checkPermission from 'components/Authorized/CheckPermissions';

import { goTo } from 'utils/utils';


import BasicInfo from '../../components/details/BasicInfo';
import GoodsInfo from '../../components/details/GoodsInfo';
import ApplyInfo from '../../components/details/ApplyInfo';
import OriginOrderInfo from '../../components/details/OriginOrderInfo';
import PayInfo from '../../components/details/PayInfo';
import RefundInfo from '../../components/details/RefundInfo';
import OperateLog from '../../components/details/OperateLog';
import ModalApprove from './ModalApprove';
import { afterSaleTypeOptions } from '../../attr';

import { ObjectRemoveByReg, checkRequestBody, transformQueryOrder } from './utils';
// import ModalReturnApprove from ''
// import { goTo } from '../../../../utils/utils';

// import ModalReturnApprove from '../components/ModalReturnApprove';

// const { TabPane } = Tabs;

const PMS = {
  add: 'OPERPORT_JIAJU_AFTERSERVICELIST_ADD',
  edit: 'OPERPORT_JIAJU_AFTERSERVICELIST_EDIT',
  check: 'OPERPORT_JIAJU_AFTERSERVICELIST_CHECK',
  detail: 'OPERPORT_JIAJU_AFTERSERVICELIST_DETAILS',
};
@connect(({ aftersale, user, goods, loading }) => ({
  aftersale,
  goods,
  user,
  loading: loading.models.aftersale,
  submitting: (loading.effects['aftersale/applyOrderSaveApplyDetailInfo'] ||
    loading.effects['aftersale/applyOrderAuditApplyOrder']
  ),
}))
class view extends PureComponent {
  static defaultProps = {};
  // state = {
  //   VisibleModalApprove: false,
  // }
  state = {
    modalVisible: false,
  }

  componentWillMount() {
    if (!checkPermission(PMS[this.getPattern()])) {
      this.props.dispatch(routerRedux.push('/exception/403'));
    }
  }

  componentDidMount() {
    if (this.getAfterSaleType() === 'refund') {
      this.props.dispatch({
        type: 'aftersale/getAfterSaleReasons',
        payload: {
          afterSaleType: this.getAfterSaleTypeId(),
        },
      });
    }
    if (!this.isAdd()) {
      this.initDetail();
    }
  }

  getId() {
    return this.props.id;
  }

  getAfterSaleType() {
    return this.props.type || 'refund';
  }

  getAfterSaleTypeId() {
    for (const option of afterSaleTypeOptions) {
      if (option.key === this.getAfterSaleType()) {
        return option.value;
      }
    }
    return 1;
  }

  getPattern() {
    // const param = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    return this.props.pattern || 'detail';
    // console.log(this.props.pattern);
  }

  getDetail() {
    return this.props.aftersale?.queryApplyOrderDetail;
  }

  getCrumbTitle() {
    const title = '售后订单';

    if (this.isAdd()) {
      return `新增${title}`;
    } else if (this.isApprove()) {
      return `审核${title}`;
    } else if (this.isEdit()) {
      return `编辑${title}`;
    }
    return `${title}详情`;
  }

  getAfterSaleTypeName() {
    switch (this.getAfterSaleType()) {
      case 'refund':
        return '仅退款售后单';
      case 'exchange':
        return '换货售后单';
      case 'return':
        return '退货退款售后单';
      default:
        return '';
    }
  }

  getSubmitTitle() {
    const title = '提交';
    if (this.isAdd()) {
      return title;
    } else if (this.isApprove()) {
      return '审核';
    } else if (this.isEdit()) {
      return '保存';
    }
    return title;
    // return `${title}详情`;
  }

  getBasicInfoType() {
    let type = 4;
    switch (this.getAfterSaleType()) {
      case 'exchange':
        type = 5;
        break;
      case 'refund':
        type = 6;
        break;
      default:
        type = 4;
    }

    if (this.isAdd()) {
      return type + 3;
    }
    if (this.isEdit() || this.isApprove()) {
      return type + 6;
    }
    return type;
  }

  getOptions() {
    const options = {};
    const { aftersale: { afterSaleReasons } } = this.props;
    if (this.getAfterSaleType() === 'refund') {
      options.reasonOptions = afterSaleReasons[this.getAfterSaleTypeId()] || [];
    }
    return options;
  }

  getReasonNameByReasonId(id) {
    if (id && this.getAfterSaleType() === 'refund') {
      const { aftersale: { afterSaleReasons } } = this.props;
      for (const reason of (afterSaleReasons[this.getAfterSaleTypeId()] || [])) {
        if (reason.value === id) {
          return reason.label;
        }
      }
    }
  }

  getOrderInfo = (orderInfo) => {
    const { orderId, orderSn, parentOrderId, parentOrderSn,
      orderInfoVO: orderInfoVo, createdBy: userId } = orderInfo;
    if (!orderInfoVo) {
      return this.getDetailApplyInfo();
    }
    return {
      ...this.getDetailApplyInfo(),
      merchantId: orderInfoVo.merchantId,
      merchantName: orderInfoVo.merchantName,
      factoryId: orderInfoVo?.factoryId,
      factoryName: orderInfoVo?.factoryName,
      provinceId: orderInfoVo.provinceId,
      areaId: orderInfoVo.areaId,
      cityId: orderInfoVo.cityId,
      communityId: orderInfoVo.communityId,
      nickName: orderInfoVo.userNickname,
      userId: userId || this.getDetail()?.userId,
      userMobile: orderInfoVo.userMobile,
      orderId,
      orderSn,
      parentOrderId,
      parentOrderSn,
    };
  }

  getDetailApplyInfo() {
    const detail = this.getDetail();
    if (detail) {
      const { afterSaleStatus, afterSaleType, applyOrderSn, applyOrderId,
        areaId, cityId, communityId, consumerRemark, reasonName, reasonId,
        createdBy, createdByNick, createdTime, customRemark, factoryId, factoryName, isDelete,
        merchantId, merchantName, orderId, orderSn, parentOrderId, parentOrderSn,
        personLiable, provinceId, serviceType, settlementStatus, shutDownStatus,
        userId, userMobile } = detail;
      return { afterSaleStatus,
        afterSaleType,
        applyOrderSn,
        applyOrderId,
        areaId,
        cityId,
        communityId,
        consumerRemark,
        createdBy,
        createdByNick,
        createdTime,
        customRemark,
        reasonName: reasonName || this.getReasonNameByReasonId(reasonId),
        reasonId,
        factoryId,
        factoryName,
        isDelete,
        merchantId,
        merchantName,
        orderId,
        orderSn,
        parentOrderId,
        parentOrderSn,
        personLiable,
        provinceId,
        serviceType,
        settlementStatus,
        shutDownStatus,
        userId,
        userMobile,
        nickName: detail.orderInfoVO?.userNickname,
        ...ObjectRemoveByReg(
          detail.orderInfoVO,
          /regionName|orderStatus|deliveryMethod|consignee|createdTime|orderAmountPaid|detailedAddress|userNickname/),
      };
    }
    return {};
  }

  getParams = () => {
    const vals = this.props.form.getFieldsValue();
    const { refundIntentionList, applyInfoVo = {}, goodsList,
      exchangeGoddsList: orderGoodsExchangeList, orderInfoVo, hasRefundChange = false,
      customRemark, consumerRemark, reasonName, reasonId, personLiable } = vals;
    // [applyInfoVo.pickupProvinceId,] = applyInfoVo.locations.value[0];
    if (applyInfoVo.locations) {
      // eslint-disable-next-line
      applyInfoVo.pickupProvinceId = applyInfoVo.locations?.value[0];
      // eslint-disable-next-line
      applyInfoVo.pickupCityId = applyInfoVo.locations?.value[1];
      // eslint-disable-next-line
      applyInfoVo.pickupAreaId = applyInfoVo.locations?.value[2];
    }
    delete applyInfoVo.locations;
    return {
      applyInfoVo: {
        ...this.getDetail()?.applyInfoVo,
        ...applyInfoVo,
      },
      applyOrderVo: {
        // ...vals.orderInfoVo,
        ...this.getOrderInfo(orderInfoVo),
        afterSaleType: this.getAfterSaleTypeId(),
        // consumerRemark: 23,
        createdBy: this.props.user.current.accountId,
        reasonId: reasonId || this.getDetail()?.reasonId,
        reasonName: this.getReasonNameByReasonId(
          reasonId
        ) || reasonName || this.getDetail()?.reasonName,
        createdByNick: this.getDetail()?.createdByNick || this.props.user.current.name,
        customRemark: customRemark || this.getDetail()?.customRemark,
        consumerRemark: consumerRemark || this.getDetail()?.consumerRemark,
        personLiable: personLiable || this.getDetail()?.personLiable,
        serviceType: this.getAfterSaleTypeId(),
        userId: this.getDetail()?.createdBy || orderInfoVo?.userId || orderInfoVo?.createdBy,
        // parentOrderId: '2777353460459520',
        // parentOrderSn: '2018071108454465178112',
      },
      orderGoodsList: (goodsList ? goodsList?.map((good) => {
        const { applyOrderId, ...other } = good;
        return other;
      }) : this.getDetail()?.orderGoodsList) || [],
      refundIntentionList: (
        (refundIntentionList?.length > 0 || hasRefundChange) ?
          refundIntentionList : this.getDetail()?.refundIntentionList
      ) || [],
      orderGoodsExchangeList: (
        orderGoodsExchangeList || this.getDetail()?.orderGoodsExchangeList
      ) || [],
    };
  }

  isAdd() {
    return this.getPattern() === 'add';
  }

  isEdit() {
    return this.getPattern() === 'edit';
  }

  isApprove() {
    return this.getPattern() === 'approve';
  }

  isEditable() {
    return this.isEdit() || this.isApprove() || this.isAdd();
  }

  initDetail() {
    this.props.dispatch({
      type: 'aftersale/queryApplyOrderDetail',
      payload: {
        applyOrderSn: this.getId(),
      },
    });
  }

  handleSubmit = () => {
    switch (this.getPattern()) {
      case 'approve':
        this.handleShowApprove();
        break;
      case 'add':
        this.handleAdd();
        break;
      case 'edit':
        this.handleUpdate();
        break;
      default:
        break;
    }
  }

  handleShowApprove = () => {
    if (this.getAfterSaleType() === 'refund') {
      this.props.form.validateFields((err) => {
        if (err) {
          return;
        }
        this.props.dispatch({
          type: 'aftersale/applyOrderCheckAuditStatus',
          payload: {
            applyOrderId: this.getDetail()?.applyOrderId,
          },
        }).then((r) => {
          if (r) {
            Modal.error({
              title: '系统错误提示',
              content: '该申请单为已审核状态，无法再次审核',
              okText: '关闭',
            });
            return;
          }
          Modal.confirm({
            title: '确定审核同意该单退款操作吗？',
            content: '请确认退款信息无误。',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              this.props.dispatch({
                type: 'aftersale/applyOrderCheckSettlementStatus',
                payload: {
                  afterSaleType: this.getAfterSaleTypeId(),
                  applyOrderId: this.getDetail()?.applyOrderId,
                },
              }).then((rs) => {
                if (rs === true) {
                  this.setState({
                    modalVisible: true,
                  });
                } else {
                  this.handleApprove();
                }
              });
            },
          });
        });
      });
    } else {
      this.setState({
        modalVisible: true,
      });
    }
  }

  handleCancelApprove = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleUpdate = () => {
    this.props.form.validateFields((err, { hasRefund }) => {
      if (err) {
        return;
      }
      const body = ObjectRemoveByReg(this.getParams());
      if (!checkRequestBody(body, { hasRefund, aftersaleType: this.getAfterSaleType() })) {
        return;
      }
      Modal.confirm({
        title: '确定要保存编辑后的内容吗？',
        content: '请确认信息无误',
        onOk: () => {
          this.props.dispatch({
            type: 'aftersale/applyOrderUpdateApplyDetailInfo',
            payload: body,
          }).then((s) => {
            if (s) {
              goTo('/aftersale/list');
            }
          });
        },
      });
    });
  }

  handleAdd = () => {
    this.props.form.validateFields((err, { hasRefund, orderInfoVo }) => {
      if (err) {
        return;
      }
      const body = ObjectRemoveByReg(this.getParams());
      if (!checkRequestBody(body, {
        type: 'add', hasRefund, orderInfoVo, aftersaleType: this.getAfterSaleType(),
      })) {
        return;
      }

      Modal.confirm({
        title: `确认新增为${this.getAfterSaleTypeName()}吗?`,
        content: '请确认信息填写无误',
        onOk: () => {
          this.props.dispatch({
            type: 'aftersale/applyOrderSaveApplyDetailInfo',
            payload: body,
          }).then((s) => {
            if (s) {
              goTo('/aftersale/list');
            }
          });
        },
      });
    });
  }

  handleCancel = () => {
    if (this.getPattern() === 'edit') {
      goTo('/aftersale/list');
    } else if (this.getPattern() === 'approve') {
      Modal.confirm({
        title: '确定要取消该售后单吗？',
        content: '取消后将关闭此售后单。',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'aftersale/applyOrderCheckAuditStatus',
            payload: {
              applyOrderId: this.getDetail()?.applyOrderId,
            },
          }).then((res) => {
            if (res === true) {
              Modal.error({
                title: '系统错误提示',
                content: '该申请单为已审核状态，无法再次取消',
                okText: '关闭',
              });
              return;
            }
            this.props.dispatch({
              type: 'aftersale/applyOrderCancelApplyOrder',
              payload: this.getDetail(),
            }).then((s) => {
              if (s) {
                goTo('/aftersale/list');
              }
            });
          });
        },
      });
    }
  }

  handleApprove =(cb) => {
    this.props.form.validateFields((err, vals) => {
      if (err) {
        return;
      }
      const { auditVo, hasRefund } = vals;
      const body = ObjectRemoveByReg(this.getParams());
      if (!checkRequestBody(body, { hasRefund, aftersaleType: this.getAfterSaleType() })) {
        return;
      }
      return this.props.dispatch({
        type: 'aftersale/applyOrderAuditApplyOrder',
        payload: ObjectRemoveByReg({
          auditVo: {
            ...auditVo,
            applyOrderId: this.getDetail()?.applyOrderId,
            afterSaleType: this.getDetail()?.afterSaleType,
          },
          applyInfoDetailVo: body,
        }),
      }).then((res) => {
        if (res) {
          message.success('审核成功!!!');
          goTo('/aftersale/list');
        }
        if (cb) {
          cb();
        }
      });
    });
  }

  childProps = () => {
    const { form, dispatch } = this.props;
    return {
      form,
      dispatch,
      afterSaleType: this.getAfterSaleTypeId(),
      applyOrderId: this.getDetail()?.applyOrderId,
      // detail: this.getDetail(),
    };
  }

  render() {
    const { form, submitting, type, loading } = this.props;
    const detail = this.getDetail();
    window.form = form;
    window.ref = this;
    // eslint-disable-next-line
    let { orderInfoVo = {}, ...other } = form.getFieldsValue();
    orderInfoVo = transformQueryOrder(orderInfoVo, other, detail);

    // console.log('orderInfoVo', orderInfoVo);
    return (
      <PageHeaderLayout crumbTitle={this.getCrumbTitle()}>
        <BasicInfo
          {...this.props}
          loading={!!loading}
          type={this.getBasicInfoType()}
          options={this.getOptions()}
          detailVO={{ ...detail, ...orderInfoVo }}
        />
        <Card>
          <TabsCard>
            <GoodsInfo
              {...this.props}
              tab="商品信息"
              detailVO={detail}
              type={type === 'exchange' ? 1 : 0}
              aftersaleType={this.getAfterSaleType()}
              // actionType={this.getPattern()}
              isEdit={this.isEditable()}
            />
            {this.getAfterSaleType() !== 'refund' ? (
              <ApplyInfo
                {...this.props}
                detailVO={detail}
                isEdit={this.isEditable()}
                showDeliver={this.getAfterSaleType() === 'exchange'}
                forceRender
                tab="申请信息"
              />
              ) : null }
            <RefundInfo
              {...this.props}
              isEdit={this.isEditable()}
              detailVO={detail}
              forceRender
              tab="退款意向"
            />
            <OriginOrderInfo
              {...this.props}
              orderInfoVO={orderInfoVo?.orderInfoVO || detail?.orderInfoVO}
              tab="原单据信息"
            />
            <PayInfo
              {...this.props}
              paymentRecordVOList={
                  orderInfoVo?.paymentRecordVOList || detail?.paymentRecordVOList
                }
              tab="支付信息"
            />
            {!this.isAdd() ? (
              <OperateLog
                {...this.props}
                operateLogList={detail?.operateLogList}
                tab="状态处理日志"
              />
            ) : null}
          </TabsCard>
        </Card>
        {
          this.getPattern() !== 'detail' && (
            <DetailFooterToolbar
              form={form}
              // pattern={this.getPattern()}
              submitBtnTitle={this.getSubmitTitle()}
              handleSubmit={this.handleSubmit}
              submitting={submitting}
            >
              { this.getPattern() === 'approve' && (
                <Authorized authority="OPERPORT_JIAJU_AFTERSERVICELIST_CLOSE">
                  <Button
                    type="danger"
                    style={{ marginLeft: 20 }}
                    onClick={this.handleCancel}
                  >
                    取消售后单
                  </Button>
                </Authorized>
              )}
            </DetailFooterToolbar>
          )
        }
        {this.isApprove() && (
          <ModalApprove
            {...this.childProps()}
            type={this.getAfterSaleType()}
            visible={this.state.modalVisible}
            onCancel={this.handleCancelApprove}
            onApprove={this.handleApprove}
          />
        )}
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(view);
