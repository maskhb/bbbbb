import moment from 'moment';
import rules from '../services/promotionRules';

export default {
  namespace: 'promotionRules',

  state: {},

  effects: {
    *queryListAndCasadeByPage({ data }, { call, put }) {
      const response = yield call(rules.queryListAndCasadeByPage, data);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *queryDetail({ data }, { call, put }) {
      const response = yield call(rules.queryDetail, data);
      response.clientType = data.clientType === 3 ? [1, 2] : [response.clientType];
      response.time = [moment(response.startTime), moment(response.endTime)];
      response.condition = {
        conditionType: response.conditionType,
        listPromotionRuleConditionVoS: response.listPromotionRuleConditionVoResp.map((_v) => {
          const v = { ..._v };
          if (v.conditionType === 1 || v.conditionType === 2) {
            v.fullKey = (v.fullKey / 100).toFixed(2);
            v.fullValue = (v.fullValue / 100).toFixed(2);
          } else {
            v.fullKey = (v.fullKey / 100).toFixed(2);
          }

          if (v.conditionType === 4) {
            v.fullValueIds = v.fullValue;
            v.fullValue = v.fullValueName;
          }

          return v;
        }),
      };


      response.scopeType = {
        type: response.scopeType,
        listPromotionRuleCouponScopeVoS: response.listPromotionRuleCouponScopeVoResp.filter((v) => {
          return v.isOut === 1;
        }).map((_v) => {
          const v = _v;
          v.value = v.refId;
          v.label = v.refName;
          return v;
        }),
      };

      if (response.scopeType.type === 1) {
        delete response.scopeType.listPromotionRuleCouponScopeVoS;
      }

      if (response.scopeOutType === 0) {
        delete response.scopeOutType;
      } else {
        response.scopeOutType = {
          type: response.scopeOutType,
          listPromotionRuleCouponScopeVoS:
            response.listPromotionRuleCouponScopeVoResp.filter((v) => {
              return v.isOut === 2;
            }).map((_v) => {
              const v = _v;
              v.value = v.refId;
              v.label = v.refName;
              return v;
            }),
        };
      }

      if (response.scopeOutType && response.scopeOutType.type === 1) {
        delete response.scopeOutType.listPromotionRuleCouponScopeVoS;
      }

      delete response.createdTime;
      delete response.endTime;

      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(rules.save, payload);
      yield put({
        type: 'save',
        payload: {
          save: response,
        },
      });
      return response;
    },
    *update({ payload }, { call, put }) {
      const response = yield call(rules.update, payload);
      yield put({
        type: 'save',
        payload: {
          update: response,
        },
      });
      return response;
    },
    *updateStatus({ data }, { call, put }) {
      const response = yield call(rules.updateStatus, data);
      yield put({
        type: 'save',
        payload: {
          updateStatus: response,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
