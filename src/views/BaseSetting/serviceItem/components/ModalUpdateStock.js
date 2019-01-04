import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Modal, Button, Form, Input, InputNumber } from 'antd';

import Authorized from 'utils/Authorized';

import ModalStockLog from './ModalStockLog';

const { Item, create } = Form;

const layoutForm = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const Title = ({ record }) => (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <div>编辑库存</div>
    <div>
      <Authorized authority="PMS_BASICSETTING_SERVICEITEM_INVENTORY" key="ModalStockLog">
        <ModalStockLog record={record} />
      </Authorized>
    </div>
  </div>
);

@connect(({ serviceItem }) => ({
  serviceItem,
}))
@create()
class ModalUpdateStock extends PureComponent {
  state = {
    visibleUpdateStock: false,
  }

  refreshRequestPage = async () => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'serviceItem/page',
      payload: {
        currPage: 1,
        pageSize: 10,
        serviceItemVO: {},
      },
    });
  }

  handleBtnUpdateStock = () => {
    this.setState({
      visibleUpdateStock: true,
    });
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props;

    resetFields();
  }

  submitCancle = () => {
    this.setState({
      visibleUpdateStock: false,
    }, this.handleReset);
  }

  validateSubmit = async (errors, values) => {
    const { dispatch, record } = this.props;
    const { serviceItemId, stock, serviceName } = record;
    const { stock: getStock, serviceName: getServiceName } = values;

    if (errors) return;

    if (stock === getStock && serviceName === getServiceName) {
      this.submitCancle();
      return;
    }

    const response = await dispatch({
      type: 'serviceItem/updateStock',
      payload: {
        serviceItemId,
        ...values,
      },
    });

    if (response) {
      message.success('编辑库存成功', 3);

      this.setState({
        visibleUpdateStock: false,
      }, () => {
        this.handleReset();
        this.refreshRequestPage();
      });
    }
  }

  submitUpdateStock = () => {
    const { form: { validateFieldsAndScroll } } = this.props;

    validateFieldsAndScroll(this.validateSubmit);
  }

  render() {
    const { visibleUpdateStock } = this.state;
    const { form: { getFieldDecorator }, record } = this.props;
    const { serviceName, stock } = record;

    return (
      <div>
        <Button
          size="small"
          style={{ marginRight: 10 }}
          onClick={this.handleBtnUpdateStock}
        >
          编辑库存
        </Button>
        <Modal
          centered
          title=<Title record={record} />
          closable={false}
          visible={visibleUpdateStock}
          onCancel={this.submitCancle}
          cancleText="取消"
          okText="确定"
          onOk={this.submitUpdateStock}
        >
          <Form>
            <Item label="服务名称" {...layoutForm}>
              { getFieldDecorator('serviceName', {
                initialValue: serviceName,
                rules: [
                  {
                    required: true,
                    max: 10,
                    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                    message: '最多10个字',
                  },
                ],
              })(
                <Input placeholder="最多10个字" />
              )}
            </Item>
            <Item label="库存" {...layoutForm}>
              { getFieldDecorator('stock', {
                initialValue: stock,
                rules: [
                  {
                    pattern: /^[0-9]+$/,
                    message: '正整数',
                  },
                ],
              })(
                <InputNumber placeholder="若无限库存，库存为空" style={{ width: '100%' }} />
              )}
            </Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ModalUpdateStock;
