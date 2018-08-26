import React, { PureComponent } from 'react';

import { Form, Button, Input, Modal, Table, message } from 'antd';
import request from 'utils/request';

const { Item: FormItem } = Form;

@Form.create()
export default class CouponList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: [],
      selectedRowKeys: [],
    };

    this.selectedRows = [];
    this.columns = [{
      title: 'ID',
      dataIndex: 'couponId',
      key: 'couponId',
      width: 80,
    }, {
      title: '优惠券名称',
      dataIndex: 'couponName',
      key: 'couponName',
      width: 200,
    }, {
      title: '归属',
      dataIndex: 'belongTypeName',
      key: 'belongTypeName',
      width: 80,
    }, {
      title: '使用条件（元）',
      dataIndex: 'conditionAmount',
      key: 'conditionAmount',
      width: 120,
    }, {
      title: '面额（元）',
      dataIndex: 'amount',
      key: 'amount',
      width: 110,
    }, {
      title: '剩余数量',
      dataIndex: 'remainingCount',
      key: 'number',
      width: 100,
    },
    ];
  }

  // componentWillMount() {
  //   this.fake();
  // }

  handleSubmitClick() {
    const { form } = this.props;
    form?.validateFields((err, values) => {
      if (!err) {
        this.fake(values);
      }
    });
  }
  clearModalState() {
    this.setState({
      visible: false,
      data: [],
    });
  }

  handleModalCancle() {
    this.clearModalState();
  }

  handleModalOk() {
    if (this.selectedRows.length === 0) {
      message.error('请选择优惠券！');
    } else if (this.selectedRows.length > 1) {
      message.error('只能选择1张优惠券！');
    } else {
      this.props.onChange(this.selectedRows, this.state.selectedRows);
      this.clearModalState();
    }
  }

  async fake(value) {
    const { merchantId } = this.props;
    // 根据复合条件查询商家列表
    request('/mj/ht-mj-promotion-server/promotionCoupon/queryListByPageToRule', {
      method: 'POST',
      body: {
        promotionCouponVoPage: {
          receiveMethod: this.props.batchOperate ? 2 : 1,
          ...value,
          merchantId,
          pageInfo: {
            currPage: 1,
            pageSize: 9999999,
          },
        },
      },
      pagination: true,
    }).then((data) => {
      const { defaultSelectedRows = [] } = this.props;
      const list = [];
      defaultSelectedRows.forEach((row) => {
        list.push(row);
      });
      const ids = defaultSelectedRows.map(r => r.couponId);
      data.list.forEach((row) => {
        if (ids.indexOf(row.couponId) === -1) {
          list.push(row);
        }
      });
      // console.log('selectedRows', list, defaultSelectedRows);
      const couponIds = list.map(l => l.couponId);
      if (couponIds.indexOf(this.state.selectedRowKeys[0]) > -1) {
        this.selectedRows = list.filter(l => l.couponId === this.state.selectedRowKeys[0]);
        // console.log(this.state, this.selectedRows);
        this.setState({
          data: list, selectedRowKeys: this.state.selectedRowKeys, selectedRows: this.selectedRows,
        }, () => {
          this.selectedRows = this.selectedRows.map(row => ({
            label: row.couponName, value: row.couponId,
          }));
        });
      } else {
        this.setState({ data: list, selectedRowKeys: [], selectedRows: [] });
        this.selectedRows = [];
      }
    });
  }

  render() {
    const { form, btnLoading = false } = this.props;
    const { getFieldDecorator } = form;

    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows.map((v) => {
          return { label: v.couponName, value: v.couponId };
        });
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      selectedRowKeys: this.state.selectedRowKeys,
    };

    const btn = this.props.hideBtn ? '' : <Button type="primary" onClick={() => { this.fake(); this.setState({ visible: true }); }}>选择</Button>;

    return (
      [
        btn,
        <Modal
          visible={this.state.visible}
          destroyOnClose
          title="选择优惠券"
          okText="确定"
          width="800px"
          onCancel={this.handleModalCancle.bind(this)}
          onOk={this.handleModalOk.bind(this)}
        >

          <Form layout="inline" onSubmit={this.handleSubmitClick.bind(this)}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="优惠券名称"
            >
              {
            getFieldDecorator('couponName', {

            })(
              <Input />
            )
          }
            </FormItem>

            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="优惠券ID"
            >
              {
            getFieldDecorator('couponId', {

            })(
              <Input />
            )
          }
            </FormItem>

            <FormItem>
              <Button loading={btnLoading} type="primary" onClick={this.handleSubmitClick.bind(this)}>查询</Button>
            </FormItem>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={this.state.data}
              pagination={false}
              rowKey="couponId"
              scroll={{ y: 300 }}
            />
          </Form>
        </Modal>,
      ]
    );
  }
}
