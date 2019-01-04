/*
 * @Author: wuhao
 * @Date: 2018-04-26 11:26:45
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-08 10:10:59
 *
 * 导出模版--提示
 */
import React, { PureComponent } from 'react';

import { Modal, Button } from 'antd';

class ResultPrompt extends PureComponent {
  static defaultProps = {};

  state = {
    loading: false,
  }

  showPromptInfo = () => {
    const { onSkip, params = {} } = this.props;
    Modal.confirm({
      title: '已成功创建导出任务，导出成功后请在导出管理中下载！',
      iconType: '-',
      okText: '立即前往',
      cancelText: '我知道了',
      onOk: () => {
        onSkip(params);
      },
    });
  }

  handleBtnClick = async () => {
    const { onOk, title = '', params = {} } = this.props;

    this.setState({
      loading: true,
    });

    if (onOk) {
      const res = await onOk(params);

      // 成功失败判断
      if (res) {
        const { succ } = res;
        if (succ) {
          this.showPromptInfo();
        } else {
          // Modal.error({
          //   title: `导出${sucTitle || title}失败`,
          //   content: msg,
          // });
        }
      } else {
        Modal.error({
          title: `导出${title}失败`,
          content: '导出失败，请稍后再试~',
        });
      }
    }

    this.setState({
      loading: false,
    });
  }


  render() {
    const { btnTitle = '导出' } = this.props;
    const { loading } = this.state;

    const defaultBtnElm = <Button icon="download" type="primary" >{btnTitle}</Button>;
    const { btnElm = defaultBtnElm } = this.props;

    return React.cloneElement(btnElm, {
      loading,
      onClick: this.handleBtnClick,
    });
  }
}

export default ResultPrompt;
