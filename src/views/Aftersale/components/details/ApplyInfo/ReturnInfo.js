import React from 'react';
import { Card, Form } from 'antd';
import { SelectWithOptions as Select, DecorateInput as Input, MonitorInput } from 'components/input';
import LocationStandard from 'components/LocationStandard';
// import { MonitorInput } from 'components/input';

import { RETURN_WAY, FREIGHT_TYPE } from '../../../attr';
import styles from './index.less';

export default class ReturnInfo extends React.PureComponent {
  render() {
    const { formItemLayout, isEdit, getFieldDecorator, applyInfoVo, pattern = 'add' } = this.props;
    // const { applyInfoVo } = form.getFieldsValue()
    const returnWayProps = {};
    if (pattern === 'add') {
      returnWayProps.initialValue = 2;
    }
    return (
      <Card title="退货信息">
        <Form>
          <Form.Item {...formItemLayout} label="商品返回方式">
            {getFieldDecorator('returnWay', {
              rules: [
                { required: true, message: '请选择商品返回方式' },
              ],
              ...returnWayProps,
              // initialValue: pattern === 'add' ? 2 : null,
            })(
              <Select options={RETURN_WAY} disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="退货运费承担方">
            {getFieldDecorator('freightType', {
              initialValue: 2,
            })(
              <Select options={FREIGHT_TYPE} disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系人">
            {getFieldDecorator('contact', {
              rules: [
                { required: true, message: '申请信息,联系人必填' },
              ],
            })(
              <MonitorInput maxLength={30} disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            {getFieldDecorator('contactPhone', {
              rules: [
                { required: true, message: '申请信息,联系电话必填' },
              ],
            })(
              <MonitorInput maxLength={11} disabled={!isEdit} />
            )}
          </Form.Item>
          {applyInfoVo?.returnWay === 1 && [
            <Form.Item {...formItemLayout} label="快递名称">
              {getFieldDecorator('courierName', {
              })(
                <Input disabled={!isEdit} />
              )}
            </Form.Item>,
            <Form.Item {...formItemLayout} label="快递单号">
              {getFieldDecorator('courierNum', {
              })(
                <Input disabled={!isEdit} />
              )}
            </Form.Item>,
          ]}
          {
            (applyInfoVo?.returnWay === 2 || !applyInfoVo?.returnWay) && [
              <Form.Item {...formItemLayout} label="取货地址">
                {getFieldDecorator('locations', {
                  rules: [
                    {
                      required: true,
                      message: '请选择地区',
                    }, {
                    validator(rule, value, callback) {
                      if (value.value?.length !== 3) {
                        callback('省市区必填.');
                      } else {
                        callback();
                      }
                    },
                  }],
                })(
                  <LocationStandard disabled={!isEdit} depth={3} />
                  )}
              </Form.Item>,
              <Form.Item {...formItemLayout} className={styles.formitem_address} label=" ">
                {getFieldDecorator('pickupAddress', {
                    rules: [{
                      required: true, message: '取货地址必填.',
                    }],
                  })(
                    <MonitorInput maxLength={100} disabled={!isEdit} />
                  )}
              </Form.Item>,
            ]
          }
        </Form>
      </Card>
    );
  }
}
