import React from 'react';
import { Card, Form, Row } from 'antd';
import Editor from 'components/Editor';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import styles from '../package.less';

export default class GraphicDescription extends React.Component {
  render() {
    const { editorRef, form, goodsPackage: { detail } } = this.props;
    const disabled = false;

    return (
      <Card title="图文描述" bordered={false} className={styles.card}>
        <Form layout="vertical">
          <Row key={1}>
            <Form.Item label="套餐主图：">
              {
                form.getFieldDecorator('mainImgUrl', {
                  rules: [{ required: true, message: '请上传套餐主图' }],
                  initialValue: detail?.mainImgUrl,
                })(
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={1024 * 5}
                    maxLength={1}
                    action="/api/upload/img"
                    listType="picture-card"
                  />
                )
              }
            </Form.Item>
          </Row>
          <Row key={2}>
            <Form.Item label="套餐相册：">
              {
                form.getFieldDecorator('album', {
                  rules: [{ required: true, message: '请上传套餐相册' }],
                  initialValue: detail?.album,
                })(
                  <ImageUpload
                    exclude={['gif']}
                    maxSize={1024 * 5}
                    maxLength={10}
                    action="/api/upload/img"
                    listType="picture-card"
                  />
                )
              }
            </Form.Item>
          </Row>
          <Row gutter={16} key={3}>
            <Form.Item>
              {
                form.getFieldDecorator('packageDetail', {
                  initialValue: detail?.packageDetail,
                })(
                  <Editor
                    ref={editorRef}
                    maxLength={2}
                    disabled={disabled}
                  />)
              }
            </Form.Item>
          </Row>
        </Form>
      </Card>
    );
  }
}
