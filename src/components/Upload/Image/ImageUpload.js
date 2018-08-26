import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import cookie from 'cookies-js';
import _ from 'lodash';
import UploadList from './UploadList';
import './ImageUpload.less';
import { div } from '../../../utils/number';

export default class ImageUpload extends Component {
  static defaultProps = {
    maxLength: 1, // 图片数量
    maxSize: 1024, // kb
    multiple: false, // 多文件上传
  };

  constructor(props) {
    super(props);
    let value = props.value || [];
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
  state = {
    fileList: [],
    previewVisible: false,
    previewImage: '',
  }

  // componentWillMount() {   const { fileList } = this.props;   this.setState({
  //   fileList,   }); }

  componentWillReceiveProps(nextProps) {
    const { fileList } = this.state;

    if (typeof nextProps.value !== 'undefined') {
      const value = nextProps.value instanceof Array
        ? nextProps.value
        : nextProps.value
          ? [nextProps.value]
          : [];
      this.setState({
        fileList: this.getFileListByValue(value),
      });
    } else if (fileList && fileList.length > 0 && fileList.every((v) => {
      return v.status === 'done' || v.status === 'uploading';
    })) {
      this.setState({ fileList: [] });
    }
  }

  getFileListByValue = (value) => {
    // console.log('filessssss', this.state);
    const { fileList } = this.state;
    const uids = fileList.map(l => l.uid);
    const urls = fileList.map(l => l.$url);
    _.forEach(value, (url, index) => {
      if (uids.indexOf(index + url) > -1) {
        return;
      }
      if (urls.indexOf(url) > -1) {
        for (const val of fileList) {
          if (val.$url === url) {
            val.url = url;
            val.thumbUrl = url;
          }
        }
        return;
      }
      fileList.push({
        uid: index + url,
        name: url,
        status: 'done',
        url,
        thumbUrl: url,
      });
    });
    return fileList;
  }

  getHttpProps = () => {
    if (!this.httpProps) {
      this.httpProps = {
        action: '/api/upload/img',
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
          'x-manager-token': cookie.get('x-manager-token'),
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

  // handleChange = (e) => {   const { file, fileList } = e;   if (file.status !==
  // 'uploading' && file.status !== 'done' && file.status !== 'removed') {
  // return false;   }   if (fileList) {     const { value, onChange } =
  // this.props;     const newValue = fileList.map((f) => {       const item = f;
  //      if (f.status === 'done') {         item.url = item.url ||
  // f.response?.data?.[0]?.url;       }       return item;     });     if
  // (onChange) {       onChange(newValue);     }     if (typeof value ===
  // 'undefined') {       this.setState({         fileList: newValue,       });
  //  }   } }

  handleChange = (e) => {
    const { fileList } = e;
    const { onChange, uploadChange } = this.props;
    // console.log('onchange...', JSON.stringify(fileList));
    // TODO，注意， 此处的this指向的是Form，非此Class，故执行的this.onChange为Form的方法
    const newValue = fileList.map((item) => {
      let f = '';
      if (item.status === 'done') {
        if (item.url) {
          f = item.url;
        } else if (item.response.data) {
          f = item.response.data[0].url;
        } else {
          Modal.warning({
            content: item.response.message,
          });
        }
      }
      // eslint-disable-next-line
      item.$url = f;
      return f;
    });

    if (onChange && fileList.every((v) => {
      return v.status === 'done';
    })) {
      let v = '';
      if (this.props.maxLength === 1) {
        if (newValue.length > 0) {
          [v] = newValue;
        }
      } else {
        v = newValue;
      }
      setTimeout(() => {
        onChange(v);
      }, 200);
      if (typeof uploadChange === 'function') {
        uploadChange(v);
      }
    } else {
      for (let i = 0; i < fileList.length; i += 1) { // 去掉不能传的图片
        if (fileList[i].status === undefined) {
          fileList.splice(i, 1);
          i -= 1;
        }
      }
      this.setState({ fileList });
    }
  }

  handlePrevious = (file) => {
    const { fileList = [] } = this.state;
    const files = [];
    for (const f of fileList) {
      if (f === file) {
        const tmp = files.pop();
        files.push(file);
        if (tmp) {
          files.push(tmp);
        }
      } else {
        files.push(f);
      }
    }
    this.setState({
      fileList: files,
    });
    this.handleChange({
      fileList: files,
    });
  }

  handleNext = (file) => {
    const { fileList = [] } = this.state;
    const files = [];
    let nextFile = null;
    for (const f of fileList) {
      if (f === file) {
        nextFile = file;
        // continue;
      } else {
        files.push(f);
        if (nextFile) {
          files.push(nextFile);
          nextFile = null;
        }
      }
    }
    this.setState({
      fileList: files,
    });
    this.handleChange({
      fileList: files,
    });
  }

  handleRemove = (file) => {
    const { fileList } = this.state;
    const files = fileList.filter(f => f !== file);
    // console.log(file, fileList);
    this.setState({
      fileList: files,
    });
    this.handleChange({
      fileList: files,
    });
  }

  beforeUpload = (file) => {
    const isImage = file
      .type
      .includes('image');
    if (!isImage) {
      message.error('图片格式不正确！');
      return false;
    }

    const { exclude, maxSize, maxLength, beforeUpload } = this.props;

    if (exclude.includes('gif') && file.type === 'image/gif') {
      message.error('图片格式不正确！');
      return false;
    }

    if (file.size > maxSize * 1024) {
      const s = div(maxSize, 1024);
      const msg = s >= 1 ? `${s}M` : `${maxSize}kb`;
      message.error(`图片大小超出限制（${msg}）`);
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

  renderCustomImgList() {
    const { listType } = this.props;
    const { fileList } = this.state;

    return (
      <UploadList
        listType={listType}
        items={fileList}
        onPreview={this.handlePreview}
        onRemove={this.handleRemove}
        onPrevious={this.handlePrevious}
        onNext={this.handleNext}
        locale={{
          uploading: '文件上传中...',
          removeFile: '删除',
          uploadError: '上传失败',
          previewFile: '预览',
        }}
      />
    );
  }

  render() {
    const {
      maxLength,
      customSort,
      disabled,
      showUploadList = true,
      description = '',
      ...props
    } = this.props;
    // console.log('images....props', props);
    const { fileList, previewVisible, previewImage } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div>
        {
          customSort && !disabled && this.renderCustomImgList()
        }
        <Upload
          {...props}
          {...this.getHttpProps()}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          fileList={fileList}
          disabled={disabled}
          showUploadList={
            disabled ? (showUploadList ? { showPreviewIcon: true, showRemoveIcon: false } : false)
            : (customSort ? false : showUploadList)}
        >
          {fileList.length >= maxLength
            ? null
            : uploadButton
          }
        </Upload>
        {description ? <div style={{ clear: 'both', lineHeight: '1.2em' }} >{description}</div> : null}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img
            alt="example"
            style={{
            width: '100%',
          }}
            src={previewImage}
          />
        </Modal>
      </div>
    );
  }
}
