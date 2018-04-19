
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import CommunitySelect from 'components/CommunitySelect';

class CommunitySelectBtn extends Component {
  state = {
    infoModalShow: true,
    text: this.props?.text || '编辑关联项目',
    checkedCommunityIds: [],
  };
  componentWillUnmount() {
    this.setState({ infoModalShow: false });
  }
  onChange=(value) => {
    return value;
  }
  showModal=() => {
    this.setState({ infoModalShow: true });
  }
  // 点击确定
  handleOk=() => {
    const { checkedCommunityIds } = this.state;
    if (checkedCommunityIds.length) {
      // console.log(checkedCommunityIds);// eslint-disable-line
      return this.props.handleSel(checkedCommunityIds);
    }
  }

  // 点击取消
  handleCancel() {
    this.setState({ infoModalShow: false });
  }
  // 选中小区
  handleChange=(value) => {
    const { checkedCommunityIds } = value;
    console.log(checkedCommunityIds);// eslint-disable-line
    this.setState({ checkedCommunityIds });
  }

  render() {
    const { infoModalShow, text } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal.bind(this)}>
          {text}
        </Button>
        {infoModalShow ? (
          <Modal
            title="关联小区"
            visible={infoModalShow}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            style={{ minWidth: 1100, minHeight: 427 }}
          >
            <CommunitySelect expandAll needInitCheck={false} handleChange={this.handleChange} />
          </Modal>
        ) : ''}
      </div>
    );
  }
}
// CommunitySelectBtn.defaultPropTypes={}
CommunitySelectBtn.propTypes = { ...CommunitySelect.propTypes,
  text: PropTypes.string.isRequired,
};
export default CommunitySelectBtn;
