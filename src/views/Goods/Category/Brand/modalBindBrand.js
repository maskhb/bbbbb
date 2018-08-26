import React, { Component } from 'react';
import { Input, message, Popconfirm } from 'antd';

import PanelList, { Search, Table } from 'components/PanelList';

const columns = (self) => {
  return [
    {
      title: '品牌ID',
      dataIndex: 'brandId',
      width: '30%',
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      width: '40%',
      render: (val, record) => {
        const { isBond } = record;
        return (
          <span>
            {val}
            {isBond ?
              <span style={{ color: '#ff0000' }}> (已绑定)</span>
              : ''}
          </span>
        );
      },
    },
    {
      title: '操作',
      width: '30%',
      render: (record) => {
        const { isBond } = record;
        return (
          <div>
            {!isBond ?
              <a onClick={() => self.handleBind(record)}>绑定</a>
              : (
                <Popconfirm placement="top" title="是否确认取消绑定该品牌？" onConfirm={() => self.handleUnbind(record)} okText="确认" cancelText="取消">
                  <a>取消绑定</a>
                </Popconfirm>
)
            }

          </div>
        );
      },
    },
  ];
};

export default class ModalBindBrand extends Component {
  static defaultProps = {
  };
  state = {
  };
  componentDidMount() {
    this.search.handleSearch();
  }
  onChange=(value) => {
    return value;
  }
  handleSearch = (values) => {
    const { dispatch, match: { params: { id } } } = this.props;

    dispatch({
      type: 'goodsCategoryBrand/list',
      payload: {
        categoryId: id,
        ...values,
      },
    });
  }
  handleBind = (record) => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'goodsCategoryBrand/add',
      payload: {
        categoryId: id,
        brandId: record.brandId,
      },
    }).then(() => {
      const result = this.props.goodsCategoryBrand?.add;
      if (result && !result.error) {
        message.success('绑定成功');
      }
      this.search.handleSearch();
    });
  }
  handleUnbind = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsCategoryBrand/remove',
      payload: {
        categoryBrandId: record.categoryBrandId,
      },
    }).then(() => {
      const result = this.props.goodsCategoryBrand?.remove;
      if (result && !result.error) {
        message.success('取消绑定成功');
      }
      this.search.handleSearch();
    });
  }
  render() {
    const { loading, goodsCategoryBrand } = this.props;
    // console.log('list', goodsCategoryBrand);
    return (
      <PanelList>
        <Search
          ref={(inst) => { this.search = inst; }}
          onSearch={this.handleSearch}
        >
          <Search.Item label="品牌名称" simple>
            {
              ({ form }) => (
                form.getFieldDecorator('brandName', {
                })(
                  <Input placeholder="请输入" />
                )
              )
            }
          </Search.Item>
        </Search>

        <Table
          loading={loading}
          columns={columns(this)}
          dataSource={goodsCategoryBrand?.list?.list}
          pagination={goodsCategoryBrand?.list?.pagination}
          size="small"
          bordered
          disableRowSelection
        />
      </PanelList>
    );
  }
}
