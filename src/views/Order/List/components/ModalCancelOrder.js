/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:22:38
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-12 17:16:21
 *
 * 取消订单弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Select, Form } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

class ModalCancelOrder extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
  }

  getOptionItems = () => {
    return [
      '买家不想买了',
      '商品缺货',
      '信息填写错误，重新拍',
      '买家拒绝收货',
      '买家拍错了',
      '商品价格较贵',
      '付款遇到问题（如余额不足、不知道怎么付款等）',
      '其他原因',
    ];
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

  // 调用onOk事件进行回调
  callbackOnOk = async (values) => {
    const { onOk, params } = this.props;
    if (onOk) {
      this.setState({
        loading: true,
      });
      await onOk({ ...params, ...values });
    }
    this.setState({
      showModal: false,
      loading: false,
    });
  }

  handleModalOk = async () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.callbackOnOk(values);
      }
    });
  }

  render() {
    const { hideBtn } = this.props;
    const { showModal, loading } = this.state;

    const { getFieldDecorator } = this.props.form;


    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <Button onClick={this.handleButtonClick}>取消订单</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="取消订单"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="取消订单理由">
            {getFieldDecorator('reason', {
              rules: [
                { required: true, message: '请选择取消订单理由' },
              ],
            })(
              <Select placeholder="请选择取消订单理由">
                {
                  this.getOptionItems().map(item => (
                    <Option value={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalCancelOrder);
