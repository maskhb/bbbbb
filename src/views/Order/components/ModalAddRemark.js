/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:29:27
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-15 16:19:31
 *
 * 添加备注弹框
 */
import React, { PureComponent } from 'react';

import { Modal, Form, Input, message } from 'antd';

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

  handleDefaultOk = async ({ orderSn, orderRemark = '' }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/remarkAdd',
      payload: {
        orderSn,
        orderRemark,
      },
    });

    const { orders } = this.props;
    if (orders?.remarkAdd === null) {
      throw new Error();
    }

    message.success('添加备注成功');

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
    const { hideBtn, btnTitle = '添加备注', btnClassName } = this.props;
    const { showModal, loading } = this.state;

    const { getFieldDecorator } = this.props.form;

    const btnElm = <a key="c_c_mar_a" className={`${btnClassName || ''}`} onClick={this.handleButtonClick}>{btnTitle}</a>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mar_modal"
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
                // { required: true, message: '请输入备注' },
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
