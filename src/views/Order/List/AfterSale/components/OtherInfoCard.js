/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:23:53
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-19 15:19:52
 *
 * 生成售后单 其他操作显示
 */

import React, { PureComponent } from 'react';

import { Card, Input as AntdInput, Row, Col, Form } from 'antd';

import AfterSaleMoenyLayer from './AfterSaleMoenyLayer';

const { Item: FormItem } = Form;
const { TextArea } = AntdInput;

class OtherInfoCard extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { form, className, colLeftSpan = 3 } = this.props;

    return (
      <Card title="其他信息" className={`${className || ''}`} >
        <Row>
          <Col span={colLeftSpan}>
            <span>配送方式：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>全国配送免费</span>
          </Col>
        </Row>

        <Row>
          <Col span={colLeftSpan}>
            <span>发票信息：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>不需要</span>
          </Col>
        </Row>

        <Row>
          <Col span={colLeftSpan}>
            <span>订单备注：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <FormItem>
              {
              form.getFieldDecorator('remark', {
                rules: [
                  { required: true, message: '请输入订单备注' },
                  { max: 100, message: '订单备注不能超过100字' },
                ],
              })(
                <TextArea rows={5} />
              )
            }
            </FormItem>

          </Col>
        </Row>
        <AfterSaleMoenyLayer
          {...this.props}
        />
      </Card>
    );
  }
}

export default OtherInfoCard;
