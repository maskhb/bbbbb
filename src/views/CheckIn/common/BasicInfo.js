import React from 'react';
import { Form, Input, TimePicker, InputNumber, Row, Col } from 'antd';
import { MonitorTextArea } from 'components/input';
import moment from 'moment';
import _ from 'lodash';
import FormItem from './FormItem';
import SelectSource from './SelectSource';
import SelectPriceType from './SelectPriceType';
import Departure from './DepartureDate';

const format = 'HH:mm';

export const DepartureDate = (props) => {
  const { gresDetails } = props?.checkIn || {};

  const { arrivalDepartureDate = [] } = gresDetails || {};

  return (
    <FormItem
      form={props.form}
      detailDefault={gresDetails}
      initialValue={[moment(arrivalDepartureDate[0]), moment(arrivalDepartureDate[1])]}
      label="入离店日期："
      keyName="arrivalDepartureDate"
      rules={[{ required: true, message: '请选择入离店日期' }]}
    >
      <Departure
        checkIn={props.checkIn}
        form={props.form}
        disabled={props.disabled || props.isPreCheckIn}
      />
    </FormItem>
  );
};


export const Source = (props) => {
  const handleChange = () => {
    props.form.resetFields('rateCodeId');
  };
  return (
    <FormItem
      form={props.form}
      detailDefault={props.checkIn?.gresDetails}
      label="业务来源："
      keyName="sourceId"
      rules={[{ required: true, message: '请选择业务来源' }]}
    >
      <SelectSource
        sourceList={props.checkIn.sourceList}
        onChange={handleChange}
        {...props}
        loading={props.loading.effects['checkIn/sourceList']}
        disabled={props.checkIn?.gresDetails?.sourceType === 2 || props.disabled}
      />
    </FormItem>
  );
};

export const PriceType = (props) => {
  const sourceId = props.form.getFieldValue('sourceId');
  const { gresDetails } = props.checkIn || {};
  return (
    <FormItem
      form={props.form}
      detailDefault={(sourceId === gresDetails?.sourceId) ? gresDetails : {}}
      label="价格类型："
      keyName="rateCodeId"
    >
      <SelectPriceType
        rateCodePage={props.checkIn?.rateCodePage}
        dispatch={props.dispatch}
        linkValue={sourceId}
        {...props}
        loading={props.loading.effects['checkIn/rateCodePage']}
      />
    </FormItem>
  );
};

// 销售部门
export const SalesDept = (props) => {
  const { checkIn: { sourceList } } = props;
  const curItem = _.find(sourceList?.dataList, (item) => {
    return item.sourceId === props.form.getFieldValue('sourceId');
  });

  return !curItem?.isRecommend ? (
    <FormItem
      form={props.form}
      detailDefault={curItem}
      label="销售部门："
      keyName="depName"
    >
      <Input disabled />
    </FormItem>
  ) : (
    <FormItem
      form={props.form}
      detailDefault={props.checkIn?.gresDetails}
      label="推荐人："
      keyName="salesMan"
    >
      <Input maxLength={50} disabled={props.disabled} />
    </FormItem>
  );
};

export const Memo = (props) => {
  return (
    <Form.Item
      label="备注："
    >
      {props.form.getFieldDecorator('memo', {
        initialValue: props.checkIn?.gresDetails ? props.checkIn?.gresDetails?.memo : '',
      })(
        <MonitorTextArea
          placeholder="请输入备注"
          datakey="memo"
          rows={5}
          maxLength={200}
          form={props.form}
          disabled={props.disabled}
        />
      )}
    </Form.Item>
  );
};

let isChangeGuest = false;

export const GuestName = (props) => {
  const { tanantInfo, phone, guestName } = props.form.getFieldsValue();
  const handleChange = (e) => {
    const { value } = e.target;
    if (!props.isEdit) {
      const tanantItem = tanantInfo[0]?.value;
      if (
        tanantItem && guestName === tanantItem?.guestName
        && phone === tanantItem?.mobile
        && !isChangeGuest) {
        props.form.setFieldsValue({ 'tanantInfo[0].value.guestName': value });
      } else {
        isChangeGuest = true;
      }
    }
  };

  return (
    <FormItem
      form={props.form}
      detailDefault={props.checkIn?.gresDetails}
      label="预订人姓名："
      keyName="guestName"
      rules={[{ required: true, message: '请输入预订人姓名' }]}
    >
      <Input maxLength="20" onChange={handleChange} disabled={props.disabled} />
    </FormItem>
  );
};

export const GuestPhone = (props) => {
  const { tanantInfo, phone, guestName } = props.form.getFieldsValue();
  const handleChange = (e) => {
    const { value } = e.target;
    if (!props.isEdit) {
      const tanantItem = tanantInfo[0].value;
      if (guestName === tanantItem?.guestName && phone === tanantItem?.mobile) {
        props.form.setFieldsValue({ 'tanantInfo[0].value.mobile': value });
      }
    }
  };
  return (
    <FormItem
      form={props.form}
      detailDefault={props.checkIn?.gresDetails}
      label="预订人电话："
      keyName="phone"
      rules={[{
        required: true, message: '请输入预订人电话',
      }, {
        pattern: /^1\d{10}$/,
        message: '请输入11位数字',
      }]}
    >
      <Input onChange={handleChange} disabled={props.disabled} />
    </FormItem>
  );
};

export const RemainTime = (props) => {
  const { remainTime } = props.checkIn?.gresDetails || {};

  return (
    <FormItem
      form={props.form}
      detailDefault={props.checkIn?.gresDetails}
      initialValue={remainTime ? moment(moment(remainTime), 'HHmm') : ''}
      label="房间保留至："
      keyName="remainTimeFormat"
    >
      <TimePicker format={format} disabled={props.disabled} />
    </FormItem>
  );
};

export const Members = (props) => {
  return (
    <FormItem
      form={props.form}
      detailDefault={props.checkIn?.gresDetails}
      label="成员数："
      keyName="arrMember1"
    >
      <Input.Group>
        <Row gutter={16}>
          <Col span={6}>
            <FormItem
              form={props.form}
              detailDefault={props.checkIn?.gresDetails}
              keyName={`arrMember[${0}]`}
            >
              <InputNumber disabled={props.disabled} min={0} step={1} precision={0} placeholder="男性" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              form={props.form}
              detailDefault={props.checkIn?.gresDetails}
              keyName={`arrMember[${1}]`}
            >
              <InputNumber disabled={props.disabled} min={0} step={1} precision={0} placeholder="女性" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              form={props.form}
              detailDefault={props.checkIn?.gresDetails}
              keyName={`arrMember[${2}]`}
            >
              <InputNumber disabled={props.disabled} min={0} step={1} precision={0} placeholder="儿童" />
            </FormItem>
          </Col>
        </Row>
      </Input.Group>
    </FormItem>
  );
};
