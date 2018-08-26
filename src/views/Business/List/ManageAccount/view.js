import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { Table } from 'components/PanelList';
import { Link } from 'dva/router';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import getColumns from './columns';
// import res from '../../mockData';/* 本地数据 */

@connect(({ businessAccount, business, loading }) => ({
  /* redux传入 @:装饰器 */
  businessAccount,
  business,
  loading: loading.models.businessAccount,
}))
export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
  };
  componentWillMount() {
    const {
      business: { detail: info },
      match: { params: { info: id } },
    } = this.props;
    this.query(info?.merchantId || id);
    this.props.dispatch({
      type: 'business/queryDetail',
      payload: {
        merchantId: id,
      },
    });
  }
  query = (merchantId) => {
    this.props.dispatch({
      type: 'businessAccount/queryListByPage',
      payload: {
        merchantAccountCondition: {
          merchantId,
        },
      },
    }).then(() => {
      const res = this.props.businessAccount.list;
      if (res) {
        console.log(res) //eslint-disable-line
        const { pageSize, dataList } = res;
        this.setState({
          pagination: {
            total: dataList.length,
            pageSize,
          },
        });
      }
    });
  }
  render() {
    // eslint-disable-next-line
    const merchantName = this.props?.business?.currentDetailRes?.merchantName;
    // eslint-disable-next-line
    const merchantType = this.props?.business?.currentDetailRes?.merchantType;
    console.log({merchantType}) //eslint-disable-line
    const { loading,
      searchDefault,
      businessAccount,
      business: {
        detail: info,
      } } = this.props;
    return (
      <PageHeaderLayout>
        <h1>{`${['厂商', '经销商', '小商家'][merchantType - 1]}名称：${info?.merchantName || merchantName}`}</h1>
        <Card title={`${['厂商', '经销商', '小商家'][merchantType - 1]}账号管理`}>
          <Authorized authority={['OPERPORT_JIAJU_SHOP_ADDACCOUNT']}>
            <Link to={`/business/list/manageAccount/AddAccount/${info?.merchantId}`}>
              <Button type="primary" style={{ marginBottom: 20 }}>
                新增账号
              </Button>
            </Link>
          </Authorized>
          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={getColumns(this, searchDefault)}
            dataSource={businessAccount?.list?.dataList}
            pagination={this.state.pagination}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
