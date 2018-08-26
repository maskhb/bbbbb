import { message } from 'antd';

function handleOperate(params = {}, namespace = '', method = '', confirmText = '操作', callback, isApprove) {
  const { dispatch } = this.props;

  dispatch({
    type: `${namespace}/${method}`,
    payload: params,
  }).then(() => {
    const result = this.props[namespace]?.[method];
    if (result) {
      if (result?.total) {
        if (isApprove) {
          if (result.total === 1) {
            message.success(`${confirmText}成功`);
          } else {
            message.success(`本次批量${confirmText} ${result?.total}个，成功过${result?.success}个，失败${result?.fail}个！`);
          }
        } else {
          message.success(`操作成功! ${confirmText}总数：${result?.total}， 成功：${result?.success}， 失败：${result?.fail}`);
        }
      } else {
        message.success(`${confirmText}成功`);
      }

      this.search?.handleSearch();
      if (typeof callback === 'function') {
        callback();
      }
    }
  });
}

export default handleOperate;
