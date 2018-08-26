/*
 * @Author: wuhao
 * @Date: 2018-06-15 11:16:07
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-24 08:50:24
 *
 * 售后 基本信息组件  模版字段
 */
// 配置的字段对应关系
import { RETURN_REASONS } from '../../../attr';

export function getFields() {
  return {
    用户名: {
      fieldName: 'userId',
      showName: '用户名',
      render(data) {
        return (
          data?.userId || data?.userNickname ||
          data?.orderInfoVO?.userNickname ||
          data?.userName || data?.orderInfoVO?.userName
        );
      },
    },
    申请日期: {
      fieldName: 'createdTimeFormat',
      showName: '申请日期',
    },
    经手人: {
      fieldName: 'createdByNick',
      showName: '经手人',
    },
    审核状态: {
      fieldName: 'afterSaleStatusFormat',
      showName: '审核状态',
      isRed: 1,
    },
    是否生成退款单: {
      fieldName: 'whetherRefundNoFormat',
      showName: '是否生成退款单',
    },
    退款状态: {
      fieldName: 'refundStatusFormat',
      showName: '退款状态',
      isRed: 1,
    },
    已结算金额: {
      fieldName: 'settleAmountFormat',
      showName: '已结算金额',
      value: 0,
    },
    '责任归属（客服）': {
      fieldName: 'responsibilityFormat',
      showName: '责任归属（客服）',
    },
    '退货原因（客服）': {
      fieldName: 'returnReason',
      showName: '退货原因（客服）',
      render(data) {
        for (const rs of RETURN_REASONS) {
          if (rs.value === Number(data?.returnReason)) {
            return rs.label;
          }
        }
        return data?.returnReason;
      },
    },
    '退货类型（客服）': {
      fieldName: 'returnTypeFormat',
      showName: '退货类型（客服）',
    },
    结算状态: {
      fieldName: 'settlementStatusFormat',
      showName: '结算状态',
      isRed: 1,
      render(data) {
        return data?.settlementStatusFormat || data?.settleStatusFormat;
      },
    },
    是否生成退货单: {
      fieldName: 'whetherReturnNoFormat',
      showName: '是否生成退货单',
    },
    入库状态: {
      fieldName: 'returnStatusFormat',
      showName: '入库状态',
    },
    申请人: {
      fieldName: 'userName',
      showName: '申请人',
      render(data) {
        return data?.userName || data?.orderInfoVO?.userNickname;
      },
      // value: '恒腾家居',
    },
    售后类型: {
      fieldName: 'afterSaleTypeFormat',
      showName: '售后类型',
    },
    售后原因: {
      fieldName: 'reasonName',
      showName: '售后原因',
      rules: [
        { required: true, message: '请选择售后原因' },
      ],
      selectOptionName: 'reasonOptions',
      selectFieldName: 'reasonId',
      // selectOptions: [
      // '客户误购、多购',
      // '非质量方面不满意',
      // '生厂商问题',
      // '物流商/自提点问题，如服务态度、配送延误、包装损坏',
      // '库管问题、如备货出错',
      // '质量问题',
      // '物流遗失',
      // '仓库少发货',
      // '物流破损',
      // '实物与网站描述不符',
      // '其他原因',
      // ],
    },
    操作人: {
      fieldName: 'createdByNick',
      showName: '操作人',
      value: '',
    },
    责任人: {
      fieldName: 'personLiable',
      showName: '责任人',
      maxLength: 15,
    },
    备注: {
      fieldName: 'customRemark',
      showName: '备注',
      maxLength: 100,
    },
    客户备注: {
      fieldName: 'consumerRemark',
      showName: '客户备注',
      maxLength: 100,
      // rules: [
      //   { required: true, message: '请输入客户备注' },
      // ],
    },
    客服备注: {
      fieldName: 'customRemark',
      showName: '客服备注',
      maxLength: 100,
      // rules: [
      //   { required: true, message: '请输入客服备注' },
      // ],
    },
    商品退货总价: {
      fieldName: 'intentRefundAmountFormat',
      showName: '商品退货总价',
      isRed: 2,
      value: 0,
    },
    商品退款金额: {
      fieldName: 'intentRefundAmountFormat',
      showName: '商品退款金额',
      value: 0,
    },
    实际退款总金额: {
      fieldName: 'hasRefundAmountFormat',
      showName: '实际退款总金额',
      isRed: 2,
      value: 0,
    },
    原商品售后总额: {
      fieldName: 'totalOriginAfterSaleAmountFormat',
      showName: '原商品售后总额',
      isRed: 2,
      value: 0,
    },
    换货商品总额: {
      fieldName: 'totalExchangeAmountFormat',
      showName: '换货商品总额',
      isRed: 2,
      value: 0,
    },
    实际差价金额: {
      fieldName: 'aftersaleActualDifferenceAmount',
      showName: '实际差价金额',
      isRed: 2,
      value: 0,
    },
    '（+为需要退款，-为需要补缴）': {
      isRed: 2,
      value: '（+为需要退款，-为需要补缴）',
    },
  };
}

// 获取infos信息
export const getBaseInfos = (key) => {
  const infos = {
    baseOrder: [
      '用户名',
      '申请日期',
      '经手人',
      '审核状态',
      '是否生成退款单',
      '退款状态',
      '已结算金额',
      '责任归属（客服）',
      '退货原因（客服）',
      '退货类型（客服）',
      '结算状态',
      '是否生成退货单',
      '入库状态',
    ],
    baseOrderEditApprove: [
      '用户名',
      '申请日期',
      '操作人',
      '审核状态',
      '是否生成退款单',
      '退款状态',
      '已结算金额',
      '责任归属（客服）',
      '退货原因（客服）',
      '退货类型（客服）',
      '结算状态',
      '是否生成退货单',
      '入库状态',
    ],
    refundOrder: [
      '申请人',
      '售后类型',
      '审核状态',
      '退款状态',
      '售后原因',
      '已结算金额',
      '操作人',
      '责任人',
      '备注',
    ],
    baseAddAfter: [
      '用户名',
      '申请日期',
      '操作人',
      '结算状态',
      '已结算金额',
    ],
    refundOrderForAfter: [
      '申请人',
      '售后类型',
      '审核状态',
      '结算状态',
      '退款状态',
      '已结算金额',
      '操作人',
    ],
  };

  return {
    infos: infos[key] || null,
  };
};

// 获取remarks信息
export const getBaseRemarks = () => {
  return {
    remarks: [
      '客户备注',
      '客服备注',
    ],
  };
};

// 获取inputs信息
export const getBaseInputs = (key) => {
  const inputs = {
    refundOrder: [
      '售后原因',
      '责任人',
      '备注',
    ],
    remark: [
      '客户备注',
      '客服备注',
    ],
  };

  return {
    inputs: inputs[key] || null,
  };
};

// 获取alerts信息
export const getBaseAlerts = (key) => {
  const alerts = {
    returnBill: [
      '商品退货总价',
    ],
    swapOrder: [
      '原商品售后总额',
      '-',
      '换货商品总额',
      '=',
      '实际差价金额',
      '（+为需要退款，-为需要补缴）',
    ],
    refundOrder: [
      '商品退款金额',
      '实际退款总金额',
    ],
  };

  return {
    alerts: alerts[key] || null,
  };
};

// 获取基本详情infos
export const getBaseOrderInfos = () => {
  return getBaseInfos('baseOrder');
};

export const getBaseOrderInfosEditApprove = () => {
  return getBaseInfos('baseOrderEditApprove');
};

// 获取退款详情infos
export const getRefundOrderInfos = () => {
  return getBaseInfos('refundOrder');
};

// 获取新增售后单infos
export const getAddAfterInfos = () => {
  return getBaseInfos('baseAddAfter');
};

// 获取新增、编辑、审核退款售后单infos
export const getAddAfterForRefundInfos = () => {
  return getBaseInfos('refundOrderForAfter');
};

// 获取remark的inputs
export const getRemarkInputs = () => {
  return getBaseInputs('remark');
};

// 获取退款单的inputs
export const getRefundOrderInputs = () => {
  return getBaseInputs('refundOrder');
};

// 获取退货单alerts
export const getReturnBillAlerts = () => {
  return getBaseAlerts('returnBill');
};

// 获取换货单alerts
export const getSwaporderAlerts = () => {
  return getBaseAlerts('swapOrder');
};

// 获取退款单alerts
export const getRefundOrderAlerts = () => {
  return getBaseAlerts('refundOrder');
};

// 获取退货单基本信息
export const getReturnBillBaseInfo = () => {
  return {
    ...getBaseOrderInfos(),
    ...getBaseRemarks(),
    ...getReturnBillAlerts(),
  };
};

// 获取换货单基本信息
export const getSwapOrderBaseInfo = () => {
  return {
    ...getBaseOrderInfos(),
    ...getBaseRemarks(),
  };
};

// 获取退款单基本信息
export const getRefundOrderBaseInfo = () => {
  return {
    ...getRefundOrderInfos(),
    ...getRefundOrderAlerts(),
  };
};

// 获取售后单详情基本信息（退货）
export const getAfterOrderForReturn = () => {
  return getReturnBillBaseInfo();
};

// 获取售后单详情基本信息（退款）
export const getAfterOrderForRefund = () => {
  return getRefundOrderBaseInfo();
};

// 获取售后单详情基本信息（换货）
export const getAfterOrderForSwap = () => {
  return {
    ...getSwapOrderBaseInfo(),
    ...getSwaporderAlerts(),
  };
};

// 获取新增售后单基本信息（退货）
export const getAfterOrderForAddReturn = () => {
  return {
    ...getAddAfterInfos(),
    ...getRemarkInputs(),
    ...getReturnBillAlerts(),
  };
};

// 获取新增售后单基本信息(换货)
export const getAfterOrderForAddSwap = () => {
  return {
    ...getAddAfterInfos(),
    ...getRemarkInputs(),
    ...getSwaporderAlerts(),
  };
};

// 获取编辑、审核售后单基本信息（退货）
export const getAfterOrderForOperReturn = () => {
  return {
    ...getBaseOrderInfosEditApprove(),
    ...getRemarkInputs(),
    ...getReturnBillAlerts(),
  };
};

// 获取编辑、审核售后单基本信息（换货）
export const getAfterOrderForOperSwap = () => {
  return {
    ...getBaseOrderInfosEditApprove(),
    ...getRemarkInputs(),
    ...getSwaporderAlerts(),
  };
};

// 获取新增、编辑、审核售后单基本信息(退款)
export const getAfterOrderForOperRefund = () => {
  return {
    ...getAddAfterForRefundInfos(),
    ...getRefundOrderInputs(),
    ...getRefundOrderAlerts(),
  };
};
