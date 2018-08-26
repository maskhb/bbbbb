/*
 * @Author: wuhao
 * @Date: 2018-04-16 20:26:21
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-09 10:11:56
 *
 * 选择商品
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Modal, Button, Input, InputNumber, Table, Row, Col, message } from 'antd';

import { fenToYuan } from 'utils/money';

import PopconfirmSelectGoodsSpec from 'components/PopconfirmSelectGoodsSpec';

import styles from './index.less';

const { Search } = Input;

class ModalSelectGoods extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    tableLoading: false,
    recordSelectMap: {},
    recordSpecMap: {},
    recordBuyNumMap: {},
    searchKey: null,
    pageSize: 6,
  }

  getColumns = () => {
    const { isHideBuyNum = false } = this.props;
    const columns = [
      {
        title: '商品信息',
        dataIndex: 'goodsName',
        render: (text, record) => {
          const { recordSpecMap } = this.state;
          return (
            <Row type="flex">
              <Col>
                <img className="select_goods_img" src={record.imgUrl} alt="" />
              </Col>
              <Col>
                <div className="select_goods_name">
                  <span>{record.goodsName}</span>
                </div>
                <div className="select_goods_oper">
                  {
                    recordSpecMap[`${record.goodsId}`] ? (
                      <span>
                        已选:{recordSpecMap[`${record.goodsId}`]?.propertyValue}（
                        <PopconfirmSelectGoodsSpec
                          dataSource={record?.goodsSkuVoList}
                          onConfirm={(selectRows) => {
                            this.handlePopconfirm(record, {
                              ...selectRows,
                            });
                          }}
                        >
                          <a>修改</a>
                        </PopconfirmSelectGoodsSpec>
                        ）
                      </span>
                    ) : (
                      <PopconfirmSelectGoodsSpec
                        dataSource={record?.goodsSkuVoList}
                        onConfirm={(selectRows) => {
                          this.handlePopconfirm(record, selectRows);
                        }}
                      >
                        <Button type="primary" size="small">选择规格</Button>
                      </PopconfirmSelectGoodsSpec>
                    )
                  }

                </div>
              </Col>
            </Row>
          );
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        width: '90px',
        render: (text, record) => {
          const { recordSpecMap } = this.state;
          return recordSpecMap[`${record.goodsId}`] ? fenToYuan(recordSpecMap[`${record.goodsId}`].salePrice) : '';
        },
      },
      {
        title: '库存',
        dataIndex: 'goodsNum',
        width: '80px',
        render: (text, record) => {
          const { recordSpecMap } = this.state;
          return recordSpecMap[`${record.goodsId}`]?.goodsNum || '';
        },
      },
    ];

    if (!isHideBuyNum) {
      columns.push({
        title: '购买数量',
        dataIndex: 'buyNum',
        width: '80px',
        render: (text, record) => {
          const { recordSpecMap } = this.state;
          return recordSpecMap[`${record.goodsId}`] ? (
            <InputNumber
              min={1}
              defaultValue={1}
              max={recordSpecMap[`${record.goodsId}`]?.remainNum || 1}
              style={{ width: '60px' }}
              onChange={(value) => {
                const { recordBuyNumMap } = this.state;
                recordBuyNumMap[`${record.goodsId}`] = value;
                this.setState({
                  recordBuyNumMap,
                });
              }}
            />
          ) : '';
        },
      });
    }

    columns.push({
      title: '操作',
      dataIndex: 'oper',
      width: '80px',
      render: (text, record) => {
        const { recordSelectMap } = this.state;
        let elm = <Button onClick={() => { this.handleSelectGoods(record); }}>选取</Button>;

        if (recordSelectMap[`${record.goodsId}`]) {
          elm = <Button type="primary" onClick={() => { this.handleCancleSelectGoods(record); }}>取消</Button>;
        }

        return elm;
      },
    });

    return columns;
  }

  handleButtonClick = async () => {
    const { onSearch } = this.props;
    const { pageSize } = this.state;

    this.setState({
      showModal: true,
      searchKey: null,
      tableLoading: true,
    });

    if (onSearch) {
      await onSearch({ current: 1, pageSize });
    }

    this.setState({
      tableLoading: false,
    });
  }

  handleSearch = async (searchKey) => {
    const { onSearch } = this.props;
    const { pageSize } = this.state;

    this.setState({
      tableLoading: true,
      recordSelectMap: {},
      recordSpecMap: {},
      recordBuyNumMap: {},
      searchKey,
    });

    if (onSearch) {
      await onSearch({ searchKey, current: 1, pageSize });
    }

    this.setState({
      tableLoading: false,
    });
  }

  handleTableChange = async ({ current }) => {
    const { onSearch } = this.props;
    const { searchKey, pageSize } = this.state;
    this.setState({
      tableLoading: true,
      recordSelectMap: {},
      recordSpecMap: {},
      recordBuyNumMap: {},
    });
    if (onSearch) {
      await onSearch({ searchKey, current, pageSize });
    }
    this.setState({
      tableLoading: false,
    });
  }

  handlePopconfirm = (record, selectRows) => {
    const { recordSpecMap } = this.state;

    recordSpecMap[`${record.goodsId}`] = selectRows;

    this.setState({
      recordSpecMap: {
        ...recordSpecMap,
      },
    });
  }

  handleCancleSelectGoods = (record) => {
    const { recordSelectMap } = this.state;

    delete recordSelectMap[`${record.goodsId}`];

    this.setState({
      recordSelectMap: {
        ...recordSelectMap,
      },
    });
  }

  handleSelectGoods = (record) => {
    const { isOne = false } = this.props;
    const { recordSelectMap } = this.state;


    recordSelectMap[`${record.goodsId}`] = record;

    this.setState({
      recordSelectMap: {
        ...(isOne ? { [`${record.goodsId}`]: record } : recordSelectMap),
      },
    });
  }

  handleModalCancle = () => {
    this.setState({
      showModal: false,
      loading: false,
      recordSelectMap: {},
      recordSpecMap: {},
      recordBuyNumMap: {},
    });
  }

  handleModalOk = async () => {
    const { onSelectOk } = this.props;
    const { recordSpecMap, recordSelectMap, recordBuyNumMap } = this.state;
    // console.log('recorif()dSpecMap', recordSpecMap, recordSelectMap);
    // return;
    if (Object.keys(recordSelectMap).length < 1) {
      message.error('请先选择商品');
      return;
    }
    if (Object.keys(recordSelectMap).some((key) => {
      return !recordSpecMap[key];
    })) {
      message.error('请先选择规格');
      return;
    }

    const selectArrays = [];
    Object.keys(recordSelectMap).forEach((key) => {
      const record = { ...recordSelectMap[key] };
      record.selectSpecObj = { ...recordSpecMap[key] };
      record.propertyValue = recordSpecMap[key]?.propertyValue;
      record.salePrice = recordSpecMap[key]?.salePrice;
      record.remainNum = recordSpecMap[key]?.remainNum;
      record.skuId = recordSpecMap[key]?.skuId;
      record.goodsNum = recordBuyNumMap[key] || 1;

      selectArrays.push(record);
    });

    this.setState({
      loading: true,
    });

    if (onSelectOk) {
      await onSelectOk(selectArrays);
    }

    this.setState({
      showModal: false,
      loading: false,
      recordSelectMap: {},
      recordSpecMap: {},
      recordBuyNumMap: {},
      searchKey: null,
    });

    message.success('选择成功');
  }

  render() {
    const { hideBtn, className, dataSource, btnTitle = '选择商品', modalTitle = '选择商品', btnDom } = this.props;
    const { showModal, loading, tableLoading, pageSize } = this.state;

    const btnElm = btnDom ? React.cloneElement(
      btnDom,
      {
        onClick: this.handleButtonClick,
      }
    ) : <Button key="jj_cc_msg_btn" type="primary" onClick={this.handleButtonClick}>{btnTitle}</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        key="jj_cc_msg_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title={modalTitle}
        okText="确定使用"
        width="700px"
        onCancel={this.handleModalCancle}
        onOk={this.handleModalOk}
        className={classNames(className, styles.component_modal_select_goods)}
      >
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Search
            placeholder="请输入搜索关键词"
            enterButton
            onSearch={this.handleSearch}
            style={{
              width: 300,
            }}
          />
        </div>
        <Table
          loading={tableLoading}
          dataSource={dataSource?.list}
          columns={this.getColumns()}
          size="small"
          locale={{
            emptyText: '没有相关商品，请换个关键词搜索',
          }}
          onChange={this.handleTableChange}
          pagination={{
            ...dataSource?.pagination,
            pageSize,
          }}
          key="jj_cc_msg_table"
        />
      </Modal>,
    ];
  }
}

export default ModalSelectGoods;
