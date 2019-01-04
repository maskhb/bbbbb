import React from 'react';
import PropTypes from 'prop-types';
import { Form, message, Input, DatePicker, Select, Icon } from 'antd';
import ModalCover from './ModalCover';
import moment from 'moment';
import _ from 'lodash';
import { INVOICE_HEADER } from './status';
import { mul, div } from 'utils/number';

@Form.create()
export default class NewInvoiceModal extends React.Component {
  static propTypes = {
    gresId: PropTypes.number, // 单号
    dispatch: PropTypes.func.isRequired, // dispatch
    edit: PropTypes.bool,
    invoiceId: PropTypes.number,
    onOk: PropTypes.func, // 点击操作完成按钮
  };

  static defaultProps = {
    invoiceId: 0,
  };

  state = {
    // invoiceHeaderSelected: 0,
    // inited:false // 是否初始化了edit form
  };

  disabledStartDate(endTime) {
    return function (current) {
      return current.valueOf() < endTime.valueOf();
    };
  }

  handleInvoiceHeaderSelectChange(value) {
    // this.setState({
    //   invoiceHeaderSelected: value,
    // });
  }

  // 初始化编辑表单
  initFormData() {
    const { form, invoiceNo, businessDay, rate, invoiceHeader, invoiceCompany, remark, edit } = this.props;

    if (edit) { // 编辑的时候才需要填写
      form.setFieldsValue({
        invoiceNo,
        businessDay: moment(new Date(businessDay)),
        rate: div(rate, 100),
        // invoiceHeader,
        remark,
      });
    } else {
      form.resetFields();
    }
  }

  handleOkBtn() {
    const { edit } = this.props;
    return new Promise((resolve) => {
      this.validInvoiceForm()
        .then((res) => {
          if (edit) {
            this.handleEditInvoice.call(this, res, resolve);
          } else {
            this.handleNewInvoice.call(this, res, resolve);
          }
        });
    });
  }

  // 新增
  handleNewInvoice(res, resolve) {
    const { dispatch, gresId, invoiceId, onOk } = this.props;
    dispatch({
      type: 'checkIn/gresInvoice',
      payload: {
        invoiceVO: {
          ...res,
          rate: mul(+res.rate, 100),
          gresId,
          invoiceId,
          businessDay: res.businessDay.valueOf(),
        },
      },
    })
      .then((res) => {
        onOk && onOk(res);
        message.success('开发票成功');
        resolve();
      });
  }

  // 编辑
  handleEditInvoice(res, resolve) {
    const { dispatch, gresId, invoiceId, onOk } = this.props;
    // debugger;
    dispatch({
      type: 'checkIn/gresEditInvoice',
      payload: {
        invoiceVO: {
          ...res,
          rate: mul(+res.rate, 100),
          gresId,
          invoiceId,
          businessDay: res.businessDay.valueOf(),
        },
      },
    })
      .then((res) => {
        onOk && onOk(res);
        message.success('编辑成功');
        resolve();
      });
  }

  validInvoiceForm = () => {
    return new Promise((resolve) => {
      const { form } = this.props;
      form?.validateFields((err, values) => {
        if (!err) {
          resolve(values);
        }
      });
    });
  }

  renderForm() {
    const { form, edit, invoiceHeader, invoiceCompany } = this.props;
    const formItemStyle = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Form>
        <Form.Item label="发票编号" {...formItemStyle}>
          {form.getFieldDecorator('invoiceNo', {
            rules: [{
              required: true,
              message: '请输入发票编号',
            }, {
              max: 50,
              message: '不允许超过50个字符',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="营业日期" {...formItemStyle}>
          {form.getFieldDecorator('businessDay', {
            initialValue: moment(),
            rules: [{
              required: true,
              message: '请选择营业日期',
            }],
          })(
            <DatePicker
              allowClear={false}
              disabledDate={this.disabledStartDate(moment())}
            />
          )}
        </Form.Item>
        <Form.Item label="发票金额" {...formItemStyle}>
          {form.getFieldDecorator('rate', {
            rules: [{
              required: true,
              message: '请输入发票金额',
            }, {
              validator: (rule, value, callback) => {
                const val = +value;
                if (val > 1000000) {
                    callback('不允许录入超过1000000');
                }
                if (val > val.toFixed(2)) {
                  callback('小数点后保留两位');
                }
                callback();
              },
            }, {
              pattern: /^[0-9]+.?[0-9]*$/,
              message: '仅支持录入数字',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="发票抬头" {...formItemStyle}>
          {form.getFieldDecorator('invoiceHeader', {
            initialValue: +invoiceHeader || 1,
            rules: [{
              required: true,
              message: '请选择发票抬头',
            }],
          })(
            <Select style={{ minWidth: 150 }}>
              {
                INVOICE_HEADER.map(item => <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>)
              }
            </Select>
          )}
        </Form.Item>
        {
          (form.getFieldValue('invoiceHeader') == 2)
          ? (
            <Form.Item label="开票单位" {...formItemStyle}>
              {form.getFieldDecorator('invoiceCompany', {
                initialValue: invoiceCompany,
                rules: [{
                  required: true,
                  message: '请输入开票单位',
                }, {
                  max: 100,
                  message: '不允许录入超过100个字符',
                }],
              })(
                <Input />
              )}
            </Form.Item>
            )
          : ''
        }

        <Form.Item label="备注" {...formItemStyle}>
          {form.getFieldDecorator('remark', {
            rules: [{
              max: 200,
              message: '不允许录入超过200个字符',
            }],
          })(
            <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />
          )}
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { edit } = this.props;
    return (
      <ModalCover
        title={edit ? '编辑' : '开发票'}
        content={this.renderForm()}
        onOk={this.handleOkBtn.bind(this)}
      >
        {modalShow => (
          <a
            href="javascript:;"
            onClick={(e) => {
            modalShow();
            this.initFormData();
        }}
          >
            {edit ? '编辑' : <span><Icon type="plus" /> 添加开票信息</span>}
          </a>
        )}
      </ModalCover>
    );
  }
}
