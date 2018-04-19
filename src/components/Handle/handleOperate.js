import { message } from 'antd';

function handleOperate(params = {}, namespace = '', method = '', confirmText = '操作', callback) {
  const { dispatch } = this.props;

  dispatch({
    type: `${namespace}/${method}`,
    payload: params,
  }).then(() => {
    const result = this.props[namespace]?.[method];
    if (result && result.msgCode === 200 && result.data) {
      message.success(`${confirmText}成功`);
      this.search?.handleSearch();
      callback?.();
    } else {
      message.error(`${confirmText}失败, ${result?.message || '请稍后再试。'}`);
    }
  });
}

export default handleOperate;
