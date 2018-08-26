import DetailFooterToolbar from 'components/DetailFooterToolbar';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, Message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import styles from './Detail.less';
import { renderBasic, renderQualification, renderReceipt, renderContact, renderOperationLog } from './renderDom';
import { formatData, unFormatData } from './utils';

// const Alldata = this.props?.business?.details;
@connect(({ business, loading }) => ({
  business,
  loading,
}))

@Form.create()
export default class Detail extends Component {
  state = {
    pattern: 'add',
    projectNames: null,
    loading: false,
  };

  componentWillMount() {
    this.setState({ fmtData: {} });
  }
  componentDidMount() {
    this.query();
  }
  componentWillUnmount() {
    this.setState({ fmtData: {} });
  }
  onChange=(value) => {
    console.log(value) //eslint-disable-line
    return '';
  }
  query = () => {
    let {dispatch, match: { path, params: { merchantId } } } = this.props; //eslint-disable-line
    const pattern = path.split('/')[path.split('/').length - 2].toLowerCase();
    this.setState({ pattern, merchantId });
    if (pattern === 'edit' || pattern === 'currdetail') {
      if (pattern === 'edit' && merchantId.length && merchantId.indexOf('&') > 0) {
        const c = merchantId;
        const arr = c.split('&');
        merchantId = arr[0];//eslint-disable-line
        document.querySelector(`#${arr[1]}`).scrollIntoView(true);
      }

      console.log("merchantId===========",merchantId) //eslint-disable-line
      dispatch({
        type: 'business/queryDetailAll',
        payload: { merchantId },
      }).then(() => {
        const { merchantBaseVo: { regionId } } = this.props.business.details;
        if (regionId) {
          dispatch({
            type: 'business/getRegionPath',
            payload: { regionId },
          }).then((res) => {
            let regionName = '';
            const regArr = [];
            res.forEach((v) => {
              regArr.push(v.regionId);
              regionName += v.regionName;
            });
            const fmtData = unFormatData(this.props.business.details, regArr);
            this.setState({
              fmtData,
              regionName,
              merchantType: fmtData.merchantBaseVo.merchantType,
              useTicket: fmtData.merchantBaseVo.predepositCouponSwitch,
              checkAll: fmtData.merchantBaseVo.allCommunity === 1,
            });
          });
        } else {
          const fmtData = unFormatData(this.props.business.details, null);

          this.setState({
            fmtData,
            merchantType: fmtData.merchantBaseVo.merchantType,
            useTicket: fmtData.merchantBaseVo.predepositCouponSwitch,
            checkAll: fmtData.merchantBaseVo.allCommunity === 1,
          });
        }
      });
    } else {
      this.setState({ fmtData: {} });
    }
  }


  handleCategoryChange = (value) => {
    const { dispatch } = this.props;

    if (value.length) {
      dispatch({
        type: 'goodsBrand/list',
        payload: {},
      });
    }
  }


  /* 提交 */
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pattern } = this.state;
    // 校验并滚动到错误位置
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);//eslint-disable-line
      } else {
        this.setState({ loading: true });
        const params = formatData(values, this.state);
        const type = (pattern === 'add' ? 'business/saveNewMerchant' : 'business/updateMerchant');
        dispatch({
          type,
          payload: { merchantIntegrationVo: params },
        }).then(() => {
          const { business } = this.props;
          this.setState({ loading: false });
          if (business.saveRes) {
            Message.success('提交成功。', 1, () => {
              history.back();
            });
          }
        });
      }
    });
  }


  handleSel=(arr) => {
    console.log(arr.join(''));// eslint-disable-line
  }

  callback=(key) => {
    return key;
  }

  /* 两个v层切换内容的方法  */
  handleMerchantTypeChange=(e) => {
    this.setState({ MerchantType: e.target.value });//eslint-disable-line
  }

  handleUseTicketChange=(e) => {
    this.setState({ useTicket: e.target.value });//eslint-disable-line
  }


  render() {
    const { form, match: { params: { merchantId = '0' } } } = this.props;
    const { pattern } = this.state;
    const { TabPane } = Tabs;
    switch (pattern) {
      case 'add':
      case 'edit': /* 这两个一样 */
        return (
          <PageHeaderLayout>
            <Form
              onSubmit={this.handleSubmit}
              layout="horizontal"
            >
              {renderBasic(this)}
              {renderQualification(this)}
              {renderReceipt(this)}
              {renderContact(this)}
            </Form>

            <DetailFooterToolbar
              form={form}
              submitting={this.state.loading}
              handleSubmit={this.handleSubmit}
            />
          </PageHeaderLayout>
        );

      case 'currdetail':
        return (
          <PageHeaderLayout>
            <Tabs
              defaultActiveKey="1"
              onChange={this.callback.bind(this)}
            >
              <TabPane tab="基本信息" key="1">
                {renderBasic(this)}
              </TabPane>
              <TabPane tab="资质信息" key="2">
                {renderQualification(this)}
              </TabPane>
              <TabPane tab="银行信息" key="3">
                {renderReceipt(this)}
              </TabPane>
              <TabPane tab="联系人信息" key="4">
                {renderContact(this)}
              </TabPane>
              <TabPane tab="合同信息" key="5">
                <Card
                  title="合同信息"
                  className={styles.card}
                  bordered={false}
                >
                  <a
                    rel="noopener noreferrer"
                    href={`/2.0/balance/balance-set/little-setting?id=${merchantId}`}
                    target="_blank"
                  >
                    查看该商家的合同
                  </a>
                </Card>
              </TabPane>
              <TabPane tab="操作日志" key="6">
                {renderOperationLog(this)}
              </TabPane>
            </Tabs>
          </PageHeaderLayout>
        );
      default:
        return <p>???</p>;
    }
  }
}
