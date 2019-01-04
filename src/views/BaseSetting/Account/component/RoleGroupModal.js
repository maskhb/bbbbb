import React from 'react';
import { Checkbox, Row, Modal } from 'antd';

export default class SearchTree extends React.Component {
  state = {
  }

  handleCheck = (e, org, role) => {
    const { onCheck } = this.props;
    if (onCheck) {
      onCheck(org, role, e.target.checked);
    }
  }

  render() {
    const { visible, data = [], accountInfo, onOk, selectedKeys, onCancel } = this.props;
    const defaultProps = {};
    if (data?.length === 0) {
      defaultProps.footer = false;
    }
    return (
      <Modal
        {...defaultProps}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        className="account-info-role-group-modal"
        title="角色设置"
        style={{ maxHeight: '70vh' }}
      >
        <p style={{ marginTop: -10 }}>
          请为账号{accountInfo.loginName}所关联的全部组织，分别配置角色。
        </p>
        {data?.length === 0 && <h3>暂未有相关联角色组</h3>}
        {data.map((d) => {
          return (
            <Row style={{ marginBottom: 15 }}>
              <h4>{d.orgName}</h4>
              <div>
                {d.rolesRelated.map((role) => {
                  const key = `${d.orgId}-${role.roleId}`;
                  return (
                    <Checkbox
                      checked={selectedKeys.indexOf(key) > -1}
                      style={{ width: 220, marginLeft: 10 }}
                      onChange={e => this.handleCheck(e, d, role)}
                    >{role.roleName}
                    </Checkbox>
                  );
                })}
              </div>
            </Row>
          );
        })}
      </Modal>
    );
  }
}
