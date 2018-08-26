import React from 'react';
import { Radio, Form } from 'antd';
import { MonitorTextArea, rules } from 'components/input';

import { arrAuditStatus } from './status';

const arr = arrAuditStatus?.filter(item => item.value).map(item => ({
  value: item.value,
  label: item.label?.replace('审核', ''),
}));

@Form.create()
export default class AuditForm extends React.Component {
  state = { auditOpinion: false };
  render() {
    const { form } = this.props;
    const { auditOpinion } = this.state;

    return (
      <div>
        <Form>
          <Form.Item label="审核结果">
            {form.getFieldDecorator('status', {
              rules: rules([{
                required: true,
                message: '请选择审核结果',
              }]),
              initialValue: arr[0]?.value,
            })(
              <Radio.Group onChange={(e) => { this.setState({ auditOpinion: e.target.value }); }}>
                {arr?.map(item =>
                  <Radio value={item.value} key={item.value}>{item.label}</Radio>)}
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="审核意见：">
            {form.getFieldDecorator('auditOpinion', {
              rules: rules([{
                required: auditOpinion === 2,
                message: '请输入审核意见',
              }]),
            })(
              <MonitorTextArea
                placeholder="请输入审核意见"
                datakey="auditOpinion"
                rows={5}
                maxLength={200}
                form={form}
              />
            )}
          </Form.Item>
        </Form>
      </div>
    );
  }
}
