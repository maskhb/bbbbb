/*
 * @Author: wuhao
 * @Date: 2018-06-15 15:54:49
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-30 16:30:22
 *
 * 换货商品弹框
 */
import React, { PureComponent } from 'react';
import uuidv4 from 'uuid/v4';

import { Form, Button, Modal, Table, Input as AntdInput, InputNumber, message } from 'antd';

import { mul, div } from 'utils/number';

import PopconfirmSelectGoodsSpec from 'components/PopconfirmSelectGoodsSpec';
import ModalSelectGoods from 'components/ModalSelectGoods/business';

import './ModalSwapGoods.less';

const { TextArea } = AntdInput;
const { Item: FormItem } = Form;

@Form.create()
class ModalSwapGoods extends PureComponent {
  static defaultProps = {};

  state = {
    loading: false,
    showModal: false,
    isSpecialOrder: false,
    isHideSelectGoodsBtn: false,
    isHideCustomGoodsBtn: false,
    goodsList: [],
  }


  getColumns = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const {
      goodsList = [],
      isHideSelectGoodsBtn = false,
      isHideCustomGoodsBtn = false,
      isSpecialOrder = false,
    } = this.state;

    const columns = [
      {
        title: '换货商品',
        width: '120px',
        dataIndex: 'swapOper',
        render: (text, record, index) => {
          return {
            children: (
              <div>
                {
                  !isHideSelectGoodsBtn ? (
                    <ModalSelectGoods {...this.props} isHideBuyNum modalTitle="添加换货商品(仅限搜索当前商家用于换货的商品)" onSelectOk={this.handleCustomSelectGoodsOk} />
                  ) : null
                }

                {
                  (isSpecialOrder && !isHideCustomGoodsBtn) ? (
                    <Button
                      style={{
                        marginTop: '10px',
                      }}
                      onClick={this.handleAddCustom}
                    >手动备注
                    </Button>
                  ) : null
                }

              </div>
            ),
            props: {
              rowSpan: index === 0 ? (goodsList?.length || 1) : 0,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        render: (text, record) => {
          if (record?.isCustom) {
            return (
              <FormItem className="form_item_input">
                {
                  getFieldDecorator(`goodsName[${record?.skuId}]`, {
                    rules: [
                      { required: true, message: '请输入商品名称' },

                    ],
                    initialValue: record?.goodsName,
                  })(
                    <TextArea
                      rows={3}
                      maxLength={30}
                      onChange={(e) => { this.handleCustomInputChange('goodsName', record, e?.target?.value); }}
                    />
                  )
                }
              </FormItem>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '商品规格',
        width: '200px',
        dataIndex: 'propertyValue',
        render: (text, record) => {
          if (record?.isCustom) {
            return (
              <FormItem className="form_item_input">
                {
                  getFieldDecorator(`propertyValue[${record?.skuId}]`, {
                    rules: [
                      { required: true, message: '请输入商品规格' },

                    ],
                    initialValue: record?.propertyValue,
                  })(
                    <TextArea
                      rows={3}
                      maxLength={30}
                      onChange={(e) => { this.handleCustomInputChange('propertyValue', record, e?.target?.value); }}
                    />
                  )
                }
              </FormItem>
            );
          } else if (text) {
            return (
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
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '销售价',
        width: '150px',
        dataIndex: 'salePrice',
        render: (text, record) => {
          if (record?.isCustom) {
            return (
              <FormItem className="form_item_input">
                {
                  getFieldDecorator(`salePrice[${record?.skuId}]`, {
                    rules: [
                      { required: true, message: '请输入销售价' },
                      {
                        validator: (rule, value, callback) => {
                          if (value <= 0) {
                            callback('请输入销售价');
                          } else if (value > 9999999.99) {
                            callback('销售价应小于9999999.99');
                          }
                          callback();
                        },
                      },
                    ],
                    initialValue: div((record?.salePrice || 0), 100),
                  })(
                    <InputNumber
                      precision={2}
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      onChange={(value) => { this.handleCustomInputChange('salePrice', record, mul((value || 0), 100)); }}
                    />
                  )
                }
              </FormItem>
            );
          } else {
            return text ? div(text, 100) : text;
          }
        },
      },
      {
        title: '换货数量',
        width: '100px',
        dataIndex: 'exchangeAmount',
        render: (text, record) => {
          return goodsList?.length > 0 ? (
            <FormItem className="form_item_input">
              {
              getFieldDecorator(`exchangeAmount[${record?.skuId}]`, {
                rules: [
                  { required: true, message: '请输入换货数量！' },
                  {
                    validator: (rule, value, callback) => {
                      if (value <= 0) {
                        callback('请输入换货数量');
                      }
                      callback();
                    },
                  },
                ],
                initialValue: record?.exchangeAmount || 1,
              })(
                <InputNumber
                  min={1}
                  onChange={(value) => { this.handleCustomInputChange('exchangeAmount', record, value || 1); }}
                />
              )
            }
            </FormItem>
          ) : null;
        },
      },
      {
        title: '操作',
        width: '120px',
        dataIndex: 'oper',
        render: (text, record) => {
          return goodsList?.length > 0 ? (
            <a onClick={() => { this.handleRemoveGoods(record); }}>删除</a>
          ) : null;
        },
      },
    ];

    return columns;
  }

  reqOnOk = async (params) => {
    const { onOk, dispatch } = this.props;
    const { goodsList = [] } = this.state;

    this.setState({
      loading: true,
    });
    // console.log('goodsList', goodsList);
    const skuIds = goodsList.filter((l) => {
      return l.skuId.toString().indexOf('custom') === -1;
    }).map(l => l.skuId);

    if (skuIds.length === 0) {
      await onOk(params);
      this.hideModalFun();
      this.setState({
        loading: false,
      });
      return;
    }
    const resList = await dispatch({
      type: 'aftersale/checkExchangeGoods',
      payload: {
        skuIdList: skuIds,
      },
    });

    if (resList) {
      const resErrList = resList?.filter(
        item => item?.putawayStatus === 0 || item?.inventoryStatus === 0
      );
      if (resErrList?.length > 0) {
        const errList = resErrList?.map((item) => {
          const goodsInfo = goodsList?.filter(item2 => item2?.skuId === item?.skuId)?.[0];

          let errMsg = `${goodsInfo?.goodsName}`;

          if (item?.putawayStatus === 0) {
            errMsg += '未上架';
          } else if (item?.inventoryStatus === 0) {
            errMsg += '库存不足';
          } else {
            errMsg += '未知不能选择';
          }

          return errMsg;
        });

        message.error(errList?.join(';'));
      } else if (onOk) {
        await onOk(params);
        this.hideModalFun();
      }
    }

    this.setState({
      loading: false,
    });
  }

  initGoodsSkuList = async (goodsList = []) => {
    const skuIds = goodsList?.map((item) => {
      return item.skuId;
    });


    if (!skuIds || skuIds.length < 1) {
      return [];
    }

    const paramSkuIds = [
      ...skuIds?.filter((item) => {
        return `${item}` !== `${-1}`;
      }),
    ];

    this.setState({
      loading: true,
    });

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
    const newGoodsList = goodsList?.map((item) => {
      return {
        ...(orderGoodsVoMap[`goods_${item.goodsId}`]),
        ...item,
      };
    });

    this.setState({
      goodsList: [
        ...newGoodsList,
      ],
      loading: false,
    });
  }

  hideModalFun = () => {
    this.setState({
      loading: false,
      showModal: false,
      isSpecialOrder: false,
      isHideSelectGoodsBtn: false,
      isHideCustomGoodsBtn: false,
      goodsList: [],
    });
  }

  handleModalCanale = () => {
    this.hideModalFun();
  }

  handleModalOk = () => {
    const { form, params } = this.props;
    const { goodsList = [] } = this.state;

    if (!goodsList || goodsList?.length < 1) {
      message.error('请选择换货商品');
      return;
    }


    form?.validateFields(
      ['goodsName', 'propertyValue', 'salePrice', 'exchangeAmount'], (err) => {
        if (!err) {
          this.reqOnOk({
            originSkuId: params?.skuId,
            goodsList: goodsList?.map((item) => {
              const newItem = item;
              newItem.originSkuId = params?.skuId;
              newItem.salePriceFormat = div(newItem?.salePrice || 0, 100);
              return newItem;
            }),
          });
        }
      });
  }

  handleBtnClick = () => {
    const { params, goodsList = [] } = this.props;
    const { orderGoodsType } = params || {};

    const [goodsVO] = goodsList || [];

    this.setState({
      showModal: true,
      isSpecialOrder: orderGoodsType === 3 || orderGoodsType === 5, // 3 定制商品 5 套餐商品
      isHideCustomGoodsBtn: goodsVO && `${goodsVO.skuId}`.indexOf('custom') === -1 && goodsVO.skuId > 0,
      isHideSelectGoodsBtn: goodsVO && (`${goodsVO.skuId}`.indexOf('custom') > -1 || goodsVO.skuId < 0),
      goodsList: [
        ...this.props.goodsList || [],
      ],
    });

    this.initGoodsSkuList(this.props.goodsList || []);
  }

  handleAddCustom = () => {
    const { goodsList = [] } = this.state;
    goodsList?.push({
      skuId: `custom_${uuidv4()}`,
      isCustom: true,
      exchangeAmount: 1,
    });

    this.setState({
      isHideSelectGoodsBtn: true,
      goodsList: [
        ...goodsList,
      ],
    });
  }

  handleRemoveGoods = (record) => {
    const {
      goodsList = [],
      isHideCustomGoodsBtn = false,
      isHideSelectGoodsBtn = false,
    } = this.state;

    const newGoodsList = goodsList.filter((item) => {
      return item.skuId !== record.skuId;
    });
    this.setState({
      isHideCustomGoodsBtn: newGoodsList?.length < 1 ? false : isHideCustomGoodsBtn,
      isHideSelectGoodsBtn: newGoodsList?.length < 1 ? false : isHideSelectGoodsBtn,
      goodsList: [
        ...newGoodsList,
      ],
    });
  }

  handleCustomSelectGoodsOk =(selectRows = []) => {
    const { goodsList = [] } = this.state;
    const newGoodsList = [
      ...selectRows.map((item) => {
        const newItem = item;
        newItem.exchangeAmount = 1;
        return newItem;
      }),
      ...goodsList.filter((item) => {
        return !selectRows.some((item2) => {
          return item?.skuId === item2.skuId;
        });
      }),
    ];

    this.setState({
      isHideCustomGoodsBtn: newGoodsList && newGoodsList.length > 0,
      goodsList: newGoodsList,
    });
  }

  handlePopconfirm = (record, selectRows) => {
    const { goodsList = [] } = this.state;

    if ((goodsList || []).some(item => item.skuId === selectRows.skuId)) {
      message.error('所选规格商品已存在~');
      return;
    }

    const newGoods = (goodsList || []).map((item) => {
      const newItem = item;
      if (newItem.skuId === record.skuId) {
        newItem.selectSpecObj = selectRows;
        newItem.propertyValue = selectRows.propertyValue;
        newItem.skuId = selectRows.skuId;
        newItem.remainNum = selectRows.remainNum;
        newItem.salePrice = selectRows.salePrice;
      }

      return newItem;
    });

    this.setState({
      goodsList: [...newGoods],
    });
  }

  handleCustomInputChange = (fieldName, record, value) => {
    const { goodsList = [] } = this.state;

    const newGoods = (goodsList || []).map((item) => {
      const newItem = item;
      if (newItem.skuId === record.skuId) {
        newItem[`${fieldName}`] = value;
      }

      return newItem;
    });

    this.setState({
      goodsList: [...newGoods],
    });
  }

  render() {
    const { title = '换货商品', btnTitle = '换货', btnElm, hideBtn = false, className } = this.props;
    const { loading = false, showModal = false, goodsList = [] } = this.state;
    window.exRef = this;
    const operBtnElm = btnElm || <Button>{btnTitle}</Button>;

    return [
      hideBtn ? null : React.cloneElement(operBtnElm, {
        loading,
        onClick: this.handleBtnClick,
      }),
      <Modal
        key="view_aftersale_components_detail_goodsInfo_components_swapgoods"
        className={`view_aftersale_components_detail_goodsInfo_components_swapgoods ${className || ''}`}
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title={title}
        okText="确认"
        width="1000px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Table
          columns={this.getColumns()}
          dataSource={goodsList?.length > 0 ? goodsList : [{}]}
          pagination={false}
          size="small"
        />
      </Modal>,
    ];
  }
}

export default ModalSwapGoods;
