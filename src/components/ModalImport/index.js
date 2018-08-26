/**
 * 弹出导入窗
 */
import React, { PureComponent } from 'react';
import { Modal, Row, Col, Spin, message } from 'antd';
import UploadFile from 'components/Upload/File';
import Download from 'components/Download';
import { goTo } from 'utils/utils';
// import DraggerUpload from 'components/Upload/File/DraggerUpload';
import request from 'utils/request';
import styles from './styles.less';

export default class ImportModal extends PureComponent {
  static defaultProps = {
    importLabel: '导入文件',
    templateLabel: '导入模板',
    title: '批量导入',
  };
  state = {
    uploading: false,
    file: null,
    visible: true,
    submitting: false,
  }

  componentWillReceiveProps(nextProps) {
    // console.log('modalimport', nextProps);
    // if (nextProps.visible) {
    this.setState({
      visible: nextProps.visible,
    });
    // }
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
    if (!this.state.file) {
      message.error('请先上传导入文件');
      return;
    }

    const { onOk, uploadProps = {} } = this.props;
    if (uploadProps.manual) {
      this.handleUpload().then((res) => {
        if (onOk) {
          onOk(res);
        }
      });
    } else if (onOk) {
      onOk(this.state.file);
    } else {
      const { actionProps } = this.props;
      if (actionProps && actionProps.url && actionProps.params) {
        let { params } = actionProps;
        if (typeof actionProps.params === 'function') {
          params = actionProps.params(this.state.file);
        }
        this.setState({
          submitting: true,
        });
        request(actionProps.url, { body: params }).then((res) => {
          this.setState({
            submitting: false,
          });
          if (res !== null) {
            this.setState({
              visible: false,
            });
            const { onSuccess } = this.props;
            if (onSuccess) {
              onSuccess();
            } else {
              const { onCancel } = this.props;
              if (onCancel) {
                this.setState({ file: null });
                onCancel();
              }
              Modal.confirm({
                title: '导入上传成功',
                okText: '查看导入结果',
                cancelText: '关闭',
                iconType: 'check-circle',
                className: 'modal-success-confirm',
                onOk() {
                  goTo('/batchimport/import');
                  // console.log('跳到导入管理页面');
                },
              });
            }
          }
        });
      }
    }
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  handleUpload = () => {
    this.setState({
      uploading: true,
    });
    return this.upload.manualUpload().then((res) => {
      this.setState({
        uploading: false,
      });
      message.suucess('导入成功');
      return res.json();
    });
  }

  renderBasicUpload() {
    const { importLabel, remark } = this.props;
    return (
      <Row>
        <Col className={styles.import_left} span="4" offset="4">
          {importLabel}：
        </Col>
        <Col className={styles.import_right} span="16">
          <UploadFile
            uploadType="excel"
            {...this.uploadProps()}
            ref={(ref) => { this.upload = ref; }}
          />
          { remark }
        </Col>
      </Row>
    );
  }


  renderDragerUpload() {
    const { remark } = this.props;

    return (
      <Row>
        <Col span="16" offset="4">
          <UploadFile
            ref={(ref) => { this.upload = ref; }}
            uploadType="excel"
            dragger
            {...this.uploadProps()}
            remark={remark}
          />
        </Col>
      </Row>
    );
  }

  render() {
    const { title, templateLabel, templateUrlProps, dragger } = this.props;
    const { submitting } = this.state;
    return (
      <Modal
        title={title}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={!submitting}
        closable={!submitting}
        keyboard={!submitting}
        confirmLoading={submitting}
      >
        <Spin spinning={this.state.uploading}>
          <Row>
            <Col className={styles.import_left} span="4" offset="4">
              {templateLabel}：
            </Col>
            <Col className={styles.import_right} span="16">
              <Download {...templateUrlProps} />
            </Col>
          </Row>
          {this.state.visible && (dragger ? this.renderDragerUpload() : this.renderBasicUpload())}
        </Spin>
      </Modal>
    );
  }
}
