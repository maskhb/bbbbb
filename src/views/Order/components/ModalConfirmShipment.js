/*
 * @Author: wuhao
 * @Date: 2018-04-12 11:21:55
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-31 18:02:47
 *
 * 确认发货弹框
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Button, Modal, Form, Select, Radio, Table, Row, Col, message } from 'antd';
import Input from 'components/input/DecorateInput';

import { expressCompanyListOptions } from 'components/Const';
import { getOptionLabelForValue, LogisticsTypeOptions } from '../attr';

import { transformShipOrderGoodsList } from '../transform';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Group: RadioGroup } = Radio;

class ModalConfirmShipment extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    isHideLogistics: false,
    tableLoading: false,
    selectedRowKeys: [],
  }


  getTableColumns = () => {
    return [
      {
        title: '商品信息',
        dataIndex: 'goodsName',
        render: (text, record) => {
          return (
            <Row type="flex">
              <Col>
                <img className="shipment_table_product_img" src={record.mainImgUrl} alt="" />
              </Col>
              <Col>
                <div className="shipment_table_product_name">
                  <span>{text}</span>
                </div>
                <div className="shipment_table_product_desc">
                  <span>{record.propertyValue}</span>
                </div>
              </Col>
            </Row>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'goodsNum',
        width: '80px',
      },
    ];
  }

  handleTableSelectRowKeysChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  handleRadioChange = (e) => {
    const { value } = e.target;

    this.setState({
      isHideLogistics: getOptionLabelForValue(LogisticsTypeOptions)(value) === '无需物流',
    });
  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
      isHideLogistics: false,
      selectedRowKeys: [],
    });
  }

  handleDefaultOk = async ({ orderSn, type, logisticsNumber = '', logisticsCompanyCode = '' }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/ship',
      payload: {
        orderSn,
        logisticsRequestVO: {
          logisticsCompany: getOptionLabelForValue(expressCompanyListOptions)(logisticsCompanyCode) || '',
          logisticsCompanyCode,
          logisticsNumber,
          orderGoodsId: this.state.selectedRowKeys,
          type,
        },
      },
    });

    const { orders } = this.props;
    if (orders?.ship === null) {
      throw new Error();
    }

    message.success('发货成功');

    if (refresh) {
      refresh();
    }
  }

  // 调用onOk事件进行回调
  callbackOnOk = async (values) => {
    const { onOk, params } = this.props;
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys || selectedRowKeys.length < 1) {
      message.error('请选择需要发货的商品~');
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      if (onOk) {
        await onOk({ ...params, ...values, ...{ prods: selectedRowKeys } });
      } else {
        await this.handleDefaultOk({ ...params, ...values });
      }
      this.setState({
        showModal: false,
        loading: false,
        isHideLogistics: false,
        selectedRowKeys: [],
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
    const {
      hideBtn,
      className,
      params = {},
    } = this.props;
    const { orderGoodsVOList = [], receiptVO = {} } = params || {};
    const { showModal, loading, isHideLogistics, tableLoading, selectedRowKeys } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <Button key="c_c_mcs_btn" type="primary" onClick={this.handleButtonClick}>确认发货</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mcs_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="确认发货"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
        className={classNames(className, styles.component_order_modal_confirm_shipment)}
      >
        <Table
          className="shipment_table"
          dataSource={transformShipOrderGoodsList(orderGoodsVOList)}
          columns={this.getTableColumns()}
          loading={tableLoading}
          pagination={false}
          scroll={{ y: 200 }}
          rowKey="orderGoodsId"
          rowSelection={{
            selections: true,
            selectedRowKeys,
            onChange: this.handleTableSelectRowKeysChange,
          }}
        />

        <Form>
          <FormItem {...formItemLayout} label="收货地址">
            <span>
              {receiptVO?.regionName}
              {receiptVO?.detailedAddress}，
              {receiptVO?.consigneeName}，
              {receiptVO?.consigneeMobile}
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="发货方式">
            {getFieldDecorator('type', {
              initialValue: 1,
            })(
              <RadioGroup onChange={this.handleRadioChange}>
                {
                  (LogisticsTypeOptions || []).map(item => (
                    <Radio key={item.value} value={item.value} >{item.label}</Radio>
                  ))
                }
              </RadioGroup>
            )}
          </FormItem>
          {
          isHideLogistics ? null : [
            <FormItem key="c_c_mcs_fi_logisticsCompanyCode" {...formItemLayout} label="快递公司">
              {getFieldDecorator('logisticsCompanyCode', {
                initialValue: '',
                rules: [
                  { required: true, message: '请选择快递公司' },
                ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="">请选择快递公司</Option>
                    {
                      (expressCompanyListOptions || []).map(item => (
                        <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
            </FormItem>,
            <FormItem key="c_c_mcs_fi_logisticsNumber" {...formItemLayout} label="快递单号">
              {getFieldDecorator('logisticsNumber', {
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

export default Form.create()(ModalConfirmShipment);
