/* eslint-disable */

/**
 * Generates the cartesian product of the sets.
 * @param {...(Array|String)} sets - letiable number of sets of n elements.
 * @returns {Generator} yields each product as an array
 */
function* cartesian(...sets) {
  let that = this;
  let data = [];
  yield* cartesianUtil(0);

  function* cartesianUtil(index) {
    if (index === sets.length) {
      return yield that.clones ? data.slice() : data;
    }
    for (let i = 0; i < sets[index].length; i++) {
      data[index] = sets[index][i];
      yield* cartesianUtil(index + 1);
    }
  }
};

const G  = {};
G.cartesian = cartesian;

export default G;
