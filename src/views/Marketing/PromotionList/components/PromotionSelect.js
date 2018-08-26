import React, { PureComponent } from 'react';
import { Form, message, Select, Input, InputNumber, Table } from 'antd';
import { optionsToHtml } from 'components/DataTransfer';
import ModalTransferSearch from 'components/ModalTransferSearch';
import { connect } from 'dva';
import { formatAllOpion } from 'utils/utils';
import Coupon from './Coupon';
import { conditionTypeOptionsEdit } from '../attr';

@Form.create()

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))


export default class SelectArea extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      row: props?.value?.listPromotionRuleConditionVoS || [],
      conditionType: props?.value?.conditionType,
    };
  }

  onHandleChange() {
    const { onChange } = this.props;

    if (onChange) {
      onChange({
        conditionType: this.state.conditionType,
        listPromotionRuleConditionVoS: this.state.row,
      });
    }
  }

  renderGift(_key, {
    keys,
    nums,
  }) {
    return (
      <ModalTransferSearch
        btnTitle="选择"
        hideBtn={this.props.disabled}
        modalTitle="选择赠品"
        isShowSearch
        isShowPage
        isNeedNum
        maxLength={10}
        selectedKeys={{ keys, nums }}
        onOk={(k, _row) => {
        const row = _row.map((v) => {
          return { label: v.name, value: v.key, num: v.num };
        });

        const key = _key.split('_')[0];
        const value = _key.split('_')[1];

        this.setState((res) => {
          const v = res;
          v.row[value][key] = row.map(val => val.label).join('[`rule^]');
          v.row[value][`${key}Ids`] = row.map(val => val.value).join(',');
          v.row[value].fullValueCount = row.map(val => val.num).join(',');
          return { row: [...v.row] };
        });
      }}
        transfer={
        {
          titles: ['可选商品', '已选商品'],
            showSearch: true,
        }}

        onSearch={async (data) => {
        const { dispatch } = this.props;

        let payload = {
          goodsName: data?.values?.goodsName,
          skuCode: data?.values?.skuId,
          skuIdsStr: data?.values?.skuIdsStr,
          goodsType: 4,
          pageInfo: {
            currPage: data?.current,
            pageSize: data?.pageSize || 5,
          },
        };

        payload = formatAllOpion(payload);


        await dispatch({
          type: 'common/queryPromotionGoodsByPage',
          payload,
        });

        const {
          common: { queryPromotionGoodsByPage: { totalCount: total, dataList } },
        } = this.props;
        return { total,
          dataSource: dataList.map((val) => {
            const sku = val.skuPropertyRelationVoSList || [];
            return {
              key: val.skuId,
              name: val.goodsName,
              desc: sku.map((v) => { return `${v.propertyKey}:${v.propertyValue}`; }).join(','),
              img: (
                val.goodsImgVos.find((v) => { return v.isMain; })?.imgUrl ||
                 val.goodsImgVos?.[0]?.imgUrl
              ),
            };
          }) };
      }
      }
      />
    );
  }

  render() {
    const { form, disabled, merchantId } = this.props;
    const { row, conditionType } = this.state;
    const formDom = (rowKey, rowValue, minValue) => {
      const defaultProps = {};
      // if (minValue) {
      if (rowKey.indexOf('fullKey') > -1) {
        defaultProps.min = (minValue || 0) + 0.01;
      } else {
        defaultProps.max = minValue || 0;
        defaultProps.min = 0;
      }
      // }
      return (
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <InputNumber
            {...defaultProps}
            disabled={this.props.disabled}
            style={{ width: '80px' }}
            size="small"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            precision={2}
            // min={0}
            value={rowValue}
            onChange={((_key) => {
            return (_v) => {
              const key = _key.split('_')[0];
              const value = _key.split('_')[1];

              this.setState((v) => {
              const val = v;
              val.row[value][key] = _v;
              return val;
            }, () => {
              this.onHandleChange();
            });
                        };
            })(rowKey)}
          />
        </div>);
    };

    const showGoodsDom = (v) => {
      // 熊哥写的分割符合，恶心
      const names = (v.fullValueName || v.fullValue || null)?.split('[`rule^]');
      const counts = (v.fullValueCount || null)?.split(',');
      const dataSource = names?.map((item, index) => {
        return {
          name: item,
          count: counts?.[index] || 1,
        };
      });
      return (
        <div>
          {
            <Table
              footer={null}
              pagination={false}
              columns={[
                {
                  title: '赠品名称',
                  dataIndex: 'name',
                },
                {
                  title: '数量',
                  dataIndex: 'count',
                  width: '100px',
                },
              ]}
              dataSource={dataSource}
            />
          }
        </div>
      );
    };

    const formDomGoods = (key, rowValue, vals = {}) => {
      return (
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}> {this.renderGift(key, vals)}</div>
      );
    };

    const showCouponDom = (rowValue) => {
      return (
        <div>
          <Input disabled style={{ width: '300px' }} value={rowValue} size="small" />
        </div>
      );
    };

    const formDomCoupon = (_key) => {
      return (
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <Coupon
            merchantId={merchantId}
            hideBtn={this.props.disabled}
            onChange={(_row) => {
            const key = _key.split('_')[0];
            const value = _key.split('_')[1];

            this.setState((_v) => {
              const v = _v;
              v.row[value][key] = _row.map(val => val.label).join(',');
              v.row[value][`${key}Ids`] = _row.map(val => val.value).join(',');

              return { row: [...v.row] };
            }, () => {
              this.onHandleChange();
            });
          }}
          />
        </div>
      );
    };

    const loop = () => {
      const str1 = conditionType === 1 || conditionType === 2 ? '减' : '赠';
      const str2 = conditionType === 1 || conditionType === 2 ? '元' : '';

      return row.map((v, index) => {
        // console.log('v-', v, index);
        let max = null;
        if (index > 0) {
          // const max =
          max = row[index - 1].fullKey;
        }
        let a = null;
        if (conditionType !== 1) {
          if (!disabled) {
            a = index === 0 ? (
              <a onClick={() => {
              if (row.length === 5) {
                message.error('最多可添加5项');
                return;
              }
            this.setState((_val) => {
            const val = _val;

            val.row.push({});
            return { row: [...val.row] };
            });
          }}
              >增加一级优惠
              </a>
            ) : (
              <a onClick={((i) => {
              return () => {
                this.setState((_val) => {
              const val = _val;

            val.row.splice(i, 1);
            return { row: [...val.row] };
              });
              };
            })(index)}
              >删除
              </a>
            );
          }
        }
        console.log('v:', v);
        return (
          <div style={{ marginBottom: '0' }}>满 {formDom(`fullKey_${index}`, v.fullKey, max)} 元，{str1} {
              conditionType === 3 ? formDomGoods(`fullValue_${index}`, v.fullValueName || v.fullValue, {
                keys: (v.fullValueIds || v.fullValue)?.split(','),
                nums: (v.fullValueCount)?.split(','),
              }) : conditionType === 4 ? formDomCoupon(`fullValue_${index}`, v.fullValue) : formDom(`fullValue_${index}`, v.fullValue, v.fullKey)} {str2} {a}

            {
                conditionType === 3 ? showGoodsDom(v) : (
                  conditionType === 4 ? showCouponDom(v.fullValue) : null
                )
              }
          </div>
        );
      });
    };

    return (
      <div>
        <Select
          placeholder="请选择"
          disabled={this.props.disabled}
          onSelect={(v) => {
        form.resetFields();

        this.setState({ conditionType: v, row: [{}] }, () => {
            this.onHandleChange([]);
});
      }}
          value={conditionType}
        >
          {optionsToHtml(conditionTypeOptionsEdit)}
        </Select>
        <div>
          {loop()}
        </div>
      </div>
    );
  }
}

