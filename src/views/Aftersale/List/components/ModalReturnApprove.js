import React from 'react';
import { Modal, Row, Col, Select, Button, Form } from 'antd';
import { getCustomFieldDecorator as getDecorator } from 'utils/utils';
import {
  RETURN_TYPES, RETURN_REFUND_CHANNEL, RETURN_DUTIES, RETURN_REASONS,
} from '../../attr';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const getCustomFieldDecorator = (vo, form) => {
  return getDecorator(vo, form, 'auditVo');
};

const renderSelect = (options = [], placeholder = '请选择...', params = {}) => {
  return (
    <Select placeholder={placeholder} {...params}>
      {
        options.map((item) => {
          return (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          );
        })
      }
    </Select>
  );
};


export default class ApproveView extends React.PureComponent {
  state = {
    visibleApprove: false,
    currentType: null,
  }

  handleEntityApprove = () => {
    // const { form } = this.props;
    // form.setFieldsValue({})
    this.setState({
      visibleApprove: true,
      currentType: 'Entity',
      visibleChannel: false,
      approveTitle: '审核有实物退货信息',
    });
  }

  handleNoneApprove = () => {
    this.setState({
      visibleApprove: true,
      currentType: 'None',
      approveTitle: '审核无实物退货信息',
    });
  }

  handleApproveCancel = () => {
    this.setState({
      visibleApprove: false,
      currentType: null,
    });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleChannelSubmit = () => {
    // console.log('jfdosjfod');
    const { form } = this.props;
    form.validateFields(() => {
      this.props.onApprove();
    });
  }

  handleChannelCancel =() => {
    this.setState({
      visibleChannel: false,
    });
    this.handleApproveCancel();
  }

  handleApproveSubmit =() => {
    const { type } = this.props;
    const title = type === 'exchange' ? '换货' : '退货';

    this.props.form.validateFields((err, vals) => {
      if (err) {
        return;
      }
      const { afterSaleType, applyOrderId } = this.props;

      this.props.dispatch({
        type: 'aftersale/applyOrderCheckAuditStatus',
        payload: {
          applyOrderId,
        },
      }).then((r) => {
        if (r) {
          Modal.error({
            title: '系统错误提示',
            content: '该申请单为已审核状态，无法再次审核',
            okText: '关闭',
          });
          return;
        }
        this.props.dispatch({
          type: 'aftersale/applyOrderCheckSettlementStatus',
          payload: {
            ...vals.auditVo,
            afterSaleType,
            applyOrderId,
            isHasEntity: this.state.currentType === 'Entity' ? 1 : 2,
          },
        }).then((res) => {
          if (res) {
            this.setState({
              visibleChannel: true,
              visibleApprove: false,
            });
          } else {
            Modal.confirm({
              title: `确定审核同意该单${title}操作吗？`,
              content: '请信息无误。',
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                this.props.onApprove();
              },
            });
          }
        });
      });
    });
  }

  render() {
    const { visible, form, type, ...other } = this.props;
    const getFieldDecorator = getCustomFieldDecorator({}, form);
    return (
      <React.Fragment>
        <Modal
          footer={false}
          visible={
          visible && !this.state.visibleApprove && !this.state.visibleChannel && type !== 'refund'
          }
          title={type === 'exchange' ? '换货审核' : '退货审核'}
          {...other}
        >
          <p>请选择退货类型:</p>
          <Row>
            <Col span={8} offset={6}>
              <Button onClick={this.handleEntityApprove} type="primary">有实物退货</Button>
            </Col>
            <Col span={8}>
              <Button onClick={this.handleNoneApprove} type="primary">无实物退货</Button>
            </Col>
          </Row>
          <br />
        </Modal>
        { type !== 'refund' && (
          <ApproveForm
            visible={this.state.visibleApprove}
            title={this.state.approveTitle}
            type={this.state.currentType}
            form={this.props.form}
            onOk={this.handleApproveSubmit}
            onCancel={this.handleApproveCancel}
            getFieldDecorator={getFieldDecorator}
            afterType={type}
          />
        )}
        { (this.state.visibleChannel || (visible && type === 'refund')) && (
          <ChannelForm
            visible
            onOk={this.handleChannelSubmit}
            form={this.props.form}
            onCancel={this.handleChannelCancel}
            getFieldDecorator={getFieldDecorator}
            afterType={type}
          />
        )}
      </React.Fragment>
    );
  }
}

/* eslint-disable react/no-multi-comp */
// @Form.create()
class ApproveForm extends React.PureComponent {
  handleCancel = () => {
    const { form } = this.props;
    form.resetFields(['auditVo']);
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // if (!err) {
      // console.log(values);
      if (this.props.onOk) {
        this.props.onOk(values);
      }
      // }
    });
  }
  renderNoneForm = () => {
    const { getFieldDecorator } = this.props;
    getFieldDecorator('isHasEntity', {
      initialValue: 2,
    });
    return (
      <React.Fragment>
        <FormItem {...formItemLayout} label="退货原因(客服)">
          {getFieldDecorator('returnReason', {
            rules: [
              { required: true, message: '请选择退货原因' },
            ],
          })(
            renderSelect(RETURN_REASONS.filter(item => item.entity !== true))
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="责任归属(客服)">
          {getFieldDecorator('responsibility', {
            rules: [
              { required: true, message: '请选择责任归属' },
            ],
          })(
            renderSelect(RETURN_DUTIES)
          )}
        </FormItem>
      </React.Fragment>
    );
  }

  renderEntityForm = () => {
    const { getFieldDecorator } = this.props;
    getFieldDecorator('isHasEntity', {
      initialValue: 1,
    });
    return (
      <React.Fragment>
        <FormItem {...formItemLayout} label="退货类型(客服)">
          {getFieldDecorator('returnType', {
            rules: [{ required: true, message: '请选择退货类型' }],
          })(
            renderSelect(RETURN_TYPES)
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="退货原因(客服)">
          {getFieldDecorator('returnReason', {
            rules: [
              { required: true, message: '请选择退货原因' },
            ],
          })(
            renderSelect(RETURN_REASONS.filter(item => item.entity !== false))
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="责任归属(客服)">
          {getFieldDecorator('responsibility', {
            rules: [
              { required: true, message: '请选择责任归属' },
            ],
          })(
            renderSelect(RETURN_DUTIES)
          )}
        </FormItem>
      </React.Fragment>
    );
  }
  render() {
    const { type, form, onCancel, onOk, ...other } = this.props;
    return (
      <Modal
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        {...other}
      >
        <Form >
          {type === 'Entity' ? this.renderEntityForm() : this.renderNoneForm()}
        </Form>
      </Modal>
    );
  }
}

// @Form.create()
export class ChannelForm extends React.PureComponent {
  render() {
    const { getFieldDecorator, afterType, ...other } = this.props;
    return (
      <Modal
        title={
          afterType === 'exchange' ? '换货审核' : afterType === 'refund' ? '退款审核' : '退货审核'
        }
        {...other}
      >
        <Form layout="horizontal" >
          <FormItem
            label={
              `该订单为已结算状态，请选择${afterType === 'refund' ? '退款' : '退货退款'}渠道：`
              }
          >
            {getFieldDecorator('refundOrReturnChannel', {
              initialValue: 1,
              rules: [
                { required: true, message: '请选择退货退款渠道' },
              ],
            })(
              renderSelect(afterType === 'refund' ?
                RETURN_REFUND_CHANNEL.REFUND_CHANNEL : RETURN_REFUND_CHANNEL.RETURN_CHANNEL)
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
