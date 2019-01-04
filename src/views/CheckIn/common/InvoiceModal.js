import React from 'react';
import PropTypes from 'prop-types';
import { Table, Form, Divider, Popconfirm, message } from 'antd';
import ModalCover from './ModalCover';
import NewInvoiceModal from './NewInvoiceModal';
import moment from 'moment';
import { fenToYuan } from 'utils/money';
@Form.create()
export default class InvoiceModal extends React.Component {
  static propTypes = {
    gresId: PropTypes.number, // 单号
    dispatch: PropTypes.func.isRequired, // dispatch
    // gresInvoiceList: PropTypes.array, // 发票列表
  };

  static defaultProps = {
  };

  state = {
    invoiceList: [],
  };

  // 获取发票列表
  fetchInvoiceList() {
    const { dispatch, gresId } = this.props;
    dispatch({
      type: 'checkIn/gresInvoiceList',
      payload: {
        gresId,
      },
    })
      .then((res) => {
      // debugger
        this.setState({ invoiceList: res });
      });
  }

  // 作废发票
  handleDisableInvoice({ invoiceId }) {
    const { dispatch, gresId } = this.props;
    dispatch({
      type: 'checkIn/gresDisableInvoice',
      payload: {
        invoiceId,
        gresId,
      },
    }).then((res) => {
      if (res) {
        this.fetchInvoiceList();
        message.success('作废成功');
      }
    });
  }

  getColumns() {
    const { dispatch, gresId } = this.props;
    return [{
      title: '编号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '发票单位',
      dataIndex: 'invoiceCompany',
      key: 'invoiceCompany',
    }, {
      title: '发票金额',
      dataIndex: 'rate',
      key: 'rate',
      render: (val, record) => `￥${fenToYuan(record.rate)}`,
    }, {
      title: '开票时间',
      dataIndex: 'businessDay',
      key: 'businessDay',
      render: (val, record) => moment(record.businessDay).format('YYYY-MM-DD'),
    }, {
      title: '开票人',
      dataIndex: 'invoiceName',
      key: 'invoiceName',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <NewInvoiceModal
              {...this.props}
              dispatch={dispatch.bind(this)}
              {...record}
              edit
              onOk={this.fetchInvoiceList.bind(this)}
            />
            <Divider type="vertical" />
            <Popconfirm title="是否确定作废当前发票？" onConfirm={this.handleDisableInvoice.bind(this, record)} okText="确定" cancelText="取消">
              <a href="javascript:;">作废</a>
            </Popconfirm>
          </span>
        );
      },
    }];
  }

  renderTable() {
    const { dispatch } = this.props;
    return (
      <div>
        <NewInvoiceModal
          title="开发票"
          onOk={this.fetchInvoiceList.bind(this)}
          {...this.props}
          dispatch={dispatch.bind(this)}
        />
        <Table columns={this.getColumns()} dataSource={this.state.invoiceList} pagination={false} />
      </div>
    );
  }

  render() {
    return (
      <ModalCover
        title="开发票"
        content={this.renderTable()}
        width={1000}
        footer={null}
      >
        {modalShow => (
          <a
            href="javascript:;"
            onClick={(e) => {
              modalShow();
              this.fetchInvoiceList();
            }}
          > 开发票
          </a>
        ) }
      </ModalCover>
    );
  }
}
