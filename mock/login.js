export function login(req, res) {
  const result = {
    msgCode: 200,
    status: 'ok',
    data: {
      result: 'cAqdYVTJ37dEmDO7nfqkTAIUuuzOWSqWG9dOrD66/OCGAQfuX9IBORqoSAfNA/xu',
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
