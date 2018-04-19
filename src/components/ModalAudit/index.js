import React from 'react';
import { Modal, Form, Radio } from 'antd';
import { MonitorTextArea } from '../input';
import { AUDITSTATUS } from '../Status/audit';

const ModalAudit = Form.create()(
  (props) => {
    const { visible, onCancel, onOk, form, ...p } = props;
    const { getFieldDecorator } = form;
    const max = 200;

    return (
      <Modal
        visible={visible}
        title="审核"
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
        {...p}
      >
        <Form layout="vertical" hideRequiredMark>
          <Form.Item label="状态">
            {getFieldDecorator('auditCode', {
              initialValue: 0,
            })(
              <Radio.Group>
                {
                  Object.entries(AUDITSTATUS).map((v, k) => (
                    <Radio key={v[0]} value={k}>{v[1]}</Radio>
                  ))
                }
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="意见">
            {getFieldDecorator('comment', {
              rules: [{ max }],
            })(
              <MonitorTextArea rows={6} maxLength={`${max}`} form={form} datakey="comment" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default ModalAudit;
