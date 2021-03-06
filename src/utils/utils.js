import moment from 'moment';
import { routerRedux } from 'dva/router';
import { toFullPath } from './request/utils';
import store from '../index';

export function goToLocation(path) {
  window.location = toFullPath(path);
}
export function goToNewWin(path) {
  window.open(toFullPath(path), '_blank');
}

export function goTo(path) {
  store.dispatch(routerRedux.push(path));
  document.querySelector('body')?.scrollIntoView();
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
export function getWeekday(timestamp) {
  const day = new Date(timestamp).getDay();
  const arr = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${arr[day]}`;
}
export function handleTime(type, time) { // type 1:当天0点，2：当天晚上11点59
  const result = new Date(time);
  if (type === 1) {
    result.setHours(0);
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
  } else if (type === 2) {
    result.setHours(23);
    result.setMinutes(59);
    result.setSeconds(59);
    result.setMilliseconds(999);
  }
  return result.getTime();
}
export function checkArr(arr, label, value) { // 检查数组中是否包含某个值
  let hasElement = false;
  let index = 0;
  const thisArr = arr || [];
  thisArr.forEach((v, i) => {
    if (v[label] === value) {
      hasElement = true;
      index = i;
    }
  });
  return {
    hasElement, index,
  };
}
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

// function getRelation(str1, str2) {
//   if (str1 === str2) {
//     console.warn('Two path are equal!');  // eslint-disable-line
//   }
//   const arr1 = str1.split('/');
//   const arr2 = str2.split('/');
//   if (arr2.every((item, index) => item === arr1[index])) {
//     return 1;
//   } else if (arr1.every((item, index) => item === arr2[index])) {
//     return 2;
//   }
//   return 3;
// }

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).sort().filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path
  );
  routes = routes.map(item => item.replace(path, ''));
  const renderArr = routes;
  // renderArr.push(routes[0]);

  // for (let i = 1; i < routes.length; i += 1) {
  //   let isAdd = false;
  //   isAdd = renderArr.every(item => {
  //     return getRelation(item, routes[i]) === 3
  //   });
  //   renderArr = renderArr.filter(item => {
  //     return getRelation(item, routes[i]) !== 1
  //   });
  //   if (isAdd) {
  //     renderArr.push(routes[i]);
  //   }
  // }
  const renderRoutes = renderArr.map((item) => {
    // const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact: true,
    };
  });

  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

// 线性数据转化为树。
export function toTree(data, keyMap = { id: 'id', pid: 'pid' }, parentId = 0, level = 1) {
  const tree = [];
  let temp;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i][keyMap.pid] === parentId) {
      const obj = data[i];
      obj.level = level;

      temp = toTree(data, keyMap, data[i][keyMap.id], level + 1);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

export function toTreeData(data, keyMap = { id: 'id', pid: 'pid' }) {
  return toTree(data, keyMap);
}

/**
 * 根据options的label或value获取optionsItem
 * @param {*} options
 * @param {String:[label,value]} keyName
 * @param {Number|String} keyValue
 */
export const getOptionItemForLabelOrValue = (options, keyName, keyValue) => {
  return (options || []).find((item) => {
    return `${item[keyName]}` === `${keyValue}`;
  });
};

/**
 * 根据Value获取Label
 *
 * 例子: getOptionLabelForValue(options)(value)
 *
 * @param {*} options
 */
export const getOptionLabelForValue = (options) => {
  return (value) => {
    const optionItem = getOptionItemForLabelOrValue(options, 'value', value);
    return optionItem ? optionItem.label : null;
  };
};

/**
 * 根据Label获取Value
 *
 * 例子: getOptionValueForLabel(options)(label)
 *
 * @param {*} options
 */
export const getOptionValueForLabel = (options) => {
  return (label) => {
    const optionItem = getOptionItemForLabelOrValue(options, 'label', label);

    return optionItem ? optionItem.value : null;
  };
};


export const getValueFromEvent = (e) => {
  let value;
  if (!e || !e.target) {
    value = e;
  } else {
    const { target } = e;
    // eslint-disable-next-line
    value =  target.type === 'checkbox' ? target.checked : target.value;
  }
  // eslint-disable-next-line
  if (value.__proto__ === String.prototype) {
    return value.replace(/^\s/, '').replace(/(\s{2}$)/g, ' ');
  }
  return value;
};


export const formatAllOpion = (_obj) => {
  const obj = { ..._obj };

  Object.keys(obj).forEach((v) => {
    if (obj[v] === -1 || obj[v] === undefined || obj[v] === '') {
      delete obj[v];
    }
  });

  return obj;
};

export const getCustomFieldDecorator = (vo, form, rootName) => {
  return (field, args) => {
    return form.getFieldDecorator(rootName ? `${rootName}.${field}` : field, {
      ...args,
      initialValue: args?.initialValue || vo?.[field],
    });
  };
};
/**
 * 根据value获取对应的label
 */
export const getLabelByValue = (options, value, valueName, labelName) => {
  let resultLabel = '';
  const keyName = valueName || 'value';
  const labelName2 = labelName || 'label';
  if (options instanceof Array) {
    options.forEach((v) => {
      if (Number(v[keyName]) === Number(value)) {
        resultLabel = v[labelName2];
      }
    });
  }
  return resultLabel;
};

export function formatFloat(f, digit) { // 维持Float数字精度   f：数字， digit：保留位数
  const m = 10 ** digit;
  return Math.round(f * m, 10) / m;
}
