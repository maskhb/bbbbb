import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, DatePicker, InputNumber, message, Spin, Checkbox, Radio } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { goTo } from 'utils/utils';
import { MonitorInput, MonitorTextArea } from 'components/input';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import SelectArea from '../components/SelectArea';
import PromotionSelect from '../components/PromotionSelect';
import SelectSearchMerchant from '../../Coupon/components/SelectSearchMerchant';

import { clientTypeOptions, belongTypeOptions, isUseConponOptions } from '../attr';

const FormItem = Form.Item;

@connect(({ promotionRules, marketing, loading }) => ({
  promotionRules,
  marketing,
  loading: loading.models.promotionRules,
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
    comeFrom: 1,
  };

  state = {
    pattern: 'detail',
    initalFieldsValue: {},
  };

  componentWillMount() {
    const { match: { url } } = this.props;

    let pattern = null;
    if (url.search('add') > -1) {
      pattern = 'add';
    } else if (url.search('edit') > -1) {
      pattern = 'edit';
    } else if (url.search('detail') > -1) {
      pattern = 'detail';
    }

    this.setState({
      pattern,
    });
  }

  componentDidMount() {
    const { id: promotionId } = this.props?.match?.params;
    const { pattern } = this.state;
    const { dispatch } = this.props;

    if (pattern === 'detail' || pattern === 'edit') {
      dispatch({
        type: 'promotionRules/queryDetail',
        data: {
          promotionRuleVoQ: { promotionId },
        },
      });
    }
  }

  handlePatternChange = () => {
    const { form } = this.props;
    const { pattern, initalFieldsValue } = this.state;

    // 缓存详情数据
    if (!initalFieldsValue || _.isEmpty(initalFieldsValue)) {
      this.setState({
        initalFieldsValue: form.getFieldsValue(),
      });
    }


    // 重置数据
    if (pattern === 'edit' || pattern === 'detail') {
      form.setFieldsValue(initalFieldsValue);
    }
  }

  handleSubmit = () => {
    const { form, dispatch, promotionRules } = this.props;
    const { pattern } = this.state;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, _values) => {
      if (!error) {
        const values = { ..._values };

        if (values?.clientType?.length === 2) {
          values.clientType = 3;
        } else {
          const tmp = values.clientType[0];
          values.clientType = tmp;
        }

        values.listPromotionRuleConditionVoS = values.condition.listPromotionRuleConditionVoS.map(
          (_v) => {
            const v = { ..._v };
            v.conditionType = values.condition.conditionType;
            if (v.fullValueIds) {
              v.fullValue = v.fullValueIds;
              delete v.fullValueIds;
            }

            if (v.conditionType === 1 || v.conditionType === 2) {
              v.fullKey = parseInt(v.fullKey * 100, 10);
              v.fullValue = v.fullValue || 0;
              v.fullValue = parseInt(v.fullValue * 100, 10);
            } else {
              v.fullKey = parseInt(v.fullKey * 100, 10);
              v.fullValue = v.fullValue || 0;
            }

            return v;
          });

        if (values.listPromotionRuleConditionVoS.some(v => !v.fullKey)) {
          message.error('满足金额不能为空');
          return;
        }

        if (values.listPromotionRuleConditionVoS
          .filter(v => v.conditionType === 1 || v.conditionType === 2)
          .some(v => parseInt(v.fullValue, 10) === 0)) {
          message.error('优惠金额不能为空');
          return;
        }

        if (values.listPromotionRuleConditionVoS
          .filter(v => v.conditionType === 3)
          .some(v => parseInt(v.fullValue, 10) === 0)) {
          message.error('赠品不能为空');
          return;
        }

        if (values.listPromotionRuleConditionVoS
          .filter(v => v.conditionType === 4)
          .some(v => parseInt(v.fullValue, 10) === 0)) {
          message.error('优惠券不能为空');
          return;
        }

        values.conditionType = values.condition.conditionType;
        delete values.condition;

        values.startTime = values.time[0].valueOf();
        values.endTime = values.time[1].valueOf();
        delete values.time;

        values.listPromotionRuleCouponScopeVoS = [];

        if (values.scopeType.type !== 1) {
          const scopeRow = values.scopeType.row || values.scopeType.listPromotionRuleCouponScopeVoS;
          if (!scopeRow || scopeRow.length === 0) {
            message.error('适用范围不能为空');
          } else {
            const list1 = scopeRow.map((v) => {
              if (pattern === 'edit' || pattern === 'detail') {
                return {
                  isOut: 1,
                  promotionRuleCouponType: 1,
                  refId: v.value,
                  refName: v.label,
                };
              } else {
                return {
                  isOut: 1,
                  promotionRuleCouponType: 1,
                  refId: v.value,
                  refName: v.label,
                };
              }
            });

            values.listPromotionRuleCouponScopeVoS =
              values.listPromotionRuleCouponScopeVoS.concat(list1);
            values.scopeType = values.scopeType.type;
          }
        } else {
          const list1 = {
            isOut: 1,
            promotionRuleCouponType: 1,
            refId: 0,
          };

          values.listPromotionRuleCouponScopeVoS =
            values.listPromotionRuleCouponScopeVoS.concat(list1);

          values.scopeType = 1;
        }

        if (values.scopeOutType) {
          if (values.scopeOutType.type !== 1) {
            const scopeRow = values.scopeOutType.row ||
            values.scopeOutType.listPromotionRuleCouponScopeVoS;
            if (!scopeRow || scopeRow.length === 0) {
              message.error('不适用范围不能为空');
            } else {
              const list2 = scopeRow.map((v) => {
                return {
                  isOut: 2,
                  promotionRuleCouponType: 1,
                  refId: v.value,
                  refName: v.label,
                };
              });

              values.listPromotionRuleCouponScopeVoS =
              values.listPromotionRuleCouponScopeVoS.concat(list2);

              values.scopeOutType = values.scopeOutType.type;
            }
          } else {
            const list1 = {
              isOut: 2,
              promotionRuleCouponType: 1,
              refId: 0,
            };

            values.listPromotionRuleCouponScopeVoS =
            values.listPromotionRuleCouponScopeVoS.concat(list1);

            values.scopeOutType = 1;
          }
        }

        if (values.listPromotionRuleCouponScopeVoS.length === 0) {
          delete values.listPromotionRuleCouponScopeVoS;
        }

        if (pattern === 'edit' || pattern === 'detail') {
          values.promotionId = promotionRules.detail.promotionId;
          delete values.belongType;
          values.listPromotionRuleCouponScopeVoU = values.listPromotionRuleCouponScopeVoS;
          delete values.listPromotionRuleCouponScopeVoS;
          values.listPromotionRuleConditionVoU = values.listPromotionRuleConditionVoS;
          values.listPromotionRuleConditionVoU = values.listPromotionRuleConditionVoU.map((_v) => {
            const v = _v;

            return {
              conditionId: v.conditionId,
              fullKey: v.fullKey,
              fullValue: v.fullValue,
              fullValueCount: v.fullValueCount,
            };
          });
          delete values.conditionType;
          delete values.listPromotionRuleConditionVoS;
        }


        dispatch({
          type: pattern === 'add' ? 'promotionRules/add' : 'promotionRules/update',
          payload: values,
        }).then((res) => {
          if (res) {
            message.success('提交成功。', 0.4, () => {
              goTo('/marketing/promotionlist');
            });
          }
        });
      }
    });
  }

  merchantChange = async (value) => {
    const { dispatch } = this.props;
    const merchantBaseVo = Number(value) ? { merchantId: Number(value) } : { merchantName: value };

    this.props.form.setFieldsValue({
      scopeType: {},
      scopeOutType: {},
    });

    await dispatch({
      type: 'marketing/queryMerchant',
      payload: {
        merchantBaseVo,
      },
    });
  }

  render() {
    const { promotionRules, loading, submitting, form, marketing } = this.props;
    const { pattern } = this.state;
    const data = pattern !== 'add' ? promotionRules?.detail : {};

    const merchantsData = marketing?.queryMerchant || [];

    let { merchantName } = merchantsData?.[0] || {};
    const { merchantId, belongType } = form.getFieldsValue();
    merchantName = belongType === 1 ? '' : merchantName;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <PageHeaderLayout>
        <Card loading={!data && loading}>
          <Spin spinning={!!(data && loading)}>
            {
          pattern !== 'edit' || (pattern === 'edit' && data)
            ? (
              <Form style={{ marginTop: 8 }}>
                <p style={{ fontSize: '16px', fontWeight: '700', lineHeight: '48px', background: 'rgba(242, 242, 242, 1)', paddingLeft: '10px' }}>基本信息</p>
                <FormItem {...formItemLayout} label="规则名称">
                  {form.getFieldDecorator('promotionName', {
                  rules: [{
                    required: true, message: '请输入名称',
                  }],
                  initialValue: data?.promotionName,
                })(
                  <MonitorInput maxLength={100} simple="true" whitespace />
                )}
                </FormItem>
                <FormItem {...formItemLayout} label="规则提示">
                  {form.getFieldDecorator('promotionTip', {
              initialValue: data?.promotionTip,
            })(
              <MonitorInput maxLength={100} simple="true" whitespace />
            )}
                </FormItem>
                <FormItem {...formItemLayout} label="规则描述">
                  {form.getFieldDecorator('promotionDesc', {
                  rules: [],
                  initialValue: data?.promotionDesc,
                })(
                  <MonitorTextArea datakey="promotionDesc" rows={5} maxLength={200} form={form} />
                )}
                </FormItem>
                <FormItem {...formItemLayout} label="生效时间">
                  {form.getFieldDecorator('time', {
                  rules: [{
                    required: true, message: ' 请输入生效时间',
                  }],
                  initialValue: data?.time,
                })(
                  <DatePicker.RangePicker
                    disabled={pattern === 'detail'}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
                </FormItem>
                <FormItem {...formItemLayout} label="促销归属">
                  {form.getFieldDecorator('belongType', {
                  rules: [{
                    required: true, message: ' 请输入促销归属',
                  }],
                  initialValue: data?.belongType,
                })(
                  <Radio.Group
                    disabled={pattern === 'edit' || pattern === 'detail'}
                    onChange={(e) => {
                          this.setState({ belongType: e.target.value });

                          if (e.target.value === 1) {
                            this.props.form.setFieldsValue({
                              merchantId: 0,
                            });
                          }
                        }}
                  >
                    {
                          _.unionBy(belongTypeOptions, 'value').map(
                            item =>
                              <Radio value={item.value} key={item.value}>{item.label}</Radio>
                          )
                        }
                  </Radio.Group>
                )}
                </FormItem>
                {this.state.belongType === 2 ?
                  (
                    <Form.Item {...formItemLayout} label="商家">
                      {form.getFieldDecorator('merchantId', {
                        rules: [{
                          required: true, message: '请选择所属商家',
                        }],
                        initialValue: data?.merchantId,
                      })(
                        pattern === 'detail' ? <span>{data?.merchantId}</span>
                          : (
                            <SelectSearchMerchant
                              disabled={pattern === 'edit' || pattern === 'detail'}
                              dataSource={merchantsData}
                              onChange={this.merchantChange}
                              placeholder="请输入商家ID或者名称"
                            />
                          )
                      )}
                    </Form.Item>
                  ) : null}
                <FormItem {...formItemLayout} label="适用终端">
                  {form.getFieldDecorator('clientType', {
                  rules: [{ required: true, message: ' 请输入适用终端' }],
                  initialValue: data?.clientType || [2],
                })(
                  <Checkbox.Group disabled={pattern === 'detail'} options={clientTypeOptions} />
                )}
                </FormItem>

                <FormItem {...formItemLayout} label="是否允许使用优惠券">
                  {form.getFieldDecorator('isUseConpon', {
                  rules: [{ required: true, message: ' 必填' }],
                  initialValue: data?.isUseConpon || 2,
                })(
                  <Radio.Group disabled={pattern === 'detail'}>
                    {
                      _.unionBy(isUseConponOptions, 'value').map(
                        item =>
                          <Radio value={item.value} key={item.value}>{item.label}</Radio>
                      )
                    }
                  </Radio.Group>
                )}
                </FormItem>
                {/* <FormItem {...formItemLayout} label="活动链接-PC端">
                  {form.getFieldDecorator('activityUrlPc', {
                  rules: [{
                    type: 'url', message: 'url格式不正确',
                  }],
                  initialValue: data?.activityUrlPc,
                })(
                  <MonitorInput maxLength={200} simple="true" />
                )}
                </FormItem> */}

                <FormItem {...formItemLayout} label="活动链接-移动端">
                  {form.getFieldDecorator('activityUrlApp', {
                  rules: [{
                    type: 'url', message: 'url格式不正确',
                  }],
                  initialValue: data?.activityUrlApp,
                })(
                  <MonitorInput maxLength={200} simple="true" />
                )}
                </FormItem>
                <FormItem {...formItemLayout} label="优先级">
                  {form.getFieldDecorator('orderNum', {
                  rules: [{
                    required: true, message: '请输入优先级',
                  }],
                  initialValue: data?.orderNum,
                })(
                  <InputNumber disabled={pattern === 'detail'} min={1} max={9999} precision={0} />
                )}
                </FormItem>
                <p style={{ fontSize: '16px', fontWeight: '700', lineHeight: '48px', background: 'rgba(242, 242, 242, 1)', paddingLeft: '10px' }}>促销方案</p>
                <FormItem {...formItemLayout} label="促销类型">
                  {
                  form.getFieldDecorator('condition', {
                    rules: [{ required: true, message: '必填' }],
                    initialValue: data?.condition,
                  })(
                    <PromotionSelect merchantId={merchantId} disabled={pattern === 'edit' || pattern === 'detail'} />
                  )
                }
                </FormItem>
                <FormItem {...formItemLayout} label="适用范围">
                  {
                  form.getFieldDecorator('scopeType', {
                    rules: [{ required: true, message: '必填' }],
                    initialValue: data?.scopeType,
                  })(
                    <SelectArea
                      disabled={pattern === 'detail'}
                      belongType={belongType}
                      merchantName={merchantName}
                      merchantId={merchantId}
                    />
                  )
                }
                </FormItem>
                <FormItem {...formItemLayout} label="不适用范围">
                  {
                  form.getFieldDecorator('scopeOutType', {
                    initialValue: data?.scopeOutType,
                  })(
                    <SelectArea
                      disabled={pattern === 'detail'}
                      belongType={belongType}
                      merchantName={merchantName}
                      isOut
                      merchantId={merchantId}
                    />
                  )
                }
                </FormItem>

                <DetailFooterToolbar
                  form={form}
                  submitting={submitting}
                  handleSubmit={this.handleSubmit.bind(this)}
                  handlePatternChange={this.handlePatternChange}
                />
              </Form>
            )
            : ''
        }
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
