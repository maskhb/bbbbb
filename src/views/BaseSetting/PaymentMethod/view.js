import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList from 'components/PanelList';
import { Card } from 'antd';

import SearchHeader from './components/SearchHeader';
import OperTable from './components/OperTable';

@connect(({ paymentMethod, loading }) => ({
  paymentMethod,
  pageLoading: loading.effects['paymentMethod/page'],
}))
class PaymentMethod extends PureComponent {
  static defaultProps = {
    searchDefault: { },
  };

  state = {}

  render() {
    const { searchDefault, pageLoading, dispatch, paymentMethod } = this.props;
    const resData = paymentMethod?.page || {};
    return (
      <PageHeaderLayout>
        <Card
          title="收款方式设置"
          extra={(
            <span>如需要新增收款方式，请联系恒腾</span>
          )}
        >
          <PanelList>
            <SearchHeader
              searchDefault={searchDefault}
              loading={pageLoading}
              dispatch={dispatch}
            />
            <OperTable
              searchDefault={searchDefault}
              loading={pageLoading}
              dispatch={dispatch}
              data={resData}
              paymentMethod={paymentMethod}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default PaymentMethod;
