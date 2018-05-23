import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import getColumns from './columns';
import ModalBindBrand from './modalBindBrand';

@connect(({ goodsCategoryBrand, goodsCategory, loading }) => ({
  goodsCategoryBrand,
  goodsCategory,
  loading: loading.models.goodsCategoryBrand,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
      status: 1,
    },
  };

  state = {
    currentCategory: '',
  };

  componentDidMount() {
    this.search.handleSearch();
  }
  handleSearch = (values) => {
    const { dispatch, match: { params: { id } } } = this.props;
    const that = this;

    dispatch({
      type: 'goodsCategoryBrand/listOnlyBond',
      payload: {
        categoryId: id,
        ...values,
      },
    });
    dispatch({
      type: 'goodsCategory/detail',
      payload: {
        categoryId: id,
      },
    }).then(() => {
      // console.log('goodsCategory', this.props.goodsCategory);
      const category = this.props?.goodsCategory?.[`detail${id}`];
      if (category && !category.error) {
        that.setState({ currentCategory: category.categoryName });
      }
    });
  }
  modalBindBrandShow = () => {
    this.setState({ modalBindBrandVisible: true });
  }
  modalBindBrandCancel = () => {
    this.setState({ modalBindBrandVisible: false });
    this.search.handleSearch();
  }

  handleRemove = (record) => {
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
    // console.log('goodsCategoryBrand', goodsCategoryBrand);
    return (
      <PageHeaderLayout>
        <Card style={{ marginBottom: 10, background: '#fff', fontWeight: 600 }}>
          <div>当前分类：{this.state.currentCategory}</div>
        </Card>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              onSearch={this.handleSearch}
            />
            <Batch>
              <Button icon="plus" type="primary" onClick={this.modalBindBrandShow}>添加绑定品牌</Button>
              <Modal
                title="添加绑定品牌"
                visible={this.state.modalBindBrandVisible}
                onOk={this.modalBindBrandOk}
                onCancel={this.modalBindBrandCancel}
                width="60%"
                footer={null}
                destroyOnClose="true"
              >
                <ModalBindBrand
                  ref={(inst) => { this.modalBindBrandRef = inst; }}
                  {...this.props}
                />
              </Modal>
            </Batch>

            <Table
              loading={loading}
              columns={getColumns(this)}
              dataSource={goodsCategoryBrand?.listOnlyBond?.list}
              pagination={goodsCategoryBrand?.listOnlyBond?.pagination}
              disableRowSelection
              rowKey="id"
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
