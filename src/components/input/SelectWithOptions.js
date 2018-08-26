import React from 'react';
import { Select } from 'antd';

export default function (props) {
  const { placeholder = '请选择', options, ...other } = props;
  return (
    <Select placeholder={placeholder} {...other}>
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
}
