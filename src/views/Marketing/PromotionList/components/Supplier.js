import React, { PureComponent } from 'react';
import { Transfer, Modal } from 'antd';

export default class Supplier extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  render() {
    return (
      <Modal
        width={700}
        title="指定供应商"
        visible={this.props.visible}
        onCancel={() => { this.props.onChange({ visible: false }); }}
        onOk={() => {
        this.props.onChange(this.state.checkedKeys);
      }}
      >
        <Transfer
          titles={['可选分类', '已选分类']}
          dataSource={[]}
          showSearch
          listStyle={{
        width: 250,
          height: 300,
      }}
          targetKeys={[]}
          selectedKeys={[]}
          onChange={() => {}}
          onSelectChange={() => {}}
          render={item => `${item.title}`}
        />
      </Modal>
    );
  }
}

