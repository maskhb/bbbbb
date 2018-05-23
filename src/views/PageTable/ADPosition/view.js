import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, message } from 'antd';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';
import ModalForm from './modalForm';

@connect(({ adPos, loading }) => ({
  adPos,
  loading: loading.models.adPos,
}))
export default class View extends PureComponent {
  static defaultProps = {};

  state = {
    modalFormVisible: false,
    formTitle: '添加广告位',
    editData: {},
  };

  componentDidMount() {
    this.search.handleSearch();
  }
  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'adPos/list',
      payload: {
        ...values,
      },
    });
  }

  handleAdd(parentId = 0) {
    const editData = { parentId };
    if (parentId) {
      editData.parents = this.getParents(parentId).join(' / ');
    }
    this.setState({ modalFormVisible: true, formTitle: '添加广告位', editData });
  }

  handleEdit(record = { parentId: 0 }) {
    const editData = record;
    if (editData.parentId) {
      editData.parents = this.getParents(editData.posId).join(' / ');
    }
    this.setState({ modalFormVisible: true, formTitle: '编辑广告位', editData });
  }

  modalFormOk = (item) => {
    const { dispatch } = this.props;
    const data = { ...item };
    const type = item.posId ? 'edit' : 'add';
    dispatch({
      type: `adPos/${type}`,
      payload: data,
    }).then(() => {
      const result = this.props.adPos[type];
      if (result && !result.error) {
        message.success(item.posId ? '编辑成功' : '新增成功');
        this.search.handleSearch();
        this.setState({
          modalFormVisible: false,
          editData: null,
        });
      }
    });
  }
  modalFormCancel = () => {
    this.setState({ modalFormVisible: false });
  }

  render() {
    const { loading, adPos, searchDefault } = this.props;
    // console.log(adPos);
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            />

            <Batch style={{ marginBottom: '16px' }}>
              <Authorized authority={[permission.OPERPORT_JIAJU_BANNERPOSITIONLIST_ADD]}>
                <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>添加广告位</Button>
                <ModalForm
                  data={this.state.editData}
                  title={this.state.formTitle}
                  visible={this.state.modalFormVisible}
                  onOk={this.modalFormOk}
                  onCancel={this.modalFormCancel}
                />
              </Authorized>
            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={adPos?.list?.list}
              pagination={adPos?.list?.pagination}
              disableRowSelection
              rowKey="posId"
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
