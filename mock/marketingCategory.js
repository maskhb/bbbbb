function list(req, res) {
  const result = {
    list: [
      {
        value: '1',
        label: '1',
        children: [
          {
            value: '11',
            label: '11',
            children: [
              {
                value: '111',
                label: '111',
              },
            ],
          },
          {
            value: '12',
            label: '12',
          },
        ],
      },
      {
        value: '2',
        label: '2',
      },
    ],
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
