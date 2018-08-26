import Authorized from 'utils/Authorized';
import React, { PureComponent } from 'react';
import ModalExportBusiness from 'components/ModalExport/business';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { goTo } from 'utils/utils';
import UploadFile from 'components/Upload/File';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Card, Button, Select, Row, Col, DatePicker, Modal, message } from 'antd';
import request from 'services/orders';

import styles from './view.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
@connect(({ statement, user, loading }) => ({
  statement,
  user,
  loading: loading.models.statement,
}))

export default class View extends PureComponent {
  static defaultProps = {

  };


  state = {
    selectedTime: [0, 0],
    fileList: [],
  };

  componentDidMount() {
    this.init();
  }
  init = () => {
  }

  handleSearchDateChange = (value) => {
    const [a, b] = value;
    // console.log({ a: new Date(a).getTime(), b: new Date(b).getTime() }) //eslint-disable-line
    const selectedTime = [new Date(a).getTime(), new Date(b).getTime()];
    const [day1, day2] = selectedTime;
    if ((day2 - day1) / (1000 * 60 * 60 * 24) > 31) {
      this.setState({ selectedTime: [] });
      return message.error('导出时间日期不能超过31天,请重新选择');
    }
    return this.setState({ selectedTime });
  }
  handleTimeStr = (timestamp, type) => { // type 1:到00:00:00   2：到23:59:59
    let result = '';
    if (type === 1) {
      result = new Date(timestamp);
    } else if (type === 2) {
      result = new Date(timestamp);
    }
    return result;
  }

  convertExportParam = () => {
    const stateOfSearch = {
      startTime: this.state.selectedTime[0],
      endTime: this.state.selectedTime[1],
    };

    return request.transactionExportCount({
      ...stateOfSearch,
    }).then((total) => {
      return {
        param: {
          param: {
            ...stateOfSearch,
            exportUserId: this.props.user.current.accountId,
            pageInfo: { currPage: 1, pageSize: 500 },
          },
        },
        /* eslint-disable-next-line */
      totalCount: total,
        dataUrl: '/ht-mj-order-server/order/transaction/compare/export',
        prefix: 801004,
      };
    });
  }

  handleChange = (payType) => {
    this.setState({ payType });
  }

  handleUpload = (file, fileListStatues) => {
    const { fileList } = fileListStatues;
    let files = [];
    if (fileList && fileList.length > 0) {
      files = [fileList[fileList.length - 1]];
    }
    // console.log(JSON.stringify(fileList)) //eslint-disable-line
    // console.log(file, s);
    this.setState({ fileList: files });
  }
  removeFile = () => {
    // const { fileList } = this.state;
    // const NewFileList = JSON.parse(JSON.stringify(fileList));
    // NewFileList.forEach((v, i) => {
    //   if (v.uid = file.uid) { //eslint-disable-line
    //     NewFileList.splice(i, 1);
    //   }
    // });
    this.setState({ fileList: [] });
    // console.log(JSON.stringify(file)) //eslint-disable-line
  }
  handleImport = () => {
    const { fileList, payType } = this.state;
    const [file] = fileList || [];
    const { response: { data: [info] = [] } = {} } = file || {};
    const { user: { current: { accountId, loginName } } } = this.props;
    const importParams = {
      fileName: file.name,
      fileUrl: info.url,
      importType: payType,
      uploaderId: accountId,
      uploaderName: loginName,
    };
    return this.props.dispatch({
      type: 'statement/importInfo',
      payload: { importParams },
    }).then((res) => {
      if (res) {
        Modal.success({
          title: '正在导出订单，请稍等',
          content: (
            <p>导入成功，系统正在处理数据，稍候可以下载</p>
          ),
          okText: '立即查看',
          cancelText: '取消',
          onOk() {
            goTo('/batchimport/import');
          },
        });
      }
    });
  }

  render() {
    const { payType, fileList } = this.state;
    const { loading } = this.props;
    return (
      <PageHeaderLayout >

        <Card>
          <div className={styles.imporBox}>
            <Row gutter={16} >
              <Col span={6} >
                请选择导入支付信息类型
              </Col>
              <Col span={6} >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={this.handleChange}
                >
                  <Option value="1">拉卡拉</Option>
                  <Option value="2">微信支付</Option>
                  <Option value="3">支付宝</Option>
                </Select>
              </Col>
              <Col span={12} />
            </Row>
            <br />
            <Row gutter={16}>
              <Col span={6} >
                {payType ? '上传第三方支付信息文件' : '请先选择导入支付信息类型'}
              </Col>
              <Col span={6} >
                {payType ? (
                  <UploadFile
                    uploadType="excel"
                    maxSize={1024 * 5}
                    maxLength={1}
                    override
                    onChange={this.handleUpload}
                    onRemove={this.removeFile}
                  />
                ) : ''}
              </Col>
              <Col span={12} />
            </Row>

            <Row gutter={16}>

              <Col span={8} offset={6}>
                <Button
                  type="primary"
                  disabled={!(fileList && fileList.length > 0)}
                  onClick={this.handleImport}
                  loading={loading}
                >
                  确认导入
                </Button>
              </Col>
              <Col span={6} >
                <Link to="/batchimport/import">
                  <Button type="primary">查看导入文件</Button>
                </Link>
              </Col>
            </Row>

            <br />

            <Row gutter={16}>
              <Col span={6} offset={6}>
                导入说明：Excel文件不能超过5M
              </Col>
            </Row>
          </div>

          <br />
          <br />
          <br />

          <Row gutter={16}>
            <Col span={6} >
              下单时间：
            </Col>
            <Col span={8} >

              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.handleSearchDateChange.bind(this)}
              />
            </Col>
            <Col span={6} >

              <Authorized authority={
                ['OPERPORT_JIAJU_ACCOUNTS_EXPORT']
              }
              >
                <ModalExportBusiness
                /* eslint-disable-next-line */
                disabled={!(this.state.selectedTime && this.state.selectedTime.length === 2 && this.state.selectedTime[0] && this.state.selectedTime[1])}
                  {...this.props}
                  title="订单"
                  params={{}}
                  convertParam={this.convertExportParam}
                  exportModalType={2}
                  simple
                />
              </Authorized>


            </Col>
            <Col span={6} />
          </Row>

          <br />
          <Row gutter={16}>

            <Col span={6} offset={12}>
              温馨提示：先导入第三方支付信息后，再导出订单对账
            </Col>
            <Col span={6} />
          </Row>

          <br />
          <hr />
        </Card>

      </PageHeaderLayout >

    );
  }
}
