/*
 * @Author: wuhao
 * @Date: 2018-06-19 09:58:47
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-18 10:11:31
 *
 * 选择订单商品
 */
import React, { PureComponent } from 'react';

import { Form, Button, Modal, Table, Input as AntdInput, InputNumber, message } from 'antd';
import { Link } from 'dva/router';

import './ModalSelectOrderGoods.less';

const defaultGoodsPic = require('assets/goods_default.png');

const { Search } = AntdInput;
const { Item: FormItem } = Form;

@Form.create()
class ModalSelectOrderGoods extends PureComponent {
  static defaultProps = {};

  state = {
    loading: false,
    showModal: false,
    tableLoading: false,
    searchKey: '',
    selectedRowKeys: [],
    selectedRows: [],
    orderVO: {},
    goodsList: [],
  }

  getColumns = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form || {};

    const columns = [
      {
        title: '商品编号',
        width: '90px',
        dataIndex: 'goodsId',
      },
      {
        title: 'SKU编码',
        width: '90px',
        dataIndex: 'skuId',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        render: (text, record) => {
          return (
            <div className="components_selectordergoods_goods_name">
              { record.goodsId && record.skuId > 0 ? (
                <Link to={`/goods/list/detail/${record.goodsId}`} target="_blank">
                  <img
                    style={{
                      width: '50px',
                      height: '50px',
                    }}
                    src={record.mainImgUrl || record.goodsUrl || defaultGoodsPic}
                    alt=""
                  />
                  <span>{text}</span>
                </Link>
            )
            : [
              <img
                style={{
                width: '50px',
                height: '50px',
              }}
                src={record.mainImgUrl || record.goodsUrl || defaultGoodsPic}
                alt=""
              />,
              <span>{text}</span>,
            ]}
            </div>
          );
        },
      },
      {
        title: '商品规格',
        width: '100px',
        dataIndex: 'propertyValue',
      },
      {
        title: '总数量',
        width: '80px',
        dataIndex: 'goodsNum',
      },
      {
        title: '可退换数量',
        width: '90px',
        dataIndex: 'returnAbleNum',
      },
      {
        title: '销售价',
        width: '90px',
        dataIndex: 'salePriceFormat',
      },
      {
        title: '成交价',
        width: '90px',
        dataIndex: 'finalPriceFormat',
      },
      {
        title: '商品总额',
        width: '100px',
        dataIndex: 'goodsTotalSumFormat',
      },
      {
        title: <span>退货数量<span className="ant-form-item-required" /></span>,
        width: '100px',
        dataIndex: 'exchangeAmount',
        render: (text, record) => (
          <FormItem className="form_item_input">
            {
              getFieldDecorator(`exchangeAmount[${record?.skuId}]`, {
                rules: [
                  { required: true, message: '请输入售后数量！' },
                  {
                    validator: (rule, value, callback) => {
                      this.validatorExchangeAmount(record, rule, value, callback);
                    },
                  },
                ],
                initialValue: record?.exchangeAmount || 1,
              })(
                <InputNumber
                  min={1}
                  onChange={(value) => {
                    this.handleExchangeAmountChange(record, value);
                  }}
                />
              )
            }
          </FormItem>
        ),
      },
      {
        title: '签收时间',
        width: '100px',
        dataIndex: 'receiptTimeFormat',
      },
    ];

    return columns;
  }

  getGoodsList = async (orderSn) => {
    this.setState({
      tableLoading: true,
    });

    const { dispatch } = this.props;
    await dispatch({
      type: 'aftersale/queryOrderDetails',
      payload: {
        orderSn,
      },
    });

    const { aftersale, orderGoodsList = [] } = this.props;
    const { queryOrderDetails } = aftersale || {};
    const goodsList = queryOrderDetails?.orderGoodsList?.filter((item) => {
      return !(item?.goodsType === 3 && item?.isRemark === 2);
    }) || [];
    const selectedRowKeys = orderGoodsList.map(l => l.skuId);
    this.setState({
      selectedRowKeys: orderGoodsList.map(l => l.skuId),
      selectedRows: goodsList.filter(l => selectedRowKeys.indexOf(l.skuId) > -1),
      tableLoading: false,
      orderVO: queryOrderDetails || {},
      goodsList,
    });
  }

  /**
   * 退货数量校验
   */
  validatorExchangeAmount = (record, rule, value, callback) => {
    if (record && record.isSelect) {
      if (value > (record.returnAbleNum || 0)) {
        callback('售后数量不可大于可退换数量！');
      }
    }
    callback();
  }

  hideModalFun = () => {
    this.setState({
      loading: false,
      showModal: false,
      tableLoading: false,
      searchKey: '',
      selectedRowKeys: [],
      selectedRows: [],
      orderVO: {},
      goodsList: [],
    });
  }

  handleBtnClick = () => {
    this.setState({
      showModal: true,
    });

    const { orderSn } = this.props;
    if (orderSn) {
      this.state.searchKey = orderSn;
      this.getGoodsList(orderSn);
    }
  }

  handleModalOk = () => {
    const { form, onOk } = this.props;
    const { selectedRows = [], orderVO } = this.state;

    if (!selectedRows || selectedRows?.length < 1) {
      message.error('请选择订单商品');
      return;
    }

    form?.resetFields();
    form?.validateFields((err, vals) => {
      if (!err) {
        if (onOk) {
          onOk({
            orderVO: {
              ...orderVO,
              merchantId: orderVO?.orderInfoVO?.merchantId,
            },
            selectedRows: selectedRows.map((row) => {
              return {
                ...row,
                exchangeAmount: vals.exchangeAmount[row.skuId],
              };
            }),
          });
        }

        this.hideModalFun();
      }
    });
  }

  handleModalCanale = () => {
    this.hideModalFun();
  }

  handleSearch = (value) => {
    this.setState({
      searchKey: value,
    });

    this.getGoodsList(value);
  }

  handleTableSelectChange = (selectedRowKeys = [], selectedRows = []) => {
    const { goodsList = [] } = this.state;
    const newGoodsList = goodsList?.map((item) => {
      const newItem = item;
      newItem.isSelect = false;

      if (selectedRows?.some(item2 => item.skuId === item2.skuId)) {
        newItem.isSelect = true;
      }

      return newItem;
    });

    this.setState({
      selectedRowKeys,
      selectedRows,
      goodsList: [
        ...newGoodsList,
      ],
    });
  }

  handleExchangeAmountChange = (record, value) => {
    const { goodsList = [] } = this.state;

    const newGoodsList = goodsList.map((item) => {
      const newItem = item;
      if (newItem?.skuId === record?.skuId) {
        newItem.exchangeAmount = value || 0;
      }

      return newItem;
    });

    this.setState({
      goodsList: [
        ...newGoodsList,
      ],
    });
  }

  render() {
    const { title = '添加原订单', pattern, btnTitle = '添加原订单', btnElm, hideBtn = false, className } = this.props;
    const { searchKey = '', selectedRowKeys = [], loading = false, showModal = false, tableLoading = false, goodsList } = this.state;
    const operBtnElm = btnElm || <Button type="primary" icon="plus">{btnTitle}</Button>;
    return [
      hideBtn ? null : React.cloneElement(operBtnElm, {
        loading,
        onClick: this.handleBtnClick,
      }),
      <Modal
        key="view_aftersale_components_detail_goodsInfo_components_selectordergoods"
        className={`view_aftersale_components_detail_goodsInfo_components_selectordergoods ${className || ''}`}
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title={title}
        okText="确认"
        width="1200px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        {pattern !== 'edit' && (
          <div className="components_selectordergoods_search">
            <Search
              placeholder="请输入订单号"
              enterButton="搜索"
              onSearch={this.handleSearch}
            />
          </div>
        )}
        <div className="components_selectordergoods_show">
          <span>原子订单号：{searchKey}</span>
        </div>
        <Table
          loading={tableLoading}
          columns={this.getColumns()}
          dataSource={goodsList}
          pagination={false}
          size="small"
          rowSelection={{
            selectedRowKeys,
            onChange: this.handleTableSelectChange,
          }}
          rowKey="skuId"
        />
      </Modal>,
    ];
  }
}

export default ModalSelectOrderGoods;
