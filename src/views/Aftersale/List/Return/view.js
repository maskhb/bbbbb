
import React from 'react';
import Detail from '../Detail/view';

export default function (props) {
  return (
    <Detail
      type="return"
      {...props.match.params}
      {...props}
    />
  );
}
