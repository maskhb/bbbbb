import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import cookie from 'cookies-js';
import './ImageUpload.less';

export default class ImageUpload extends Component {
  static defaultProps = {
    maxLength: 1, // 图片数量
    maxSize: 1024, // kb
  };

  state = {
    fileList: [],
    previewVisible: false,
    previewImage: '',
  }

  componentWillMount() {
    const { fileList } = this.props;
    this.setState({
      fileList,
    });
  }

  getHttpProps = () => {
    if (!this.httpProps) {
      this.httpProps = {
        action: '/mj/upload/img',
        data: {
          token: cookie.get('x-manager-token'),
          loginType: 1,
          type: 2,
          watermark: ((this.props.watermark)
            ? 1
            : 0),
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
        },
      };
    }

    return this.httpProps;
  }

  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewVisible: true,
      previewImage: file.url || file.thumbUrl,
    });
  }

  handleChange = (e) => {
    const { file, fileList } = e;

    if (file.status !== 'uploading' && file.status !== 'done' && file.status !== 'removed') {
      return false;
    }

    if (fileList) {
      const { value, onChange } = this.props;

      const newValue = fileList.map((f) => {
        const item = f;
        if (f.status === 'done') {
          item.url = item.url || f.response?.data?.[0]?.url;
        }
        return item;
      });

      if (onChange) {
        onChange(newValue);
      }

      if (typeof value === 'undefined') {
        this.setState({
          fileList: newValue,
        });
      }
    }
  }

  beforeUpload = (file) => {
    const isImage = file.type.includes('image');
    if (!isImage) {
      message.error('只能上传图片！');
      return false;
    }

    const { exclude, maxSize, maxLength, beforeUpload } = this.props;

    if (exclude.includes('gif') && file.type === 'image/gif') {
      message.error('不能上传gif！');
      return false;
    }

    if (file.size > maxSize * 1024) {
      message.error(`图片大小超出限制（${maxSize}kb）`);
      return false;
    }

    const { fileList } = this.state;
    if (fileList.length >= maxLength) {
      message.error(`上传数量超出限制（${maxLength}）`);
      return false;
    }

    if (beforeUpload) {
      return beforeUpload(file);
    }
  }

  render() {
    const { maxLength, ...props } = this.props;
    const { fileList, previewVisible, previewImage } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div>
        <Upload
          {...props}
          {...this.getHttpProps()}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          fileList={fileList}
        >
          {
            fileList.length >= maxLength
              ? null
              : uploadButton
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
