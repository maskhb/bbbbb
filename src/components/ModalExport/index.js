/*
 * @Author: wuhao
 * @Date: 2018-04-09 18:09:55
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-09 14:56:39
 *
 * 导出对话框
 */
import React, { PureComponent } from 'react';
import { Row, Col, Modal, Tabs, Divider, Input, Button } from 'antd';

const { TabPane } = Tabs;

class ModalExport extends PureComponent {
  static defaultProps = {};

  state = {
    exportFileName: '',
    activeKey: '1',
    showModal: this.props.show || false,
    loading: false,
  }

  componentWillReceiveProps(newProps) {
    const { show } = newProps;
    // 用于外部调用显示隐藏
    if (typeof show === 'boolean') {
      this.setState({
        showModal: show,
      });
    }
  }

  /**
   * 获取导出字段显示布局元素
   */
  getShowExportFieldRowElm = (options = []) => {
    return [
      <Row key="mefr_export_name">
        <Col>
          <span>导出内容：</span>
        </Col>
      </Row>,
      <Row
        key="mefr_export_content"
        style={{
        marginTop: '10px',
        marginLeft: '15px',
      }}
      >
        {
          options.map(item => (
            <Col
              key={item}
              span="6"
              style={{
                lineHeight: '28px',
              }}
            >
              {item}
            </Col>
          ))
        }
      </Row>,
    ];
  }

  /**
   * 获取文件名称布局元素
   */
  getExportFileRowElm = () => {
    const { exportFileName } = this.state;

    return [
      <Divider key="mefr_export_divider" />,
      <Row key="mefr_export_filename" type="flex" align="middle">
        <Col span={3}>
          <span>文件名称：</span>
        </Col>
        <Col span={10} >
          <Input placeholder="可输入导出文件名称" value={exportFileName} onChange={this.handleExportFileNameChange} />
        </Col>
      </Row>,
      <Row key="mefr_export_filedesc">
        <Col offset={3}>
          <span style={{
            color: '#d4d4d4',
            fontSize: '12px',
            padding: '5px 0 15px 0',
            display: 'block',
          }}
          >
            导出文件为.xls格式，文件名默认为当前日期.xls
          </span>
        </Col>
      </Row>,
    ];
  }

  /**
   * 文件名称Input输入回调
   */
  handleExportFileNameChange = (e) => {
    const { value } = e.target;

    this.setState({
      exportFileName: value,
    });
  }

  /**
   * tabs切换回调
   */
  handleTabsChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  }

  /**
   * modal 取消按钮事件
   */
  handleModalCanale = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    } else {
      this.setState({
        showModal: false,
      });
    }
  }

  /**
   * modal 导出按钮事件
   */
  handleModalOk = async () => {
    const { onOk, isOkHide = true, tabOptions, title = '', onSkip } = this.props;

    let exportFail = false;
    let isExportFailHideModal = false;

    this.setState({
      loading: true,
    });

    if (onOk) {
      const res = await onOk({
        exportFileName: this.state.exportFileName,
        ...tabOptions[this.state.activeKey - 1].params,
      });

      // 成功失败判断
      if (res) {
        const { succ, totalCount, sucTitle, isHide = false } = res;
        if (succ) {
          Modal.success({
            title: `正在导出${sucTitle || title || '数据'}，请稍等`,
            content: `本次导出的${sucTitle || title || '数据'}约${totalCount || 0}条，大概需要5分钟后才能下载`, // ${Math.ceil(totalCount / 1000)}
            cancelText: '关闭',
            ...(onSkip) ? {
              okText: '查看',
              onOk: () => {
                onSkip(tabOptions[this.state.activeKey - 1]?.params);
              },
              maskClosable: true,
            } : null,

          });
        } else {
          exportFail = true;
          // Modal.error({
          //   title: `导出${sucTitle || title}失败`,
          //   content: msg,
          // });

          isExportFailHideModal = isHide;
        }
      } else {
        exportFail = true;
        Modal.error({
          title: `导出${title}失败`,
          content: '导出失败，请稍后再试~',
        });
      }
    }

    // 默认调用隐藏
    if (isOkHide && (!exportFail || isExportFailHideModal)) {
      this.setState({
        showModal: false,
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  /**
   * 显示导出弹层
   */
  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  /**
   * 多个tab的渲染元素
   */
  renderTabs = () => {
    const { tabOptions = [] } = this.props;
    const { activeKey } = this.state;

    return (
      <Tabs
        activeKey={activeKey}
        size="small"
        onChange={this.handleTabsChange}
      >
        {
          tabOptions.map((item, index) => (
            <TabPane tab={item.title} key={`${index + 1}`}>
              {
                this.getShowExportFieldRowElm(item.fields)
              }
              {
                this.getExportFileRowElm()
              }
            </TabPane>
          ))
        }
      </Tabs>
    );
  }

  /**
   * 无tab或只有一个tab的渲染元素
   */
  renderNoTabs = () => {
    const { tabOptions = [] } = this.props;


    return tabOptions.length > 0 ? (
      <div>
        {
          this.getShowExportFieldRowElm(tabOptions[0].fields)
        }
        {
          this.getExportFileRowElm()
        }
      </div>
    ) : (<div />);
  }

  render() {
    const { hideBtn, tabOptions = [], title = '', btnTitle = '导出' } = this.props;
    const { showModal, loading } = this.state;

    const btnElm = <Button key="mec_btn" icon="download" type="primary" onClick={this.handleButtonClick}>{btnTitle}</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="mec_modal"
        visible={showModal}
        confirmLoading={loading}
        title={`导出${title}`}
        okText="导出"
        width="600px"
        bodyStyle={{
          padding: '5px 15px',
        }}
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        {
        tabOptions.length > 1 ? this.renderTabs() : this.renderNoTabs()
      }
      </Modal>,
    ];
  }
}

export default ModalExport;
