import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, message, DatePicker, Select, Button } from 'antd';
// import _ from 'lodash';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList, { Search, Table, Batch } from '../../../components/PanelList';
import CheckboxCascade from '../../../components/CheckBoxCascade';
import ModalAudit from '../../../components/ModalAudit';
import getColumns, { payTypeArr } from './columns';
import { ONLINESTATUS } from '../../../components/Status/online';
// import { debug } from 'util';

@connect(({ payment, loading }) => ({
  payment,
  loading: loading.models.payment,
}))

export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {},
  };

  state = {
    modalAuditVisible: false,
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    console.log(values);
    const { dispatch } = this.props;
    return dispatch({
      type: 'payment/gethislist',
      payload: values,
    }).then(() => {
      const { payment } = this.props;
      console.log(payment);
    });
  }

  popConfirmOnline = (val) => {
    const { dispatch } = this.props;
    const text = ONLINESTATUS[val === 0 ? 1 : 0];

    dispatch({
      type: 'goods/audit',
      payload: val,
    }).then(() => {
      const { audit } = this.props.goods;
      if (audit.result === 0) {
        message.success(`${text}成功`);
        this.search.handleSearch();
      } else if (audit.result === 1) {
        message.error(`${text}失败, ${audit.msg || '请稍后再试。'}`);
      }
    });
  }

  popConfirmDelete = (rows) => {
    this.handleDelete(rows);
  }

  modalAuditShow = (records) => {
    if (!records) {
      return;
    }

    let rows = [];
    if (records.constructor.name !== 'Array') {
      rows = [records];
    } else {
      rows = records;
    }

    this.modalAuditRef.resetFields();
    this.modalAuditRef.rows = rows;
    this.setState({ modalAuditVisible: true });
  }
  modalAuditCancel = () => {
    this.setState({ modalAuditVisible: false });
  }
  modalAuditOk = () => {
    this.modalAuditRef.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'goods/audit',
        payload: {
          ...values,
          ids: this.modalAuditRef.rows.map(row => row.id).join(','),
        },
      }).then(() => {
        const { audit } = this.props.goods;
        if (audit.result === 0) {
          message.success('审核成功');
          this.search.handleSearch();
          // this.setState({
          //   selectedRows: [],
          // });
        } else if (audit.result === 1) {
          message.error(`审核失败, ${audit.msg || '请稍后再试。'}`);
        }
      });

      this.modalAuditCancel();
    });
  }

  render() {
    const { payment, loading, searchDefault } = this.props;
    const { modalAuditVisible } = this.state;
    const selectOptions = { // CheckboxCascade组件的入参集合
      url: [
        { value: 1, label: '支付单号', key: 1, childrenType: 1, childrenName: 'payOrderId', childrenProps: { placeholder: '请输入' } },
        { value: 2, label: '订单编号', key: 2, childrenType: 1, childrenName: 'businessNo', childrenProps: { placeholder: '请输入' } },
        { value: 3, label: '交易流水号', key: 3, childrenType: 1, childrenName: 'transactionId', childrenProps: { placeholder: '请输入' } },
      ],
    };

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              onSearch={this.handleSearch}
            >
              <Search.Item label="" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('url', {
                      initialValue: 1,
                    })(
                      <CheckboxCascade
                        name="url"
                        selectOptions={selectOptions.url}
                      />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="支付方式" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('payTypeKey', {
                      initialValue: '0',
                    })(
                      <Select >
                        <Select.Option key="0" value="0">全部</Select.Option>
                        {payTypeArr.map(v =>
                          <Select.Option key={v.key} value={v.value}>{v.value}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="支付状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('payState', {
                      initialValue: '',
                    })(
                      <Select>
                        <Select.Option key="" value="">全部</Select.Option>
                        <Select.Option key="0" value="0">未支付</Select.Option>
                        <Select.Option key="1" value="1">已支付</Select.Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="支付时间">
                {
                  ({ form }) => (
                    form.getFieldDecorator('createdTime', {
                    })(
                      <DatePicker.RangePicker format="YYYY-MM-DD HH:mm:ss" />
                    )
                  )
                }
              </Search.Item>
            </Search>
            <Batch><Button type="primary">导出</Button></Batch>
            <Table
              loading={loading}
              columns={getColumns(this)}
              searchDefault={searchDefault}
              disableRowSelection
              dataSource={payment?.list?.list}
              pagination={payment?.list?.pagination}
            />
          </PanelList>

          <ModalAudit
            ref={(inst) => { this.modalAuditRef = inst; }}
            visible={modalAuditVisible}
            onCancel={this.modalAuditCancel}
            onOk={this.modalAuditOk}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
