/*  退房或补结账操作弹窗  */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, Form } from 'antd';

const FormItem = Form.Item;
@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
@Form.create()
class ModalWithForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.handleChange();
  }
  componentWillReceiveProps(nextProps) {
    const { form } = this.props;
    const { visible } = this.state;
    if (!visible && nextProps.visible) {
      if (JSON.stringify(nextProps.initFormData) === '{}') {
        form.resetFields();
      } else {
        const formData = { ...form.getFieldsValue() };
        Object.keys(formData).forEach((v) => {
          formData[v] = nextProps.initFormData[v];
        });
        form.setFieldsValue(formData);
      }
      this.setState({
        visible: true,
      });
      this.handleChange(); // 触发dispatch，更新store
    }
    this.setState({
      visible: nextProps.visible,
    });
  }
  onModalOk(e) {
    const that = this;
    const { form, modalSubmit } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        modalSubmit(values, () => {
          that.onModalCancel();
        });
      }
    });
  }
  onModalCancel() {
    const { modalCancel } = this.props;
    this.setState({
      visible: false,
    });
    modalCancel();
  }
  handleChange() {
    const { form, id, dispatch } = this.props;
    dispatch({
      type: 'common/setModalWithForm',
      payload: {
        id,
        data: form,
      },
    });
  }
  render() {
    const { form, title, okText, cancelText, initFormData } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    const children = this.props.children.length > 1 ?
      Object.assign([], this.props.children) : [this.props.children];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.onModalOk.bind(this)}
          onCancel={this.onModalCancel.bind(this)}
          okText={okText}
          cancelText={cancelText}
        >
          <Form
            onChange={this.handleChange.bind(this)}
          >
            {
              children.map((child, index) => (
                child ? (
                  <FormItem
                    key={`${index}i`}
                    {...formItemLayout}
                    label={child.props.label}
                  >
                    {getFieldDecorator(child.props.name, {
                      initialValue: initFormData[child.props.name],
                    rules: child.props.rules,
                  })(
                    child.props.children
                  )}
                  </FormItem>
                ) : ''
              ))
            }
          </Form>
        </Modal>
      </div>
    );
  }
}
// Form.childContextTypes = {
//   form: PropTypes.object, // form
// };

ModalWithForm.propTypes = Object.assign({}, ModalWithForm.propTypes, {
  title: PropTypes.string.isRequired, // 弹窗的标题
  modalSubmit: PropTypes.func.isRequired, // 弹窗提交时触发
  modalCancel: PropTypes.func, // 弹窗取消时触发
  initFormData: PropTypes.object.isRequired, // 初始Form值，若为空传{}
});

export default ModalWithForm;
