import _ from 'lodash';

/* eslint no-param-reassign: 0 */

function initPush(arrayName, obj, toPush) {
  if (obj[arrayName] === undefined) {
    obj[arrayName] = [];
  }
  obj[arrayName].push(toPush);
  obj[arrayName] = _.uniq(obj[arrayName]);
}

function multiInitPush(arrayName, obj, toPushArray) {
  let len;
  len = toPushArray.length;
  if (obj[arrayName] === undefined) {
    obj[arrayName] = [];
  }
  while (len -= 1 > 0) {
    obj[arrayName].push(toPushArray.shift());
    obj[arrayName] = _.uniq(obj[arrayName]);
  }
}

export default (list = [], options = {}, disableFn) => {
  if (list?.constructor?.name !== 'Array') {
    return [];
  }

  const config = Object.assign({
    id: 'id',
    parentId: 'parentId',
    children: 'children',
  }, options);
  const flat = [..._.orderBy(list, config.parentId, 'asc')];
  const roots = [];
  const temp = {};
  const pendingChildOf = {};

  for (let i = 0, len = flat.length; i < len; i += 1) {
    const flatEl = flat[i];
    flatEl.value = flatEl.categoryId;
    flatEl.label = flatEl.categoryName;
    flatEl.disabled = _.isFunction(disableFn) ? disableFn(flatEl) : false;

    const id = flatEl[config.id];
    const parentId = flatEl[config.parentId];

    temp[id] = flatEl;

    if (parentId === undefined || parentId === null || parentId === 0) {
      // 是根节点
      roots.push(flatEl);
    } else if (temp[parentId] !== undefined) {
      // 找到了根节点
      initPush(config.children, temp[parentId], flatEl);
    } else {
      // 没有找到根节点
      initPush(parentId, pendingChildOf, flatEl);
    }

    if (pendingChildOf[id] !== undefined) {
      multiInitPush(config.children, flatEl, pendingChildOf[id]);
    }
  }

  return roots;
};
