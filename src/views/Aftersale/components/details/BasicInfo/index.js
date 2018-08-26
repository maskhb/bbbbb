/*
 * @Author: wuhao
 * @Date: 2018-06-14 09:15:38
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-23 15:36:40
 *
 * 详情基本信息组件
 */
import React, { PureComponent } from 'react';

import { Card, Row, Col, Alert, Form, Spin, Select } from 'antd';

import { DecorateInput as Input, MonitorInput } from 'components/input';


import {
  getFields,
  getReturnBillBaseInfo,
  getSwapOrderBaseInfo,
  getRefundOrderBaseInfo,
  getAfterOrderForReturn,
  getAfterOrderForRefund,
  getAfterOrderForSwap,
  getAfterOrderForAddReturn,
  getAfterOrderForAddSwap,
  getAfterOrderForOperReturn,
  getAfterOrderForOperSwap,
  getAfterOrderForOperRefund,
} from './fieldTemp';

import './index.less';

const { Item: FormItem } = Form;
const SelectOption = Select.Option;

class BasicInfo extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};

    this.getFields = getFields.bind(this);
  }

  // 获取配置的字段
  getFieldInfo = (key) => {
    const { fieldInfos, detailVO: data, options = {} } = this.props;

    const field = this.getFields()?.[key] || fieldInfos?.[key];
    if (field) {
      return {
        label: field?.showName,
        value: field?.render?.(data) ||
              data?.[field?.fieldName] ||
              field?.value ||
              (field?.value === 0 ? 0 : ''),
        fieldName: field?.fieldName,
        isRed: field?.isRed,
        rules: field?.rules || [],
        selectFieldName: field?.selectFieldName,
        maxLength: field?.maxLength,
        selectValue: field?.render?.(data) ||
              data?.[field?.selectFieldName] ||
              field?.selectValue ||
              (field?.value === 0 ? 0 : ''),
        selectOptions: field?.selectOptions || options?.[`${field?.selectOptionName}`],
      };
    }

    return {
      value: key,
    };
  }


  // 获取props传递的信息
  getOtherParamsBaseInfo = () => {
    const { params } = this.props;
    const {
      infos,
      remarks,
      inputs,
      alerts,
    } = params || {};


    return {
      infos,
      remarks,
      inputs,
      alerts,
    };
  }

  // 获取页面展示信息
  getShowInfoElm = () => {
    const { type = 0 } = this.props;
    let returnInfo = {};
    switch (type) {
      case 1: // 退货单
        returnInfo = getReturnBillBaseInfo();
        break;
      case 2: // 换货单
        returnInfo = getSwapOrderBaseInfo();
        break;
      case 3: // 退款单
        returnInfo = getRefundOrderBaseInfo();
        // console.log('returnInfo', returnInfo);
        break;
      case 4: // 售后申请单(退货)
        returnInfo = getAfterOrderForReturn();
        break;
      case 5: // 售后申请单(换货)
        returnInfo = getAfterOrderForSwap();
        break;
      case 6: // 售后申请单(退款)
        returnInfo = getAfterOrderForRefund();
        break;
      case 7: // 新增售后申请单(退货)
        returnInfo = getAfterOrderForAddReturn();
        break;
      case 8: // 新增售后申请单(换货)
        returnInfo = getAfterOrderForAddSwap();
        break;
      case 9: // 新增售后申请单(退款)
        returnInfo = getAfterOrderForOperRefund();
        break;
      case 10: // 编辑、审核售后申请单(退货)
        returnInfo = getAfterOrderForOperReturn();
        break;
      case 11: // 编辑、审核售后申请单(换货)
        returnInfo = getAfterOrderForOperSwap();
        break;
      case 12: // 编辑、审核售后申请单(退款)
        returnInfo = getAfterOrderForOperRefund();
        break;
      default: // 自定义
        returnInfo = this.getOtherParamsBaseInfo();
    }

    return returnInfo;
  }


  getShowColElm = (objs, colSpan = {}) => {
    const { detailVO: data } = this.props;
    return objs && objs.filter((obj) => {
      if (obj === '售后原因' && data?.afterSaleType !== 3) {
        return false;
      }
      return true;
    }).map((key) => {
      const itemObj = this.getFieldInfo(key);
      return (
        <Col {...colSpan} className={itemObj?.isRed === 2 ? 'red' : null}>
          {
            itemObj?.label && <span>{itemObj?.label}</span>
          }
          <span className={itemObj?.isRed === 1 ? 'red' : null}>{itemObj?.value}</span>
        </Col>
      );
    });
  }

  getInputColElm = (objs) => {
    const { form } = this.props;
    return objs && objs.map((key) => {
      const itemObj = this.getFieldInfo(key);
      return itemObj?.selectOptions ? (
        <Col>
          <FormItem
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 10 }}
            label={itemObj?.label}
          >
            {
              form.getFieldDecorator(`${itemObj?.selectFieldName || itemObj?.fieldName}`, {
                rules: itemObj?.rules || [],
                initialValue: itemObj?.selectValue || itemObj?.value || '',
              })(
                <Select>
                  <SelectOption value="">请选择</SelectOption>
                  {
                    itemObj?.selectOptions.map(item => (
                      <SelectOption value={item?.value || item}>{item?.label || item}</SelectOption>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>
        </Col>
      ) : (
        <Col>
          <FormItem
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 10 }}
            label={itemObj?.label}
          >
            {
              form.getFieldDecorator(`${itemObj?.fieldName}`, {
                rules: itemObj?.rules || [],
                initialValue: itemObj?.value,
              })(
                itemObj?.maxLength ?
                  <MonitorInput maxLength={itemObj.maxLength} simple /> : <Input />
              )
            }
          </FormItem>
        </Col>
      );
    });
  }

  render() {
    const { className, loading } = this.props;
    // console.log(detailVO);

    const colSpan = { span: 6 };

    const { infos, remarks, inputs, alerts } = this.getShowInfoElm() || {};

    return (
      <Card title="基本信息" className={`${className} view_aftersale_components_details_basicinfo`}>
        <Spin spinning={loading}>

          {
            infos && infos.length > 0 ? (
              <Row gutter={16}>
                {
                  this.getShowColElm(infos, colSpan)
                }
              </Row>
            ) : null
          }

          {
            remarks && remarks.length > 0 ? (
              <Row>
                {
                  this.getShowColElm(remarks)
                }
              </Row>
            ) : null
          }

          {
            inputs && inputs.length > 0 ? (
              <Row className="baseinfo_row_inputs">
                {
                  this.getInputColElm(inputs)
                }
              </Row>
            ) : null
          }

          {
            alerts && alerts.length > 0 ? (
              <Alert
                message={(
                  <Row type="flex">
                    {
                    this.getShowColElm(alerts)
                  }
                  </Row>
                )}
                type="info"
                showIcon
              />
            ) : null
          }

        </Spin>

      </Card>
    );
  }
}

export default BasicInfo;
