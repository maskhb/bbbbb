import { add } from 'utils/number';
import _ from 'lodash';
/**
 * 计算当前套餐总价
 * @param detail
 * @returns {*}
 */
export const getTotal = (detail) => {
  return _.reduce(detail?.packageSpaceVoQs, (sum, item) =>
    add(sum, _.reduce(_.filter(item?.packageGoodsList, (good) => {
      return good.isDefault;
    }), (s, good) =>
      add(s, good.packagePrice || 0), 0))
    , 0);
};
