export default (list, val, fieldId, fieldParentId, fieldName) => {
  const loop = (id, field) => {
    for (const item of Object.values(list || [])) {
      if (id === item[field]) {
        return {
          id: item[fieldId],
          name: item[fieldName],
        };
      }
    }

    return {
      id: null,
      name: '',
    };
  };
  const { name } = loop(val, fieldId);
  const { id: secondId, name: secondName } = loop(val, fieldParentId);
  const { name: thirdName } = loop(secondId, fieldParentId);

  return `${thirdName}${secondName ? ' > ' : ''}${secondName}${name ? ' > ' : ''}${name}`;
};
