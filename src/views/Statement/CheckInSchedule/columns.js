import React from 'react';
import Authorized from 'utils/Authorized';
import { fenToYuan } from 'utils/money';
import moment from 'moment';
import Download from 'components/Download';

export default (me) => {
  return [
    {
      title: '营业日期',
      dataIndex: 'businessTime',
      align: 'center',
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '本日收入',
      dataIndex: 'incomeToday',
      align: 'center',
      render: val => (val ? fenToYuan(val) : 0),
    },
    {
      title: '操作 ',
      render: (val) => {
        return (
          <Authorized authority="PMS_REPORTFORMS_RECELVABLESDAILY_DOWNLOAD" >
            <Download
              baseUrl="/ht-fc-pms-server/statistics/receivables/download"
              query={{ infoId: val.infoId }}
              title="下载报表"
            />
          </Authorized >
        );
      },
    },
  ];
};
