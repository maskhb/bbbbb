/*
 * @Author: wuhao
 * @Date: 2018-04-20 10:31:43
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-11 16:39:56
 *
 * 物流信息
 */
import React, { PureComponent } from 'react';

import { Card, Row, Col, Timeline, Tabs, Spin, Table } from 'antd';
import moment from 'moment';

import { isPaidOrder, getOptionLabelForValue, orderStatusOptions } from '../../../attr';

const { Item: TimelineItem } = Timeline;
const { TabPane } = Tabs;

class LogisticsInfo extends PureComponent {
  static defaultProps = {};

  state = {
    logisticsLoading: false,
    logisticsVOList: [],
  }

  componentDidMount() {
    this.initlogisticsDetail();
  }

  initlogisticsDetail = async () => {
    const { dispatch, orders } = this.props;

    this.setState({
      logisticsLoading: true,
    });

    await dispatch({
      type: 'orders/logisticsDetail',
      payload: {
        orderId: orders?.detail?.orderId,
      },
    });

    const { logisticsDetail } = this.props?.orders;
    if (logisticsDetail && logisticsDetail.length > 0) {
      const [logisticsVO] = logisticsDetail;
      await this.initLogisticsVOItem(logisticsVO, logisticsDetail);
    }

    this.setState({
      logisticsLoading: false,
    });
  }

  initLogisticsVOItem = async (logisticsVO, logisticsList) => {
    const { dispatch, orders } = this.props;
    const { orderId } = orders?.detail || {};
    const { packageNumber } = logisticsVO || {};

    if (logisticsVO && !logisticsVO.isReq) {
      await dispatch({
        type: 'orders/queryOrderLogisticsDetail',
        payload: {
          orderId,
          packageNumber,
        },
      });

      const logisticsResList = this.props?.orders?.[`queryOrderLogisticsDetail-${orderId || 0}-${packageNumber || 0}`];
      const [logisticsRes] = logisticsResList || [];
      if (logisticsRes && logisticsList) {
        logisticsList.forEach((item) => {
          const newItem = item;
          if (newItem.packageNumber === logisticsRes.packageNumber) {
            newItem.logisticsItemList = logisticsRes.logisticsItemList;
            newItem.orderGoodsVOList = logisticsRes.orderGoodsVOList;
            newItem.isReq = true;
          }
        });

        this.setState({
          logisticsVOList: [
            ...logisticsList,
          ],
        });
      }
    }
  }

  handleTabsChange = async (key) => {
    const { logisticsVOList } = this.state;
    const logisticsVO = (logisticsVOList || [])?.filter(item => `${item.packageNumber}` === `${key}`)?.[0];

    if (logisticsVO && !logisticsVO.isReq) {
      this.setState({
        logisticsLoading: true,
      });

      await this.initLogisticsVOItem(logisticsVO, logisticsVOList);

      this.setState({
        logisticsLoading: false,
      });
    }
  }

  renderMorePackage = () => {
    const { logisticsVOList } = this.state;
    return (
      <Tabs size="small" onChange={this.handleTabsChange}>
        {
          logisticsVOList.map(item => (
            <TabPane tab={`包裹 ${item.packageNumber}`} key={item.packageNumber}>
              {
                this.renderGoods(item || {})
              }
              {
                this.renderLogistics(item)
              }
            </TabPane>
          ))
        }

      </Tabs>
    );
  }

  renderGoods = ({ orderGoodsVOList }) => {
    const columns = [
      {
        title: '商品图片',
        dataIndex: 'mainImgUrl',
        key: 'mainImgUrl',
        render(val, record) {
          return <img src={val} alt={record.goodsName} width={50} height={50} />;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '商品规格',
        dataIndex: 'propertyValue',
        key: 'propertyValue',
      },
      {
        title: '数量',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
      },
    ];
    return (
      <Table
        style={{ marginBottom: '25px' }}
        columns={columns}
        dataSource={orderGoodsVOList}
        pagination={false}
        rowKey="orderGoodsId"
      />
    );
  }

  renderLogistics = (logisticsItem) => {
    const { orders = {} } = this.props;
    const { detail = {} } = orders || {};
    const { orderActionVOList = [] } = detail || {};
    const { logisticsLoading, logisticsVOList } = this.state;
    const [logisticsVO] = logisticsVOList || [];
    const leftSpan = 2;

    const logisticsVOItem = logisticsItem || logisticsVO;

    const cancleTime = (orderActionVOList || []).find(item => item.action === 8)?.time || 0;

    return (
      <Spin spinning={logisticsLoading}>
        <div className="logistics_info_div">
          <Row>
            <Col span={leftSpan}>
              <span>物流名称：</span>
            </Col>
            <Col span={24 - leftSpan}>
              <span>{logisticsVOItem?.logisticsCompany || '暂无'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={leftSpan}>
              <span>物流单号：</span>
            </Col>
            <Col span={24 - leftSpan}>
              <span> {logisticsVOItem?.logisticsNumber || '暂无'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={leftSpan}>
              <span>物流信息：</span>
            </Col>
            <Col span={24 - leftSpan}>
              <Timeline className="logistics_info_timeline">
                {
                  cancleTime > 0 && (
                  <TimelineItem className="logistics_info_timeline">
                    <span>用户已取消订单</span><span>{moment(cancleTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </TimelineItem>
                )}

                {
                  logisticsVOItem?.logisticsItemList?.map((item) => {
                    return (
                      <TimelineItem key={item?.time}>
                        <span>{item?.context}</span>
                        <span>{moment(item?.time).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </TimelineItem>
                    );
                  })
                }

                {
                  detail?.paidTime > 0 && isPaidOrder(detail?.payStatus) && (
                  <TimelineItem>
                    <span>用户成功支付了订单</span><span>{moment(detail?.paidTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </TimelineItem>
                )}

                <TimelineItem>
                  <span>用户成功提交了订单</span><span>{moment(detail?.createdTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                </TimelineItem>
              </Timeline>
            </Col>
          </Row>
        </div>
      </Spin>
    );
  }

  render() {
    const {
      className,
      orders = {},
    } = this.props;
    const { detail } = orders || {};
    const { logisticsVOList } = this.state;
    const [, logisticsVOItem] = logisticsVOList || [];

    const orderStatusName = getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus);

    return (
      <Card title="物流信息" className={`${className}`}>
        {
          logisticsVOItem || (logisticsVOList?.length > 0 && orderStatusName === '待发货') ? this.renderMorePackage() : this.renderLogistics()
        }
      </Card>
    );
  }
}

export default LogisticsInfo;
