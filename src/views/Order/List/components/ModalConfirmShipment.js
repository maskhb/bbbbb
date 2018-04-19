/*
 * @Author: wuhao
 * @Date: 2018-04-12 11:21:55
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-17 14:49:48
 *
 * 确认发货弹框
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Button, Modal, Form, Input, Select, Radio, Table, Row, Col } from 'antd';

import { expressCompanyListOptions } from 'components/Const';
import { getOptionLabelForValue, LogisticsTypeOptions } from '../attr';

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
        dataIndex: 'productName',
        render: (text, record) => {
          console.log(record);
          return (
            <Row type="flex">
              <Col>
                <img className="shipment_table_product_img" src="https://www.baidu.com/img/bd_logo1.png" alt="" />
              </Col>
              <Col>
                <div className="shipment_table_product_name">
                  <span>双虎家私名品简美综合类实木卧房家具储物柜SM－1201</span>
                </div>
                <div className="shipment_table_product_desc">
                  <span>实木色（1个）*整装</span>
                </div>
              </Col>
            </Row>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'productNum',
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

  // 调用onOk事件进行回调
  callbackOnOk = async (values) => {
    const { onOk, params } = this.props;
    const { selectedRowKeys } = this.state;
    if (onOk) {
      this.setState({
        loading: true,
      });
      await onOk({ ...params, ...values, ...{ prods: selectedRowKeys } });
    }
    this.setState({
      showModal: false,
      loading: false,
      isHideLogistics: false,
      selectedRowKeys: [],
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
    const { hideBtn, className } = this.props;
    const { showModal, loading, isHideLogistics, tableLoading, selectedRowKeys } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <Button type="primary" onClick={this.handleButtonClick}>确认发货</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
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
          dataSource={[{}, {}, {}]}
          columns={this.getTableColumns()}
          loading={tableLoading}
          pagination={false}
          scroll={{ y: 200 }}
          rowSelection={{
            selections: true,
            selectedRowKeys,
            onChange: this.handleTableSelectRowKeysChange,
          }}
        />

        <Form>
          <FormItem {...formItemLayout} label="收货地址">
            <span>广东省广州市荔湾区沙面196号，南越王，13119503727</span>
          </FormItem>
          <FormItem {...formItemLayout} label="发货方式">
            {getFieldDecorator('type', {
              initialValue: '1',
            })(
              <RadioGroup onChange={this.handleRadioChange}>
                {
                  (LogisticsTypeOptions || []).map(item => (
                    <Radio value={`${item.value}`} >{item.label}</Radio>
                  ))
                }
              </RadioGroup>
            )}
          </FormItem>
          {
          isHideLogistics ? null : [
            <FormItem {...formItemLayout} label="快递公司">
              {getFieldDecorator('logisticsCompany', {
                initialValue: '',
                rules: [
                  { required: true, message: '请选择快递公司' },
                ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="">请选择快递公司</Option>
                    {
                      (expressCompanyListOptions || []).map(item => (
                        <Option value={`${item.value}`}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
            </FormItem>,
            <FormItem {...formItemLayout} label="快递单号">
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
