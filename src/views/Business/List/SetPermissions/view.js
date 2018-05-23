import request from 'utils/request';
import React, { PureComponent } from 'react';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { Card, Checkbox, Row, Col, Button, Tree, message } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const { TreeNode } = Tree;
const CheckboxGroup = Checkbox.Group;

@connect(({ businessAccount, loading, business }) => ({
  businessAccount,
  business,
  loading: loading.models.businessAccount,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };
  state = {
    checkedKeys: [],
    treeData: null,
    roleNameAuthortyMap: {},
  };

  componentWillMount() {
    this.initBusinessRoleData();
    this.initAllRoleData();
    this.initAllAuthorData();
  }

  onChange=(checkedRoleList) => {
    this.setState({ checkedRoleList });

    setTimeout(() => {
      this.handleBusinessRoleChange();
    });
  }

  // 初始化所有权限数据
  initAllAuthorData = () => {
    const { dispatch } = this.props;

    // 请求树节点
    dispatch({
      type: 'businessAccount/queryAuthorityList',
      payload: { },
    }).then((res) => {
      this.setState({
        treeData: res?.filter(item => item.identifier === 'VENDORPORT')?.[0]?.children?.[0]?.children,
      });
    });
  }

  // 初始化角色数据
  initAllRoleData = () => {
    const { dispatch } = this.props;

    // 请求所有角色列表
    dispatch({
      type: 'businessAccount/queryRoleListWeb',
      payload: {
        conditionMap: { sysType: 3, isEnable: 1 }, // 默认传小区
        pageIndex: 1,
        pageSize: 1000,
      },
    }).then((res) => {
      const { dataList } = res;
      const roleOptions = [];
      dataList.forEach((v) => {
        roleOptions.push(v.systemRoleName);
      });

      this.setState({ roleOptions });

      this.initRoleAuthorData();
    });
  }

  // 初始化角色权限数据
  initRoleAuthorData = () => {
    const dataList = this.props.businessAccount?.AllRole?.dataList || [];

    const { roleNameAuthortyMap = {} } = this.state;
    Promise.all(dataList?.map((role) => {
      return request('json/sys-privilege-api/auth/getAuthoritySettersByRoleId', {
        token_key: 'x-manager-token',
        body: {
          systemRoleId: role.systemRoleId,
        },
      }).then((single) => {
        roleNameAuthortyMap[`${role.systemRoleName}`] = single?.filter((item) => {
          return item.authorized === true;
        });
        return true;
      });
    })).then(() => [
      this.setState({
        roleNameAuthortyMap,
      }),
      setTimeout(() => {
        this.initBusinessRoleAuthorData();
      }, 0),
    ]);
  }

  // 初始化商家角色
  initBusinessRoleData = () => {
    const self = this;
    console.log(this.props) //eslint-disable-line
    let {
      business: { detail: currentData },
      dispatch, match: { params: { data: id } },//eslint-disable-line
    } = this.props;
    if (!currentData) {
      this.props.dispatch({
        type: 'businessAccount/queryDetail',
        payload: {
          merchantAccountId: id,
        },
      }).then(() => {
        currentData = this.props.businessAccount.queryDetailRes;
        this.setState({ currentData });
        otherThings();
      });
    }
    this.setState({ currentData });

    function otherThings() {
      //  查询商家账号角色列表接口
      dispatch({
        type: 'businessAccount/queryList',
        payload: {
          accountId: currentData?.accountId,
        },
      }).then(() => {
        setTimeout(() => {
          self.initBusinessRoleAuthorData();
        }, 0);
      });
    }
    otherThings();
  }

  // 初始化商家角色选中
  initBusinessRoleAuthorData = () => {
    const { queryListRes, AllRole } = this.props?.businessAccount || {};
    const { dataList } = AllRole || {};

    const defaultValue = [];

    queryListRes?.forEach((v) => {
      dataList?.forEach((value) => {
        if (v.authorityRoleId === value.systemRoleId) {
          defaultValue.push(value.systemRoleName);
        }
      });
    });

    this.setState({ defaultValue });

    setTimeout(() => {
      this.handleBusinessRoleChange();
    }, 0);
  }

  // 显示商家角色权限
  handleBusinessRoleChange = () => {
    const { checkedRoleList, defaultValue, roleNameAuthortyMap } = this.state;

    const checkedKeys = [];
    (checkedRoleList || defaultValue || []).forEach((systemRoleName) => {
      checkedKeys.push(
        ...(roleNameAuthortyMap || {})?.[`${systemRoleName}`]?.map((item) => {
          return item.authorityId;
        }) || []
      );
    });

    this.setState({
      checkedKeys: Array.from(new Set(checkedKeys)),
    });
  }


  handleSubmit=() => {
    const { dispatch,
      businessAccount: { AllRole: { dataList } },
    } = this.props;
    const { checkedRoleList, currentData } = this.state;
    const merchantAccountRoleList = [];
    (checkedRoleList || []).forEach((v) => {
      dataList.forEach((value) => {
        if (value.systemRoleName === v) {
          merchantAccountRoleList.push({
            authorityRoleId: value.systemRoleId,
            merchantAccountId: currentData?.accountId,
          });
        }
      });
    });

    dispatch({
      type: 'businessAccount/saveAccountpermissions',
      payload: {
        merchantAccountRoleList: {
          merchantAccountRoleList,
        },
      },
    }).then(() => {
      if (this.props.businessAccount.saveRes) {
        message.success('保存成功');
        history.back();
      }
    });
  }

  renderTreeNodes = (data) => {
    return data?.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.text} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.text} key={item.id} />;
    });
  }


  render() {
    const { roleOptions, currentData, defaultValue } = this.state;
    const title = `选择角色 ( ${currentData?.accountFullName} )`;
    return (
      <PageHeaderLayout >
        <Row className="leftSide" type="flex" justify="space-between">
          <Col span={19} id={styles.role}>
            <Card
              bordered={false}
              title={title}
              style={{ minHeight: 850 }}
              loading={this.props?.loading}
            >
              <div className={styles.checkContainer}>
                <CheckboxGroup
                  key={`sp_cg_${JSON.stringify(defaultValue) || ''}`}
                  options={roleOptions}
                  defaultValue={defaultValue}
                  onChange={this.onChange.bind(this)}
                />
              </div>

            </Card>
            <Button type="primary" style={{ width: 116 }} onClick={this.handleSubmit}> 保存 </Button>
          </Col>
          <Col span={5}>
            <Card
              bordered={false}
              title="已分配的权限"
              style={{ minHeight: 850, borderLeft: '1px,solid,#CCC' }}
              loading={this.props?.loading}
            >

              <Tree
                checkable
                checkedKeys={this.state.checkedKeys}// 选中复选框的树节点
              >
                {this.renderTreeNodes(this.state?.treeData)}
              </Tree>

            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
