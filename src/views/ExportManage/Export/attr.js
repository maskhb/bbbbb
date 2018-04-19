const ExportOptions = {
  QQZT: [
    { label: '已完成', value: '1', key: 1 },
    { label: '请求中', value: '2', key: 2 },
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

export default ExportOptions;
