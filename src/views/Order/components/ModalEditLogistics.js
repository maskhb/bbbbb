/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:26:55
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-31 18:04:07
 *
 * 修改物流信息弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Form, Select, Radio, message } from 'antd';
import Input from 'components/input/DecorateInput';

import { expressCompanyListOptions } from 'components/Const';
import { getOptionLabelForValue, LogisticsTypeOptions } from '../attr';

const FormItem = Form.Item;
const { Option } = Select;
const { Group: RadioGroup, Button: RadioButton } = Radio;

class ModalEditLogistics extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    isHideLogistics: false,
    btnLoading: false,
    logisticsVOList: [],
    logisticsVO: {},
  }

  initLogisticsList = async () => {
    this.setState({
      btnLoading: true,
    });

    const { dispatch, params = {} } = this.props;
    await dispatch({
      type: 'orders/logisticsDetail',
      payload: {
        orderId: params?.orderId,
      },
    });

    const { orders } = this.props;
    const [logisticsVO] = orders?.logisticsDetail || [];

    this.setState({
      btnLoading: false,
      logisticsVOList: orders?.logisticsDetail || [],
      logisticsVO,
    });

    setTimeout(() => {
      this.setState({
        isHideLogistics: getOptionLabelForValue(LogisticsTypeOptions)(logisticsVO?.type) === '无需物流',
      });
    }, 1);
  }


  handlePackageNumChange = (e) => {
    const { value } = e.target;

    const logisticsVo = (this.state?.logisticsVOList || [])?.filter((item) => {
      return `${item.packageNumber}` === `${value}`;
    })?.[0];

    this.props.form.setFieldsValue({
      logisticsNumber: logisticsVo?.logisticsNumber,
      logisticsCompanyCode: logisticsVo?.logisticsCompanyCode,
      type: logisticsVo?.type,
    });

    this.setState({
      isHideLogistics: getOptionLabelForValue(LogisticsTypeOptions)(logisticsVo?.type) === '无需物流',
      logisticsVO: logisticsVo,
    });
  }

  handleRadioChange = (e) => {
    const { value } = e.target;

    this.setState({
      isHideLogistics: getOptionLabelForValue(LogisticsTypeOptions)(value) === '无需物流',
    });
  }

  handleButtonClick = async () => {
    await this.initLogisticsList();

    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
      isHideLogistics: false,
    });
  }

  handleDefaultOk = async ({
    orderSn,
    type,
    logisticsNumber = '',
    logisticsCompanyCode = '',
    packageNumber = 1,
  }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/logisticsModify',
      payload: {
        orderSn,
        logisticsRequestVO: {
          logisticsCompany: getOptionLabelForValue(expressCompanyListOptions)(logisticsCompanyCode) || '',
          logisticsCompanyCode,
          logisticsNumber,
          orderGoodsId: this.state.selectedRowKeys,
          packageNumber,
          type,
        },
      },
    });

    const { orders } = this.props;
    if (orders?.logisticsModify === null) {
      throw new Error();
    }

    message.success('修改物流成功');

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
        isHideLogistics: false,
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
    const { hideBtn } = this.props;

    const {
      showModal,
      loading,
      btnLoading,
      isHideLogistics,
      logisticsVOList,
      logisticsVO,
    } = this.state;
    const [, logisticsVO2] = logisticsVOList || [];

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <Button key="c_c_melog_btn" onClick={this.handleButtonClick} loading={btnLoading}>修改物流</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_melog_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="修改物流"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          {
            logisticsVO2 ? (
              <FormItem style={{ textAlign: 'center' }}>
                {getFieldDecorator('packageNumber', {
                initialValue: '1',
                })(
                  <RadioGroup onChange={this.handlePackageNumChange}>
                    {
                      (logisticsVOList || []).map(item => (
                        <RadioButton key={`packageNumber_${item.packageNumber}`} value={`${item.packageNumber}`} >包裹 {item.packageNumber}</RadioButton>
                      ))
                    }
                  </RadioGroup>
                )}
              </FormItem>
          ) : null
        }
          <FormItem {...formItemLayout} label="发货方式">
            {getFieldDecorator('type', {
            initialValue: logisticsVO?.type || 1,
            })(
              <RadioGroup onChange={this.handleRadioChange}>
                {
                  (LogisticsTypeOptions || []).map(item => (
                    <Radio key={`tye_${item.value}`} value={item.value} >{item.label}</Radio>
                  ))
                }
              </RadioGroup>
            )}
          </FormItem>
          {
          isHideLogistics ? null : [
            <FormItem key="c_c_order_mel_logisticsCompanyCode" {...formItemLayout} label="快递公司">
              {getFieldDecorator('logisticsCompanyCode', {
                initialValue: `${logisticsVO?.logisticsCompanyCode || ''}`,
                rules: [
                  { required: true, message: '请选择快递公司' },
                ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="">请选择快递公司</Option>
                    {
                      (expressCompanyListOptions || []).map(item => (
                        <Option key={`lcompanycode_${item.value}`} value={`${item.value}`}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
            </FormItem>,
            <FormItem key="c_c_order_mel_logisticsNumber" {...formItemLayout} label="快递单号">
              {getFieldDecorator('logisticsNumber', {
                initialValue: logisticsVO?.logisticsNumber || '',
                rules: [
                  { required: true, message: '请填写快递单号' },
                  { max: 20, message: '快递单号最长20位' },
                ],
                })(
                  <Input />
                )}
            </FormItem>,
          ]
        }
        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalEditLogistics);
