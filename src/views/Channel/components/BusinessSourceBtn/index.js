
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Checkbox } from 'antd';
import request from 'utils/request';
import { orgId } from 'utils/getParams';
import styles from './view.less';

const CheckboxGroup = Checkbox.Group;
class BusinessSourceBtn extends Component {
  state = {
    infoModalShow: false,
    checked: [...this.props.initData],
  };


  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    this.setState({ infoModalShow: false });
  }
  init=() => {
    request('/fc/ht-fc-pms-server/source/list', {
      method: 'POST',
      body: {
        orgId: orgId(),
      },
    }).then((res) => {
      const { dataList } = res;
      if (dataList && dataList.map) {
        const tempArr = [];
        /* .filter(i => (i.status === 1)) */
        dataList.forEach((v) => {
          tempArr.push({ label: v.sourceName, value: v.sourceId });
        });
        tempArr.sort((str1, str2) => {
          return str1.label.localeCompare(str2.label, 'zh');
        });
        this.setState({ dataList: tempArr });
      }
    });
  }

  showModal = () => {
    this.setState({ infoModalShow: true });
  }
  // 点击确定
  handleOk = () => {
    const { dataList, checked } = this.state;
    let checkNames = '';
    dataList.forEach((i) => {
      if (checked?.includes(i.value)) {
        checkNames += `${i.label},`;
      }
    });
    checkNames = checkNames.substr(0, checkNames.length - 1);
    this.props.okCallBack(checked, dataList, checkNames);
    this.setState({ infoModalShow: false });
  }
  handleChange = (checked) => {
    console.log({ checked });

    this.setState({ checked });
  }

  // 点击取消
  handleCancel() {
    this.props.cancelCallBack();
    this.setState({ infoModalShow: false });
  }


  render() {
    const { infoModalShow, dataList } = this.state;
    const { text, buttonType } = this.props;

    return (
      <div>
        {buttonType === 'button' ? (
          <Button
            type="primary"
            onClick={this.showModal.bind(this)}
          >
            {text}
          </Button>
        ) : (
          <a onClick={this.showModal.bind(this)}>
            {text}
          </a>
          )}

        {infoModalShow ? (
          <Modal
            title="选择业务来源"
            visible={infoModalShow}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            className={styles.modal}
          >

            <CheckboxGroup
              options={dataList}
              onChange={this.handleChange.bind(this)}
              defaultValue={this.props.initData}
            />

          </Modal>
        ) : ''}
      </div>
    );
  }
}
BusinessSourceBtn.defaultProps = {
  buttonType: 'button',
  text: '编辑业务来源',
  cancelCallBack: () => {},
};

BusinessSourceBtn.propTypes = {
  buttonType: PropTypes.string,
  cancelCallBack: PropTypes.func,
  text: PropTypes.string,
  okCallBack: PropTypes.func.isRequired,
};

export default BusinessSourceBtn;
