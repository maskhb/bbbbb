import React from 'react';
import { Modal, Form, Radio } from 'antd';
import { MonitorTextArea } from 'components/input';
import AUDITSTATUS from 'components/AuditStatus';

const ModalAudit = Form.create()(
  (props) => {
    const { visible, onCancel, onOk, form, loading, ...p } = props;
    const { getFieldDecorator } = form;
    const max = 200;

    return (
      <Modal
        visible={visible}
        title="审核商品"
        confirmLoading={loading}
        onCancel={onCancel}
        okText="确定"
        onOk={() => {
          const auditCode = form.getFieldValue('auditCode');
          const comment = form.getFieldValue('comment');

          if (auditCode === AUDITSTATUS.SUCCESS.value) {
            // 审核通过，不需要填写审核意见
            form.setFields({
              comment: {
                value: comment,
                errors: [],
              },
            });
          } else if (auditCode === AUDITSTATUS.FAIL.value && !comment) {
            // 审核不通过，必须填写审核意见
            form.setFields({
              comment: {
                value: comment,
                errors: [new Error(
                  '请填写审核意见')],
              },
            });
          }

          onOk();
        }}
        {...p}
      >
        <Form layout="horizontal">
          <Form.Item label="审核结果" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('auditCode', {
              rules: [{
                required: true, message: '请选择审核结果',
              }],

            })(
              <Radio.Group>
                {
                  Object.values(AUDITSTATUS)
                    .filter(({ value }) => value !== AUDITSTATUS.WAIT.value)
                    .map(({ text, value }) => (
                      <Radio key={value} value={value}>{text}</Radio>
                    ))
                }
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="审核意见" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('comment', {
              rules: [{
                validator: (rule, value, callback) => {
                  const errors = [];

                  // 审核不通过，必须填写审核意见
                  const auditCode = form.getFieldValue('auditCode');
                  if (auditCode === AUDITSTATUS.FAIL.value && !value) {
                    errors.push(new Error(
                      '请填写审核意见',
                      rule.field));
                  }

                  callback(errors);
                },
              }, {
                max,
              }],
            })(
              <MonitorTextArea rows={6} maxLength={`${max}`} form={form} datakey="comment" style={{ marginTop: 15 }} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default ModalAudit;
