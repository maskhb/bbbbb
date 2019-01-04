import _ from 'lodash';

/**
 * 缓存网络请求
 */
export default class Cache {
  constructor(initFn, context) {
    this.initFn = initFn;
    this.context = context || this;
  }
  options = {};

  fromContext = context => {
    this.context = context;
    return this;
  };

  set = (key, value) => {
    this.options[key] = value;
  };

  /**
   * @argument {array} args
   */
  get = args => {
    const key = args instanceof Array ? args.join("_") : args;
    if (this.options[key]) {
      return Promise.resolve(this.options[key]);
    }
    return this.initFn.apply(this.context, [].concat(args)).then(res => {
      this.set(key, res);
      return this.get(key);
    });
  };
}
