import React from 'react';
import { Checkbox } from 'antd';

import ModalCover from './ModalCover';

export default class ButtonAddSpace extends React.Component {
  state = {};

  onCheckAllChange = (checkedList) => {
    this.setState({
      checkedList,
    });
  }

  getSpaceList = () => {
    const { unSelectedSpaceList } = this.props;

    return (
      <div>
        <Checkbox.Group options={unSelectedSpaceList} onChange={this.onCheckAllChange} />
      </div>
    );
  };

  render() {
    const { modalGoodsListOk, unSelectedSpaceList } = this.props;

    return (
      <ModalCover
        title="添加空间"
        content={this.getSpaceList()}
        onOk={() => {
          const { checkedList } = this.state;
          const list = unSelectedSpaceList.filter(item => checkedList.indexOf(item.value) !== -1);
          this.setState({ checkedList: [] });
          modalGoodsListOk(checkedList, list);
        }}
      >
        {
          (modalGoodsShow) => {
            return (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  modalGoodsShow();
                }}
              >+添加空间
              </a>);
          }
        }
      </ModalCover>
    );
  }
}
