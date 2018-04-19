import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import _ from 'lodash';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import ImageUpload from '../Upload/Image/ImageUpload';

/* global FileReader */
const PREFIX = 'c-img-uploader';

export default class Crop extends Component {
  static defaultProps = {
    maxLength: 1,
    maxSize: 500, // kb
    listType: 'picture-card',
    type: 'select',
    showUploadList: true,
    watermark: false, // 是否上传水印
  }
  constructor(props) {
    super(props);
    let value = props.defaultValue || props.value;
    const self = this;
    if (value) {
      if (!(value instanceof Array)) {
        value = [value];
      }
      value = self.getFileListByValue(value);
    }
    self.setState({
      fileList: value,
    });
  }

  state = {
    src: null,
    // cropResult: null,
    vi: false,
    // uploading: false,
    fileList: [],
  }


  componentWillReceiveProps(nextProps) {
    const { fileList } = this.state;
    const self = this;

    if (typeof nextProps.value !== 'undefined') {
      const value = nextProps.value instanceof Array
        ? nextProps.value
        : nextProps.value
          ? [nextProps.value]
          : [];
      self.setState({
        fileList: self.getFileListByValue(value),
      });
    } else if (fileList && fileList.length > 0 && fileList.every((v) => {
      return v.status === 'done' || v.status === 'uploading';
    })) {
      self.setState({ fileList: [] });
    }
  }

  onChange = (e) => {
    e.preventDefault();
    let files;
    const self = this;
    if (e.dataTransfer) {
      ({ files } = e.dataTransfer);
    } else if (e.target) {
      ({ files } = e.target);
    }
    const reader = new FileReader();
    reader.onload = () => {
      self.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  getFileListByValue = (value) => {
    return _.map(value, (url, index) => {
      return {
        uid: index + url,
        name: url,
        status: 'done',
        url,
        thumbUrl: url,
      };
    });
  }

  cropImage = (cb) => {
    const self = this;
    if (typeof self.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }

    const dataUrl = self
      .cropper
      .getCroppedCanvas()
      .toDataURL('image/jpeg');
    const bd = self.dataURLtoBlob(dataUrl);

    // this.cropper.getCroppedCanvas().toBlob(blob => {
    // this.setState({ cropResult: bd });
    cb(bd);
    // });
  }

  dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n -= 1) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  cancel = () => {
    const self = this;
    self.setState({ vi: false });
  }

  handleBeforeUpload = (file) => {
    // console.log(file);
    const files = [file];
    const self = this;
    self.currentUid = file.uid;
    const reader = new FileReader();
    reader.onload = () => {
      self.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);

    self.setState({ vi: true });
    return new Promise((resolve) => {
      self.resolve = resolve;
    });
  }

  handleChange = () => {
    const self = this;
    self.cropImage((blob) => {
      // const fileList = [blob]; let { value, onChange, uploadChange } = self.props;
      // // TODO，注意， 此处的self指向的是Form，非此Class，故执行的self.onChange为Form的方法
      // console.log(fileList);
      if (self.resolve) {
        const file = new File([blob], 'test.jpeg', {
          type: 'image/jpeg',
          lastModified: new Date(),
        });
        file.uid = self.currentUid;
        self.resolve(file);
        self.setState({ vi: false });
      }
    });
  }

  render() {
    const self = this;
    const { maxLength } = self.props;
    const { fileList } = self.state;
    let btnHideClass = '';
    // console.log('-------------------------------------', props);
    if (fileList.length >= maxLength) {
      btnHideClass = 'btn-hide';
    }

    return (
      <div className={`${PREFIX} clearfix ${btnHideClass}`}>
        {/* <ImageUpload
          {...props}
          key="pic"
          maxLength={1}
          maxSize={500}
          beforeUpload={self
          .handleBeforeUpload
          .bind(self)}
        /> */}
        <ImageUpload
          exclude={['gif']}
          maxSize={5120}
          maxLength={maxLength}
          beforeUpload={self.handleBeforeUpload}
          fileList={fileList}
          listType="picture-card"
        />
        <Modal
          className="cut-img-uploader"
          width="850px"
          visible={this.state.vi}
          title="选择图片"
          onCancel={self.cancel}
          footer={[
            <Button
              key="back"
              onClick={
                () => self
                  .file
                  .click()
              }
            > 重新选择
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={self.handleChange}
            > 完成
            </Button>,
            ]}
        >
          <div
            style={{
              width: '100%',
              height: '500px',
              padding: '0 30px',
            }}
          >
            <input
              type="file"
              style={{
              margin: '0 auto',
              marginTop: '30px',
              display: 'none',
            }}
              ref={(file) => { self.file = file; }}
              onChange={self.onChange}
            />
            <div
              className="pre-box"
              style={{
              width: '350px',
              float: 'left',
            }}
            >
              <div style={{ margin: '30px 0' }}>
                <h2>原图</h2>
              </div>
              <div
                className="box"
                style={{
                width: '350px',
                height: '300px',
                paddingTop: '67px',
                backgroundColor: '#e9ecef',
              }}
              >
                <div
                  className="img-preview"
                  style={{
                  width: '100%',
                  float: 'right',
                  height: '200px',
                  overflow: 'hidden',
                }}
                />
              </div>
            </div>
            <div
              className="cut-box"
              style={{
              width: '350px',
              float: 'right',
            }}
            >
              <div style={{ margin: '30px 0' }}>
                <h2>图片&nbsp;展示区域</h2>
              </div>
              <Cropper
                style={{
                height: '300px',
                width: '350px',
              }}
                aspectRatio={25 / 12}
                viewMode={2}
                preview=".img-preview"
                guides={false}
                src={this.state.src}
                ref={(cropper) => {
                self.cropper = cropper;
              }}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
