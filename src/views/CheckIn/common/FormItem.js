import React from 'react';
import { Form } from 'antd';
import _ from 'lodash';

export default ({
  rules: ruleList, label, keyName, children, detailDefault, form,
  initialValue, ref, ...others
}) => {
  return (
    <Form.Item label={label} {...others}>
      {form.getFieldDecorator(keyName, {
        rules: ruleList,
        initialValue: initialValue || (detailDefault ? _.get(detailDefault, keyName) : ''),
      })(
        children
      )}
    </Form.Item>
  );
};
