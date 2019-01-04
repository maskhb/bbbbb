import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { TreeSelect, message } from 'antd';
import { goToLocation } from 'utils/utils';
import styles from './index.less';

const { TreeNode } = TreeSelect;


@connect(({ common, loading, user, login }) => ({
  common,
  user,
  login,
  loading: loading.models.common,
}))

export default class GlobalChanger extends PureComponent {
  static defaultProps = {
    user: { AccountOrgsInTree: [], AccountLoginSelected: {} },
  };
  state = {
    selectedOrgId: '',
  };

  componentDidMount() {
    this.init();
  }
  onSelect= (value, node) => {
    this.setState({
      selectedOrgId: value,
    });
    this.handleClickSubMenu(node.props);
  };

  init = async () => {
    // console.log('init header...');


    const { dispatch, login: { userInfo } } = this.props;
    const { accountId, orgIdSelected: orgId } = userInfo || {};

    // 获取账户登陆后所选的组织
    await dispatch({
      type: 'user/getAccountLoginSelectedOrg',
      payload: { accountId },
    });

    // 以树的形式展示当前账号的关联组织列表
    await dispatch({
      type: 'user/getAccountOrgsInTree',
      payload: {},
    });

    this.setState({
      selectedOrgId: orgId,
    });

    //
    // 获取账户在某组织下的角色列表
    // const roleList = await dispatch({
    //   type: 'user/getAccountRolesByOrgId',
    //   payload: { accountId, orgId },
    // });
    // console.log({ current, allLevel });


    // console.log('init header end');
  };
  handleClickSubMenu = ({ item }) => {
    if (item.isRelated === 1) {
      const { orgId, orgName } = item;
      const { dispatch, login: { userInfo: { accountId } } } = this.props;
      dispatch({
        type: 'user/updateAccountLoginOrgId',
        payload: { orgId },
      }).then(async (res) => {
        if (res) {
          message.success('操作成功!');

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
  };


  render() {
    const { user: { AccountOrgsInTree } } = this.props;

    /* 树 */
    const loop = data => data.map((item) => {
      if (item.childOrgs) {
        return (
          <TreeNode
            key={item.orgId}
            value={item.orgId}
            title={item.orgName}
            item={item}
            disabled={item.isRelated === 0}
          >
            {loop(item.childOrgs)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.orgId}
          value={item.orgId}
          item={item}
          disabled={item.isRelated === 0}
          title={item.orgName}
        />
      );
    });

    return (
      <div className={styles.container}>
        <TreeSelect
          showLine
          style={{ width: 150 }}
          value={this.state.selectedOrgId}
          dropdownStyle={{ maxHeight: 400, minWidth: 250, overflow: 'auto' }}
          disabled={!AccountOrgsInTree}
          placeholder="请选择组织"
          treeDefaultExpandAll
          onSelect={this.onSelect}
        >
          {AccountOrgsInTree ? loop(AccountOrgsInTree) : ''}
        </TreeSelect>
      </div>
    );
  }
}
