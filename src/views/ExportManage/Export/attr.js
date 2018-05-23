const ExportOptions = {
  QQZT: [
    { label: '请求中', value: '1', key: 1 },
    { label: '生成中', value: '2', key: 2 },
    { label: '已完成', value: '3', key: 3 },
    { label: '已取消', value: '4', key: 4 },
  ],
  getLabelByValue: (name, value) => {
    let resultLabel;
    if (ExportOptions[name] instanceof Array) {
      ExportOptions[name].forEach((v) => {
        if (Number(v.value) === Number(value)) {
          resultLabel = v.label;
        }
      });
    }
    return resultLabel;
  },
};

export default ExportOptions;
