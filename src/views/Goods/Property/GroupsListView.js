import React, { PureComponent } from 'react';
import { Input, Button, message } from 'antd';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';

import columns from './columns';
import ModalPropertyForm from './ModalPropertyForm';

import ProjectInput from '../../../components/ProjectInput';

export default class View extends PureComponent {
  state = {
    modalFormVisible: false,
    item: null,
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'propertyGroup/list',
      payload: {
        type: this.props.type || 1,
        currentPage: 1,
        pageSize: 20,
        ...values,
      },
    });
  }

  popConfirmStatus = (record, status, confirmText) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyGroup/edit',
      payload: {
        id: record.propertyGroupId,
        status,
      },
    }).then(() => {
      message.success(`${confirmText}成功`);
      this.handleSearch();
    });
  }

  popConfirmRemove = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyGroup/remove',
      payload: item,
    }).then(() => {
      message.success('删除成功');
      this.handleSearch();
    });
  }

  handleModalSubmit = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: item.propertyGroupId ? 'propertyGroup/edit' : 'propertyGroup/add',
      payload: item,
    }).then(() => {
      message.success(item.propertyGroupId ? '编辑成功' : '新增成功');
      this.handleSearch();
      this.setState({
        modalFormVisible: false,
        item: null,
      });
    });
  }

  handleModalCancel = () => {
    this.setState({
      modalFormVisible: false,
      item: null,
    });
  }

  handleModalShow = (item) => {
    this.setState({
      modalFormVisible: true,
      item,
    });
  }

  render() {
    const { loading, propertyGroup } = this.props;
    return (
      <div>
        <PanelList>
          <Search
            ref={(inst) => { this.search = inst; }}
            onSearch={this.handleSearch}
          >
            <Search.Item label="属性组名称" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('name')(
                    <Input />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="项目选择" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('project')(
                    <ProjectInput />
                  )
                )
              }
            </Search.Item>
          </Search>

          <Batch>
            <Button icon="plus" type="primary" onClick={() => this.handleModalShow()}>
              新建
            </Button>
          </Batch>

          <Table
            loading={loading}
            columns={columns.basic(this)}
            dataSource={propertyGroup.list}
            pagination={propertyGroup.pagination}
            disableRowSelection
            rowKey="propertyGroupId"
          />
        </PanelList>
        <ModalPropertyForm
          visible={this.state.modalFormVisible}
          item={this.state.item}
          onOk={this.handleModalSubmit}
          onCancel={this.handleModalCancel}
        />
      </div>
    );
  }
}
