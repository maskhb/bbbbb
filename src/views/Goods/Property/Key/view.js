import React, { PureComponent } from 'react';
import { Button, Card, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';

import PanelList, { Batch, Table } from 'components/PanelList';
import columns from '../columns';
import KeyFormModal from './KeyFormModal';
import ValueListModal from './ValueListModal';
import ImportModal from './ImportModal';

@connect(({ propertyGroup, propertyKey, propertyValue, loading }) => ({
  propertyGroup,
  propertyKey,
  propertyValue,
  // loading,
  loading,
}))
export default class View extends PureComponent {
  state = {
    modalFormVisible: false,
    item: null,
    modalValueVisible: false,
    modalValuePropertyId: null,
    modalImportVisible: false,
  }

  componentDidMount() {
    this.initData();
  }
  getDetailId() {
    const { match: { params: { id } } } = this.props;
    return id;
  }

  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyGroup/detail',
      payload: {
        id: this.getDetailId(),
      },
    });
    this.handleSearch();
  }

  handleSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyKey/list',
      payload: {
        id: this.getDetailId(),
      },
    });
  }

  popConfirmRemove = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyKey/remove',
      payload: item,
    }).then(() => {
      message.success('删除成功');
      this.handleSearch();
    });
  }

  handleModalSubmit = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: item.id ? 'propertyKey/update' : 'propertyKey/add',
      payload: item,
    }).then(() => {
      message.success(item.id ? '编辑成功' : '新增成功');
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

  handleModalValueCancel = () => {
    this.setState({
      modalValueVisible: false,
      modalValuePropertyId: null,
    });
  }

  handleModalValueShow = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyValue/list',
      payload: {
        propertyId: val,
      },
    });
    this.setState({
      modalValueVisible: true,
      modalValuePropertyId: val,
    });
  }

  handleImport = () => {
    this.setState({
      modalImportVisible: false,
    });
  }

  handleModalImprtShow = () => {
    this.setState({
      modalImportVisible: true,
    });
  }

  handleModalImprtCancel = () => {
    this.setState({
      modalImportVisible: false,
    });
  }

  render() {
    const { loading, propertyGroup, propertyKey, propertyValue, dispatch } = this.props;
    const detail = propertyGroup[`detail${this.getDetailId()}`] || {};

    return (
      <PageHeaderLayout>
        <Card title={detail.propertyGroupName}>
          <PanelList>
            <Batch>
              <Button icon="plus" type="primary" onClick={() => this.handleModalShow()}>
                新建
              </Button>
              <Button type="primary" onClick={this.handleModalImprtShow}>
                导入
              </Button>
            </Batch>

            <Table
              loading={loading.models.propertyKey}
              columns={columns.key(this)}
              dataSource={propertyKey.list}
              pagination={propertyKey.pagination}
              disableRowSelection
              rowKey="id"
            />
          </PanelList>
          <KeyFormModal
            visible={this.state.modalFormVisible}
            item={this.state.item}
            type={1}
            onOk={this.handleModalSubmit.bind(this)}
            onCancel={this.handleModalCancel}
          />
          <ValueListModal
            dispatch={dispatch}
            visible={this.state.modalValueVisible}
            propertyValue={propertyValue}
            loading={loading.models.propertyValue}
            propertyId={this.state.modalValuePropertyId}
            onCancel={this.handleModalValueCancel}
          />
          <ImportModal
            onCancel={this.handleModalImprtCancel}
            visible={this.state.modalImportVisible}
            onOk={this.handleImport}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
