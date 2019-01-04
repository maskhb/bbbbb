/**
 * 组织类型
 */
export const organizeTypeOptions = [
  {
    value: 1,
    label: '酒店门店型',
  },
  {
    value: 2,
    label: '管理架构型',
  },
];


/**
 * 组织树
 */
export const organizeTree = [
  {
    title: '纷程平台',
    key: '1',
    organizeType: 1,
    regionId: [350, 351, 352, 353],
    children: [
      { title: '伊斯登酒店集团',
        key: '1-1',
        organizeType: 1,
        regionId: [350, 351, 352, 353],
        children: [
          { title: '广东省',
            key: '1-1-1',
            organizeType: 1,
            regionId: [350, 351, 352, 353],
            children: [
              { title: '粤东片区',
                key: '1-1-1-1',
                organizeType: 1,
                regionId: [350, 351, 352, 353],
                children: [
                  { title: '阳江恒大御景湾', disabled: true, key: '1-1-1-1-1', organizeType: 2, regionId: [350, 351, 352, 353], isLeaf: true },
                  { title: '恩平恒大泉都', key: '1-1-1-1-2', organizeType: 2, regionId: [350, 351, 352, 353], isLeaf: true },
                ],
              },
            ],
          },
          { title: '广西省', key: '1-1-2', organizeType: 1, regionId: [350, 351, 352, 353] },
        ],
      },
      { title: 'XXX酒店集团',
        key: '1-2',
        organizeType: 1,
        regionId: [350, 351, 352, 353],
        children: [],
      },
    ],
  },
];

/**
 * 部门树
 */
export const departmentTree = [
  {
    title: '前厅部',
    key: '1',
    children: [
      {
        title: '前厅前台组',
        key: '1-1',
        children: [
          { title: '前厅前台早班组', key: '1-1-1' },
          { title: '前厅前台午班组', key: '1-1-2' },
          { title: '前厅前台晚班组', key: '1-1-3' },
          { title: '前厅前台早班组', key: '1-1-4' },
          { title: '前厅前台午班组', key: '1-1-5' },
          { title: '前厅前台晚班组', key: '1-1-6' },
        ],
      },
      { title: '前厅经理组', key: '1-2', children: [] },
      { title: '前厅服务组', key: '1-3', children: [] },
    ],
  },
  { title: '客房部', key: '2', children: [] },
  { title: '财务部', key: '3', children: [] },
  { title: '保安部', key: '4', children: [] },
  { title: '技术部', key: '5', children: [] },
];


/**
 * 角色组树
 */
export const roleGroupTree = [
  { title: '酒店门店型', key: '1' },
  { title: '管理架构型', key: '2' },
  { title: '南方省级专用角色组', key: '3' },
];


/**
 * 角色树
 */
export const roleListOptions = [
  { label: '项目前台', value: '1' },
  { label: '项目财务', value: '2' },
  { label: '项目管理员', value: '3' },
  { label: '南方省级管理员', value: '4' },
  { label: '南方省级区域管理', value: '5' },
  { label: '南方省级财务', value: '6' },
  { label: '南方省级市场部主管', value: '7' },
  { label: '南方省级市场部专员', value: '8' },
];

