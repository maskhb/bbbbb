import createHistory from 'history/createHashHistory';
import qs from 'qs';

const history = createHistory();
const defaultKeys = ['__m', '__k'];
const getDefaultParams = () => {
  const query = window.location.href.split('?')[1];
  const params = qs.parse(query);
  const vals = {};
  for (const k of defaultKeys) {
    if (params[k] && params[k].length > 0) {
      vals[k] = params[k];
    }
  }

  return vals;
};

if (defaultKeys && defaultKeys.length > 0) {
  if (!history.defaultParams) {
    history.defaultParams = getDefaultParams();
  }
  history.listen(() => {
    history.defaultParams = getDefaultParams();
  });
  const originCreateHref = history.createHref;
  history.createHref = (location) => {
    if (Object.keys(history.defaultParams).length > 0) {
      location.search = toJpath(location.search || ''); // eslint-disable-line
    }
    return originCreateHref(location);
  };

  const toJpath = (path) => {
    let tmp = path;
    if (typeof path === 'string') {
      if (path.indexOf('?') > 0) {
        const [basePath, search] = path.split('?');

        tmp = `${basePath}?${qs.stringify(Object.assign(qs.parse(search), history.defaultParams))}`;
      } else {
        tmp = `${path}?${qs.stringify(history.defaultParams)}`;
      }
    }

    return tmp;
  };

  const originPush = history.push;
  // if (originPush)
  history.push = path => originPush(toJpath(path));

  const originReplace = history.replace;

  history.replace = path => originReplace(toJpath(path));
}

export default history;
