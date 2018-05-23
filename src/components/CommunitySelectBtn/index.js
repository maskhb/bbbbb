
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Card, Checkbox } from 'antd';
import CommunitySelect from 'components/CommunitySelect';

class CommunitySelectBtn extends Component {
  state = {
    infoModalShow: false,
    checkedCommunityIds: this.props.checkedCommunityIds,
    checkAll: this.props.checkAll,
    checkType: 4,
  };

  componentWillReceiveProps(next) {
    const { checkedCommunityIds } = next;
    this.setState({ checkedCommunityIds });
  }
  componentWillUnmount() {
    this.setState({
      infoModalShow: false,
      checkAll: this.props.checkAll,
    });
  }
  onChange=(value) => {
    return value;
  }
  showModal=() => {
    this.setState({ infoModalShow: true });
  }
  // 点击确定
  handleOk = () => {
    const { checkedCommunityIds, allCommunity, checkAll } = this.state;
    this.props.okCallBack(checkedCommunityIds, allCommunity, checkAll);
    this.setState({ infoModalShow: false });
  }
  handleChange=(v) => {
    const { checkedCommunityIds, allCommunity } = v;
    if (checkedCommunityIds?.length === allCommunity?.length) {
      this.setState({ checkAll: true, checkType: 2 });
    } else if (checkedCommunityIds?.length === 0) {
      this.setState({ checkType: 3 });
    } else {
      this.setState({ checkAll: false, checkType: 4 });
    }
    this.setState({ checkedCommunityIds, allCommunity });
  }

  // 点击取消
  handleCancel() {
    this.setState({ infoModalShow: false });
  }

  handleClick(e) {
    this.setState({ checkAll: e.target.checked });
    if (e.target.checked) {
      // 全选设type2
      this.setState({ checkType: 2 });
    } else {
      // 全不选 type3
      this.setState({ checkType: 3 });
    }
  }


  render() {
    const { infoModalShow, checkType, checkedCommunityIds } = this.state;
    const { text, buttonType } = this.props;
    return (
      <div>
        {buttonType === 'button' ? (
          <Button type="primary" onClick={this.showModal.bind(this)}>
            {text}
          </Button>
      ) : (
        <a onClick={this.showModal.bind(this)}>
          {text}
        </a>
      )}

        {infoModalShow ? (
          <Modal
            title="关联小区"
            visible={infoModalShow}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            style={{ minWidth: 1100, minHeight: 427 }}
          >
            <Card title="全部小区" loading={this.props.loading}>
              <Checkbox
                checked={this.state.checkAll}
                onClick={this.handleClick.bind(this)}
              >
                {'全部小区'}
              </Checkbox>
            </Card>
            <br />

            <Card title="具体小区" loading={this.props.loading}>
              <CommunitySelect
              // checkType={this.props.checkType}// 1,2 all,3 none,4 自定义,必填
                checkedCommunityIds={checkedCommunityIds}
                checkType={checkType}
                expandAll
                needInitCheck={false}
                handleChange={this.handleChange.bind(this)}
                okCallBack={this.props.okCallBack}
              />
            </Card>
          </Modal>
        ) : ''}
      </div>
    );
  }
}
CommunitySelectBtn.defaultProps = {
  text: '编辑关联项目',
  buttonType: 'button',
  checkAll: false,
  checkedCommunityIds: [],
};

CommunitySelectBtn.propTypes = {
  ...CommunitySelect.propTypes,
  text: PropTypes.string,
  buttonType: PropTypes.string,
  checkAll: PropTypes.bool,
  checkedCommunityIds: PropTypes.array,
  okCallBack: PropTypes.func.isRequired,
};
export default CommunitySelectBtn;
