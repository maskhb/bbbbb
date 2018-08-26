/*
 * @Author: wuhao
 * @Date: 2018-04-23 10:59:41
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-31 18:03:03
 *
 * 修改收货信息
 */
import React, { PureComponent } from 'react';

import { Modal, Form, Input as AntdInput, message } from 'antd';

import Input from 'components/input/DecorateInput';
import SelectRegion from 'components/SelectRegion/business';

import { validatorRegionSelectIsArea } from '../rules';


const FormItem = Form.Item;
const { TextArea } = AntdInput;

class ModalEditAddress extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
    });
  }

  handleDefaultOk = async ({
    orderSn,
    addressName: consigneeName,
    addressPhone: consigneeMobile,
    addressRegion,
    address: detailedAddress,
  }) => {
    const { dispatch, refresh } = this.props;
    const { value, selectedOptions } = addressRegion;
    const [provinceId, cityId, areaId] = value || [];
    const [{ label: provinceName = '' } = {}, { label: cityName = '' } = {}, { label: areaName = '' } = {}] = selectedOptions || [];

    await dispatch({
      type: 'orders/addressModify',
      payload: {
        orderSn,
        receiptVO: {
          consigneeMobile,
          consigneeName,
          detailedAddress,
          areaId,
          cityId,
          provinceId,
          regionName: `${provinceName}${cityName}${areaName}`,
        },
      },
    });

    const { orders } = this.props;
    if (orders?.addressModify === null) {
      throw new Error();
    }

    message.success('修改收货信息成功');

    if (refresh) {
      refresh();
    }
  }

  // 调用onOk事件进行回调
  callbackOnOk = async (values) => {
    const { onOk, params } = this.props;
    this.setState({
      loading: true,
    });

    try {
      if (onOk) {
        await onOk({ ...params, ...values });
      } else {
        await this.handleDefaultOk({ ...params, ...values });
      }

      this.setState({
        showModal: false,
        loading: false,
      });
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.callbackOnOk(values);
      }
    });
  }

  render() {
    const { hideBtn, btnTitle = '[修改]', params = {} } = this.props;
    const { receiptVO = {} } = params || {};
    const { showModal, loading } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <a key="c_c_mea_a" onClick={this.handleButtonClick}>{btnTitle}</a>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mea_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="修改信息"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="收 货 人 ">
            {getFieldDecorator('addressName', {
              initialValue: receiptVO?.consigneeName,
              rules: [
                { required: true, message: '请输入收货人' },
                { max: 20, message: '最多输入20个字' },
              ],
            })(
              <Input placeholder="请输入收货人" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号码">
            {getFieldDecorator('addressPhone', {
              initialValue: receiptVO?.consigneeMobile,
              rules: [
                { required: true, message: '请输入手机号码' },
                { max: 11, message: '最多输入11个字' },
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号码' },
              ],
            })(
              <Input placeholder="请输入手机号码" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所在地区">
            {getFieldDecorator('addressRegion', {
              initialValue: [receiptVO?.provinceId, receiptVO?.cityId, receiptVO?.areaId],
              rules: [
                { required: true, message: '请选择所在地区' },
                { validator: validatorRegionSelectIsArea },
              ],
            })(
              <SelectRegion placeholder="请选择所在地区" depth={3} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="详细地址">
            {getFieldDecorator('address', {
              initialValue: receiptVO?.detailedAddress,
              rules: [
                { required: true, message: '请输入详细地址' },
                { max: 100, message: '最多输入100个字' },
              ],
            })(
              <TextArea rows={6} placeholder="请输入详细地址" />
            )}
          </FormItem>
        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalEditAddress);
