const channelOptions = {
  DQST: [
    { label: '按价格代码查看', value: '1', key: 1 },
    { label: '按房型查看', value: '2', key: 2 },
  ],
  getLabelByValue: (name, value) => {
    let resultLabel;
    if (channelOptions[name] instanceof Array) {
      channelOptions[name].forEach((v) => {
        if (Number(v.value) === Number(value)) {
          resultLabel = v.label;
        }
      });
    }
    return resultLabel;
  },
};

export default channelOptions;
