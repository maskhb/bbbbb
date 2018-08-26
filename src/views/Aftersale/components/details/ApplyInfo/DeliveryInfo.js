import React from 'react';
import { Card, Form, InputNumber } from 'antd';
import { SelectWithOptions as Select, DecorateInput as Input } from 'components/input';
import LocationStandard from 'components/LocationStandard';

import { DISTRIBUTION_TYPE } from '../../../attr';
import styles from './index.less';

export default class DeliveryInfo extends React.PureComponent {
  render() {
    const { isEdit, getFieldDecorator, formItemLayout } = this.props;
    // const getFieldDecorator = getCustomFieldDecorator(applyInfoVo, form);
    return (
      <Card title="发货信息">
        <Form>
          <Form.Item {...formItemLayout} label="取货地址">
            {getFieldDecorator('locations', {
            })(
              <LocationStandard disabled={!isEdit} depth={3} />
              )}
          </Form.Item>
          <Form.Item {...formItemLayout} className={styles.formitem_address} label=" ">
            {getFieldDecorator('pickupAddress', {
              })(
                <Input disabled={!isEdit} />
              )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系人">
            {getFieldDecorator('deliveryContact', {
            })(
              <Input disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="联系电话">
            {getFieldDecorator('deliveryContactPhone', {
            })(
              <Input disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="配送方式">
            {getFieldDecorator('distributionType', {
            })(
              <Select options={DISTRIBUTION_TYPE} disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="配送运费">
            {getFieldDecorator('freight', {
            })(
              <InputNumber disabled={!isEdit} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="配送要求">
            {getFieldDecorator('requirement', {
            })(
              <Input disabled={!isEdit} />
            )}
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
