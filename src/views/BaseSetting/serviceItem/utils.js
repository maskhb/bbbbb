import React from 'react';

export const getOption = (Ele, options) => {
  return options?.map(item => (
    <Ele
      key={item.value}
      value={item.value}
    >
      {item.label}
    </Ele>
  ));
};
