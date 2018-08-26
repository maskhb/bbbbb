import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'antd';
import { MonitorInput } from 'components/input';
import LocationStandard from 'components/LocationStandard';

import styles from './index.less';


@Form.create()
@connect(({ aftersale }) => ({
  aftersale,
}))
class AddressModal extends PureComponent {
  componentWillMount() {
    // const { dispatch, unionMerchantId } = this.props;
    //
    // dispatch({
    //   type: 'business/queryList',
    //   payload: {
    //     unionMerchantId,
    //   },
    // });
  }

  render() {
    const { aftersale, visible, onCancel, onOk, form } = this.props;
    const { goOpenExchangeOrder } = aftersale;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    return (
      <Modal
        visible={visible}
        title="修改信息"
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
      >
        <Form>
          <Form.Item label="收货人" {...formItemLayout} className={styles.mb_0}>
            {form.getFieldDecorator('consigneeName', {
              initialValue: goOpenExchangeOrder?.consigneeName,
              rules: [
                { required: true, message: '请输入手机号码' },
              ],
            })(
              <MonitorInput />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="手机号码">
            {form.getFieldDecorator('consigneeMobile', {
              initialValue: goOpenExchangeOrder?.consigneeMobile,
              rules: [
                { required: true, message: '请输入手机号码' },
                { max: 11, message: '最多输入11个字' },
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' },
              ],
            })(
              <MonitorInput />
            )}
          </Form.Item>
          <Form.Item label="所在地区" {...formItemLayout} className={styles.mb_0}>
            {form.getFieldDecorator('area', {
              initialValue: {
                value: [
                  goOpenExchangeOrder?.provinceId,
                  goOpenExchangeOrder?.cityId,
                  goOpenExchangeOrder?.areaId,
                ].filter(l => !!l),
              },
              rules: [
                {
                  validator(rule, value, callback) {
                    if (value && value.value && value.value.length === 3) {
                      callback();
                    } else {
                      callback('请选择地区！');
                    }
                  },
                },
              ],
            })(
              <LocationStandard depth={3} />
            )}
          </Form.Item>
          <Form.Item label="详细地址" {...formItemLayout} className={styles.mb_0}>
            {form.getFieldDecorator('detailedAddress', {
              initialValue: goOpenExchangeOrder?.detailedAddress,
              rules: [
                { required: true, message: '请输入详细地址' },
              ],
            })(
              <MonitorInput />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddressModal;
