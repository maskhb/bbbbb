import moment from 'moment';

import { format } from 'components/Const';

export const getColumns = () => {
  return [
    {
      title: '编辑时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 100,
      render: text => moment(text).format(format),
    },
    {
      title: '编辑人',
      dataIndex: 'updatedByName',
      key: 'updatedByName',
      width: 100,
    },
    {
      title: '编辑详情',
      dataIndex: 'content',
      key: 'content',
      width: 100,
    },
  ];
};
