import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Menu } from 'antd';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
import getColumns from './columns';
import './view.less';

@connect(({ model, loading }) => ({
  model,
  loading: loading.models.model,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'model/list',
      payload: values,
    });
  }

  render() {
    const { loading, model, searchDefault } = this.props;

    return (
      <Card>
        <PanelList>
          <Search
            ref={(inst) => { this.search = inst; }}
            searchDefault={searchDefault}
            onSearch={this.handleSearch}
          >
            <Search.Item label="x1" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('id', {
                  })(
                    <Input placeholder="请输入" />
                  )
                )
              }
            </Search.Item>
          </Search>

          <Batch>
            <a href="#/model/list/detail/0">
              <Button icon="plus" type="primary">新建</Button>
            </a>
            <Batch.Item>
              {
                ({ rows }) => {
                  return (
                    rows.length
                      ? (
                        <Button>批量1</Button>
                      )
                      : ''
                  );
                }
              }
            </Batch.Item>
            <Batch.More>
              {
                () => {
                  return (
                    <Menu>
                      <Menu.Item key="more1">批量more1</Menu.Item>
                      <Menu.Item key="more2">批量more2</Menu.Item>
                      <Menu.Item key="more3">批量more3</Menu.Item>
                    </Menu>
                  );
                }
              }
            </Batch.More>
          </Batch>

          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={getColumns(this, searchDefault)}
            dataSource={model?.list?.list}
            pagination={model?.list?.pagination}
          />
        </PanelList>
      </Card>
    );
  }
}
