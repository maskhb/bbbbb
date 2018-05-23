import React, { PureComponent } from 'react';
import { Input, Button, message } from 'antd';
import Authorized from 'utils/Authorized';
import * as P from 'config/permission';

import PanelList, { Search, Batch, Table } from 'components/PanelList';
import columns from './columns';
import ModalPropertyForm from './ModalPropertyForm';


// import ProjectInput from '../../../components/ProjectInput';

export default class View extends PureComponent {
  state = {
    modalFormVisible: false,
    item: null,
  }

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values) => {
    // console.log(values);
    const { dispatch, type } = this.props;
    return dispatch({
      type: 'propertyGroup/list',
      payload: {
        type,
        ...values,
      },
    });
  }

  popConfirmStatus = (record, status, confirmText) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyGroup/edit',
      payload: {
        propertyGroupId: record.propertyGroupId,
        // propertyGroupName: record.propertyGroupName,
        status,
      },
    }).then((res) => {
      if (res !== null) {
        message.success(`${confirmText}成功`);
        this.search.handleSearch();
      }
    });
  }

  popConfirmRemove = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyGroup/remove',
      payload: {
        propertyGroupId: item.propertyGroupId,
      },
    }).then((res) => {
      if (res !== null) {
        message.success('删除成功');
        this.search.handleSearch();
      }
    });
  }

  handleModalSubmit = (item) => {
    const { dispatch, type } = this.props;
    const data = { ...item };
    if (!data.propertyGroupId) {
      data.type = type;
    }
    dispatch({
      type: item.propertyGroupId ? 'propertyGroup/edit' : 'propertyGroup/add',
      payload: data,
    }).then((res) => {
      if (!res !== null) {
        message.success(item.propertyGroupId ? '编辑成功' : '新增成功');
        this.search.handleSearch();
        this.setState({
          modalFormVisible: false,
          item: null,
        });
      }
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
    const { loading, propertyGroup, type } = this.props;
    const data = propertyGroup[`type${type}`];
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
                  form.getFieldDecorator('propertyGroupName')(
                    <Input />
                  )
                )
              }
            </Search.Item>
          </Search>

          <Batch>
            <Authorized authority={
              type === 1 ?
               P.OPERPORT_JIAJU_BASICPROPERTYLIST_ADD : P.OPERPORT_JIAJU_SALESPROPERTYLIST_ADD
              }
            >
              <Button icon="plus" type="primary" onClick={() => this.handleModalShow()}>
                新建
              </Button>
            </Authorized>
          </Batch>

          <Table
            loading={loading}
            columns={columns.basic(this)}
            dataSource={data?.list}
            pagination={data?.pagination}
            disableRowSelection
            rowKey="propertyGroupId"
          />

        </PanelList>
        {this.state.modalFormVisible && (
          <ModalPropertyForm
            visible={this.state.modalFormVisible}
            item={this.state.item}
            onOk={this.handleModalSubmit}
            onCancel={this.handleModalCancel}
          />
        )}
      </div>
    );
  }
}
