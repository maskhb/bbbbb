import React from 'react';
import { Menu, message } from 'antd';
import { goToLocation } from 'utils/utils';

export default renderMenu;
const { SubMenu } = Menu;
let thisClass;
function renderMenu(data, me) {
  thisClass = me;
  return (
    <Menu>
      {data && Array.isArray(data) && data.length && data.map(dt => renderCurrentMenu(dt, me))}
    </Menu>
  );
}

// function orgIsDisable(org) {
//   return org.status === 2 || (org.isRelated === 0 && org.isRoleRelated === 0);
// }

function renderCurrentMenu(dt) {
  if (dt.childOrgs) {
    return (
      <SubMenu
        info={JSON.stringify(dt)}
        key={JSON.stringify(dt)}
        title={
          <a className={dt.isRelated === 0 ? 'menuDisabled' : ''} onClick={() => handleClickSubMenu(dt)}>{dt.orgName}</a>
        }
      >
        {dt.childOrgs.map(org => renderCurrentMenu(org))}
      </SubMenu>
    );
  } else {
    return (
      <Menu.Item
        key={dt.orgId}
        onClick={() => handleClickSubMenu(dt)}
      >
        {dt.orgName}
      </Menu.Item>
    );
  }
}

async function handleClickSubMenu(data) {
  if (data.isRelated === 1) {
    const { orgId, orgName } = data;
    const { dispatch, login: { userInfo: { accountId } } } = thisClass.props;
    dispatch({
      type: 'user/updateAccountLoginOrgId',
      payload: { orgId },
    }).then(async (res) => {
      if (res) {
        message.success('操作成功!');
        console.log({ accountId, orgId });

        // debugger;/*eslint-disable-line*/

        const result = await dispatch({
          type: 'user/getAccountAuthsByOrgId',
          payload: { accountId, orgId },
        });
        if (result) {
          const permiss = result.map((v) => {
            return v.authCode;
          });
          localStorage.permission = JSON.stringify(permiss);
          localStorage.permissionName = JSON.stringify(result);
        }

        const { orgType } = await dispatch({
          type: 'user/getAccountLoginSelectedOrg',
          payload: { accountId },
        });

        // 重写 localStorage user 下的信息
        const origin = JSON.parse(localStorage.getItem('user'));
        let { orgIdSelected, orgNameSelected } = origin;
        orgIdSelected = orgId;
        orgNameSelected = orgName;
        localStorage.setItem('user', JSON.stringify({ ...origin, orgNameSelected, orgIdSelected, orgType }));
        goToLocation('/');
      }
    });
  }
}
