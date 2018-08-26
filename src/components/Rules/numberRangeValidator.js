export default (rule, value = {}, callback) => {
  const { min, max } = value;

  if ((min || min === 0) && (max || max === 0) && min > max) {
    callback('最小 <= 最大');
    return;
  }

  callback();
};
