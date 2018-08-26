const ENABLESTATUS = {
  ENABLE: {
    text: '启用',
    value: 1,
    color: 'success',
  },
  DISENABLE: {
    text: '禁用',
    value: 2,
    color: 'error',
  },
  DRAFT: {
    text: '草稿',
    value: 3,
    color: 'default',
  },
};
export function getStatus(val) {
  return Object.values(ENABLESTATUS).find(
    ({ value }) => value === Number(val))?.text;
}

export default ENABLESTATUS;
