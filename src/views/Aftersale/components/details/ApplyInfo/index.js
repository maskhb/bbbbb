/**
 * 申请信息
 * props
 *   form 表单对象
 *   applyInfoVo Object 申请信息
 *   showReturn  boolean default: true 是否显示退货信息
 *   showDeliver boolean default: false 是否显示发货信息
 *   isEditor boolean default: false 是否编辑状态
 */
import React from 'react';
import { Row, Col } from 'antd';
import { getCustomFieldDecorator as getDecorator } from 'utils/utils';

import DeliveryInfo from './DeliveryInfo';
import ReturnInfo from './ReturnInfo';

const getCustomFieldDecorator = (vo, form) => {
  return getDecorator(vo, form, 'applyInfoVo');
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
    md: { span: 8 },
    lg: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 12 },
    lg: { span: 16 },
  },
};

export default class extends React.PureComponent {
  state = {
    currentOrderSn: null,
  }

  resetApplyInfo = (info, applyForm) => {
    this.state.currentOrderSn = info.orderSn;
    const { form } = this.props;
    const data = { ...applyForm };
    // window.form = form;
    for (const attr of Object.keys(data)) {
      data[attr] = info[attr];
    }
    // console.log('.....', data, info);
    form.setFieldsValue({
      applyInfoVo: data,
    });
    // console.log('reset Info', info);
  }

  render() {
    const { form, applyInfoVo, detailVO, showReturn = true,
      showDeliver = false, isEdit, pattern } = this.props;
    // console.log('applyInfoVo....', form, detailVO, applyInfoVo);
    const { orderInfoVo, applyInfoVo: applyInfoForm } = form.getFieldsValue();
    const orderVo = orderInfoVo?.orderInfoVO;
    const info = {
      ...orderVo,
      ...(detailVO?.applyInfoVo || applyInfoVo),
      pickupProvinceId: orderVo?.provinceId || detailVO?.applyInfoVo?.pickupProvinceId,
      pickupCityId: orderVo?.cityId || detailVO?.applyInfoVo?.pickupCityId,
      pickupAreaId: orderVo?.areaId || detailVO?.applyInfoVo?.pickupAreaId,
      pickupAddress: orderVo?.detailedAddress || detailVO?.applyInfoVo?.pickupAddress,
      deliveryContact: orderVo?.consigneeName || detailVO?.applyInfoVo?.deliveryContact,
      deliveryContactPhone: (
        orderVo?.deliveryContactPhone || detailVO?.applyInfoVo?.deliveryContactPhone
      ),
      contact: orderVo?.consigneeName || detailVO?.applyInfoVo?.contact,
      contactPhone: orderVo?.consigneeMobile || detailVO?.applyInfoVo?.contactPhone,
      distributionType: orderVo?.deliveryMethod || detailVO?.applyInfoVo?.distributionType,
      orderSn: orderVo?.orderSn || detailVO?.orderSn,
    };
    const locations = { value: [
      info?.pickupProvinceId, info?.pickupCityId, info?.pickupAreaId,
    ].filter(l => !!l) };
    // info.locations = locations;
    // console.log(locations.value);
    const getFieldDecorator = getCustomFieldDecorator({
      ...info, locations: { value: [...locations.value] } }, form);
    const currentApplyInfo = Object.assign({}, { ...info }, applyInfoForm);
    // console.log('currentInfoApply...', currentApplyInfo);
    if (!this.state.currentOrderSn && info?.orderSn) {
      this.state.currentOrderSn = info.orderSn;
    }
    if (this.state.currentOrderSn && info?.orderSn &&
       this.state.currentOrderSn !== info.orderSn &&
       applyInfoForm) {
      this.resetApplyInfo(info, applyInfoForm);
    }
    // console.log('orderInfovo....', orderInfoVo);
    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          { showReturn && (
          <Col key="return" span={11} lg={showDeliver ? 10 : 16}>
            <ReturnInfo
              isEdit={isEdit}
              formItemLayout={formItemLayout}
              applyInfoVo={currentApplyInfo}
              getFieldDecorator={getFieldDecorator}
              pattern={pattern}
            />
          </Col>
          )}
          {showDeliver && currentApplyInfo?.returnWay === 1 && (
            <Col key="exchange" span={12} lg={showReturn ? 10 : 16}>
              <DeliveryInfo
                isEdit={isEdit}
                formItemLayout={formItemLayout}
                getFieldDecorator={getFieldDecorator}
                pattern={pattern}
              />
            </Col>)}
          <Col span={0} lg={3} />
        </Row>
      </React.Fragment>
    );
  }
}

