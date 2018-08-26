const dataDivide = (list = []) => {
  const data = [];
  let temp = [];
  for (const [k, v] of Object.entries(list)) {
    temp.push(v);

    const i = Number(k);
    if ((i !== 0 && i % 3 === 2) || i === list.length - 1) {
      data.push(temp);
      temp = [];
    }
  }
  return data;
};

export default dataDivide;
