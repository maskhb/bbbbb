const spaceOptions = {
  ZT: [
    { label: '草稿', value: '1', key: 1 },
    { label: '已启用', value: '2', key: 2 },
    { label: '已禁用', value: '3', key: 3 },
    { label: '已删除', value: '4', key: 4 },
  ],
  getLabelByValue: (name, value) => {
    if (this[name]) {
      this[name].forEach((v) => {
        if (Number(v.value) === Number(value)) {
          return v.label;
        }
      });
    }
  },
};

export default spaceOptions;
