import React, { PureComponent } from 'react';
import { Input, InputNumber, Form } from 'antd';
import styles from './styles.less';

class EditableCell extends PureComponent {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    // if (nextProps.status && nextProps.status !== this.props.status) {
    //   if (nextProps.status === 'save') {
    //     this.props.onChange(this.state.value);
    //   } else if (nextProps.status === 'cancel') {
    //     this.setState({ value: this.cacheValue });
    //     this.props.onChange(this.cacheValue);
    //   }
    // }
  }

  handleChange(e) {
    let value = e;
    if (typeof e === 'object') {
      value = e.target.value; // eslint-disable-line
    }
    this.setState({ value });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }

  renderInput() {
    const { value } = this.props;
    if (typeof value === 'number') {
      return (
        <InputNumber
          min="0"
          onChange={e => this.handleChange(e)}
        />
      );
    } else {
      return (
        <Input
          onChange={e => this.handleChange(e)}
        />
      );
    }
  }

  render() {
    const { value, editable } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {
          editable ? (
            <Form.Item className={styles.editable_item}>
              {
                getFieldDecorator('val', {
                  initialValue: this.props.value,
                  rules: [
                    { required: true, message: '不允许为空!' },
                  ],
                })(this.renderInput())
              }

            </Form.Item>
          ) : (
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
          )}
      </div>
    );
  }
}

export default Form.create()(EditableCell);
