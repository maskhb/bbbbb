const tableListDataSource = [];
for (let i = 0; i < 100; i += 1) {
  tableListDataSource.push({
    // 商品营销分类主键
    categoryId: i + 1,
    categoryName: `商品营销分类名称${i + 1}`,
    parentId: Math.floor(i / 5),
  });
}

function list(req, res) {
  const dataSource = [...tableListDataSource];

  const result = {
    list: dataSource,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  list,
};
