import mockjs from 'mockjs';

const queryListByPage = (req, res) => {
  const params = res.type === 'GET' ? req.params : req.body;

  const result = mockjs.mock({
    'dataList|10-100': [{
      album: [
        '@image()',
      ],
      auditOpinion: '@cword()',
      auditStatus: '@integer(0,2)',
      createdBy: new Date().getTime(),
      createdTime: new Date().getTime(),
      'decorateStyleTShow|1-10': [
        {
          createdBy: new Date().getTime(),
          createdTime: new Date().getTime(),
          isDelete: '@integer(0,1)',
          isSelect: '@integer(0,1)',
          orderNum: '@integer(0,100)',
          remark: '@cparagraph()',
          status: '@integer(0,2)',
          tagDesc: '@cparagraph()',
          tagId: '@integer(0,100)',
          tagName: '@cword()',
          tagType: '@integer(0,2)',
          updatedBy: new Date().getTime(),
          updatedTime: new Date().getTime(),
        },
      ],
      decorateStyleTagId: 0,
      'houseTypeShow|1-10': [
        {
          createdBy: '@integer(0,100)',
          createdTime: new Date().getTime(),
          isDelete: '@integer(0,1)',
          isSelect: '@integer(0,1)',
          orderNum: '@integer(0,100)',
          remark: '@cparagraph()',
          status: '@integer(0,2)',
          tagDesc: '@cparagraph()',
          tagId: '@integer(0,100)',
          tagName: '@cword()',
          tagType: '@integer(0,2)',
          updatedBy: new Date().getTime(),
          updatedTime: new Date().getTime(),
        },
      ],
      houseTypeTags: 'string',
      isDelete: 0,
      isTop: 0,
      mainImgUrl: 'string',
      merchantId: 0,
      minPrice: 0,
      orderNum: 0,
      packageDesc: 'string',
      packageDetail: 'string',
      packageId: 0,
      packageName: 'string',
      packageShortName: 'string',
      'packageSpaceVoQs|1-10': [
        {
          createdBy: 0,
          createdTime: new Date().getTime(),
          packageId: '@integer(0,100)',
          packageSpaceId: 0,
          spaceId: '@integer(0,100)',
          spaceName: 'string',
          updatedBy: 0,
        },
      ],
      packageUrl: '@image()',
      status: '@integer(0,2)',
      threeDimenUrl: '@image()',
      totalPrice: '@integer(0,100000)',
      updatedBy: new Date().getTime(),
    }],
    pageSize: params.pageSize,
  });

  result.totalCount = result.dataList.length;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

export default {
  queryListByPage,
};
