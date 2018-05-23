const batchImportOptions = {
  SCZT: [
    { label: '待上传', value: '1', key: 1 },
    { label: '上传中', value: '2', key: 2 },
    { label: '上传完毕', value: '3', key: 3 },
    { label: '上传失败', value: '4', key: 4 },
  ],
  getLabelByValue: (name, value) => {
    let resultLabel;
    if (batchImportOptions[name] instanceof Array) {
      batchImportOptions[name].forEach((v) => {
        if (Number(v.value) === Number(value)) {
          resultLabel = v.label;
        }
      });
    }
    return resultLabel;
  },
};

export default batchImportOptions;
