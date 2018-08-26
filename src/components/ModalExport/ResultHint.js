/*
 * @Author: wuhao
 * @Date: 2018-04-26 10:20:35
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-19 14:35:13
 *
 * 提示--导出模版2
 */
import React, { PureComponent } from 'react';

import { Modal, Button } from 'antd';

import './index.less';

class ResultHint extends PureComponent {
  static defaultProps = {};

  state = {
    loading: false,
  }

  showModalInfo = (totalCount = 0) => {
    const { onSkip, params = {}, title } = this.props;
    Modal.confirm({
      title: '提示',
      content: (
        <div className="component_modal_export_resulthint">
          <span>为了查询性能及体验，我们对导出功能进行改造；</span>
          <span>1.为了保证您的查询性能，两次导出的时间间隔请保持在5分钟以上</span>
          <span>2.本次导出的{title || '数据'}约{totalCount}条，需要等待一段时间才能下载</span>
        </div>
      ),
      okText: '查看导出结果',
      cancelText: '取消',
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
        const { succ, totalCount } = res;
        if (succ) {
          this.showModalInfo(totalCount);
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
    const { btnTitle = '导出', disabled = false } = this.props;
    const { loading } = this.state;

    const defaultBtnElm = <Button icon="download" type="primary" >{btnTitle}</Button>;
    const { btnElm = defaultBtnElm } = this.props;

    return React.cloneElement(btnElm, {
      disabled,
      loading,
      onClick: this.handleBtnClick,
    });
  }
}

export default ResultHint;
