/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:24:04
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-07 17:54:48
 *
 * 备注商品弹框
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import uuidv4 from 'uuid/v4';

import { Button, Modal, Table, InputNumber, Row, Col, Input, Select, message } from 'antd';

import { fenToYuan } from 'utils/money';
import { sub, mul } from 'utils/number';

import PopconfirmSelectGoodsSpec from 'components/PopconfirmSelectGoodsSpec';
import ModalSelectGoods from 'components/ModalSelectGoods/business';

import { IsOrderGoodsIsRemark } from '../attr';

import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

class ModalRemarkGoods extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    tableLoading: false,
    customGoods: [],
    totalSalePrice: 0,
    selectPropertyKeys: [],
  }

  getColumns = () => {
    const { params = {} } = this.props;
    const { customGoods = [] } = this.state;

    const { orderGoodsVOList = [], newOrderGoodsVOList } = params || {};
    let orderGoodsVo = null;
    (newOrderGoodsVOList || orderGoodsVOList || []).forEach((item) => {
      if (!IsOrderGoodsIsRemark(item.isRemark)) {
        orderGoodsVo = item;
      }
    });

    if (orderGoodsVo === null) {
      const [oneOrderGoodsVo] = newOrderGoodsVOList || orderGoodsVOList || [];
      orderGoodsVo = oneOrderGoodsVo || {};
    }


    return [
      {
        title: '定制商品',
        dataIndex: 'customGoods',
        render: (text, record, index) => {
          return {
            children: (
              <div>
                <Row type="flex" className="custom_goods_row">
                  <Col>
                    <img className="custom_goods_img" src={orderGoodsVo?.mainImgUrl} alt="" />
                  </Col>
                  <Col>
                    <div className="custom_goods_name">
                      <span>{orderGoodsVo?.goodsName}</span>
                    </div>
                    <div className="custom_goods_desc">
                      <span>类型：{orderGoodsVo?.propertyValue}</span>
                    </div>
                    <div className="custom_goods_money">
                      <span>¥{orderGoodsVo?.salePriceFormat || 0}x{orderGoodsVo?.goodsNum}</span>
                    </div>
                  </Col>
                </Row>
                <div>
                  <ModalSelectGoods {...this.props} onSelectOk={this.handleCustomSelectGoodsOk} />
                  &nbsp;&nbsp;
                  <Button onClick={this.handleAddGoods}>手动备注</Button>
                </div>
              </div>
            ),
            props: {
              rowSpan: index === 0 ? (customGoods.length || 1) : 0,
            },
          };
        },
      },
      {
        title: '商品名称',
        width: '160px',
        dataIndex: 'goodsName',
        render: (text, record) => {
          return record?.customType === 2 ? (
            <TextArea
              rows={10}
              maxLength={30}
              defaultValue={text}
              onChange={(e) => { this.handleCustomGoodsNameChange(record, e?.target?.value); }}
            />
          ) : text;
        },
      },
      {
        title: '商品规格',
        width: '120px',
        dataIndex: 'propertyValue',
        render: (text, record) => {
          return record?.customType === 2 ? (
            <TextArea
              rows={10}
              maxLength={30}
              defaultValue={text}
              onChange={(e) => { this.handleCustomPropertyValueChange(record, e?.target?.value); }}
            />
          ) : (record?.customType !== 0 ? (
            <span>
              {text} <br />（
              <PopconfirmSelectGoodsSpec
                dataSource={record?.goodsSkuVoList}
                onConfirm={(selectRows) => {
                  this.handlePopconfirm(record, selectRows);
                }}
              >
                <a>更改规格</a>
              </PopconfirmSelectGoodsSpec>）
            </span>
          ) : '');
        },
      },
      {
        title: '基础数据',
        width: '150px',
        dataIndex: 'basicData',
        render: (text, record) => {
          const { selectPropertyKeys } = this.state;
          return record?.customType === 2 ? (
            <Row>
              {
                (selectPropertyKeys || []).map(item => (
                  <Col key={`propert_key_${item.propertyName}`} style={{ marginBottom: '5px' }}>
                    <span>{item.propertyName}：</span>
                    <Select
                      style={{ width: '100px' }}
                      dropdownMatchSelectWidth={false}
                      defaultValue={
                        item.propertyName === '空间' ? (record?.propertySpace || '') : (
                          item.propertyName === '材质' ? (record?.propertyMaterial || '') : (
                            item.propertyName === '风格' ? (record?.propertyStyle || '') : (
                              item.propertyName === '功能' ? (record?.propertyFunction || '') : ''
                            )
                          )
                        )
                      }
                      onChange={(value) => {
                        this.handlePropertyKeyChange(record, item, value);
                      }}
                    >
                      <Option value="">请选择</Option>
                      {
                        (item.propertyValuesAll || '').split(',').map(itemValue => (
                          <Option key={`proper_${itemValue}`} value={itemValue}>{itemValue}</Option>
                        ))
                      }
                    </Select>
                  </Col>
                ))
              }
            </Row>
          ) : (
            <div>
              {
                (record?.goodsPropertyRelationVoSList || []).map(item => (
                  <div key={`goods_property_${item.propertyKey}`}>
                    <span>{item.propertyKey}：</span>
                    <span>{item.propertyValue}</span>
                  </div>
                ))
              }
            </div>
          );
        },
      },
      {
        title: '销售价',
        width: '100px',
        dataIndex: 'salePrice',
        render: (text, record) => {
          const salePrice = fenToYuan(text, false);
          return record?.customType === 2 ? (
            <InputNumber
              defaultValue={salePrice || 0}
              precision={2}
              min={0}
              max={9999999.99}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={(value) => { this.handleCustomSalePriceChange(record, value || 0); }}
            />
          ) : (record?.customType !== 0 ? salePrice : '');
        },
      },
      {
        title: '购买数量',
        width: '75px',
        dataIndex: 'goodsNum',
        render: (text, record) => {
          return record?.customType !== 0 ? (
            <InputNumber
              style={{ width: '60px' }}
              precision={0}
              min={1}
              defaultValue={text}
              onChange={(value) => { this.handleCustomBuyNumChange(record, value || 0); }}
            />
          ) : '';
        },
      },
      {
        title: '操作',
        width: '60px',
        dataIndex: 'oper',
        render: (text, record) => {
          return record?.customType !== 0 ? <a onClick={() => { this.handleRemoveGoods(record); }}>删除</a> : '';
        },
      },
    ];
  }

  initPropertyKeyList = async () => {
    const { selectPropertyKeys } = this.state;
    if (!selectPropertyKeys || selectPropertyKeys.length < 1) {
      const { dispatch } = this.props;
      await dispatch({
        type: 'propertyKey/list',
        payload: {
          propertyGroupId: 0,
          pageInfo: {},
        },
      });

      const { propertyKey } = this.props;

      const newSelectPropertyKeys = [];

      (propertyKey?.[0]?.list || []).forEach((item) => {
        if (
          item.propertyName === '空间' ||
          item.propertyName === '功能' ||
          item.propertyName === '风格' ||
          item.propertyName === '材质'
        ) {
          newSelectPropertyKeys.push(item);
        }
      });

      this.setState({
        selectPropertyKeys: newSelectPropertyKeys,
      });
    }
  }

  initGoodsSkuList = async (queryOrderGoods = []) => {
    const skuIds = queryOrderGoods?.map((item) => {
      return item.skuId;
    });


    if (!skuIds || skuIds.length < 1) {
      return [];
    }

    const paramSkuIds = [
      ...skuIds?.filter((item) => {
        // return `${item}` !== `${-1}`;
        return item > 0;
      }),
    ];

    // skuIds不存在时，不进行接口调用
    if (paramSkuIds && paramSkuIds.length > 0) {
      const { dispatch } = this.props;
      await dispatch({
        type: 'goods/orderGoodsList',
        payload: {
          skuIds: paramSkuIds,
        },
      });
    }

    const { goods } = this.props;
    const { orderGoodsList } = goods || {};

    const orderGoodsVoMap = {};
    (orderGoodsList || []).forEach((item) => {
      const goodsSkuVoList = (item?.goodsSkuVoList || []).map((goodsItem) => {
        return {
          ...goodsItem,
          propertyValue: (goodsItem?.skuPropertyRelationVoSList || []).map((propertyItem) => {
            return propertyItem.propertyValue;
          }).join(','),
          goodsNum: goodsItem.remainNum,
        };
      });

      orderGoodsVoMap[`goods_${item.goodsId}`] = {
        ...item,
        goodsSkuVoList,
        selectSpecObj: goodsSkuVoList?.[0],
        remainNum: goodsSkuVoList?.[0]?.remainNum,
        propertyValue: goodsSkuVoList?.[0]?.propertyValue,
        salePrice: goodsSkuVoList?.[0]?.salePrice,
      };
    });
    return queryOrderGoods?.map((item) => {
      return {
        ...(orderGoodsVoMap[`goods_${item.goodsId}`]),
        ...item,
      };
    });
  }

  initRemarkGoods = async () => {
    const { dispatch, params } = this.props;
    this.setState({
      tableLoading: true,
    });

    await dispatch({
      type: 'orders/queryOrderGoods',
      payload: {
        type: 1,
        orderId: params?.orderId,
      },
    });

    const { orders } = this.props;
    const { queryOrderGoods = [] } = orders;

    const newQueryOrderGoods = queryOrderGoods?.map((item) => {
      return {
        ...item,
        customType: item.goodsId > 0 ? 1 : 2,
      };
    });

    const newCustomGoods = await this.initGoodsSkuList(newQueryOrderGoods);

    this.setState({
      tableLoading: false,
      customGoods: newCustomGoods,
    });

    this.initTotalSalePrice();
  }

  initTotalSalePrice = () => {
    const { customGoods = [] } = this.state;

    let totalSalePrice = 0;
    customGoods.forEach(({ salePrice = 0, goodsNum = 1 }) => {
      totalSalePrice += mul(salePrice, goodsNum);
    });

    this.setState({
      totalSalePrice,
    });
  }

  handlePropertyKeyChange = (record, item, value) => {
    const { customGoods = [] } = this.state;
    (customGoods || []).forEach((goodsVO, index) => {
      if (goodsVO.orderGoodsId === record.orderGoodsId) {
        if (item.propertyName === '空间') {
          customGoods[index].propertySpace = value;
        } else if (item.propertyName === '材质') {
          customGoods[index].propertyMaterial = value;
        } else if (item.propertyName === '风格') {
          customGoods[index].propertyStyle = value;
        } else if (item.propertyName === '功能') {
          customGoods[index].propertyFunction = value;
        }
      }
    });
  }

  handleCustomSalePriceChange = (record, value) => {
    const { customGoods = [] } = this.state;
    customGoods.forEach((item, index) => {
      if (item.orderGoodsId === record.orderGoodsId) {
        customGoods[index].salePrice = mul(value, 100) || 0;
      }
    });

    this.initTotalSalePrice();
  }

  handleCustomBuyNumChange = (record, value) => {
    const { customGoods = [] } = this.state;
    customGoods.forEach((item, index) => {
      if (item.orderGoodsId === record.orderGoodsId) {
        customGoods[index].goodsNum = value;
      }
    });

    this.initTotalSalePrice();
  }

  handleCustomGoodsNameChange = (record, value) => {
    const { customGoods = [] } = this.state;
    customGoods.forEach((item, index) => {
      if (item.orderGoodsId === record.orderGoodsId) {
        customGoods[index].goodsName = value;
      }
    });
  }

  handleCustomPropertyValueChange = (record, value) => {
    const { customGoods = [] } = this.state;
    customGoods.forEach((item, index) => {
      if (item.orderGoodsId === record.orderGoodsId) {
        customGoods[index].propertyValue = value;
      }
    });
  }

  handleAddGoods = () => {
    const { customGoods = [] } = this.state;

    customGoods.push({
      orderGoodsId: uuidv4(),
      goodsId: -1,
      customType: 2,
      goodsNum: 1,
    });
    this.setState({
      customGoods: [...customGoods],
    });
  }

  handleRemoveGoods = (record) => {
    const { customGoods = [] } = this.state;

    this.setState({
      customGoods: [...customGoods.filter((item) => {
        return item.orderGoodsId !== record.orderGoodsId;
      })],
    });

    setTimeout(() => {
      this.initTotalSalePrice();
    }, 0);
  }

  handlePopconfirm = (record, selectRows) => {
    const { customGoods = [] } = this.state;

    if ((customGoods || []).some(item => item.skuId === selectRows.skuId)) {
      message.error('所选规格商品已存在~');
      return;
    }


    const newGoods = (customGoods || []).map((item) => {
      const newItem = item;
      if (newItem.orderGoodsId === record.orderGoodsId) {
        newItem.selectSpecObj = selectRows;
        newItem.propertyValue = selectRows.propertyValue;
        newItem.skuId = selectRows.skuId;
        newItem.remainNum = selectRows.remainNum;
        newItem.salePrice = selectRows.salePrice;
      }

      return newItem;
    });

    this.setState({
      customGoods: [...newGoods],
    });

    setTimeout(() => {
      this.initTotalSalePrice();
    }, 0);
  }

  handleCustomSelectGoodsOk = (goods) => {
    const { customGoods = [] } = this.state;

    const newGoods = goods.filter(({ skuId }) => {
      return !customGoods.some((item) => {
        return item.skuId === skuId;
      });
    }).map((item) => {
      const newItem = item;

      newItem.customType = 1;
      newItem.orderGoodsId = uuidv4();
      return newItem;
    });

    customGoods.push(...newGoods);

    this.setState({
      customGoods: [
        ...customGoods,
      ],
    });

    setTimeout(() => {
      this.initTotalSalePrice();
    }, 0);
  }

  handleButtonClick = () => {
    this.initPropertyKeyList();
    this.initRemarkGoods();
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
      loading: false,
      customGoods: [],
      totalSalePrice: 0,
    });
  }

  handleDefaultOk = async ({ orderSn, customGoods = [] }) => {
    const { dispatch, refresh } = this.props;
    const goodsRemarkVOList = [];

    let isError = false;
    goodsRemarkVOList.push(
      ...customGoods.map(({
        goodsId,
        goodsName,
        goodsNum,
        propertyValue,
        salePrice,
        skuId,
        propertyFunction = '',
        propertyMaterial = '',
        propertySpace = '',
        propertyStyle = '',
        customType,
      }) => {
        if (customType === 2 && (
          propertyFunction.length < 1 ||
          propertyMaterial.length < 1 ||
          propertySpace.length < 1 ||
          propertyStyle.length < 1
        )) {
          isError = true;
        }

        return {
          ...customType === 2 ? null : { goodsId },
          goodsName,
          goodsNum,
          propertyValue,
          salePrice,
          skuId,
          propertyFunction,
          propertyMaterial,
          propertySpace,
          propertyStyle,
        };
      })
    );

    if (isError) {
      message.error('手动备注的商品基础数据必选~');
      throw new Error();
    }

    await dispatch({
      type: 'orders/goodsRemark',
      payload: {
        orderSn,
        goodsRemarkVOList,
      },
    });

    const { orders } = this.props;
    if (orders?.goodsRemark === null) {
      throw new Error();
    }

    message.success('备注商品成功');

    if (refresh) {
      refresh();
    }
  }

  handleModalOk = async () => {
    const { onOk, params } = this.props;
    const { customGoods = [], totalSalePrice = 0 } = this.state;

    if (sub(params?.orderAmount, totalSalePrice) !== 0) {
      message.error('备注商品金额合计不等于定制商品金额');
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      if (onOk) {
        await onOk({ ...params, customGoods });
      } else {
        await this.handleDefaultOk({ ...params, customGoods });
      }

      this.setState({
        showModal: false,
        loading: false,
        customGoods: [],
        totalSalePrice: 0,
      });
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { hideBtn, className, params } = this.props;
    const { showModal, loading, tableLoading, customGoods = [], totalSalePrice } = this.state;

    const btnElm = <Button key="c_c_mrg_btn" type="primary" onClick={this.handleButtonClick}>备注商品</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mrg_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="备注商品"
        okText="保存"
        width="1000px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
        className={classNames(className, styles.component_modal_remark_goods)}
      >
        <Table
          loading={tableLoading}
          columns={this.getColumns()}
          dataSource={customGoods && customGoods.length > 0 ? customGoods : [{ customType: 0 }]}
          pagination={false}
          size="small"
          rowKey="orderGoodsId"
        />

        <div className="custom_goods_error">
          <span>
            备注商品金额合计¥{params?.orderAmountFormat}，
            距离定制商品总额还差¥{fenToYuan(sub(params?.orderAmount, totalSalePrice))}
          </span>
        </div>
      </Modal>,
    ];
  }
}

export default ModalRemarkGoods;
