export default (rules) => {
  return rules.map((rule) => {
    const r = {
      ...rule,
    };

    if (!r.message) {
      if (r.max) {
        r.message = `最多${r.max}个字`;
      } else if (r.min) {
        r.message = `最少${r.min}个字`;
      }
    }

    return r;
  });
};
