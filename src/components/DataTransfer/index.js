import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';

const listToOptions = (list = [], value, title = '', filter = () => true) => {
  if (list.constructor?.name !== 'Array') {
    return [];
  }

  return _.compact(Object.values(list).filter(filter).map((item = {}) => {
    return {
      value: item[value],
      label: item[title],
    };
  }));
};

const optionsToHtml = (options) => {
  return options.map((option = {}) => {
    return (
      <Select.Option key={option.value} value={option.value}>
        {option.label}
      </Select.Option>
    );
  });
};

const enumToHtml = (enumObject) => {
  return Object.entries(enumObject).map(([k, v]) =>
    <Select.Option value={Number(k)} key={k}>{v}</Select.Option>);
};

export {
  listToOptions,
  optionsToHtml,
  enumToHtml,
};
