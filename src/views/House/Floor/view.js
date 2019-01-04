import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Select, Button, message } from 'antd';
import getColumns from './columns';
import styles from './view.less';
import ModalForm from './modalForm';

import { isStoreOrg } from '../../../utils/getParams';

const { Option } = Select;
@connect(({ floor, loading, user, login }) => ({
  floor,
  user,
  login,
  loading: loading.effects['floor/queryListByPage'],
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {},
  };

  state = {
    modalFormVisible: false,
    formTitle: '新增楼层',
    editData: {},
  };

  componentDidMount() {
    this.search.handleSearch();
  }
  handleSearch = async (values = {}) => {
    const { orgId } = values;
    const { dispatch } = this.props;
    if (Array.isArray(orgId)) {
      values.orgId = !orgId.length ? undefined : orgId[orgId.length - 1]; //eslint-disable-line
    }
    await dispatch({
      type: 'floor/queryListByPage',
      payload: values,
    });
  };

  handleAdd() {
    this.setState({ modalFormVisible: true, formTitle: '新增楼层', editData: {} });
  }

  handleEdit(record) {
    const editData = record;
    this.setState({ modalFormVisible: true, formTitle: '编辑楼层', editData });
  }

  modalFormOk = (item) => {
    const { dispatch } = this.props;
    const data = { ...item };
    const type = item.floorId ? 'edit' : 'add';
    dispatch({
      type: `floor/${type}`,
      payload: data,
    }).then(() => {
      const result = this.props.floor[type];
      if (result && !result.error) {
        message.success(item.floorId ? '编辑成功' : '新增成功');
        this.search.handleSearch();
        this.setState({
          modalFormVisible: false,
          editData: null,
        });
      }
    });
  };
  modalFormCancel = () => {
    this.setState({ modalFormVisible: false });
  };

  render() {
    const { loading, floor } = this.props;
    const labelCol = {
      sm: 24,
      md: 6,
    };
    return (
      <PageHeaderLayout>
        <Card title="楼层管理" className={styles.card}>
          <PanelList>
            <Search
              onSearch={this.handleSearch}
              ref={(inst) => {
                this.search = inst;
              }}
            >
              <Search.Item label="楼层名" {...labelCol} simple>
                {({ form }) =>
                  form.getFieldDecorator('floorName', {})(
                    <Input placeholder="请输入名称" />
                  )
                }
              </Search.Item>
              <Search.Item label="状态" {...labelCol} simple>
                {({ form }) =>
                  form.getFieldDecorator('status', {})(
                    <Select allowClear placeholder="全部">
                      <Option value="1">启用</Option>
                      <Option value="2">禁用</Option>
                    </Select>
                  )
                }
              </Search.Item>
            </Search>
            <Batch>
              <div>
                {
                  isStoreOrg() ? (
                    <Authorized authority={[permission.PMS_ROOMRESOURCES_FLOOR_ADD]}>
                      <Button
                        className={styles.btnAdd}
                        icon="plus"
                        type="gray"
                        onClick={() => this.handleAdd()}
                      >
                        新增楼层
                      </Button>
                    </Authorized>
                  ) : null
                }

                <ModalForm
                  data={this.state.editData}
                  title={this.state.formTitle}
                  visible={this.state.modalFormVisible}
                  onOk={this.modalFormOk}
                  onCancel={this.modalFormCancel}
                />
              </div>
            </Batch>
            <Table
              loading={loading}
              columns={getColumns(this)}
              dataSource={floor?.ListData?.list}
              pagination={floor?.ListData?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
