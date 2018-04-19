import centra from './centra';

function formatter(data) {
  return data.map((item) => {
    return {
      ...item,
      children: formatter(item.children),
    };
  });
}

export const getMenuData = () => formatter(centra());
