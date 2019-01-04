import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { message, Modal, Button, Form, Input, InputNumber, Select } from 'antd';

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
class ModalUpdateService extends PureComponent {
  state = {
    visibleUpdateStatus: false,
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
    const { dispatch, record } = this.props;
    const { source } = record;

    if (source === 2) return;

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

  handleBtnUpdateService = () => {
    this.setState({
      visibleUpdateStatus: true,
    }, this.initRequestPage);
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props;

    resetFields();
  }

  submitCancle = () => {
    this.setState({
      visibleUpdateStatus: false,
    }, this.handleReset);
  }

  validateSubmit = async (errors, values) => {
    const { dispatch, record } = this.props;
    const { serviceItemId, paymentItemId, serviceName, sort, salePrice, source } = record;

    if (errors) return;

    if (source === 2) {
      const { sort: getSort } = values;

      if (sort === getSort) {
        this.submitCancle();

        return;
      }

      const response = await dispatch({
        type: 'serviceItem/update',
        payload: {
          serviceItemId,
          sort: getSort,
        },
      });

      if (response) {
        message.success('编辑服务成功', 3);

        this.setState({
          visibleUpdateStatus: false,
        }, () => {
          this.handleReset();
          this.refreshRequestPage();
        });

        return;
      }
    }

    const {
      paymentItemId: getPaymentItemId,
      serviceName: getServiceName,
      sort: getSort,
      salePrice: getSalePrice,
    } = values;
    const salePriceTransfer = mul(getSalePrice, 100);

    if (
      paymentItemId === getPaymentItemId &&
      serviceName === getServiceName &&
      sort === getSort &&
      salePrice === getSalePrice
    ) {
      this.submitCancle();

      return;
    }

    const response = await dispatch({
      type: 'serviceItem/update',
      payload: {
        serviceItemId,
        ...values,
        salePrice: salePriceTransfer,
      },
    });

    if (response) {
      message.success('编辑服务成功', 3);

      this.setState({
        visibleUpdateStatus: false,
      }, () => {
        this.handleReset();
        this.refreshRequestPage();
      });
    }
  }

  submitUpdateService = () => {
    const { form: { validateFieldsAndScroll } } = this.props;

    validateFieldsAndScroll(this.validateSubmit);
  }

  render() {
    const { visibleUpdateStatus } = this.state;
    const { form: { getFieldDecorator }, record } = this.props;
    const { source, serviceName, sort, paymentItemId, salePrice } = record;
    const salePriceFilter = salePrice / 100;
    const paymentItemOptions = this.getPaymentItemOptions();

    return (
      <div>
        <Button
          size="small"
          style={{ marginRight: 10 }}
          onClick={this.handleBtnUpdateService}
        >
          编辑服务
        </Button>
        <Modal
          centered
          title="编辑服务"
          closable={false}
          visible={visibleUpdateStatus}
          onCancel={this.submitCancle}
          cancleText="取消"
          okText="确定"
          onOk={this.submitUpdateService}
        >
          <Form>
            { source === 1 && (
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
            ) }
            <Item label="优先级" {...layoutForm}>
              { getFieldDecorator('sort', {
                initialValue: sort,
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
            { source === 1 && (
              <Fragment>
                <Item label="关联账务" {...layoutForm}>
                  { getFieldDecorator('paymentItemId', {
                    initialValue: paymentItemId,
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
                <Item label="对客价" {...layoutForm}>
                  { getFieldDecorator('salePrice', {
                    initialValue: salePriceFilter,
                    rules: [
                      {
                        required: true,
                        max: 10,
                        pattern: /^(([1-9][0-9]*)|0|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                        message: '数字，最多保留小数点后两位',
                      },
                    ],
                  })(
                    <InputNumber placeholder="输入该服务的对客销售价格" style={{ width: '100%' }} />
                  )}
                </Item>
              </Fragment>
            ) }
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ModalUpdateService;
