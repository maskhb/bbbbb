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
    if (!info) {
      this.props.dispatch({
        type: 'business/queryDetail',
        payload: {
          merchantId: id,
        },
      }).then(() => {
      });
    }
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
        const { currPage: current, pageSize, totalPage } = res;
        this.setState({
          pagination: {
            current,
            total: res.dataList.length,
            pageSize,
            totalPage,
          },
        });
      }
    });
  }
  render() {
    // eslint-disable-next-line
    const merchantName = this.props?.business?.currentDetailRes?.merchantName;
    const { loading,
      searchDefault,
      businessAccount,
      business: {
        detail: info,
      } } = this.props;
    return (
      <PageHeaderLayout>
        <h1>{`经销商名称：${info?.merchantName || merchantName}`}</h1>
        <Card title="经销商账号管理">
          <Authorized authority={['OPERPORT_JIAJU_SHOP_ADDACCOUNT']}>
            <Link to={`/business/list/manageAccount/AddAccount/${info?.merchantId}`}>
              <Button type="primary" style={{ marginBottom: 20 }}>
                新增帐号
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
