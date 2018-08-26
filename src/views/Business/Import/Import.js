import React, { Component } from 'react';
import UploadFile from 'components/Upload/File';
// import { Link } from 'dva/router';
import Download from 'components/Download';
import { connect } from 'dva';
import { goTo } from 'utils/utils';

import { Form, Card, message, Button, Row, Col } from 'antd';
// import { Link } from 'dva/router';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import './Import.less';

@connect(({ business, loading }) => ({
  business, loading,
}))
@Form.create()

export default class Import extends Component {
  componentWillMount() {
    const path = `${this.props.location.pathname}`;
    const type = path.split('/')[path.split('/').length - 2];
    if (type === 'importAccount') {
      this.setState({ importAccount: true });
      console.log(this.props.business.urlRes) //eslint-disable-line
    } else {
      this.setState({ importAccount: false });
    }
  }
  handleUpload=(fileList) => {
console.log(fileList) //eslint-disable-line
    this.setState({ fileList });
  }
  handleSubmit=() => {
    const { fileList, importAccount } = this.state;
    const [currentFile] = fileList;
    if (importAccount) {
      // 批量导入账号接口
      this.props.dispatch({
        type: 'business/importAccount',
        payload: {
          BatchImportVo: {
            fileName: currentFile.originalFileName,
            fileUrl: currentFile.url,
          },
        },
      }).then((res) => {
        if (res) {
          message.success('上传成功');
        }
      });
      /* ; */
    } else {
      // 批量导入商家接口
      this.props.dispatch({
        type: 'business/importMerchant',
        payload: {
          BatchImportVo: {
            fileName: currentFile.originalFileName,
            fileUrl: currentFile.url,
          },
        },
      }).then((res) => {
        if (res) {
          message.success('上传成功');
        }
      });
    }
  }


  render() {
    const { importAccount } = this.state;
    const title = `商家${importAccount ? '账号' : ''}批量导入须知`;
    return (
      <PageHeaderLayout>
        <Card title={title} bordered={false}>
          <p>{`请将需批量导入的商家${importAccount ? '账号' : ''}按下方模板所示格式上传`}</p>
          <p>
            <Download
              baseUrl={
                importAccount ? (
                  '/ht-mj-merchant-server/merchantAccount/downloadMerchantAccountTemplate'
                ) : (
                  '/ht-mj-merchant-server/merchantBase/downloadMerchantTemplate'
                )}
              title={`下载商家${importAccount ? '账号' : ''}批量导入模板`}
            />
          </p>
          <br />
          <Row gutter={16}>
            <Col span={3} >{`上传须批量导入的商家${importAccount ? '账号' : ''}：`}</Col>
            <Col span={3} >

              <UploadFile
                uploadType="excel"
                maxSize={1024 * 5}
                maxLength={1}
                onChange={this.handleUpload}
              />
              <br />
              <span>请选择要上传的文件(.xlsx)</span>
            </Col>
          </Row>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Row gutter={16}/*  type="flex" justify="start" */>
            <Col span={3} >
              <Button type="primary" onClick={this.handleSubmit}>批量导入</Button>
            </Col>
            <Col span={3} >

              <Button
                style={{ backgroundColor: '#FF6600', color: '#fff' }}
                onClick={() => { goTo('/batchimport/import'); }}
              >批量导入管理
              </Button>
              <br />
              <br />
              在此处查看批量导入状态
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
