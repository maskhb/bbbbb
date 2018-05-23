import { message } from 'antd';

function handleOperate(params = {}, namespace = '', method = '', confirmText = '操作', callback) {
  const { dispatch } = this.props;

  dispatch({
    type: `${namespace}/${method}`,
    payload: params,
  }).then(() => {
    const result = this.props[namespace]?.[method];
    if (result) {
      message.success(`${confirmText}成功`);
      this.search?.handleSearch();
      if (typeof callback === 'function') {
        callback();
      }
    }
  });
}

export default handleOperate;
