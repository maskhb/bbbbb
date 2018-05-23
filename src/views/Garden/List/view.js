import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Input, Message } from 'antd';
import Authorized from 'utils/Authorized';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
import LocationStandard from '../../../components/LocationStandard';
import DragTable from '../../../components/DragTable';
import getColumns from './columns';
import getMerchantCategoryOrderColumns from './merchantCategoryOrderColumns';
import getMerchantOrderColumns from './merchantOrderColumns';

@connect(({ garden, loading }) => ({
  garden,
  loading: loading.models.garden,
}))
export default class List extends PureComponent {
  static defaultProps = {
  };

  state = {
    modalBusinessCategoryOrderVisible: false,
    modalMerchantCategoryOrderList: [], // 商家排序规则设置获得的列表数据
    merchantOrderCategoryIdList: [], // 商家排序规则设置获得的categoryId的列表
    modalMerchantOrderVisible: false,
    modalMerchantOrderList: [], // 设置商家排序获得的列表数据
    merchantOrderList: [], // 商家排序规则设置获得的merchant的列表
    key: 0, // modal的唯一标识
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  modalBusinessCategoryOrderShow() {
    const { dispatch } = this.props;
    dispatch({
      type: 'garden/merchantCategoryList',
      payload: {
        merchantCategoryVoCondition: {
          parentId: 0,
          status: 0,
        },
      },
    }).then(() => {
      const { merchantCategoryList } = this.props.garden;
      this.setState({
        modalBusinessCategoryOrderVisible: true,
        modalMerchantCategoryOrderList: merchantCategoryList,
        key: this.state.key + 1,
      });
    });
  }
  modalBusinessCategoryOrderCancel() {
    this.setState({
      modalBusinessCategoryOrderVisible: false,
      modalMerchantCategoryOrderList: [],
    });
  }
  modalBusinessCategoryOrderOk() {
    const { dispatch } = this.props;
    const { merchantOrderCategoryIdList } = this.state;
    const categoryIdList = merchantOrderCategoryIdList.map(v => v.categoryId);
    dispatch({
      type: 'garden/merchantCategoryOrder',
      payload: {
        merchantCommunityGlobalVo: {
          categoryIdSortedList: categoryIdList,
        },
      },
    }).then(() => {
      const { merchantCategoryOrder } = this.props.garden;
      this.modalBusinessCategoryOrderCancel();
      if (merchantCategoryOrder) {
        Message.success('保存成功。', 1, () => {
          this.search.handleSearch();
        });
      } else {
        Message.error('保存失败，请稍候重试！');
      }
    });
  }
  merchantCategoryOrderHandleChange(categoryIdList) {
    this.setState({
      merchantOrderCategoryIdList: categoryIdList,
    });
  }
  modalMerchantOrderShow(communityId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'garden/merchantList',
      payload: {
        communityIdList: [communityId],
      },
    }).then(() => {
      const { merchantList } = this.props.garden;
      this.setState({
        currentCommunityId: communityId,
        modalMerchantOrderVisible: true,
        modalMerchantOrderList: merchantList || [],
        key: this.state.key + 1,
      });
    });
  }
  modalMerchantOrderCancel() {
    this.setState({
      modalMerchantOrderVisible: false,
      modalMerchantOrderList: [],
    });
  }
  modalMerchantOrderOk() {
    const { dispatch } = this.props;
    const { merchantOrderList, currentCommunityId } = this.state;
    const merchantIdList = merchantOrderList.map(v => v.merchantId);
    dispatch({
      type: 'garden/merchantOrder',
      payload: {
        merchantCommunityCustomVo: {
          communityId: currentCommunityId,
          merchantIdSortedList: merchantIdList,
        },
      },
    }).then(() => {
      const { merchantOrder } = this.props.garden;
      this.modalMerchantOrderCancel();
      if (merchantOrder) {
        Message.success('保存成功。', 1, () => {
          this.search.handleSearch();
        });
      } else {
        Message.error('保存失败，请稍候重试！');
      }
    });
  }
  modalMerchantOrderHandleChange(merchantList) {
    this.setState({
      merchantOrderList: merchantList,
    });
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const param = {
      queryCondition: {
        platformField: 3, isOpen: 1, communityName: values?.communityName,
      },
      pageSize: values.pageInfo.pageSize || 10,
      currentPage: values.pageInfo.currPage || 1,
    };
    if (values?.areaSelect?.value) {
      values.areaSelect.value.forEach((v, i) => {
        switch (i) {
          case 0:
            param.queryCondition.provinceId = v;
            break;
          case 1:
            param.queryCondition.cityId = v;
            break;
          case 2:
            param.queryCondition.areaId = v;
            break;
          default:
        }
      });
    }
    return dispatch({
      type: 'garden/list',
      payload: param,
    });
  }

  render() {
    const { loading, garden } = this.props;
    const { modalMerchantCategoryOrderList, modalMerchantOrderList, key } = this.state;
    const dataResult = garden?.list;
    return (
      <Card>
        <PanelList>
          <Search
            onSearch={this.handleSearch}
            ref={(inst) => { this.search = inst; }}
          >
            <Search.Item label="所属地区" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('areaSelect', {
                  })(
                    <LocationStandard depth={3} />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="项目名称" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('communityName', {
                  })(
                    <Input />
                  )
                )
              }
            </Search.Item>
          </Search>
          <Batch>
            <Authorized authority={['OPERPORT_JIAJU_COMMUNITY_SETTING']}>
              <a href="#/garden/list/setting/0">
                <Button type="primary">家居项目配置</Button>
              </a>
            </Authorized>
            <Authorized authority={['OPERPORT_JIAJU_COMMUNITY_SORTRULESETTING']}>
              <Button type="primary" onClick={this.modalBusinessCategoryOrderShow.bind(this)}>商家排序规则设置</Button>
            </Authorized>
            {this.state.modalBusinessCategoryOrderVisible && (
              <Modal
                key={key}
                title="商家排序规则设置"
                visible={this.state.modalBusinessCategoryOrderVisible}
                onOk={this.modalBusinessCategoryOrderOk.bind(this)}
                onCancel={this.modalBusinessCategoryOrderCancel.bind(this)}
                width="45%"
              >
                <DragTable
                  bordered
                  scroll={{ x: true, y: 500 }}
                  rowKey={(record, index) => `${record.categoryId}${index}`}
                  dataSource={modalMerchantCategoryOrderList || []}
                  columns={getMerchantCategoryOrderColumns(this)}
                  pagination={false}
                  onChange={(categoryIdList) => {
                    this.merchantCategoryOrderHandleChange(categoryIdList);
                  }}
                />
              </Modal>
            )}
            {this.state.modalMerchantOrderVisible && (
              <Modal
                key={key}
                title="设置商家排序"
                visible={this.state.modalMerchantOrderVisible}
                onOk={this.modalMerchantOrderOk.bind(this)}
                onCancel={this.modalMerchantOrderCancel.bind(this)}
                width="45%"
              >
                <DragTable
                  rowKey={(record, index) => `${record.categoryId}${index}`}
                  bordered
                  scroll={{ x: true, y: 500 }}
                  dataSource={modalMerchantOrderList || []}
                  columns={getMerchantOrderColumns(this)}
                  pagination={false}
                  onChange={(categoryIdList) => {
                    this.modalMerchantOrderHandleChange(categoryIdList);
                  }}
                />
              </Modal>
            )}
          </Batch>
          <Table
            rowKey={(record, index) => `${record.communityId}${index}`}
            loading={loading}
            columns={getColumns(this)}
            dataSource={dataResult?.dataList}
            pagination={{
              current: dataResult?.currPage || 1,
              pageSize: dataResult?.pageSize || 10,
              total: dataResult?.totalCount || 0,
            }}
            disableRowSelection
          />
        </PanelList>
      </Card>
    );
  }
}

// 遗留问题： 1.设置商家排序接口不通，  2. 商家排序规则设置保存后没生效
