import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';

import GroupsListView from './GroupsListView';
import '../view.less';

@connect(({ propertyGroup, loading }) => ({
  propertyGroup,
  loading: loading.models.propertyGroup,
}))
export default class AssociatedButton extends Component {
  static defaultProps = {
    type: 'normal',
  };
  state = {
    infoModalShow: false,
    propertyGroupId: null,
    propertyGroupName: null,
  }

  componentWillMount() {
    const currentValue = this.props.value;
    const { groupName } = this.props;

    if (currentValue) {
      this.setState({
        propertyGroupId: currentValue,
        propertyGroupName: groupName,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value, groupName } = nextProps;
      const currentName = this.props.groupName;

      if (groupName !== currentName) {
        this.setState({
          propertyGroupId: value,
          propertyGroupName: value ? groupName || currentName : '',
        });
      }
    }
  }

  onChange=(value) => {
    return value;
  }
  showModal=() => {
    this.setState({ infoModalShow: true });
  }
  // 点击确定
  handleOk=() => {
  }

  // 点击取消
  handleCancel() {
    this.setState({ infoModalShow: false });
  }

  handleBindChange = (record) => {
    const { onChange } = this.props;
    this.setState({
      propertyGroupId: record?.propertyGroupId,
      propertyGroupName: record?.propertyGroupName,
    }, () => {
      onChange(record?.propertyGroupId);
    });
  }
  handleSearch = ({ pageInfo, ...values }) => {
    const { dispatch, type } = this.props;
    return dispatch({
      type: 'propertyGroup/list',
      payload: {
        type,
        status: 1,
        pageInfo: {
          orderType: 'created_time desc',
          ...pageInfo,
        },
        ...values,
      },
    });
  }

  render() {
    const { loading, propertyGroup, type, dispatch } = this.props;
    const { infoModalShow, propertyGroupId, propertyGroupName } = this.state;
    // console.log(this.props.value)
    // console.log('验证setState会更新组件', propertyGroupId, propertyGroupName);
    return (
      <div>
        <Modal
          className="mainModal"
          title="关联属性组"
          visible={infoModalShow}
          footer={null}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          style={{ minWidth: 827, minHeight: 427 }}
        >
          <GroupsListView
            type={type}
            loading={loading}
            propertyGroup={propertyGroup}
            dispatch={dispatch}
            onChange={this.handleBindChange}
            propertyGroupId={propertyGroupId}
            match={this.props.match}
          />
        </Modal>
        { propertyGroupId ? (
          <span>
            <span>{propertyGroupName}</span>
            <a onClick={this.showModal.bind(this)} style={{ marginLeft: '30px' }}>修改</a>
          </span>
) : <a onClick={this.showModal.bind(this)}>请选择</a>
        }
      </div>
    );
  }
}
