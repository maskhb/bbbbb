export function login(req, res) {
  const result = {
    msgCode: 200,
    status: 'ok',
    data: {
      result: 'KYU0JOF1t/ooK85NvoCEkPdWJn5G5N52vJjP8r7IvyGGAQfuX9IBORqoSAfNA/xu',
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  login,
};
