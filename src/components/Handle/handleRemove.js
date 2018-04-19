import handleOperate from './handleOperate';

function handleRemove(params = {}, namespace = '', callback) {
  handleOperate.call(this, params, namespace, 'remove', '删除', callback);
}

export default handleRemove;
