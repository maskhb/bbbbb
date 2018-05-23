import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Input, Table } from 'antd';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import G from 'utils/cartesian';
import { d3Col0, d3Col1 } from 'components/Const';
import TipLabel from 'components/input/TipLabel';
import ISSTATUS from 'components/IsStatus';
import DynamicRadio from './DynamicRadio';
import DynamicCheckbox from './DynamicCheckbox';
import DynamicSelect from './DynamicSelect';
import dataDivide from './dataDivide';
import skuCardTableColumns from './skuCardTableColumns';

export default class SkuCard extends Component {
  constructor(props) {
    super(props);

    const { value = {} } = this.props;
    this.state = {
      goodsSkuVoList: value.goodsSkuVoList || [],
      choiceList: value.choiceList || [],
      delSkuIds: value.delSkuIds || [],
      hasSku: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;

      this.setState({
        goodsSkuVoList: value.goodsSkuVoList?.map((sku) => {
          // skuPropertyRelationVoSList扁平化到表格数据
          const json = Object.values(sku.skuPropertyRelationVoSList || []).map((prop) => {
            return prop;
          });
          const jsonToNewList = {};
          for (const r of Object.values(json)) {
            if (typeof r.propertyValue !== 'undefined') {
              jsonToNewList[`skuProp_${r.propertyKeyId}`] = r.propertyValue;
            }
          }

          return {
            ...sku,
            ...jsonToNewList,
          };
        }),
        choiceList: value.choiceList,
        delSkuIds: value.delSkuIds,
      });
    }
  }

  // 没有规格属性，生成一个默认sku
  handleAddDefaultSku = () => {
    const { form } = this.props;

    const defaultImgGroupId = _.find(form.getFieldValue('goodsImgGroupVoList')?.imageGroups,
      v => v.isDefault === ISSTATUS.YES.value)?.imgGroupId;

    const createDefaultSku = (uid) => {
      return {
        prop: {
          skuId: uid,
          remainNum: 100,
          skuCode: '',
          barCode: '',
          supplyPrice: 0,
          marketPrice: 0,
          salePrice: 0,
          discountPrice: 0,
          imgGroupId: defaultImgGroupId,
          skuPropertyRelationVoSList: [],
        },
      };
    };

    const uid = uuidv4();
    const { prop } = createDefaultSku(uid);
    const newList = [{
      ...prop,
      isDefault: ISSTATUS.YES.value,
    }];

    this.setState({
      goodsSkuVoList: newList,
    });
    this.triggerChange({ goodsSkuVoList: newList });
  }

  // 生成规格
  handleAddSku = () => {
    const { goodsSkuVoList, choiceList } = this.state;
    const { form } = this.props;

    if (!choiceList || choiceList.length === 0) {
      if (!goodsSkuVoList || goodsSkuVoList.length === 0) {
        this.handleAddDefaultSku();
      }
      return;
    }

    const defaultImgGroupId = _.find(form.getFieldValue('goodsImgGroupVoList')?.imageGroups,
      v => v.isDefault === ISSTATUS.YES.value)?.imgGroupId;

    let hasMulti = false;
    // 从表单、属性列表中，拼接属性对象
    const props = _.compact(Object.entries(form.getFieldsValue()).map(([k, v]) => {
      let r = null;
      const selectV = _.isArray(v) ? v : [v];
      // 获取属性id
      const propertyKeyId = k.match(/skuProp_(\w*)/)?.[1];
      // 获取属性对象
      for (const prop of Object.values(choiceList)) {
        if (prop.propertyKeyId === Number(propertyKeyId)) {
          const kvs = prop.propertyValuesIds?.split(',')?.map((value, valIndex) => {
            return {
              value: Number(value),
              label: prop.propertyValuesAll?.split(',')?.[valIndex],
            };
          }) || [];

          const propertyValue = _.compact(selectV?.map((val) => {
            return kvs.find(kv => kv.value === val)?.label;
          })).join(',');

          r = {
            ...prop,
            propertyValue,
          };

          if (propertyValue.indexOf(',') !== -1) {
            hasMulti = true;
          }
        }
      }
      return r;
    }));

    // 复选值转单选值 propertyValue: '1, 2' -> 两个属性
    let mutilProps = [];
    const multiValues = [];
    if (hasMulti) {
      const allValues = [];

      for (const prop of props) {
        const values = prop.propertyValue.split(',');
        allValues.push(values);
      }

      for (const values of G.cartesian(...allValues)) {
        multiValues.push([...values]);
      }

      const pLength = props?.length;
      const vLength = multiValues?.[0].length;

      if (pLength === vLength) {
        mutilProps = multiValues.map((valArray) => {
          return valArray.map((val, index) => {
            const prop = props[index];
            return {
              ...prop,
              propertyValue: val,
            };
          });
        });
      }
    }

    const compareProps = (mProps) => {
      const compareStr = mProps.map(p => `${p.propertyKeyId}:${p.propertyValue}`).join();
      const compareStrs = goodsSkuVoList.map((sku) => {
        return _.compact(sku.skuPropertyRelationVoSList?.map(p => `${p.propertyKeyId}:${p.propertyValue}`)).join();
      });

      if (compareStrs.includes(compareStr)) {
        return null;
      } else {
        return mProps;
      }
    };

    const createSku = (oneProps1, uid) => {
      // skuPropertyRelationVoSList扁平化到表格数据
      const json = Object.values(oneProps1).map((prop) => {
        return prop;
      });
      const jsonToNewList = {};
      for (const r of Object.values(json)) {
        if (typeof r.propertyValue !== 'undefined') {
          jsonToNewList[`skuProp_${r.propertyKeyId}`] = r.propertyValue;
        }
      }

      return {
        json,
        prop: {
          skuId: uid,
          totalNum: 100,
          occupyNum: 0,
          remainNum: 100,
          skuCode: '',
          barCode: '',
          supplyPrice: 0,
          marketPrice: 0,
          salePrice: 0,
          discountPrice: 0,
          skuPropertyRelationVoSList: oneProps1.map((p) => {
            const valuesIds = p.propertyValuesIds || [];
            const valuesAll = p.propertyValuesAll || [];
            const valueId = Number(valuesIds.split(',')[valuesAll.split(',').findIndex(v => v === p.propertyValue)]) || 0;

            return {
              propertyGroupId: p.propertyGroupId,
              propertyKeyId: p.propertyKeyId,
              propertyKey: p.propertyName,
              propertyValueId: valueId,
              propertyValue: p.propertyValue,
            };
          }),
          imgGroupId: defaultImgGroupId,
          ...jsonToNewList,
        },
      };
    };

    const validateOneProps = (oneProps, callback) => {
      const fileds = _.compact(oneProps.map(p => (p.isRequired ? `skuProp_${p.propertyKeyId}` : '')));
      form.validateFields(fileds, (error) => {
        if (!error) {
          const uid = uuidv4();
          const { prop } = createSku(oneProps, uid);

          // 新增属性表列
          const newList = [...goodsSkuVoList];
          if (newList.length === 0) {
            newList.unshift({
              ...prop,
              isDefault: ISSTATUS.YES.value,
            });
          } else {
            newList.unshift(prop);
          }

          this.setState({
            goodsSkuVoList: newList,
          });
          this.triggerChange({ goodsSkuVoList: newList });

          callback(form, fileds);
        }
      });
    };

    // 多条sku的验证
    let newListEmpty = false;
    const validateProps = (mutilProps1, callback) => {
      const fileds = _.compact(mutilProps1[0].map(p => (p.isRequired ? `skuProp_${p.propertyKeyId}` : '')));
      form.validateFields(fileds, (error) => {
        if (!error) {
          const newList = [...goodsSkuVoList];

          mutilProps1.map((onePropsA, index) => {
            const uid = uuidv4();
            const { prop } = createSku(onePropsA, uid);

            if (index === 0 && newList.length === 0) {
              newListEmpty = true;
            }

            if (newListEmpty && index === mutilProps1.length - 1) {
              newList.unshift({
                ...prop,
                isDefault: ISSTATUS.YES.value,
              });

              newListEmpty = false;
            } else {
              newList.unshift(prop);
            }

            return null;
          });

          this.setState({
            goodsSkuVoList: newList,
          });
          this.triggerChange({ goodsSkuVoList: newList });
        }

        callback(form, fileds);
      });
    };

    if (hasMulti) {
      // 排除重复的sku
      mutilProps = _.compact(mutilProps.map((mProps) => {
        return compareProps(mProps);
      }));

      if (!mutilProps || mutilProps.length === 0) {
        this.setState({
          hasSku: true,
        });
        return;
      }

      this.setState({
        hasSku: false,
      });

      validateProps(mutilProps, (formC, fileds) => {
        formC.resetFields(fileds);
      });
    } else {
      // 排除重复的sku
      const filterProps = compareProps(props);
      if (!filterProps || filterProps.length === 0) {
        this.setState({
          hasSku: true,
        });
        return;
      }

      this.setState({
        hasSku: false,
      });

      // 验证属性
      validateOneProps(props, (formC, fileds) => {
        formC.resetFields(fileds);
      });
    }
  }

  // 自定义 - 离开控件
  handleCustomBlur = (value, dataKey, e) => {
    if (!e.target.value) {
      return;
    }

    this.setState({
      [dataKey]: this.state[dataKey].map((c) => {
        const color = c;
        if (color.value === value) {
          color.label = e.target.value;
        }
        return color;
      }),
      [`${dataKey}Lock`]: false,
    });
  }

  // 自定义
  handleCustom = (data, dataKey) => {
    if (this.state[`${dataKey}Lock`]) {
      return;
    }

    const value = _.maxBy(data, o => o.value).value + 1;
    this.setState({
      [dataKey]: data.concat({
        label: <Input
          size="small"
          onBlur={this.handleCustomBlur.bind(this, value, dataKey)}
        />,
        value,
      }),
      [`${dataKey}Lock`]: true,
    });
  }

  // 表格 - 删除
  handleSkuDelete = (record) => {
    // delSkuIds:[1,2]
    const goodsSkuVoList = this.state.goodsSkuVoList.filter(item => item.skuId !== record.skuId);
    // 接口返回的sku，删除后要记录
    const delSkuIds = _.uniq([
      ...this.state.delSkuIds,
      String(record.skuId)?.match(/-/) ? null : record.skuId,
    ]);

    this.setState({ goodsSkuVoList, delSkuIds });
    this.triggerChange({ goodsSkuVoList, delSkuIds });
  }

  handleSkuUpdate = (record, status) => {
    const goodsSkuVoList = this.state.goodsSkuVoList.map((item) => {
      if (item.skuId === record.skuId) {
        return {
          ...item,
          status,
        };
      } else {
        return item;
      }
    });
    this.setState({ goodsSkuVoList });
    this.triggerChange({ goodsSkuVoList });
  }

  // 表格 - 字段值
  handleChangeColumn(value, skuId, column) {
    const { goodsSkuVoList } = this.state;
    const newData = [...goodsSkuVoList];
    const target = newData.filter(item => skuId === item.skuId)?.[0];
    if (target) {
      target[column] = value;

      // 联动可售库存
      if (column === 'totalNum') {
        target.remainNum = value - target.occupyNum;
      }

      this.setState({ goodsSkuVoList: newData });
      this.triggerChange({ goodsSkuVoList: newData });
    }
  }

  // 表格 - 默认操作
  handleChangeDefault = (skuId) => {
    const { goodsSkuVoList } = this.state;
    const newData = [...goodsSkuVoList];
    for (const item of newData.values()) {
      item.isDefault = item.skuId === skuId ? ISSTATUS.YES.value : ISSTATUS.NO.value;
    }
    this.setState({ goodsSkuVoList: newData });
    this.triggerChange({ goodsSkuVoList: newData });
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { form, disabled, pattern, propertyGroupId } = this.props;
    const { choiceList, goodsSkuVoList, hasSku } = this.state;

    const propsDivideByCategoryList = dataDivide(choiceList);
    const me = this;

    const divideTable = {};
    // sku的sku属性key不同，则分开表格显示
    for (const sku of Object.values(goodsSkuVoList)) {
      const propIdsStr = sku.skuPropertyRelationVoSList?.map((prop) => {
        return prop.propertyKeyId;
      }).join('') || '0';

      if (!divideTable[propIdsStr]) {
        divideTable[propIdsStr] = [];
      }

      divideTable[propIdsStr].push(sku);
    }

    return (
      <div>
        {
          !disabled
            ? (
              <Form layout="vertical">
                {
                  propsDivideByCategoryList.length > 0
                    ? (
                      <div style={{ marginBottom: 24 }}>
                        {propsDivideByCategoryList.map((skuPropGroup, i) => (
                          <Row gutter={16} key={`${i + 1}`}>
                            {skuPropGroup.map((skuProp, index) => {
                              const col = index % 3 === 0 ? d3Col0 : d3Col1;
                              const { isFilter, isRequired, isCustmer, inputType,
                                propertyKeyId, propertyName } = skuProp;
                              const yesno = isFilter === 1;
                              const dynamicInputProps = {
                                form,
                                filedId: `skuProp_${propertyKeyId}`,
                                label: propertyName,
                                filters: skuProp.propertyValuesIds?.split(',')?.map((value, valIndex) => {
                                  return {
                                    value: Number(String(value).replace('c-', '')),
                                    label: skuProp.propertyValuesAll?.split(',')?.[valIndex]?.replace('c-', ''),
                                    isCustmer: value.match('c-'),
                                  };
                                }),
                                required: isRequired === 1,
                                custom: isCustmer === 1,
                                yesno,
                                disabled,
                                onChangeFilters: (filters) => {
                                  const newList = choiceList.map((prop) => {
                                    const p = { ...prop };
                                    if (p.propertyKeyId === propertyKeyId) {
                                      p.propertyValuesAll = (filters.map((f) => {
                                        return f.label;
                                      })).join(',');
                                      p.propertyValuesIds = (filters.map((f) => {
                                        return f.value;
                                      })).join(',');
                                    }
                                    return p;
                                  });

                                  me.setState({
                                    choiceList: newList,
                                  });
                                  me.triggerChange({ choiceList: newList });
                                },
                              };

                              return (
                                <Col {...col} key={propertyKeyId}>
                                  <Row>
                                    {yesno || inputType === 1
                                      ? <DynamicRadio {...dynamicInputProps} />
                                      : inputType === 2
                                        ? <DynamicCheckbox {...dynamicInputProps} />
                                        : inputType === 3
                                          ? <DynamicSelect {...dynamicInputProps} />
                                          : inputType === 4
                                            ? <DynamicSelect {...dynamicInputProps} showSearch />
                                            : ''}
                                  </Row>
                                </Col>
                              );
                            })}
                          </Row>
                        ))}
                      </div>
                    )
                    : ''
                }
                <Row>
                  <Button disabled={!propertyGroupId || disabled} type="dashed" onClick={this.handleAddSku}>
                    <Icon type="plus" />生成规格
                  </Button>
                  {
                    !propertyGroupId
                      ? <TipLabel content="请先选择商品分类" />
                      : ''
                  }
                  {
                    hasSku
                      ? <span style={{ color: '#f5222d', marginLeft: 24 }}>规格已存在</span>
                      : ''
                  }
                </Row>
              </Form>
            )
            : ''
        }
        {
          Object.entries(divideTable).map(([k, v]) => {
            return (
              <Table
                bordered
                columns={skuCardTableColumns(this, v, disabled, form, pattern)}
                dataSource={v}
                pagination={false}
                rowKey="skuId"
                key={k}
                style={{ marginTop: 24, marginBottom: 24 }}
              />
            );
          })
        }
      </div>
    );
  }
}
