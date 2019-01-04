
import React from 'react';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import {
  PMS_REPORTFORMS_CHECKINANALYSIS_DOWNLOAD,
} from 'config/permission';
import { formatBirthDay } from 'components/Const';
import Download from '../../../components/Download';

export default () => {
  return [
    {
      title: '营业日期',
      dataIndex: 'businessTime',
      render: current => <span>{moment(current).format(formatBirthDay)}</span>,
    },
    {
      title: '本日在住房晚',
      dataIndex: 'housingToday',
      textAlign: 'center',
    },
    {
      title: '操作',
      dataIndex: 'oper',
      render: (val, row) => {
        return (
          <div>
            <Authorized authority={[PMS_REPORTFORMS_CHECKINANALYSIS_DOWNLOAD]}>
              <Download
                baseUrl="/ht-fc-pms-server/statistics/receivables/download"
                query={{ infoId: row.infoId, fileName: '下载报表' }}
                title="下载报表"
              />
            </Authorized>
          </div>
        );
      },
    },
  ];
};
