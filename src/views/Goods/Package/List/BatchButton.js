import React from 'react';
import { Button } from 'antd';
import * as permission from 'config/permission';
import Authorized from 'utils/Authorized';
import ModalCover from '../Detail/ModalCover';
import AuditForm from './AuditForm';

export default ({ handleBathOperating, getSelectedRows, listInst, audit, ...others }) => {
  const disabledBatchButton = !others.rows?.length;

  return (
    audit === 0
      ? (
        <Authorized authority={[permission.OPERPORT_JIAJU_TOAPPROVEPROLIST_BATCHAPPROVE]}>
          <ModalCover
            content={<AuditForm ref={(inst) => {
              /* eslint no-param-reassign:0 */
              listInst.auditForm = inst;
            }}
            />}
            onOk={handleBathOperating.bind(listInst, others.rows)}
          >
            {(modalGoodsListShow) => {
              return <Button type="primary" disabled={disabledBatchButton} onClick={modalGoodsListShow}>批量审核</Button>;
            }}

          </ModalCover>
        </Authorized>
      )
      : ''
  );
};
