import React from 'react';
import { Card, Form, Col, Row, Input, Radio, Checkbox, InputNumber } from 'antd';
import { d2Col } from 'components/Const';
import { MonitorTextArea, MonitorInput } from 'components/input';
import _ from 'lodash';
import BusinessSelect from 'components/ProjectBusinessSelect/factoryBusiness';
import MerchantSelect from 'components/ProjectBusinessSelect/merchantBusiness';
import styles from '../package.less';
import { fenToYuan } from '../../../../utils/money';
import { getTotal } from './common';

const FormItem = ({
  rules: ruleList, label, keyName, children, detailDefault, form,
  initialValue,
}) => {
  return (
    <Form.Item label={label}>
      {form.getFieldDecorator(keyName, {
        rules: ruleList,
        initialValue: initialValue || (detailDefault ? detailDefault[keyName] : ''),
      })(
        children
      )}
    </Form.Item>
  );
};

export default class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventKey: `merchant_${new Date().getTime()}`,
    };
  }

  /**
   * 计算当前套餐总价
   * @param detail
   * @returns {*}
   */
  getTotal = (detail) => {
    const totalPrice = getTotal(detail);

    this.props.form.setFieldsValue({ totalPrice: fenToYuan(totalPrice, true) });
    return totalPrice;
  }

  handleChangeMerchant = () => {
    const { goodsPackage, dispatch } = this.props;
    const { detail = {} } = goodsPackage;
    detail.packageSpaceVoQs = [];
    detail.totalPrice = this.getTotal(detail);
    detail.minPrice = '';
    this.props.form.setFieldsValue({ minPrice: '' });
    dispatch({ type: 'goodsPackage/saveDetail', payload: detail });
  }

  render() {
    const { form, goodsPackage } = this.props;
    const disabled = false;
    const { arrHouseTypeTags = [], arrDecorateStyle = [], detailDefault } = goodsPackage;
    const { pathname } = this.props.location;
    const isAdd = pathname.match('/add');
    const { eventKey } = this.state;
    /* eslint no-useless-escape:0 */
    const urlPattern = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?.*)?(#.*)?$/;

    return (
      <Card title="基本信息" bordered={false} className={styles.card}>
        <Form
          layout="vertical"
        >
          <Row gutter={16}>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="套餐名称："
                keyName="packageName"
                rules={[{
                  required: true, message: '请输入套餐名称',
                }]}
              >
                <MonitorInput autoComplete="off" maxLength={100} disabled={disabled} placeholder="请输入套餐名称" />
              </FormItem>
            </Col>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="适用户型："
                keyName="arrHouseTypeTags"
                rules={[{
                  required: true, message: '请选择适用户型',
                }]}
              >
                <Checkbox.Group options={_.unionBy(arrHouseTypeTags, 'value')} />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="所属厂家："
                keyName={isAdd ? 'factoryId' : 'factoryName'}
                rules={[{
                  required: true, message: '请输入所属厂家',
                }]}
              >
                <BusinessSelect disabled={!isAdd} eventName={eventKey} placeholder="请输入所属厂家" />
              </FormItem>
            </Col>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="装修风格："
                keyName="decorateStyleTagId"
                rules={[{
                  required: true, message: '请选择装修风格',
                }]}
              >
                <Radio.Group>
                  {
                    _.unionBy(arrDecorateStyle, 'value').map(
                      item =>
                        <Radio value={item.value} key={item.value}>{item.label}</Radio>
                    )
                  }
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="所属商家："
                keyName={isAdd ? 'merchantId' : 'merchantName'}
                rules={[{
                  required: true, message: '请输入所属商家',
                }]}
              >
                <MerchantSelect
                  eventName={eventKey}
                  disabled={!isAdd}
                  placeholder="请输入所属商家"
                  onChange={this.handleChangeMerchant}
                  form={form}
                />
              </FormItem>
            </Col>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="3D展示链接："
                keyName="threeDimenUrl"
                rules={[{
                  message: '请输入正确的url链接',
                  pattern: urlPattern,
                }]}
              >
                <Input autoComplete="off" disabled={disabled} placeholder="请输入3D展示链接" />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col {...d2Col}>
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="排序："
                keyName="orderNum"
                rules={[{
                  required: true, message: '请输入排序',
                }]}
                initialValue={detailDefault.orderNum || 100}
              >
                <InputNumber min={1} max={10000} disabled={disabled} placeholder="请输入" />
              </FormItem>
            </Col>
            <Col {...d2Col}>
              <Form.Item
                form={form}
                detailDefault={detailDefault}
                label="套餐描述："
                keyName="packageDesc"
              >
                {form.getFieldDecorator('packageDesc', {
                  initialValue: detailDefault ? detailDefault.packageDesc : '',
                })(
                  <MonitorTextArea
                    placeholder="请输入套餐描述"
                    datakey="packageDesc"
                    rows={5}
                    maxLength={200}
                    form={form}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
