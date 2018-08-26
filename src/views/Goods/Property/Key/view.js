import React, { PureComponent } from 'react';
import { Button, Card, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import Authorized from 'utils/Authorized';

import PanelList, { Batch, Table } from 'components/PanelList';
import columns from '../columns';
import KeyFormModal from './KeyFormModal';
import ValueListModal from './ValueListModal';
import ImportModal from './ImportModal';

import styles from './styles.less';

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
    return parseInt(id, 10);
  }

  getCurrentPropertyGroup() {
    const { propertyGroup } = this.props;
    return propertyGroup[`detail${this.getDetailId()}`] || {};
  }

  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyGroup/detail',
      payload: {
        propertyGroupId: this.getDetailId(),
      },
    });
    this.handleSearch();
  }

  isBaisc = () => {
    return this.getCurrentPropertyGroup().type === 1;
  }

  handleSearch(values = {}) {
    const { dispatch } = this.props;
    let { pageInfo } = values;
    if (!pageInfo) {
      const { propertyKey } = this.props;
      const { pagination = {} } = propertyKey[this.getDetailId()] || {};
      pageInfo = {
        currPage: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
      };
    }

    dispatch({
      type: 'propertyKey/list',
      payload: {
        propertyGroupId: this.getDetailId(),
        ...values,
        pageInfo,
      },
    });
  }

  popConfirmRemove = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyKey/remove',
      payload: item,
    }).then((res) => {
      if (res !== null) {
        message.success('删除成功');
        this.handleSearch();
      }
    });
  }

  handleModalSubmit = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: item.propertyKeyId ? 'propertyKey/edit' : 'propertyKey/add',
      payload: {
        propertyGroupId: this.getDetailId(),
        ...item,
      },
    }).then((res) => {
      if (res != null) {
        message.success(item.propertyKeyId ? '编辑成功' : '新增成功');
        this.handleSearch();
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

  handleModalValueCancel = () => {
    this.handleSearch();
    this.setState({
      modalValueVisible: false,
      modalValuePropertyId: null,
    });
  }

  handleModalValueShow = (val) => {
    this.setState({
      modalValueVisible: true,
      modalValuePropertyId: val.propertyKeyId,
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

  renderKeyFormModal = () => {
    if (this.state.modalFormVisible) {
      // const {}
      return (
        <KeyFormModal
          visible={this.state.modalFormVisible}
          item={this.state.item}
          type={this.getCurrentPropertyGroup().type}
          onOk={this.handleModalSubmit.bind(this)}
          onCancel={this.handleModalCancel}
        />
      );
    }
  }

  renderValueListModal() {
    if (this.state.modalValueVisible) {
      const { dispatch, propertyValue, loading } = this.props;
      return (
        <ValueListModal
          dispatch={dispatch}
          visible={this.state.modalValueVisible}
          propertyValue={propertyValue}
          loading={loading.models.propertyValue}
          propertyKeyId={this.state.modalValuePropertyId}
          onCancel={this.handleModalValueCancel}
        />
      );
    }
  }

  renderImportVisibleModal = () => {
    if (this.state.modalImportVisible) {
      const detail = this.getCurrentPropertyGroup();
      return (
        <ImportModal
          propertyGroupId={this.getDetailId()}
          prefixBusinessType={(detail.type || 1) + 1}
          onCancel={this.handleModalImprtCancel}
          visible={this.state.modalImportVisible}
          onOk={this.handleImport}
          onSuccess={() => {
            this.setState({
              modalImportVisible: false,
            });
            this.handleSearch();
          }}
        />
      );
    }
  }

  render() {
    const { loading, propertyKey } = this.props;
    const data = propertyKey[this.getDetailId()] || {};
    const detail = this.getCurrentPropertyGroup();

    return (
      <PageHeaderLayout>
        <Card title={detail.propertyGroupName}>
          <PanelList>
            <Batch>
              <Authorized authority={
                this.isBaisc() ? 'OPERPORT_JIAJU_BASICPROPERTYLIST_ADD'
                : 'OPERPORT_JIAJU_SALESPROPERTYLIST_ADD'
              }
              >
                <Button icon="plus" type="primary" onClick={() => this.handleModalShow()}>
                  新建
                </Button>
              </Authorized>
              <Authorized authority={
                this.isBaisc() ? 'OPERPORT_JIAJU_BASICPROPERTYLIST_IMPORT'
                : 'OPERPORT_JIAJU_SALESPROPERTYLIST_IMPORT'
              }
              >
                <Button type="primary" onClick={this.handleModalImprtShow}>
                  导入
                </Button>
              </Authorized>
            </Batch>

            <Table
              className={styles.value_table}
              loading={loading.models.propertyKey}
              columns={columns.key(this)}
              dataSource={data.list}
              pagination={data.pagination}
              onChange={(pagination) => {
                this.handleSearch({
                  pageInfo: {
                    currPage: pagination.current,
                    pageSize: pagination.pageSize,
                  },
                });
                // console.log(pagination);
              }}
              disableRowSelection
              rowKey="propertyKeyId"
            />
          </PanelList>
          {this.renderKeyFormModal()}
          {this.renderValueListModal()}
          {this.renderImportVisibleModal()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
