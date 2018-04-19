import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Upload, Button, Icon, Row, Col } from 'antd';
// import { Link } from 'dva/router';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import './Import.less';

@connect(({ goods, goodsCategory, goodsBrand, marketingCategory, business, loading }) => ({
  goods,
  goodsCategory,
  goodsBrand,
  marketingCategory,
  business,
  submitting: loading.effects['goods/add'],
  fetchingBusinessList: loading.effects['business/list'],
}))
@Form.create()

export default class Import extends Component {
  componentWillMount() {
    const path = `${this.props.location.pathname}`;
    const type = path.split('/')[path.split('/').length - 2];
    if (type === 'importAccount') {
      this.setState({ importAccount: true });
    } else {
      this.setState({ importAccount: false });
    }
  }

  render() {
    const { importAccount } = this.state;
    const title = `商家${importAccount ? '帐号' : ''}批量导入须知`;
    return (
      <PageHeaderLayout>
        <Card title={title} bordered={false}>
          <p>{`请将需批量导入的商家${importAccount ? '帐号' : ''}按下方模板所示格式上传`}</p>
          <p>
            <a href="#">
              {`下载商家${importAccount ? '帐号' : ''}批量导入模板`}
            </a>
          </p>
          <br />
          <Row gutter={16}>
            <Col span={3} >{`上传须批量导入的商家${importAccount ? '帐号' : ''}：`}</Col>
            <Col span={3} >
              <Upload >
                <Button type="ghost">
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
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
              <Button type="primary">批量导入</Button>
            </Col>
            <Col span={3} >
              <Button style={{ backgroundColor: '#FF6600', color: '#fff' }}>批量导入管理</Button>
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
