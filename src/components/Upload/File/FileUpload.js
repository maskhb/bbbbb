import React, { Component } from 'react';
import { Upload, Icon, Button, message } from 'antd';
import _ from 'lodash';
import cookie from 'utils/cookie';
import './FileUpload.less';
// import { requestRoot } from 'configs/global';

// todo:解决request依赖问题

// 使用第三方

const PREFIX = 'c-uploader';


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
    if (!this.httpProps) {
      this.httpProps = {
        action: '/api/upload/file',
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
          // 'x-client-id': 'nBpBkX-1522045206159',
          'x-client-os-version': 0,
          'x-client-type': 'pc',
          'x-client-version-code': 0,
          'x-client-version-name': 0,
        },
      };
    }

    return this.httpProps;
  }


  handleBeforeUpload(e) {
    const { uploadType } = this.props;
    if (uploadType === 'txt' && !(e.type === 'text/plain')) {
      message.error('只能上传 txt 文件哦！');
      return false;
    }
    if (uploadType === 'excel' && (!(e.type.indexOf('excel') > 0) && !(e.name.indexOf('xlsx') > 0))) {
      message.error('只能上传 excel 文件哦！');
      return false;
    }
    if (e.size > this.props.maxSize * 1024) {
      message.error('文件大小已超出限制,请重新上传');
      return false;
    }
    if (this.state.fileList.length >= this.props.maxLength) {
      message.error('文件数量已超出限制');
      return false;
    }
  }


  handleChange = (info) => {
    if (!('fileList' in this.props) && info.file.status !== undefined) {
      this.setState({ fileList: info.fileList });
    }
    const { onChange } = this.props;
    if (onChange) {
      if (info.file.status === 'done') {
        onChange(info.file.response.data, { fileList: info.fileList, status: info.file.status });
      }
    }
  }

  render() {
    const { value, maxLength, defaultValue, wraperStyle, ...props } = this.props;
    const { fileList } = this.state;
    let btnHideClass = '';

    if (fileList.length >= maxLength) {
      btnHideClass = 'btn-hide';
    }

    return (
      <div className={`${PREFIX} clearfix ${btnHideClass}`} style={wraperStyle}>
        <Upload
          {...props}
          {...this.getHttpProps()}
          beforeUpload={this.handleBeforeUpload.bind(this)}
          onChange={this.handleChange.bind(this)}
          fileList={fileList}
        >
          <Button>
            <Icon type="plus" />
            <span className="ant-upload-text">点击上传</span>
          </Button>
        </Upload>
      </div>
    );
  }
}


// Uploader.propTypes = _.extend({}, Upload.propTypes, {
//   maxLength: PropTypes.number, // 可上传最大数量
//   value: PropTypes.oneOfType([
//     React.PropTypes.string,
//     PropTypes.array,
//   ]),
//   defaultValue: PropTypes.array,
//   maxSize: PropTypes.number,
//   onChange: PropTypes.func,
//   uploadType: PropTypes.string, // 上传类型, 只支持 txt或者excel
// });


// Uploader.defaultProps = _.extend({}, Upload.defaultProps, {
//   maxLength: 1,
//   maxSize: 500, // kb
//   listType: 'text',
//   showUploadList: true,
//   uploadType: 'txt', // 'txt','excel'
// });

export default Uploader;
