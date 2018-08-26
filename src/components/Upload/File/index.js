import React, { Component } from 'react';
import { Upload, Icon, Button, message } from 'antd';
import _ from 'lodash';
import cookie from 'utils/cookie';
import './index.less';
// import { requestRoot } from 'configs/global';

// todo:解决request依赖问题

// 使用第三方

const PREFIX = 'c-uploader';
const { Dragger } = Upload;


/**
 * 文件上传组件封装
 * 接入request的上传方法~~
 *
 *
 */
class Uploader extends Component {
  static defaultProps = {
    maxLength: 3,
    maxSize: 500, // kb
    listType: 'text',
    showUploadList: true,
    uploadType: 'txt', // 'txt','excel'
  }

  constructor(props) {
    super(props);
    let value = props.defaultValue || props.value;
    if (value) {
      if (!(value instanceof Array)) {
        value = [value];
      }
      value = this.getFileListByValue(value);
    }
    this.state = {
      fileList: value || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value !== 'undefined') {
      const value = nextProps.value instanceof (Array) ? nextProps.value : (
        nextProps.value ? [nextProps.value] : []
      );
      this.setState({
        fileList: this.getFileListByValue(value),
      });
    }
  }

  getFileListByValue = (value) => {
    return _.map(value, (url) => {
      return {
        uid: url,
        name: url,
        status: 'done',
        url,
        thumbUrl: url,
      };
    });
  }

  getHttpProps() {
    const { url = '/api/upload/file' } = this.props;
    if (!this.httpProps) {
      this.httpProps = {
        action: url,
        data: {
          token: cookie.get('x-manager-token'),
          loginType: 1,
          type: 2,
        },
        headers: {
          'x-client-channel': 0,
          'x-client-hardware': 0,
          'x-client-id': cookie.get('x-client-id'),
          'x-client-os': 'web',
          'x-client-os-version': 0,
          'x-client-type': 'pc',
          'x-client-version-code': 0,
          'x-client-version-name': 0,
          'x-manager-token': cookie.get('x-manager-token'),
        },
      };
    }

    return this.httpProps;
  }

  manualUpload = () => {
    const { fileList } = this.state;
    const { url = '/api/upload/file' } = this.props;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file[]', file);
    });

    return fetch(url, {
      body: formData,
      method: 'POST',
      headers: this.getHttpProps().headers,
    });
  }

  handleBeforeUpload(e) {
    const { uploadType, manual, onChange, override = false } = this.props;
    if (uploadType === 'txt' && !(e.type === 'text/plain')) {
      message.error('只能上传 txt 文件哦！');
      return false;
    }
    // eslint-disable-next-line
    if (uploadType === 'excel' && (!(e.type.indexOf('excel') > 0) && !(e.name.indexOf('xlsx') > 0))) {
      message.error('只能上传 excel 文件哦！');
      return false;
    }
    if (e.size > this.props.maxSize * 1024) {
      message.error('文件大小已超出限制,请重新上传');
      return false;
    }
    if (this.state.fileList.length >= this.props.maxLength && !override) {
      message.error('文件数量已超出限制');
      return false;
    }
    // windowwindow.file = e;
    if (manual) {
      if (onChange) {
        onChange(e, this.state.fileList, this);
      }
      return false;
    }
  }


  handleChange = (info) => {
    if (!('fileList' in this.props) && info.file.status !== undefined) {
      this.setState({ fileList: info.fileList });
    }
    if (info.file.response && info.file.response.msgCode !== 200) {
      const { fileList } = this.state;
      if (!('fileList' in this.props) && info.file.status !== undefined) {
        this.setState({
          fileList: fileList.filter((file) => {
            if (file.uid !== info.file.uid) {
              return true;
            } else {
              return false;
            }
          }),
        });
      }
      message.error(info.file.response.message || '上传失败');
      return;
    }
    const { onChange } = this.props;
    if (onChange) {
      if (info.file.status === 'done' && info.file.response.msgCode === 200) {
        // eslint-disable-next-line
        onChange(info.file.response.data, { fileList: info.fileList, status: info.file.status }, this);
      }
    }
  }

  renderFileUpload(fileList) {
    const { value, maxLength, defaultValue, wraperStyle, ...props } = this.props;
    let files = [];
    if (maxLength === 1 && Array.isArray(fileList) && fileList.length > 1) {
      files[0] = fileList[fileList.length - 1];
    } else {
      files = fileList;
    }
    return (
      <Upload
        {...props}
        {...this.getHttpProps()}
        beforeUpload={this.handleBeforeUpload.bind(this)}
        onChange={this.handleChange.bind(this)}
        fileList={files}
      >
        <Button>
          <Icon type="plus" />
          <span className="ant-upload-text">点击上传</span>
        </Button>
      </Upload>
    );
  }

  renderDraggerUpload(fileList) {
    const { value, maxLength, defaultValue, wraperStyle, remark, ...props } = this.props;
    return (
      <Dragger
        {...props}
        {...this.getHttpProps()}
        beforeUpload={this.handleBeforeUpload.bind(this)}
        onChange={this.handleChange.bind(this)}
        fileList={fileList}
      >
        <div className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </div>
        <div className="ant-upload-text">
          点击或将文件拖拽到这里上传
        </div>
        <div className="ant-upload-hint">
          {remark}
        </div>
      </Dragger>
    );
  }

  render() {
    const { maxLength, wraperStyle, dragger } = this.props;
    const { fileList } = this.state;
    let btnHideClass = '';

    if (fileList.length >= maxLength) {
      btnHideClass = 'btn-hide';
    }

    return (
      <div className={`${PREFIX} clearfix ${btnHideClass}`} style={{ height: 140, ...wraperStyle }}>
        { dragger ? this.renderDraggerUpload(fileList) : this.renderFileUpload(fileList)}
      </div>
    );
  }
}

export default Uploader;
