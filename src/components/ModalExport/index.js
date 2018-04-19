/*
 * @Author: wuhao
 * @Date: 2018-04-09 18:09:55
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-18 15:44:35
 *
 * 导出对话框
 */
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
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
      <Row>
        <Col>
          <span>导出内容：</span>
        </Col>
      </Row>,
      <Row style={{
        marginTop: '10px',
        marginLeft: '15px',
      }}
      >
        {
          options.map(item => (
            <Col
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
      <Divider />,
      <Row type="flex" align="middle">
        <Col span={3}>
          <span>文件名称：</span>
        </Col>
        <Col span={10} >
          <Input placeholder="可输入导出文件名称" value={exportFileName} onChange={this.handleExportFileNameChange} />
        </Col>
      </Row>,
      <Row>
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
    const { dispatch, onOk, isOkHide = true, tabOptions, title = '', routerUrl, skipUrl } = this.props;

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
      if (typeof res === 'boolean') {
        if (!res) {
          exportFail = true;
        }
      } else if (res) {
        const { msgCode: code, message: msg, totalCount, sucTitle, isHide = false } = res;
        if (code === 200) {
          Modal.success({
            title: `正在导出${sucTitle || title || '数据'}，请稍等`,
            content: `本次导出的${sucTitle || title || '数据'}约${totalCount || 0}条，大概需要${Math.ceil(totalCount / 1000)}分钟后才能下载`,
            cancelText: '关闭',
            ...(routerUrl || skipUrl) ? {
              okText: '查看',
              onOk: () => {
                if (routerUrl) {
                  dispatch(routerRedux.push(routerUrl));
                } else {
                  window.open(skipUrl, '_blank');
                }
              },
            } : null,

          });
        } else {
          exportFail = true;
          Modal.error({
            title: `导出${sucTitle || title}失败`,
            content: msg,
          });

          isExportFailHideModal = isHide;
        }
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
    const { hideBtn, tabOptions = [], title = '' } = this.props;
    const { showModal, loading } = this.state;

    const btnElm = <Button icon="download" type="primary" onClick={this.handleButtonClick}>导出</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
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
