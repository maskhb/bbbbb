import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Row, Cascader, Select, message, Spin, Icon, Checkbox } from 'antd';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import { OPERPORT_JIAJU_PRODUCTLIST_EDIT } from 'config/permission';
import { goTo } from 'utils/utils';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import flat2nested from 'components/Flat2nested';
import { d3Col0, d3Col1, d3Col2 } from 'components/Const';
import { MonitorInput, rules } from 'components/input';
import MonitorInputGoods from 'components/input/MonitorInputGoods';
import Editor from 'components/Editor';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import { GoodsType } from 'components/Enum/GoodsType';
import { listToOptions, optionsToHtml, enumToHtml } from 'components/DataTransfer';
import SelectSearchConnectFactory from 'components/SelectSearchConnect/Factory';
import SelectSearchConnectMerchant from 'components/SelectSearchConnect/MerchantNoSearch';
import AUDITSTATUS from 'components/AuditStatus';
import InputSelectGroup from './InputSelectGroup';
import BasePropsCard from './BasePropsCard';
import SkuCard from './SkuCard';
import ImageCard from './ImageCard';
import fieldLabels from './fieldLabels';
import OperateRecordCard from './OperateRecordCard';
import './Detail.less';

const CheckboxGroup = Checkbox.Group;

@connect(({ user, business, goods, goodsCategory, goodsBrand, goodsCategoryBrand,
  propertyKey, marketingCategory, space, loading }) => ({
  user,
  business,
  goods,
  goodsCategory,
  goodsBrand,
  goodsCategoryBrand,
  propertyKey,
  marketingCategory,
  space,
  loading,
  submitting: loading.effects['goods/add'] || loading.effects['goods/edit'],
  fetchingBusinessList: loading.effects['business/queryList'],
}))
@Form.create()
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.emitterUid = uuidv4();
  }

  state = {
    pattern: 'detail',
    currentFactoryId: null, // 当前厂商ID，用于处理商家
    currentGoodsCategory: {}, // 确定商品分类后，得到商品分类详情：基本/规格属性组ID等
    initalFieldsValue: {},
  };

  componentWillMount() {
    const { match: { params: { id } }, user } = this.props;
    const userMerchantId = user?.merchant?.merchantId;
    const userMerchantType = user?.merchant?.merchantType;
    const isFactory = userMerchantId && userMerchantType === 1;
    const isSmallBusiness = userMerchantId && userMerchantType === 3;

    this.setState({
      pattern: Number(id) === 0 ? 'add' : 'detail',
    });

    if (isFactory || isSmallBusiness) {
      this.setState({
        currentFactoryId: userMerchantId,
      });
    }
  }

  componentDidMount = async () => {
    const { dispatch, match: { params: { id } } } = this.props;
    const me = this;

    if (Number(id) !== 0) {
      await dispatch({
        type: 'goods/detail',
        payload: { goodsId: Number(id) },
      });

      const { goods } = this.props;
      const detail = goods?.[`detail${id}`];

      this.setState({
        currentFactoryId: detail?.factoryId,
      });

      // 厂家
      dispatch({
        type: 'business/queryUnionMerchantList',
        payload: {
          merchantTypeList: [1, 3],
          merchantName: detail?.factoryName,
        },
      });

      me.handleFactoryChange(detail?.factoryId, false); // 选中厂家

      // 商家
      dispatch({
        type: 'business/queryMerchantOfUnionList',
        payload: {
          merchantTypeList: [2],
          unionMerchantId: detail?.factoryId,
        },
      });

      me.handleMemchantChange(detail?.merchantId, false); // 选中商家

      // 全部商品分类
      await dispatch({
        type: 'goodsCategory/list',
        payload: {},
      });

      const { goodsCategory } = this.props;

      const values = [];
      const loop = (loopId) => {
        const result = _.find(goodsCategory?.list || [],
          v => v.categoryId === loopId);

        if (result) {
          values.push(result.categoryId);
        }

        if (result && result.parentId !== 0) {
          return loop(result.parentId);
        } else {
          return result;
        }
      };

      loop(detail?.goodsCategoryId);

      // 商品分类下的品牌、基本属性、sku属性
      me.handleGoodsCategoryChange(values.reverse(), false);

      // 所属商家下的营销分类
      dispatch({
        type: 'marketingCategory/list',
        payload: {
          merchantId: detail?.merchantId,
        },
      });
    }
  }

  handlePatternChange = () => {
    const { form } = this.props;
    const { pattern, initalFieldsValue } = this.state;

    // 缓存详情数据
    if (!initalFieldsValue || _.isEmpty(initalFieldsValue)) {
      this.setState({
        initalFieldsValue: form.getFieldsValue(),
      });
    }

    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });

    // 重置数据
    if (pattern === 'edit') {
      form.setFieldsValue(initalFieldsValue);
    }
  }

  // 提交
  handleSubmit = () => {
    const { form, dispatch, business, match: { params: { id } } } = this.props;
    const { pattern, currentGoodsCategory, currentFactoryId } = this.state;
    const { validateFieldsAndScroll } = form;
    const businessList = _.compact(_.concat(business?.queryUnionMerchantList?.list,
      business?.[`queryMerchantOfUnionList${currentFactoryId}`]?.list)) || [];

    const goodsDetail = this.editor.getCurrentContent();

    // 排除验证字段：sku属性
    const fileds = Object.keys(form.getFieldsValue()).filter(f => !(f.match(/skuProp_/) || f.match(/fileList_/)));
    validateFieldsAndScroll(fileds, (error, values) => {
      const params = {
        ...values,
        goodsDetail,
        goodsName: _.trim(values.goodsName),
        factoryId: values.factoryId ? Number(values.factoryId) : undefined,
        merchantId: values.merchantId ? Number(values.merchantId) : undefined,
        merchantName: businessList?.find(v => v?.merchantId === values.merchantId)?.merchantName,
        goodsCategoryId: values.goodsCategoryId?.[values.goodsCategoryId.length - 1],
        marketingCategoryId: values.marketingCategoryId?.[values.marketingCategoryId.length - 1],
        serviceTime: values.afterSaleServiceTime?.number,
        serviceType: values.afterSaleServiceTime?.unit,
        basePropertyGroupId: currentGoodsCategory?.basePropertyGroupId,
        propertyGroupId: currentGoodsCategory?.propertyGroupId,
      };

      if (params.goodsCategoryId instanceof Array) {
        // eslint-disable-next-line
        params.goodsCategoryId = params.goodsCategoryId[0];
      }

      delete params.afterSaleServiceTime;

      // 处理基本属性
      const goodsPropertyRelationVoSList = [];
      for (const [key, value] of Object.entries(values)) {
        const matchKey = key.match(/baseProp_(\w+)/);
        if (matchKey) {
          goodsPropertyRelationVoSList.push({
            // 属性组ID
            propertyGroupId: currentGoodsCategory?.basePropertyGroupId,
            // 属性ID
            propertyKeyId: Number(matchKey[1]),
            // 属性名称
            // propertyKey: '',
            // 属性值id
            propertyValueId: typeof value === 'number' || typeof value === 'string'
              ? [value].join()
              : value?.constructor?.name === 'Array'
                ? value.join()
                : '',
            // 属性值名称
            // propertyValue: '',
          });
          delete params[key];
        }
      }
      params.goodsPropertyRelationVoSList = goodsPropertyRelationVoSList;
      delete params.basePropList;
      // 对参数进行处理

      // 处理图片
      params.goodsImgGroupVoList = params.goodsImgGroupVoList?.imageGroups.map((img) => {
        const r = { ...img };
        r.id = r.imgGroupId;
        r.imgGroupId = 0;
        r.goodsImgVoList = r.goodsImgVoList.map((i) => { return { imgUrl: i, isMain: 0 }; });
        delete r.enableDelete;
        return r;
      });

      params.delSkuIds = params.goodsSkuVoList?.delSkuIds;

      // 处理sku
      params.goodsSkuVoList = params.goodsSkuVoList?.goodsSkuVoList.map((v) => {
        const r = {};

        for (const [key, val] of Object.entries(v)) {
          if (!key.match(/skuProp_/)) {
            r[key] = val;
          }
        }
        r.id = r.imgGroupId;

        delete r.imgGroupId;
        if (typeof r.skuId === 'string' && r.skuId.match('-')) {
          delete r.skuId;
        }

        r.supplyPrice *= 100;
        r.discountPrice *= 100;
        r.salePrice *= 100;
        r.marketPrice *= 100;

        return r;
      });

      if (_.find(params.goodsSkuVoList, (v) => {
        return !(v.supplyPrice <= v.discountPrice
          && v.discountPrice <= v.salePrice
          && v.salePrice <= v.marketPrice);
      })) {
        message.error('供货价<=折扣价<=售价<=市场价!');
        return;
      }

      if (pattern === 'edit') {
        params.goodsId = Number(id);
      }
      if (!error) {
        dispatch({
          type: pattern === 'add' ? 'goods/add' : 'goods/edit',
          payload: params,
        }).then((res) => {
          if (res) {
            message.success('提交成功。');
            goTo('/goods/list');
          }
        });
      }
    });
  }

  // 选中 - 厂家
  handleFactoryChange = async (value, reset = true) => {
    this.setState({
      currentFactoryId: Number(value),
    });

    const { dispatch, form } = this.props;
    // 清空 - 商家
    if (reset) {
      form.resetFields('merchantId');
      form.setFieldsValue({
        merchantId: null,
      });
    }
    // 清空 - 商家 搜索数据

    // this.merchantRef?.reset();
    // 获取厂家下的 - 商家
    // 缺省，目前需要输入才可以获取

    // 商家变动的联动效果

    // 清空 - 商品分类
    if (reset) {
      form.resetFields('goodsCategoryId');
      form.setFieldsValue({
        goodsCategoryId: null,
      });
    }

    await dispatch({
      type: 'business/queryMerchantOfUnionList',
      payload: {
        merchantTypeList: [2],
        unionMerchantId: Number(value),
      },
    });

    // 获取厂家下的 - 商品分类ids
    // 获取所有分类，根据ids筛选

    await dispatch({
      type: 'business/queryDetailAll',
      payload: {
        merchantId: Number(value),
      },
    });

    await dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });
  }

  // 选中 - 商家
  handleMemchantChange = (value, reset = true) => {
    const { dispatch, form } = this.props;

    // 清空 - 营销分类
    if (reset) {
      form.resetFields('marketingCategoryId');
      form.setFieldsValue({
        marketingCategoryId: null,
      });
    }

    // 获取所属商家下的 - 营销分类
    dispatch({
      type: 'marketingCategory/list',
      payload: {
        merchantId: Number(value),
      },
    });
  }

  // 选中 - 商品分类
  handleGoodsCategoryChange = (value, reset) => {
    const { dispatch, goodsCategory } = this.props;

    // 选中的最后一级分类
    const goodsCategoryId = value[value.length - 1];
    // 选中的最后一级分类 - 对象
    const currentGoodsCategory = _.find(goodsCategory?.list,
      v => v.categoryId === goodsCategoryId);

    this.setState({ currentGoodsCategory });

    if (value.length && currentGoodsCategory) {
      if (reset) {
        const { form } = this.props;
        // 清空 - 品牌
        form.resetFields('brandId');
        form.setFieldsValue({
          brandId: null,
        });

        // 清空 - 适用空间
        form.resetFields('spaceIds');
        form.setFieldsValue({
          spaceIds: [],
        });
      }

      // 获取分类下的 - 品牌
      dispatch({
        type: 'goodsCategoryBrand/listOnlyBond',
        payload: {
          categoryId: value[0],
          pageInfo: {
            currPage: 1,
            pageSize: 9999,
          },
        },
      });

      // 获取分类下的 - 适用空间
      dispatch({
        type: 'space/listByCategoryId',
        payload: {
          categoryId: value[0],
        },
      });

      // 获取分类下的 - 基本属性组的全部属性
      if (currentGoodsCategory?.basePropertyGroupId) {
        dispatch({
          type: 'propertyKey/list',
          payload: {
            propertyGroupId: currentGoodsCategory?.basePropertyGroupId,
            pageInfo: {
              currPage: 1,
              pageSize: 9999,
            },
          },
        });
      }

      // 获取分类下的 - 规格属性组的全部属性
      if (currentGoodsCategory?.propertyGroupId) {
        dispatch({
          type: 'propertyKey/list',
          payload: {
            propertyGroupId: currentGoodsCategory?.propertyGroupId,
            pageInfo: {
              currPage: 1,
              pageSize: 9999,
            },
          },
        });
      }
    }
  }

  render() {
    const { form, loading, submitting, user, goods, business,
      goodsCategoryBrand, propertyKey, goodsCategory, marketingCategory, space,
      match: { params: { id } }, audit } = this.props;
    const { pattern, currentGoodsCategory, currentFactoryId } = this.state;
    const disabled = pattern === 'detail';
    const detail = goods?.[`detail${id}`];
    const unionBusinessList = business?.queryUnionMerchantList?.list || [];
    let businessList = business?.[`queryMerchantOfUnionList${currentFactoryId}`]?.list || [];
    const goodsCategoryBrandList = goodsCategoryBrand?.listOnlyBond?.list || [];
    const basePropsListByCategory =
      propertyKey?.[currentGoodsCategory?.basePropertyGroupId]?.list || [];
    const skuPropsListByCategory = propertyKey?.[currentGoodsCategory?.propertyGroupId]?.list || [];

    const userMerchantId = user?.merchant?.merchantId; // 登录用户的商家id
    const userMerchantType = user?.merchant?.merchantType; // 登录用户的商家id
    const isFactory = userMerchantId && userMerchantType === 1; // 是厂家
    const partEdit = detail?.isCopy === 2; // 部分编辑

    // 厂家可以给自己新建商品
    if (currentFactoryId &&
      !businessList?.find(v => v.merchantId === currentFactoryId)) {
      const unionObj = unionBusinessList.find(v => v.merchantId === currentFactoryId);
      if (unionObj) {
        businessList = _.concat(unionObj, businessList);
      }
    }

    // 所属厂家 - 名称
    let factoryName = unionBusinessList.find(v =>
      v.merchantId === detail?.factoryId)?.merchantName;

    if (isFactory) {
      factoryName = user?.merchant?.merchantName;
    }

    const { merchantName = '' } = businessList.find(v =>
      v.merchantId === detail?.merchantId) || {};

    const currentMerchantId = form.getFieldsValue()?.merchantId;

    const getCategoryName = (list, detailId = '', listId = 'categoryId') => {
      const currentCategory = list.find(v => v.value === detail?.[detailId]);
      const parent = list.find(v => v.value === currentCategory?.parentId);

      let preParentId = 0;
      let firstParentId = 0;
      let preParent = {};
      let firstParent = {};
      if (parent?.parentId !== 0) {
        preParentId = list.find(v => v.value === parent?.[listId])?.parentId;
        preParent = list.find(v => v.value === preParentId);
      }

      if (preParent?.parentId !== 0) {
        firstParentId = list.find(v => v.value === preParent?.[listId])?.parentId;
        firstParent = list.find(v => v.value === firstParentId);
      }

      return `${firstParent?.label ? `${firstParent?.label} > ` : ''}${preParent?.label ? `${preParent?.label} > ` : ''}${parent?.label ? `${parent?.label} > ` : ''}${currentCategory?.label ? currentCategory?.label : ''}`;
    };

    const getCategoryIds = (list, detailId = '', listId = 'categoryId') => {
      const currentCategory = list.find(v => v.value === detail?.[detailId]);
      const parent = list.find(v => v.value === currentCategory?.parentId);

      let preParentId = 0;
      let firstParentId = 0;
      let preParent = {};
      let firstParent = {};
      if (parent?.parentId !== 0) {
        preParentId = list.find(v => v.value === parent?.[listId])?.parentId;
        preParent = list.find(v => v.value === preParentId);
      }

      if (preParent?.parentId !== 0) {
        firstParentId = list.find(v => v.value === preParent?.[listId])?.parentId;
        firstParent = list.find(v => v.value === firstParentId);
      }

      return _.compact([firstParent?.value, preParent?.value,
        parent?.value, currentCategory?.value]);
    };

    // 商品分类 - id集合
    const idsByFactory = business?.details?.merchantOperateScopeVoList?.map(v => v.goodsCategoryId);
    // 商品分类 - 含子级
    const goodsCategoryCascaderOptions = flat2nested(goodsCategory?.list || [], { id: 'categoryId', parentId: 'parentId' }, item => item.status !== 1)
      .filter(v => idsByFactory?.includes(v.categoryId));
    // 商品分类 - 名称
    const goodsCategoryName = getCategoryName(goodsCategory?.list || [], 'goodsCategoryId');
    // 商品分类 - id
    const goodsCategoryIds = getCategoryIds(goodsCategory?.list || [], 'goodsCategoryId');

    // 商品品牌
    const goodsBrandOptionsHtml = optionsToHtml(listToOptions(
      goodsCategoryBrandList,
      'brandId',
      'brandName',
    ));
    // 商品品牌 - 名称
    const goodsBrandName = goodsCategoryBrandList.find(v =>
      v.brandId === detail?.brandId)?.brandName;

    // 商品类型
    const goodsTypeOptionsHtml = enumToHtml(GoodsType);
    // 商品类型 - 名称
    const goodsTypeName = Object.entries(GoodsType).find(([k]) =>
      Number(k) === detail?.goodsType)?.[1];

    // 营销分类
    const marketingCategoryOptions = flat2nested(marketingCategory?.list || [], { id: 'categoryId', parentId: 'parentId' });
    // 营销分类 - 名称
    const marketingCategoryName = getCategoryName(marketingCategory?.list || [], 'marketingCategoryId');
    // 营销分类 - ids
    const marketingCategoryIds = getCategoryIds(marketingCategory?.list || [], 'marketingCategoryId');

    // 售后服务时间
    const numberUnit = {
      number: detail?.serviceTime || '',
      unit: detail?.serviceType || '',
    };

    // 售后服务时间 - 名称
    const numberUnitName = detail?.serviceTime && detail?.serviceType
      ? `${detail?.serviceTime}${['未知', '日', '月', '年'][detail?.serviceType] || '--'}`
      : '';

    // 适用空间
    const spaceOptions = listToOptions(
      space?.listByCategoryId || [],
      'spaceId',
      'name',
    );

    // 基本属性 - 可选列表
    const basePropChoiceList = _.orderBy(basePropsListByCategory.filter(
      item => item.propertyGroupId === currentGoodsCategory?.basePropertyGroupId
        || detail?.basePropertyGroupId), ['orderNum', 'propertyKeyId'], ['desc', 'asc']);

    // 基本属性 - 当前值
    const basePropList = detail?.goodsPropertyRelationVoSList || [];
    // 基本属性
    const baseProp = {
      list: basePropList,
      choiceList: basePropChoiceList,
    };

    // sku属性 - 可选列表
    const skuPropsChiceList = _.sortBy(skuPropsListByCategory.filter(item =>
      item.propertyGroupId === currentGoodsCategory?.propertyGroupId
      || detail?.propertyGroupId)?.map(((p) => {
      const r = p;

      for (const cp of (detail?.customProperyList || []).filter(v =>
        v.propertyKeyId === p.propertyKeyId)) {
        r.propertyValuesIds = _.union(r.propertyValuesIds.split(','), [`c-${cp.propertyValueId}`]).join(',');
        r.propertyValuesAll = _.union(r.propertyValuesAll.split(','), [`c-${cp.propertyValue}`]).join(',');
      }

      return r;
    })), ['propertyKeyId']);

    const skuProp = {
      goodsSkuVoList: [
        ...detail?.goodsSkuVoList?.map((sku) => {
          return {
            ...sku,
            supplyPrice: sku.supplyPrice / 100,
            discountPrice: sku.discountPrice / 100,
            salePrice: sku.salePrice / 100,
            marketPrice: sku.marketPrice / 100,
            skuPropertyRelationVoSList: _.sortBy(sku.skuPropertyRelationVoSList, ['propertyKeyId']),
          };
        }) || [],
      ],
      choiceList: skuPropsChiceList,
      delSkuIds: [],
    };

    // 图片组
    const imgCard = {
      imageGroups: detail?.goodsImgGroupVoList || [],
    };

    const indicator = <Icon type="loading" style={{ fontSize: 12, position: 'absolute', top: 4 }} spin />;

    return (
      <PageHeaderLayout>
        <Card
          title="基本信息"
          styleName="card"
          bordered={false}
          loading={pattern === 'detail' && (!!loading.effects['goods/detail']
            || !!loading.effects['business/queryUnionMerchantList']
            || !!loading.effects['business/queryMerchantOfUnionList']
            || !!loading.effects['goodsCategoryBrand/listOnlyBond']
            || !!loading.effects['business/queryDetailAll']
            || !!loading.effects['goodsCategory/list']
            || !!loading.effects['marketingCategory/list']
            || !!loading.effects['space/listByCategoryId'])}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item
                  label={
                    <span>所属厂家
                      <Spin indicator={indicator} spinning={!!loading.effects['business/queryUnionMerchantList']} />
                    </span>
                  }
                >
                  {form.getFieldDecorator('factoryId', {
                    rules: [{
                      required: true, message: '请填写所属厂家',
                    }],
                    initialValue: detail?.factoryId,
                  })(
                    pattern === 'detail' || pattern === 'edit' || isFactory
                      ? <span>{factoryName}</span>
                      : (
                        <SelectSearchConnectFactory
                          dataSource={unionBusinessList}
                          onChange={this.handleFactoryChange}
                        />
                      )
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item
                  label={
                    <span>所属商家
                      <Spin indicator={indicator} spinning={!!loading.effects['business/queryMerchantOfUnionList']} />
                    </span>
                  }
                >
                  {form.getFieldDecorator('merchantId', {
                    rules: [{
                      required: true, message: '请填写所属商家',
                    }],
                    initialValue: detail?.merchantId,
                  })(
                    pattern === 'detail' || pattern === 'edit' || !(currentFactoryId || detail?.factoryId)
                      ? <span>{merchantName}</span>
                      : (
                        <SelectSearchConnectMerchant
                          unionMerchantId={currentFactoryId}
                          dataSource={businessList}
                          placeholder={!currentFactoryId ? '请先选择厂家' : ''}
                          onChange={this.handleMemchantChange}
                        />
                      )
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item
                  label={
                    <span>商品分类
                      <Spin indicator={indicator} spinning={!!loading.effects['business/queryDetailAll'] || !!loading.effects['goodsCategory/list']} />
                    </span>
                  }
                >
                  {form.getFieldDecorator('goodsCategoryId', {
                    rules: [{
                      required: true, message: '请输入商品分类',
                    }],
                    initialValue: goodsCategoryIds || null,
                  })(
                    pattern === 'detail' || pattern === 'edit' || !(currentFactoryId || detail?.factoryId)
                      ? <span>{goodsCategoryName}</span>
                      : (
                        <Cascader
                          options={goodsCategoryCascaderOptions}
                          placeholder={!currentFactoryId ? '请先选择厂家' : ''}
                          onChange={this.handleGoodsCategoryChange}
                          changeOnSelect
                        />
                      )
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item
                  label={
                    <span>商品品牌
                      <Spin indicator={indicator} spinning={!!loading.effects['goodsCategoryBrand/listOnlyBond']} />
                    </span>
                  }
                >
                  {form.getFieldDecorator('brandId', {
                    rules: [{
                      required: true, message: '请填写商品品牌',
                    }],
                    initialValue: detail?.brandId,
                  })(
                    pattern === 'detail' || (pattern === 'edit' && partEdit)
                      ? <span>{goodsBrandName}</span>
                      : (
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          placeholder={!goodsCategoryBrandList.length ? '请先选择商品分类' : ''}
                          disabled={!goodsCategoryBrandList.length || disabled}
                        >
                          {goodsBrandOptionsHtml}
                        </Select>
                      )
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品类型">
                  {form.getFieldDecorator('goodsType', {
                    rules: [{ required: true, message: '请填写商品类型' }],
                    initialValue: detail?.goodsType || 2,
                  })(
                    pattern === 'detail'
                      ? <span>{goodsTypeName}</span>
                      : <Select disabled={pattern === 'detail' || pattern === 'edit'}>{goodsTypeOptionsHtml}</Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品标题">
                  {form.getFieldDecorator('goodsName', {
                    rules: rules([{
                      required: true, message: '请输入商品标题',
                    }, {
                      whitespace: true, message: '请输入商品标题',
                    }, {
                      max: 200,
                    }]),
                    initialValue: detail?.goodsName,
                  })(
                    pattern === 'detail' || (pattern === 'edit' && partEdit)
                      ? (
                        <span
                          dangerouslySetInnerHTML={{
                          __html: detail?.goodsName.replace(/\s/g, '&nbsp;'),
                        }}
                        />
                      )
                      : <MonitorInputGoods maxLength={200} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="商品卖点">
                  {form.getFieldDecorator('goodsSellingPoint', {
                    rules: rules([{
                      max: 250,
                    }]),
                    initialValue: detail?.goodsSellingPoint,
                  })(
                    pattern === 'detail' || (pattern === 'edit' && partEdit)
                      ? <span>{detail?.goodsSellingPoint}</span>
                      : <MonitorInput maxLength={250} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商家商品编码">
                  {form.getFieldDecorator('goodsCode', {
                    rules: rules([{
                      max: 50,
                    }]),
                    initialValue: detail?.goodsCode,
                  })(
                    pattern === 'detail' || (pattern === 'edit' && partEdit)
                      ? <span>{detail?.goodsCode}</span>
                      : <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item
                  label={
                    <span>营销分类
                      <Spin indicator={indicator} spinning={!!loading.effects['marketingCategory/list']} />
                    </span>
                  }
                >
                  {form.getFieldDecorator('marketingCategoryId', {
                    rules: [],
                    initialValue: marketingCategoryIds || null,
                  })(
                    pattern === 'detail' || (pattern === 'edit' && partEdit)
                      ? <span>{marketingCategoryName}</span>
                      : (
                        <Cascader
                          options={marketingCategoryOptions}
                          placeholder={currentMerchantId ? '' : '请先选择所属商家'}
                          disabled={!currentMerchantId || disabled}
                        />
                      )
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="售后服务时间">
                  {form.getFieldDecorator('afterSaleServiceTime', {
                    rules: [],
                    initialValue: numberUnit,
                  })(
                    pattern === 'detail' || (pattern === 'edit' && partEdit)
                      ? <span>{numberUnitName}</span>
                      : (
                        <InputSelectGroup disabled={disabled}>
                          <Select.Option value={3}>年</Select.Option>
                          <Select.Option value={2}>月</Select.Option>
                          <Select.Option value={1}>日</Select.Option>
                        </InputSelectGroup>
                      )
                  )}
                </Form.Item>
              </Col>
              {
                space?.listByCategoryId && space?.listByCategoryId?.length > 0
                  ? (
                    <Col {...d3Col2}>
                      <Form.Item
                        label={
                          <span>适用空间
                            <Spin indicator={indicator} spinning={!!loading.effects['space/listByCategoryId']} />
                          </span>
                        }
                      >
                        {form.getFieldDecorator('spaceIds', {
                          rules: [{
                            required: true, message: '请选择适用空间',
                          }],
                          initialValue: detail?.spaceIds || [],
                        })(
                          <CheckboxGroup options={spaceOptions} disabled={disabled || (pattern === 'edit' && partEdit)} />
                        )}
                      </Form.Item>
                    </Col>
                  )
                  : ''
              }
            </Row>
          </Form>
        </Card>

        {
          form.getFieldDecorator('basePropList', {
            initialValue: baseProp,
          })(
            <BasePropsCard
              form={form}
              disabled={disabled || (pattern === 'edit' && partEdit)}
              loading={loading}
              pattern={pattern}
            />
          )
        }

        <Card title="图片" styleName="card" bordered={false}>
          <Form.Item>
            {
              form.getFieldDecorator('goodsImgGroupVoList', {
                rules: [{
                  validator: (rule, value, callback) => {
                    const errors = [];

                    if (!_.isArray(value.imageGroups) || !value.imageGroups?.length) {
                      errors.push(new Error(
                        '请添加图片组',
                        rule.field));
                    } else if (_.find(value.imageGroups, v => v.goodsImgVoList?.length <= 0)) {
                      errors.push(new Error(
                        '每个图片组至少要有一张图片',
                        rule.field));
                    }

                    callback(errors);
                  },
                }],
                initialValue: imgCard,
              })(
                <ImageCard
                  form={form}
                  disabled={disabled || (pattern === 'edit' && partEdit)}
                  emitterUid={this.emitterUid}
                  pattern={pattern}
                />
              )
            }
          </Form.Item>
        </Card>

        <Card title="规格" styleName="card" bordered={false} loading={loading.effects['propertyKey/list']}>
          <Form.Item>
            {
              form.getFieldDecorator('goodsSkuVoList', {
                rules: [{
                  validator: (rule, value, callback) => {
                    const errors = [];

                    if (!value.goodsSkuVoList?.length) {
                      errors.push(new Error(
                        '请添加规格',
                        rule.field));
                    }

                    const defaultIds = [];
                    for (const sku of value.goodsSkuVoList || []) {
                      if (!sku.imgGroupId) {
                        errors.push(new Error(
                          '请选择图片组',
                          rule.field));
                      }

                      defaultIds.push(sku.isDefault || 0);
                    }

                    if (!defaultIds.includes(2)) {
                      errors.push(new Error(
                        '请选择默认规格',
                        rule.field));
                    }

                    callback(errors);
                  },
                }],
                initialValue: skuProp,
              })(
                <SkuCard
                  form={form}
                  disabled={disabled}
                  partEdit={partEdit}
                  propertyGroupId={detail?.propertyGroupId || currentGoodsCategory?.categoryId}
                  pattern={pattern}
                  loading={loading}
                  emitterUid={this.emitterUid}
                  detail={detail}
                />
              )
            }
          </Form.Item>
        </Card>

        <Card title="介绍" styleName="card" bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              {
                form.getFieldDecorator('goodsDetail', {
                  initialValue: detail?.goodsDetail,
                })(
                  <Editor
                    ref={(inst) => { this.editor = inst; }}
                    maxLength={2}
                    disabled={disabled || (pattern === 'edit' && partEdit)}
                    unbind
                  />
                )
              }
            </Row>
          </Form>
        </Card>

        {
          disabled
            ? <OperateRecordCard disabled={disabled} goodsId={id} />
            : ''
        }

        <DetailFooterToolbar
          form={form}
          fieldLabels={fieldLabels}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          loading={
            loading.models.user ||
            loading.models.business ||
            loading.models.goods ||
            loading.models.goodsCategory ||
            loading.models.goodsBrand ||
            loading.models.goodsCategoryBrand ||
            loading.models.propertyKey ||
            loading.models.marketingCategory ||
            loading.models.space
          }
          permission={[OPERPORT_JIAJU_PRODUCTLIST_EDIT]}
          handlePatternChange={this.handlePatternChange}
          hide={audit === AUDITSTATUS.WAIT.value}
        />
      </PageHeaderLayout>
    );
  }
}
