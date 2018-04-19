export default function schema(CLASS) {
  const instance = new CLASS();
  const result = {};
  for (const name of Object.getOwnPropertyNames(instance)) {
    result[name] = instance[name];
  }

  const transferFileds = [];
  /* eslint no-proto: 0 */
  for (const name of Object.getOwnPropertyNames(instance.__proto__)) {
    if (name !== 'constructor') {
      const orginName = instance.__proto__[name];
      transferFileds.push({
        orgin: name,
        name: orginName,
      });
    }
  }

  return {
    result,
    transferFileds,
  };
}
