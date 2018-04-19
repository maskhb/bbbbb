import React from 'react';
import { Popover, Icon } from 'antd';

const IconInfo = () => (
  <Icon type="question-circle-o" style={{ color: '#000' }} />
);

export default ({ label, content }) => (
  <Popover placement="right" title="" content={content} trigger="hover">
    {label}  <IconInfo />
  </Popover>
);
