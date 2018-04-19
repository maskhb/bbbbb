import handleOperate from './handleOperate';

function handleUpdate(params = {}, namespace = '', confirmText = '更新', callback) {
  handleOperate.call(this, params, namespace, 'status', confirmText, callback);
}

export default handleUpdate;
