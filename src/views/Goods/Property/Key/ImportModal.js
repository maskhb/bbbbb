import React, { PureComponent } from 'react';
import { Modal, Row, Col } from 'antd';
import FileUpload from 'components/Upload/File/FileUpload';

import styles from './styles.less';
import { PROPERTY_BASIC_TYPE } from '../const';


export default class ImportModal extends PureComponent {
  handleOk = () => {
    const { onOk } = this.props;
    if (onOk) {
      this.onOk();
    }
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  isBasic() {
    const { type } = this.props;
    return type === PROPERTY_BASIC_TYPE;
  }

  render() {
    const { visible } = this.props;
    return (
      <Modal
        title="导入属性"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row>
          <Col className={styles.import_left} span="4" offset="4">
            属性模板：
          </Col>
          <Col className={styles.import_right} span="16">
            <a href="/fjodsjfofjiodsjfo" target="_blank">
              属性模板.xls
            </a>
          </Col>
        </Row>
        <Row>
          <Col className={styles.import_left} span="4" offset="4">
            导入文件：
          </Col>
          <Col className={styles.import_right} span="16">
            <FileUpload uploadType="*" />
            <br />
            <p>
              {'//'}支持xls格式，文件大小不能超过5M
            </p>
            { this.isBasic() && (
              <p>
                {'//'}录入形式说明：1为Radio单选组，2为Select多选组，3为下拉列表选择框，4为带搜索下拉列表选择框
              </p>
            )}
          </Col>
        </Row>
      </Modal>
    );
  }
}
