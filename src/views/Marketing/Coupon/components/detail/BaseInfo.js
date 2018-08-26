import React, { PureComponent } from 'react';
import {
  Form,
  Card,
  message,
  Radio,
  Spin,
  Select,
  DatePicker,
  Checkbox,
  InputNumber,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { MonitorInput, MonitorTextArea } from 'components/input';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import { fenToYuan } from 'utils/money';
import { goTo } from 'utils/utils';
import { mul } from 'utils/number';
import SelectSearchMerchant from '../SelectSearchMerchant';
import SelectArea from '../../../PromotionList/components/SelectArea';
import { receiveMethodOptions, codeTypeOptions, belongTypes, clientType, isOnlyOptions } from '../../../attr';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const SelectOption = Select.Option;

@connect(({ marketing, loading }) => ({
  marketing,
  loading: loading.effects['marketing/couponSave'] || loading.effects['marketing/couponUpdate'] || loading.effects[',,marketing/couponDetail'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {};

  state = {};

  getPattern() {
    return this.props.pattern || 'detail';
  }

  getSubmitTitle() {
    const title = '提交';
    if (this.isAdd()) {
      return title;
    } else if (this.isEdit()) {
      return '保存';
    }
    return title;
  }

  /*
     * 返回Select元素的公共方法
     */
  getSearchOptionsElm = (options = [], isMore = false, disabled = false, placeholder = '全部') => {
    const params = isMore
      ? {
        mode: 'multiple',
      }
      : {};

    return (
      <Select allowClear disabled={disabled} placeholder={placeholder} {...params}>
        {options.map((item) => {
          return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
        })
        }
      </Select>
    );
  }

  handleSubmit = () => {
    const {
      form,
      dispatch,
      match: {
        params: {
          id,
        },
      },
    } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => {
      const params = {
        ...values,
      };
      const type = Number(id) !== 0
        ? 'couponUpdate'
        : 'couponSave';

      if (type === 'couponSave') {
        params.clientType = params
          ?.clientType
          ?.length === 2
          ? 3
          : params
            ?.clientType[0];
        params.startTime = params
          .validity[0]
          .valueOf();
        params.endTime = params
          .validity[1]
          .valueOf();
        params.amount = mul(params
          ?.amount || 0, 100);
        params.conditionAmount = mul(params
          ?.conditionAmount || 0, 100);
        delete params.validity;
        params.listPromotionRuleCouponScopeVoS = [];

        if (params
          ?.scopeType
          ?.type !== 1) {
          if (!params
            ?.scopeType
            ?.row || params
            ?.scopeType
            ?.row
            ?.length === 0) {
            message.error('适用范围不能为空');
          } else {
            const list = params
              .scopeType
              .row
              .map((v) => {
                return { isOut: 1, promotionRuleCouponType: 2, refId: v.value, refName: v.label };
              });

            params.listPromotionRuleCouponScopeVoS = params
              .listPromotionRuleCouponScopeVoS
              .concat(list);
            params.scopeType = params.scopeType.type;
          }
        } else {
          const list = {
            isOut: 1,
            promotionRuleCouponType: 2,
            refId: 0,
          };

          params.listPromotionRuleCouponScopeVoS = params
            .listPromotionRuleCouponScopeVoS
            .concat(list);

          params.scopeType = 1;
        }

        if (params.listPromotionRuleCouponScopeVoS.length === 0) {
          delete params.listPromotionRuleCouponScopeVoS;
        }
      } else {
        params.couponId = id;
        delete params.amount;
        delete params.belongType;
        delete params.clientType;
        delete params.codeType;
        delete params.codeNum;
        delete params.conditionAmount;
        delete params.validity;
        delete params.isOnly;
        delete params.merchantId;
        delete params.receiveMethod;
        delete params.scopeType;
      }

      if (!error) {
        dispatch({ type: `marketing/${type}`, payload: params }).then(() => {
          const result = this.props.marketing[type];
          if (result && !result.error) {
            message.success('保存成功!');
            goTo('/marketing/coupon');
          } else {
            message.error('保存失败!');
          }
        });
      }
    });
  }

merchantChange = async (value) => {
  const { dispatch, form } = this.props;
  const { belongType } = form.getFieldsValue();
  const merchantBaseVo = Number(value)
    ? {
      merchantId: Number(value),
    }
    : {
      merchantName: value,
    };
  await dispatch({ type: 'marketing/queryMerchant',
    payload: {
      merchantBaseVo,
    },
  });

  if (belongType === 1) {
    form.resetFields('merchantId');
    form.setFieldsValue({ merchantId: null });
  }
}
handlePatternChange = () => {
  /* const { pattern } = this.props;

    this.setState({
      pattern: pattern === 'add' ? 'edit' : 'add',
    }); */
}

isAdd() {
  return this.getPattern() === 'add';
}

isEdit() {
  return this.getPattern() === 'edit';
}

render() {
  const {
    form,
    submitting,
    loading,
    id,
    pattern,
    detailVO,
    marketing,
  } = this.props;
  const disabled = pattern === 'detail';
  const edit = pattern === 'edit';
  const data = detailVO;
  const merchantsData = marketing
    ?.queryMerchant || [];
  let { merchantName } = merchantsData?.[0] || {};
  const { belongType, codeType, conditionAmount, merchantId } = form.getFieldsValue();
  merchantName = !(belongType === 2 && merchantId)
    ? ''
    : merchantName;
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  console.log(form.getFieldsValue()); //eslint-disable-line

  return (
    <Card title="" bordered={false}>
      <Spin spinning={!!loading}>
        <Form
          onSubmit={this
      .handleSubmit
        .bind(this)}
          style={{
      marginTop: 8,
    }}
        >
          <FormItem {...formItemLayout} label="优惠券名称">
            {form.getFieldDecorator('couponName', {
        rules: [
          {
            required: true,
            message: '优惠券名称不能为空',
          },
      ],
        initialValue: data
          ?.couponName,
      })(<MonitorInput
        maxLength={100}
        simple="true"
        disabled={disabled}
        placeholder="请输入优惠券名称，不超过100个中文字符"
      />)}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券提示">
            {form.getFieldDecorator('couponTip', {
        initialValue: data
          ?.couponTip,
      })(<MonitorInput
        maxLength={100}
        simple="true"
        disabled={disabled}
        placeholder="请输入优惠券名称，不超过100个中文字符"
      />)}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券描述">
            {form.getFieldDecorator('couponDesc', {
      initialValue: data
        ?.couponDesc,
    })(<MonitorTextArea
      datakey="couponDesc"
      rows={3}
      maxLength={200}
      form={form}
      disabled={disabled}
    />)}
          </FormItem>
          <FormItem {...formItemLayout} label="开启状态">
            {form.getFieldDecorator('receiveMethod', {
        rules: [
          {
            required: true,
            message: '派发方式不能为空',
          },
      ],
        initialValue: data
          ?.receiveMethod,
      })(<RadioGroup options={receiveMethodOptions} disabled={disabled || edit} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="券码类型">
            {form.getFieldDecorator('codeType', {
        rules: [
          {
            required: true,
            message: '券码类型不能为空',
          },
      ],
        initialValue: data
          ?.codeType,
      })(
        <RadioGroup options={codeTypeOptions} disabled={disabled || edit} />)}
          </FormItem>
          {codeType === 1
        ? (
          <FormItem
          //   style={{
          //   width: 200,
          //   position: 'relative',
          // }}
            {...formItemLayout}
            label="统一码："
          >
            {form.getFieldDecorator('codeNum', {
              rules: [
                {
                  required: true,
                  message: '统一码不能为空',
                }, {
                  len: 8,
                  message: '统一码需要8位!',
                },
              ],
              initialValue: data
                ?.codeNum,
            })(<MonitorInput
              // style={{ position: 'absolute', bottom: 25, left: '320%' }}
              disabled={disabled || edit}
              datakey="codeNum"
              form={form}
              placeholder="请输入统一码"
            />)}
          </FormItem>
        )
          : ''
      }
          <FormItem {...formItemLayout} label="使用有效期">
            {form.getFieldDecorator('validity', {
        rules: [
          {
            required: true,
            message: '上线时间不能为空',
          },
      ],
        initialValue: id > 0 ? [moment(data?.startTime), moment(data?.endTime)] : [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
      })(<RangePicker
        disabled={disabled || edit}
        showTime={{
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }}
        format="YYYY-MM-DD HH:mm:ss"
        placeholder={['开始时间', '结束时间']}
      />)}
          </FormItem>
          <FormItem {...formItemLayout} label="归属">
            {form.getFieldDecorator('belongType', {
              getValueFromEvent(e) {
                const { value } = e.target;
                if (value === 2) {
                  form.resetFields('scopeType');
                }
                return value;
              },
        rules: [
          {
            required: true,
            message: '归属不能为空',
          },
      ],
        initialValue: data
          ?.belongType,
      })(<RadioGroup options={belongTypes} disabled={disabled || edit} />)}
          </FormItem>
          {(belongType === 2 && (pattern === 'edit' || pattern === 'add'))
        ? (
          <FormItem
          //   style={{
          //   width: 200,
          //   position: 'relative',
          // }}
            {...formItemLayout}
            label="商家信息"
          >
            {form.getFieldDecorator('merchantId', {
              rules: [
                {
                  required: true,
                  message: '商家ID或名称不能为空',
                },
            ],
              initialValue: data
                ?.merchantId,
            })(<SelectSearchMerchant
              // style={{ position: 'absolute', bottom: 25, left: '320%' }}
              dataSource={merchantsData}
              onChange={this.merchantChange}
              disabled={disabled || edit}
              placeholder="请输入商家ID或者名称"
            />)}
          </FormItem>
        )
          : ''
      }
          <FormItem {...formItemLayout} keyName="clientType" label="适用渠道：">
            {form.getFieldDecorator('clientType', {
        rules: [
          {
            required: true,
            message: '适用渠道不能为空',
          },
      ],
        initialValue: (data?.clientType === 3 ? [1, 2] :
          (data?.clientType ? [data?.clientType] : [2])) || [2],
              })(<CheckboxGroup options={clientType} disabled />)}
          </FormItem>
          {edit || disabled
    ? (data
      ?.scopeType
        ?.type
        ? (
          <FormItem {...formItemLayout} label="适用范围">
            {form.getFieldDecorator('scopeType', {
              rules: [
                {
                  required: true,
                  message: '适用范围不能为空',
                },
            ],
              initialValue: data
                ?.scopeType,
            })(<SelectArea
              belongType={belongType}
              merchantName={merchantName}
              merchantId={merchantId}
              disabled={disabled || edit}
            />)}
          </FormItem>
                    )
  : '')
  : (
    <FormItem {...formItemLayout} label="适用范围">
      {form.getFieldDecorator('scopeType', {
        rules: [
          {
            required: true,
            message: '适用范围不能为空',
          },
      ],
        initialValue: data
          ?.scopeType,
      })(<SelectArea
        belongType={belongType}
        merchantName={merchantName}
        merchantId={merchantId}
      />)}
    </FormItem>
              )
            }
          <Form.Item {...formItemLayout} label="使用条件：">
            {form.getFieldDecorator('conditionAmount', {
    rules: [
      {
        required: true,
        message: '请输入使用条件',
      },
  ],
    initialValue: fenToYuan(data
      ?.conditionAmount, true),
  })(<InputNumber
    style={{ width: '20%' }}
    placeholder="请输入使用条件"
    formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
    parser={value => value.replace(/￥\s?|(,*)/g, '')}
    min={0}
    max={1000000}
    step={0.01}
    disabled={disabled || edit}
  />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="面额：">
            {form.getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: '请输入面额',
                  },
                ],
                initialValue: fenToYuan(data
                  ?.amount, true),
              })(<InputNumber
                style={{ width: '20%' }}
                placeholder="请输入面额"
                formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                min={0}
                step={0.01}
                max={Number(conditionAmount || 0)}
                disabled={disabled || edit}
              />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="优惠券数量：">
            {form.getFieldDecorator('number', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券数量',
                  },
                ],
                initialValue: data
                  ?.number,
              })(<InputNumber
                disabled={disabled}
                placeholder="请输入优惠券数量"
                min={0}
                precision={0}
                step={1}
              />)}
          </Form.Item>
          <FormItem {...formItemLayout} label="是否与其他优惠券互斥">
            {form.getFieldDecorator('isOnly', {
                rules: [
                  {
                    required: true,
                    message: '归属不能为空',
                  },
                ],
                initialValue: data
                  ?.isOnly || 1,
              })(<RadioGroup options={isOnlyOptions} disabled />)}
          </FormItem>
        </Form>
        {!disabled
            ? (
              <DetailFooterToolbar
                form={form}
                submitting={submitting}
                handleSubmit={this.handleSubmit}
                pattern={pattern}
                handlePatternChange={this.handlePatternChange}
              />
            )
            : null
          }
      </Spin>
    </Card>
  );
}
}
