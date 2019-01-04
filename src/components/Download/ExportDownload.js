import React from 'react';
import { getToken, toFullPath } from 'utils/request/utils';

export default function (props) {
  const url = `/api/excel/export/getFileWithToken?token=${encodeURIComponent(getToken())}&exportId=${props.exportId}&loginType=${props.loginType || 1}`;
  // const url = `/fc/ht-fc-pms-server/statistics/receivables/download?infoId=${props.infoId}&token=${encodeURIComponent(getToken())}`;

  return (
    <a
      href={toFullPath(url)}
      rel="noopener noreferrer"
      target="_blank"
    >{props.title || props.children || '下载'}
    </a>
  );
}
