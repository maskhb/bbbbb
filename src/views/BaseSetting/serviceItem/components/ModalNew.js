import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Modal, Button, Form, Input, Select, InputNumber } from 'antd';

import { mul } from 'utils/number';

import { getOption } from '../utils';

const { Option } = Select;
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

@connect(({ serviceItem, paymentItem }) => ({
  serviceItem,
  paymentItem,
}))
@create()
class ModalNew extends PureComponent {
  state = {
    visibleNew: false,
  }

  getPaymentItemOptions = () => {
    const { paymentItem: { page: pagePaymentItem } } = this.props;
    const paymentItemOptions = pagePaymentItem?.list?.map(item => ({
      label: item.paymentItemName,
      value: item.paymentItemId,
    })) || [];

    return paymentItemOptions;
  }

  initRequestPage = async () => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'paymentItem/page',
      payload: {
        currPage: 1,
        pageSize: 10,
      },
    });
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

  handleBtnNew = async () => {
    this.setState({
      visibleNew: true,
    }, this.initRequestPage);
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props;

    resetFields();
  }

  submitCancle = () => {
    this.setState({
      visibleNew: false,
    }, this.handleReset);
  }

  validateSubmit = async (errors, values) => {
    const { dispatch } = this.props;
    const { salePrice: getSalePrice, ...others } = values;
    const salePriceTransfer = mul(getSalePrice, 100);

    if (errors) return;

    const response = await dispatch({
      type: 'serviceItem/saveItem',
      payload: {
        salePrice: salePriceTransfer,
        ...others,
      },
    });

    if (response) {
      message.success('新建成功', 3);

      this.setState({
        visibleNew: false,
      }, () => {
        this.handleReset();
        this.refreshRequestPage();
      });
    }
  }

  submitNew = () => {
    const { form: { validateFieldsAndScroll } } = this.props;

    validateFieldsAndScroll(this.validateSubmit);
  }

  render() {
    const { visibleNew } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    const paymentItemOptions = this.getPaymentItemOptions();

    return (
      <div>
        <Button
          size="small"
          icon="plus"
          style={{ marginRight: 10 }}
          onClick={this.handleBtnNew}
        >
          新建服务
        </Button>
        <Modal
          centered
          title="新建服务"
          closable={false}
          visible={visibleNew}
          onCancel={this.submitCancle}
          cancleText="取消"
          okText="确定"
          onOk={this.submitNew}
        >
          <Form>
            <Item label="服务名称" {...layoutForm}>
              { getFieldDecorator('serviceName', {
                initialValue: '',
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
            <Item label="优先级" {...layoutForm}>
              { getFieldDecorator('sort', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    max: 3,
                    pattern: /^[0-9]+$/,
                    message: '0-100之间的整数',
                  },
                ],
              })(
                <InputNumber placeholder="0-100之间的整数，数字越小优先级越高" min={0} max={100} style={{ width: '100%' }} />
              )}
            </Item>
            <Item label="关联账务" {...layoutForm}>
              { getFieldDecorator('paymentItemId', {
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {getOption(Option, paymentItemOptions)}
                </Select>
              )}
            </Item>
            <Item label="库存" {...layoutForm}>
              { getFieldDecorator('stock', {
                initialValue: '',
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
            <Item label="对客价" {...layoutForm}>
              { getFieldDecorator('salePrice', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    max: 10,
                    pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                    message: '数字，最多保留小数点后两位',
                  },
                ],
              })(
                <InputNumber placeholder="输入该服务的对客销售价格" style={{ width: '100%' }} />
              )}
            </Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ModalNew;
