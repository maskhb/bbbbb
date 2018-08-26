const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    aliasName: `空间${i + 1}`,
    categorys: 'string',
    createdBy: 0,
    createdTime: Date.now(),
    isDelete: 0,
    name: `空间名称${i + 1}`,
    orderNum: 0,
    remark: 'string',
    spaceId: i + 1,
    status: Math.floor(Math.random() * 10) % 3,
    updatedBy: 0,
    updatedTime: Date.now(),
  });
}

function list(req, res) {
  const params = req.method === 'GET' ? req.params : req.body;

  let dataSource = [...tableListDataSource];

  if (params.status || params.status === 0) {
    const paramStatus = String(params.status).split(',').map(v => Number(v));
    dataSource = dataSource.filter(data => paramStatus.includes(data.status));
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      currPage: parseInt(params.currPage, 10) || 1,
    },
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
