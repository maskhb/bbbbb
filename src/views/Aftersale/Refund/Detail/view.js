import PageHeaderLayout from 'layouts/PageHeaderLayout';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import TabsCard from 'components/TabsCard';
import './view.less';
import BasicInfo from '../../components/details/BasicInfo';
import Reimburse from '../../components/details/ExecuteRefundInfo';
import GoodsInfo from '../../components/details/GoodsInfo';
import OriginOrderInfo from '../../components/details/OriginOrderInfo';
import PayInfo from '../../components/details/PayInfo';
// import Log from '../../components/details/Log';

@connect(({ refound, loading }) => ({
  refound,
  loading: loading.models.refound,
}))
export default class detailView extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
    type: 'detail',
  };
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const { match: { path }, match: { params: { refundSn } } } = this.props;
    const type = path.split('/')[path.split('/').length - 2];
    this.setState({ type });
    await this.props.dispatch({
      type: 'refound/refundOrderDetail',
      payload: { refundSn },
    });
  }


  render() {
    const { loading, refound } = this.props;
    const { refundDetail } = refound;
    const { type } = this.state;
    return (
      <PageHeaderLayout>
        <BasicInfo {...this.props} type={3} detailVO={refundDetail} />
        <br />
        <Card title="退款详情" loading={loading}>

          <div className="info">
            <TabsCard>
              <Reimburse tab="退款信息" {...this.props} type={type} detailVO={refundDetail} />
              <GoodsInfo tab="商品信息" {...this.props} detailVO={refundDetail} />

              <OriginOrderInfo tab="原单据信息" {...this.props} detailVO={refundDetail} />
              <PayInfo tab="原订单支付记录" {...this.props} detailVO={refundDetail} />
            </TabsCard>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
