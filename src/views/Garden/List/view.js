import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Input } from 'antd';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
import getColumns from './columns';
import ModalBusinessCategoryOrder from './modalBusinessCategoryOrder';

@connect(({ garden, loading }) => ({
  garden,
  loading: loading.models.garden,
}))
export default class List extends PureComponent {
  static defaultProps = {
  };

  state = {
    modalBusinessCategoryOrderVisible: false,
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  modalBusinessCategoryOrderShow = () => {
    this.setState({ modalBusinessCategoryOrderVisible: true });
  }
  modalBusinessCategoryOrderCancel = () => {
    this.setState({ modalBusinessCategoryOrderVisible: false });
  }
  modalBusinessCategoryOrderOk = () => {
    // const { data } = this.modalModalBusinessCategoryOrderRef.child.state;
    this.modalBusinessCategoryOrderCancel();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'garden/list',
      payload: values,
    });
  }

  render() {
    const { loading, garden } = this.props;

    return (
      <Card>
        <PanelList>
          <Search
            onSearch={this.handleSearch}
            ref={(inst) => { this.search = inst; }}
          >
            <Search.Item label="项目名称" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('s2', {
                  })(
                    <Input placeholder="请输入" />
                  )
                )
              }
            </Search.Item>
          </Search>
          <Batch>
            <a href="#/garden/list/setting/0">
              <Button type="primary" onClick={this.modalBusinessCategoryOrderShow}>家居项目配置</Button>
            </a>
            <Button type="primary" onClick={this.modalBusinessCategoryOrderShow}>商家排序规则设置</Button>
            <Modal
              title="商家排序规则设置"
              visible={this.state.modalBusinessCategoryOrderVisible}
              onOk={this.modalBusinessCategoryOrderOk}
              onCancel={this.modalBusinessCategoryOrderCancel}
              width="45%"
            >
              <ModalBusinessCategoryOrder
                ref={(inst) => { this.modalModalBusinessCategoryOrderRef = inst; }}
              />
            </Modal>
          </Batch>
          <Table
            loading={loading}
            columns={getColumns(this)}
            dataSource={garden?.list?.list}
            pagination={garden?.list?.pagination}
          />
        </PanelList>
      </Card>
    );
  }
}
