import React, { PureComponent } from 'react';
import { message } from 'antd';
// import FileUpload from 'components/Upload/File/FileUpload';
// import DraggerUpload from 'components/Upload/File/DraggerUpload';
import ModalImport from 'components/ModalImport';


// import styles from './styles.less';
import { PROPERTY_BASIC_TYPE } from '../const';


export default class ImportModal extends PureComponent {
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
  renderRemark() {
    return (
      <div>
        <br />
        <p>
          {'//'}支持xls格式，文件大小不能超过5M
        </p>
        { this.isBasic() && (
          <p>
            {'//'}录入形式说明：1为Radio单选组，2为Select多选组，3为下拉列表选择框，4为带搜索下拉列表选择框
          </p>
        )}
      </div>
    );
  }
  render() {
    const { visible, propertyGroupId, prefixBusinessType, onSuccess } = this.props;

    return (
      <ModalImport
        dragger
        title="导入属性"
        // onOk={this.handleOk}
        actionProps={{
          url: '/mj/ht-mj-goods-server/exportTemplate/goods/importData',
          params(file) {
            return {
              uploadFileVo: {
                propertyGroupId,
                fileUrl: file.url,
                fileName: file.originalFileName,
                prefixBusinessType,
              },
            };
          },
        }}
        templateLabel="属性模板"
        templateUrlProps={{
          baseUrl: '/ht-mj-goods-server/exportTemplate/goods/exportTemplate',
          query: {
            bussinessType: prefixBusinessType,
          },
          title: '下载属性模板',
        }}
        // ref={(ref) => { this.import = ref; }}
        uploadProps={{
          uploadType: 'excel',
          maxSize: 1024 * 5,
        }}
        onCancel={this.handleCancel}
        remark={this.renderRemark()}
        visible={visible}
        onSuccess={() => {
          message.success('导入成功!');
          if (onSuccess) {
            onSuccess();
          }
        }}
      />
    );
  }
}
