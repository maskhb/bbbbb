import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, message, Popover, Icon, Button } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import FooterToolbar from 'components/FooterToolbar';
import _ from 'lodash';
import { goTo } from 'utils/utils';
import BasicInfo from './BasicInfo';
import SpaceAndGoods from './SpaceAndGoods';
import GraphicDescription from './GraphicDescription';
import styles from '../style.less';

const runNext = (gen) => {
  const next = (err, data) => {
    if (err) {
      if (typeof err === 'string') {
        return message.error(err);
      } else if (err.content) {
        return message.error(err.content, err.duration || 3, err.onClose);
      }
      return;
    }
    const result = gen.next(data);
    if (result.done) return;
    if (result.value instanceof Function) {
      result.value(next);
    } else if (result.value && result.value.then instanceof Function) {
      result.value.then((func) => {
        func(next);
      });
    } else {
      /* eslint no-console:0 */
      console.error('result.value must be a function or promise');
    }
  };

  next();
};

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型',
};

@connect(({ goodsPackage, loading }) => ({
  goodsPackage,
  submitting: loading.effects['goodsPackage/add'] || loading.effects['goodsPackage/update'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {};

  state = {};

  componentDidMount() {
    const { dispatch, match: { params: { packageId } } } = this.props;
    if (Number(packageId) !== 0) {
      dispatch({
        type: 'goodsPackage/detail',
        payload: { packageId },
      });
    }

    dispatch({
      type: 'goodsPackage/queryTagList',
      payload: {
        tagType: 1,
      },
    });

    dispatch({
      type: 'goodsPackage/queryTagList',
      payload: {
        tagType: 2,
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'goodsPackage/resetDetail',
      payload: {},
    });
  }

  checkSpaceLength(p) {
    console.log(this) //eslint-disable-line
    if (!p.packageSpaceVoQs?.length) {
      return next => next('请至少选择一个空间');
    }
    return next => next('', p);
  }

  checkGoodsDefault(p) {
    console.log(this) //eslint-disable-line
    const goodsError = p.packageSpaceVoQs.find((item) => {
      return item.packageGoodsList?.length === 0 ||
        !_.find(item.packageGoodsList, (good) => {
          return good.isDefault;
        });
    });

    if (goodsError) {
      return next => next('每个空间下是否至少有一个默认SKU');
    }
    return next => next('', p);
  }

  checkSKUPrice=(p) => {
    const skuIdList = {};
    let goodsLen = 0;
    p.packageSpaceVoQs.forEach((item) => {
      item.packageGoodsList.forEach((good) => {
        goodsLen += 1;
        if (!skuIdList[`skuId_${good.skuId}`]) {
          skuIdList[`skuId_${good.skuId}`] = {
            id: good.skuId,
            skuCode: good.skuCode,
            property: good.property,
            value: [{ spaceName: item.name, packagePrice: good.packagePrice }],
          };
        } else {
          skuIdList[`skuId_${good.skuId}`].value.push({
            spaceName: item.name,
            packagePrice: good.packagePrice,
          });
        }
      });
    });

    let multiSkuIdList = [];
    if (Object.keys(skuIdList).length !== goodsLen) {
      multiSkuIdList = _.values(skuIdList).filter((item) => {
        return _.uniqBy(item.value, 'packagePrice').length > 1;
      });
    }

    if (multiSkuIdList.length > 0) {
      return next => next({
        content: (
          <div>
            <div style={{ fontWeight: 'bold', lineHeight: '25px' }}>以下SKU价格不一致，不允许保存</div>
            {
              multiSkuIdList.map((item) => {
                return (
                  <p key={item.id} style={{ maxWidth: 500, textAlign: 'left', marginBottom: 5 }}>
                    sku编码：{item.skuCode}，规格信息：{item.property}，所在空间：{item.value.map((v, index) => `${index > 0 ? '，' : ''}${v.spaceName}`)}
                  </p>
                );
              })
            }
          </div>
        ),
        duration: 10,
      });
    }
    return next => next('', p);
  }

  showSubmitSuccess = () => {
    const { pathname } = this.props.location;
    const isAdd = pathname.match('/add');
    const { add, update } = this.props.goodsPackage;

    if ((isAdd ? add : update) === 'success') {
      message.success('提交成功', 1, () => {
        goTo(pathname.split('/list')[0]);
      });
    }
    return next => next('');
  }

  doSave = async (p) => {
    const { dispatch } = this.props;
    const { pathname } = this.props.location;
    const isAdd = pathname.match('/add');

    await dispatch({
      type: `goodsPackage/${isAdd ? 'add' : 'update'}`,
      payload: p,
    });
    return next => next('', p);
  }

  * doSubmitOperate(values) {
    const { goodsPackage } = this.props;
    const p = {
      ...goodsPackage.detail,
      ..._.pickBy(values, value => value !== undefined) || [],
    };
    yield this.checkSpaceLength(p);
    yield this.checkGoodsDefault(p);
    yield this.checkSKUPrice(p);
    p.houseTypeTags = p.arrHouseTypeTags?.join(';');
    yield this.doSave(p);
    yield this.showSubmitSuccess();
  }

  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const gen = this.doSubmitOperate(values);

        runNext(gen);
      }
    });
  }

  render() {
    const {
      form, submitting, dispatch, goodsPackage,
      match: { params: { packageId } },
    } = this.props;
    const { getFieldsError } = form;
    const { location } = this.props;

    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };

    const merchantId = form.getFieldValue('merchantId');
    const { merchantName } = goodsPackage?.detail || {};

    return (
      <PageHeaderLayout>
        <BasicInfo
          form={form}
          dispatch={dispatch}
          goodsPackage={goodsPackage}
          location={location}
          packageId={packageId}
        />
        <SpaceAndGoods
          form={form}
          dispatch={dispatch}
          goodsPackage={goodsPackage}
          location={location}
          packageId={packageId}
          disabled={!merchantId && !merchantName}
        />
        <GraphicDescription
          form={form}
          dispatch={dispatch}
          goodsPackage={goodsPackage}
          location={location}
          packageId={packageId}
          editorRef={(inst) => {
            this.editor = inst;
          }}
        />
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
