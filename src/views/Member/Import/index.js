import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Row, Col, message } from 'antd';
import { Link } from 'dva/router';
import Download from 'components/Download';
import UploadFile from 'components/Upload/File';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import './view.less';

@connect(({ member, loading }) => ({
  member, loading,
}))

@Form.create()
export default class Import extends Component {
  state = {
    file: null,
  }

  componentWillMount() {
    const path = `${this.props.location.pathname}`;
    const type = path.split('/')[path.split('/').length - 2];
    if (type === 'importMember') {
      this.setState({ importMember: true });
      console.log(this.props.member.downloadTem) //eslint-disable-line
    } else {
      this.setState({ importMember: false });
    }
  }

  onChange = (files, fileList, ref) => {
    this.setState({
      file: files[0],
    });
    ref.setState({
      fileList: files.map(file => ({
        uid: (new Date()).getTime(), name: file.originalFileName, ...file,
      })),
    });
  }

  uploadProps = () => {
    const { uploadProps = {} } = this.props;
    return {
      onChange: this.onChange,
      ...uploadProps,
    };
  }


  handleOk = () => {
    const { dispatch } = this.props;
    const { file } = this.state;
    // const { originalFileName, url } = file;

    if (!this.state.file) {
      message.error('请先上传导入文件');
    } else {
      const { originalFileName, url } = file;
      dispatch({
        type: 'member/importTem',
        payload: {
          fileName: originalFileName,
          fileUrl: url,
        },
      }).then(() => {
        const { importTem } = this.props?.member;
        if (importTem === null) {
          message.error('导入失败');
        } else {
          message.success('导入成功');
        }
      });
    }
  }

  render() {
    const { remark } = this.props;
    const { importMember } = this.state;
    const { handleOk, onChange } = this;
    const title = `会员${importMember ? '账号' : ''}批量导入须知`;
    return (
      <PageHeaderLayout>
        <Card title={title} bordered={false}>
          <p>{`请将需批量导入的会员${importMember ? '账号' : ''}按下方模板所示格式上传`}</p>
          <div>
            <Download
              baseUrl="/user-center-server/member/download/template"
              query={{ businessType: 2 }}
              title={`下载会员${importMember ? '账号' : ''}批量导入模板`}
            />
          </div>
          <br />
          <Row gutter={16}>
            <Col span={3} >{`上传须批量导入的会员${importMember ? '账号' : ''}：`}</Col>
            <Col span={3} >
              <UploadFile
                ref={(ref) => { this.upload = ref; }}
                uploadType="excel"
                {...this.uploadProps()}
                remark={remark}
                onChange={onChange}
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
              <Button type="primary" onClick={handleOk}>批量导入</Button>
            </Col>
            <Col span={3} >
              <Link to="/batchimport/import">
                <Button style={{ backgroundColor: '#FF6600', color: '#fff' }}>批量导入管理</Button>
              </Link>
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
