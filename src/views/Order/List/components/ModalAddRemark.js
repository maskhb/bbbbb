/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:29:27
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-12 17:30:40
 *
 * 添加备注弹框
 */
import React, { PureComponent } from 'react';

import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class ModalAddRemark extends PureComponent {
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

  handleModalOk = () => {
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

    const btnElm = <a onClick={this.handleButtonClick}>添加备注</a>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="添加备注"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('orderRemark', {
              rules: [
                { required: true, message: '请输入备注' },
                { max: 200, message: '最多输入200个字' },
              ],
            })(
              <TextArea rows={6} placeholder="请输入备注,最多可输入200个字" />
            )}
          </FormItem>
        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalAddRemark);
