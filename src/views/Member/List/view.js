import PageHeaderLayout from 'layouts/PageHeaderLayout';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { formatBirthDay } from 'components/Const';
import Authorized from 'utils/Authorized';
import { fenToYuan } from 'utils/money';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { getOptionLabelForValue } from 'utils/utils';
import ModalExportBusiness from 'components/ModalExport/business';
import {
  Card,
  Button,
  Input,
  DatePicker,
  Select,
  Modal,
  Row,
  Col,
  Form,
} from 'antd';
import getColumns from './column';
import { transParams } from '../const';
import styles from './view.less';
import { orderStatusOptions } from '../../Order/attr';

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 18,
    },
    sm: {
      span: 18,
    },
    md: {
      span: 18,
    },
  },
};
@connect(({ member, loading }) => ({
  /* redux传入 @:装饰器 */
  member,
  loading: loading.models.member,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {},
  };

  state = {
    expandedRowDetails: [],
    expandedRowKeys: [],
    rangePickerStyle: {
      style: {
        width: 'auto',
      },
    },
  };

  componentDidMount() {
    this
      .search
      .handleSearch();
  }

  getExpandedRowDetails = async (expandedRowKeys) => {
    const { expandedRowDetails } = this.state;

    const newExpandedRowDetails = {
      ...expandedRowDetails,
    };

    for (const accountId of (expandedRowKeys || [])) {
      if (!expandedRowDetails[`rowId_${accountId}`]) {
        const rowDetails = await this.getAccountReq(accountId); //eslint-disable-line
        newExpandedRowDetails[`rowId_${accountId}`] = rowDetails;
      }
    }

    this.setState({ expandedRowDetails: newExpandedRowDetails });
  }

  getAccountReq = async (accountId) => {
    const { dispatch } = this.props;
    const pagination = {
      currPage: 1,
      pageSize: 10,
    };

    await dispatch({
      type: 'member/accountDetail',
      payload: {
        accountId: Number(accountId),
      },
    });

    await dispatch({
      type: 'member/latestAddress',
      payload: {
        userId: Number(accountId),
      },
    });

    await dispatch({
      type: 'member/cart',
      payload: {
        accountId: Number(accountId),
        cartType: 0,
        pagination,
      },
    });

    const { member } = this.props;
    return {
      accountDetail: member
        ?.accountDetail,
      latestAddress: member
        ?.latestAddress,
      cart: member
        ?.cart,
    };
  }

  handleExpandRowChange = async (expandedRowKeys) => {
    await this.getExpandedRowDetails(expandedRowKeys);
    this.setState({
      expandedRowKeys: expandedRowKeys || [],
    });
  }

  handleSearch = (values) => {
    const { dispatch } = this.props;
    return dispatch({ type: 'member/list', payload: transParams(values) });
  }

  handleSearchDateChange = (date, dateString) => {
    return { date, dateString };
  }

  validatorLimit6Months = (rule, value, callback) => {
    if (value && value.length > 1) {
      const startRegTime = moment(value[0]);
      const endRegTime = moment(value[1]);
      const months = endRegTime.diff(startRegTime, 'months', true);
      if (months > 6) {
        callback('每次可搜索6个月订单记录，请重新选择');
      }
    }
    callback();
  }

  handleSms = (rows) => {
    if (rows.length === 1) {
      window.open(`#/messagepush/pushlist/add/0?phone=${rows[0].mobile}`, '_blank');
    } else {
      Modal.warning({ title: '提示', content: '请先选择一个会员再操作！', okText: '确定', cancelText: '取消' });
    }
  }

  accountExpand = (row) => {
    const { expandedRowDetails } = this.state;
    const expandDetails = expandedRowDetails[`rowId_${row.accountId}`];
    const preDeposit = expandDetails
      ?.accountDetail
      ?.preDepositVo;
    const wallet = expandDetails
      ?.accountDetail
      ?.walletVo;
    const cartNum = expandDetails
      ?.cart
      ?.list
      ?.length;
    const {
      latestAddress = [],
    } = expandDetails;
    const latestOrder = latestAddress
      ?.orderId;
    const latestOrderTime = moment(latestAddress
      ?.createdTime).format(formatBirthDay);
    const latestOrderAccount = latestAddress
      ?.orderAmount;
    const latestOrderStatus = latestAddress
      ?.orderStatus;
    // const latesrAfterSale = ; const cartNum = ;
    const {
      address = [],
    } = latestAddress;
    const validityStart = moment(preDeposit
      ?.validityStart).format(formatBirthDay);
    const validityEnd = moment(preDeposit
      ?.validityEnd).format(formatBirthDay);

    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card className={styles.card} bordered={false}>
              <Form layout="vertical">
                <Form.Item {...formItemLayout} label="预存款余额：">
                  <span>{fenToYuan(preDeposit
                      ?.balance)}
                  </span>
                  <span style={{
                    float: 'right',
                  }}
                  >有效期：{validityStart}
                    ~ {validityEnd}
                  </span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="钱包余额：">
                  <span>{fenToYuan(wallet
                      ?.balance)}
                  </span>
                </Form.Item>
                {/* <Form.Item {...formItemLayout} label="可用优惠券：">
                  <span>{ data?.memberStatusName}</span>
                </Form.Item> */}
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card className={styles.card} bordered={false}>
              <Form layout="vertical">
                <Form.Item {...formItemLayout} label="最近一笔订单：">
                  <span>{latestOrderTime}下单，订金金额：{fenToYuan(latestOrderAccount)}， {getOptionLabelForValue(orderStatusOptions)(latestOrderStatus)}，<Link to={`/order/list/detail/1/${latestOrder}`}>订单号：（{latestOrder}）</Link>
                  </span>
                </Form.Item>
                {/* <Form.Item {...formItemLayout} label="最近一笔售后：">
                  <span>2018-01-01申请，申请退货退款，当前状态（退款中），售后单号（9988776）</span>
                </Form.Item> */}
                <Form.Item {...formItemLayout} label="购物车里的商品：">
                  <span>
                    <Link
                      target="_blank"
                      to={`/member/list/detail/${row.accountId}?cartAnchor=true`}
                    >总共{cartNum}件
                    </Link>
                  </span>
                </Form.Item>
                <Form.Item {...formItemLayout} label="最近用的收货地址：">
                  <span>{address}</span>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  convertExportParam = () => {
    const {
      stateOfSearch = {},
    } = this.search.props;
    const { pagination } = this.props
      ?.member
      ?.list;

    return {
      param: {
        condition: {
          ...stateOfSearch,
          pageInfo: {
            currPage: 1,
            pageSize: 500,
          },
        },
      },
      totalCount: pagination
        ?.total,
      dataUrl: '/user-center-server/member/export/prepare',
      prefix: 805001,
    };
  }

  render() {
    const { member, searchDefault, loading } = this.props;
    const { handleSearch, validatorLimit6Months, accountExpand, handleExpandRowChange } = this;
    const { rangePickerStyle, expandedRowKeys } = this.state;
    const { Option } = Select;

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => {
              this.search = inst;
            }}
              searchDefault={searchDefault}
              onSearch={handleSearch}
              className="searchArea"
            >
              <Search.Item md={6} label="手机号" simple className="col-6">
                {({ form }) => (form.getFieldDecorator('mobile', {})(<Input placeholder="" />))
}
              </Search.Item>
              <Search.Item md={6} label="登录名" simple>
                {({ form }) => (form.getFieldDecorator('loginName', {})(<Input placeholder="" />))
}
              </Search.Item>
              <Search.Item md={6} label="激活状态" simple>
                {({ form }) => (form.getFieldDecorator('memberStatus', {})(
                  <Select onChange={() => ''}>
                    <Option value="-1">全部</Option>
                    <Option value="0">已激活</Option>
                    <Option value="1">已冻结</Option>
                  </Select>
                ))
}
              </Search.Item>
              <Search.Item md={6} label="账号来源" simple>
                {({ form }) => (form.getFieldDecorator('channel', {})(
                  <Select onChange={() => ''}>
                    <Option value="0">全部</Option>
                    <Option value="1">IOS</Option>
                    <Option value="2">Android</Option>
                    <Option value="3">微信</Option>
                    <Option value="4">PC</Option>
                    <Option value="5">管理员创建</Option>
                    <Option value="6">线下导入</Option>
                  </Select>
                ))
}
              </Search.Item>
              <Search.Item md={6} label="注册时间" simple>
                {({ form }) => (form.getFieldDecorator('createdTime', {
                  initialValue: searchDefault.createdTime,
                  rules: [
                    {
                      validator: validatorLimit6Months,
                    },
                  ],
                })(<RangePicker
                  {...rangePickerStyle}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                />))
}
              </Search.Item>
            </Search>
            <Batch>
              <Authorized key="member_add" authority={['OPERPORT_JIAJU_USER_ADD']}>
                <Link target="_blank" to="/member/list/add/0">
                  <Button type="primary ">新增会员</Button>
                </Link>
              </Authorized>
              <Batch.Item>
                {() => {
                  return (
                    <Authorized key="member_batch_add" authority={['OPERPORT_JIAJU_USER_BATCHADD']}>
                      <Link to="/member/list/importMember/0">
                        <Button type="primary ">导入会员</Button>
                      </Link>
                    </Authorized>
                  );
                }
}
              </Batch.Item>
              <Batch.Item>
                {() => {
                  return (
                    <Authorized key="member_export" authority={['OPERPORT_JIAJU_USER_EXPORT']}>
                      <ModalExportBusiness
                        {...this.props}
                        btnTitle="导出会员"
                        title="会员"
                        content={(
                          <div>
                            <div>此操作将按照页面上搜索条件的结果导出数据。
                            </div>
                            <div>导出的表格Title是页面上的表格Title一致的。
                            </div>
                            <div>注意：会员数据是重要的公司信息，请注意保密。
                            </div>
                          </div>
                      )}
                        convertParam={this.convertExportParam}
                        exportModalType={3}
                      />
                    </Authorized>
                  );
                }
}
              </Batch.Item>
              <Batch.Item>
                {({ rows }) => {
                  return (
                    <Authorized
                      key="member_send_message"
                      authority={['OPERPORT_JIAJU_USER_SENDMESSAGE']}
                    >
                      <Button
                        type="primary"
                        onClick={this
                        .handleSms
                        .bind(this, rows)}
                      >发短信
                      </Button>
                    </Authorized>
                  );
                }
}
              </Batch.Item>
            </Batch>
            <Table
              loading={loading}
              expandIconColumnIndex={0}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault).list}
              dataSource={member
              ?.list
                ?.list}
              pagination={member
              ?.list
                ?.pagination}
              expandedRowKeys={expandedRowKeys}
              onExpandedRowsChange={handleExpandRowChange}
              expandedRowRender={row => accountExpand(row)}
              footer={member
              ?.list
                ?.pagination
                  ?.total}
              rowKey="accountId"
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
