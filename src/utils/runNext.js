const runNext = (gen, showError) => {
  const next = (err, data) => {
    if (err) {
      if (typeof err === 'string') {
        return showError(err);
      } else if (err.content) {
        return showError(err.content, err.duration || 3, err.onClose);
      }
      return;
    }
    const result = gen.next(data);
    if (result.done) return;
    if (result.value instanceof Function) {
      result.value(next);
    } else if (result.value && result.value.then instanceof Function) {
      result.value.then((func) => {
        func(next);
      });
    } else {
      /* eslint no-console:0 */
      console.error('result.value must be a function or promise');
    }
  };

  next();
};

export default runNext;
