const spaceOptions = {
  ZT: [
    { label: '草稿', value: '0', key: 0 },
    { label: '已启用', value: '1', key: 1 },
    { label: '已禁用', value: '2', key: 2 },
  ],
  getLabelByValue: (name, value) => {
    let resultLabel;
    if (spaceOptions[name] instanceof Array) {
      spaceOptions[name].forEach((v) => {
        if (Number(v.value) === Number(value)) {
          resultLabel = v.label;
        }
      });
    }
    return resultLabel;
  },
};

export default spaceOptions;
