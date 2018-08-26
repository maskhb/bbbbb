/*
 * @Author: wuhao
 * @Date: 2018-07-13 14:25:17
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-16 14:51:55
 *
 * 穿梭框默认搜索组件
 */


import React, { PureComponent } from 'react';

import classNames from 'classnames';

import { Form, Button, Input } from 'antd';

import styles from './index.less';

const { Item: FormItem } = Form;

@Form.create()
class Search extends PureComponent {
  static defaultProps = {};

  state = {}

  handleSubmitClick = () => {
    const { form, onOk } = this.props;
    form?.validateFields((err, values) => {
      if (!err) {
        if (onOk) {
          onOk(values);
        }
      }
    });
  }

  render() {
    const { form, btnLoading = false } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={classNames(styles.component_modal_transfer_search_default_search)} >
        <Form layout="inline">
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="商品名称"
          >
            {
              getFieldDecorator('goodsName', {

              })(
                <Input />
              )
            }
          </FormItem>

          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="商家SKU编码"
          >
            {
              getFieldDecorator('skuId', {

              })(
                <Input />
              )
            }
          </FormItem>

          <FormItem>
            <Button loading={btnLoading} type="primary" onClick={this.handleSubmitClick}>搜索</Button>
          </FormItem>

        </Form>
      </div>
    );
  }
}

export default Search;
