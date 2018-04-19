import joi from 'joi';
import remote from 'utils/schema/remoteDecorator';
import templates from 'utils/schema/templates';
import schema from 'utils/schema/schema';
import { ENABLESTATUSOBJECT } from 'components/Status/enable';

// const filed = (name, description) => {
//   console.log(name, description);
//   return name;
// };
// 商品品牌
class GoodsBrand {
  @remote('brandId')
  id = joi.number().required();
  @remote('')
  name = joi.string();
  @remote('')
  logo = joi.string();
  @remote('')
  orderNum = joi.number();
  @remote('')
  status = joi.number().required().valid(Object.keys(ENABLESTATUSOBJECT).map(i => Number(i)));
  @remote('')
  createdTime = joi.number();
  @remote('createdByName')
  createrName = joi.string();
  @remote('')
  url = joi.string();
}

const { result, transferFileds } = schema(GoodsBrand);
const detail = joi.object(result);

export default {
  detail,
  transferFileds,
  list: templates.list(detail),
};
