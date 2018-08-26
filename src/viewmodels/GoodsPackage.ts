import {IsPositive, ValidateNested, IsIn, IsNumber, IsDefined} from 'class-validator';
import {Exclude, Type, Expose, Transform} from 'class-transformer';
import {fenToYuan} from '../utils/money'
import {mul} from "../utils/number";

/**
 * 装修风格、空间类
 */
class Tag {
  createdBy: number = 0;
  createdTime: number = 0;
  isDelete: number = 0;
  isSelect: number = 0;
  orderNum: number = 0;
  remark: string = "";
  status: number = 0;
  tagDesc: string = "";
  tagId: number = 0;
  tagName: string = "";
  tagType: number = 0;
  updatedBy: number = 0;
  updatedTime: number = 0;

  @Expose()
  get value() {
    return this.tagId
  };

  @Expose()
  get label() {
    return this.tagName
  };
}

export class TagCollection {
  @Type(() => Tag)
  result: Tag[] = []
}

class PackageSpaceVoQs {
  createdBy: number = 0;
  createdTime: number = 0;
  packageId: number = 0;
  packageSpaceId: number = 0;
  spaceId: number = 0;
  spaceName: string = '';
  updatedBy: number = 0;
}

/**
 * 套餐类
 */
export default class GoodsPackage {
  album: Array<String> = [];
  auditOpinion: string = '';
  auditStatus: number = 0;
  createdBy: number = 0;
  createdTime: number = 0;
  decorateStyleTShow: Array<Tag> = [];
  decorateStyleTagId: number = 0;
  houseTypeShow: Array<Tag> = [];
  houseTypeTags: string = '';
  isDelete: number = 0;
  isTop: number = 0;
  mainImgUrl: string = '';
  merchantId: number = 0;
  merchantName: string = '';
  factoryId: number = 0;
  factoryName: string = '';
  minPrice: number = 0;
  orderNum: number = 0;
  packageDesc: string = '';
  packageDetail: string = '';
  packageId: number = 0;
  packageName: string = '';
  packageShortName: string = '';
  packageSpaceVoQs: Array<PackageSpaceVoQs> = [];
  packageUrl: string = '';
  status: number = 0;
  threeDimenUrl: string = '';
  totalPrice: number = 0;
  updatedBy: number = 0;
}

class Pagination {
  @IsPositive()
  totalCount: number = 0;

  @IsPositive()
  pageSize: number = 0;

  @IsPositive()
  currPage: number = 0;
}

class PaginationList<T> {
  @Exclude()
  private type: Function;

  @ValidateNested({each: true})
  @Type(options => {
    return (options!.newObject as PaginationList<T>).type;
  })
  dataList: Array<T> = [];

  pagination: Pagination = new Pagination();

  constructor(type: Function) {
    this.type = type;
  }
}

/**
 * 空间、风格列表接口请求参数
 */
export class TagListQuery {
  @IsDefined()
  @IsIn([1, 2])
  tagType!: number;
}

/**
 * 套餐详情查询请求参数
 */
export class DetailQuery {
  @IsDefined()
  packageId!: number;
}

/**
 * 套餐列表
 * @returns {PaginationList<GoodsPackage>}
 */
export const queryListByPage = () => {
  return new PaginationList<GoodsPackage>(GoodsPackage)
};

/**
 * 套餐商品添加列表请求参数
 */
export class PackageGoodsQuery {
  @Expose()
  @Transform((value) => {
    return value ? value.trim() : value
  })
  goodsName?: string;

  @Transform((value) => {
    return value ? value.trim() : value
  })
  skuCode?: string;

  @IsDefined()
  @IsNumber()
  merchantId?: number;

  neqSkuIds: Array<number> = [];
}

/**
 * 套餐详情
 */
export class PackageDetail extends GoodsPackage {
  @Expose()
  get arrHouseTypeTags() {
    return this.houseTypeTags.split(';').map(item => Number(item));
  }

  @Expose()
  get totalPriceFormat() {
    return fenToYuan(this.totalPrice || 0, false)
  }

  @Expose()
  get minPriceFormat() {
    return fenToYuan(this.minPrice || 0, false)
  }
}

/**
 * 套餐适用空间的商品列表请求参数
 */
export class GoodsListQuery {
  @Transform((value) => {
    return value ? value.trim() : value
  })
  merchantName: string='';
  status: number=0;

  @Transform((value) => {
    return value ? value.trim() : value
  })
  packageName:string='';
}

@Exclude()
class Goods {
  @Expose()
  categoryId: number = 0;
  @Expose()
  createdBy: number = 0;
  @Expose()
  createdTime: number = 0;
  @Expose()
  goodsId: number = 0;
  @Expose()
  @Transform((value) => {
    return value ? 1 : 0
  })
  isDefault: number = 0;
  @Expose()
  isDelete: number = 0;
  @Expose()
  listId: number = 0;
  @Expose()
  packageId: number = 0;
  @Expose()
  packagePrice: number = 0;
  @Expose()
  remark: string = '';
  @Expose()
  skuId: number = 0;
  @Expose()
  spaceId: number = 0;
  @Expose()
  updatedBy: number = 0;
  @Expose()
  updatedTime: number = 0;
}

/**
 * 查询所有商家列表
 */
export class MerchantQuery {
  address: string = '';
  categoryId: number = 0;
  chineseName: string = '';
  couponAccount: string = '';
  createdBy: number = 0;
  createdTime: number = 0;
  englishName: string = '';
  isDelete: number = 0;
  logoImgUrl: string = '';
  mainImgUrl: string = '';
  merchantId: number = 0;
  merchantName: string = '';
  merchantType: number = 0;
  orderReceiveTelphoneNo: string = '';
  predepositCouponSwitch: number = 0;
  status: number = 0;
  summary: string = '';
  telphoneNo: string = '';
  trafficInfo: string = '';
  unionMerchantId: number = 0;
  updatedBy: number = 0;
  updatedTime: number = 0;
}

export class Space {
  aliasName: string = '';
  categorys: string = '';
  createdBy: number = 0;
  createdTime: number = 0;
  isDelete: number = 0;
  name: string = '';
  orderNum: number = 0;
  remark: string = '';
  spaceId: number = 0;
  status: number = 0;
  updatedBy: number = 0;
  updatedTime: number = 0;

  @Expose()
  get spaceName(): string {
    return this.name;
  }
}

export class SpaceCollection {
  @Type(() => Space)
  result: Space[] = []
}

export class Merchant {
  merchantId: number = 0;
  merchantName: string = '';
  chineseName: string = '';
  englishName: string = '';
  merchantType: number = 0;
  unionMerchantId: number = 0;
  unionMerchantName: string = '';
  categoryId: number = 0;
  regionId: number = 0;
  address: string = '';
  telphoneNo: string = '';
  orderReceiveTelphoneNo: string = '';
  trafficInfo: string = '';
  summary: string = '';
  predepositCouponSwitch: number = 0;
  couponAccount: string = '';
  logoImgUrl: string = '';
  mainImgUrl: string = '';
  preStatus: number = 0;
  status: number = 0;
  isDelete: number = 0;
  createdBy: number = 0;
  createdTime: number = 0;
  updatedBy: number = 0;
  updatedTime: number = 0;

  @Expose()
  get value() {
    return String(this.merchantId);
  }

  @Expose()
  get label() {
    return this.merchantName;
  }
}

export class MerchantList {
  totalCount: number = 0;
  totalPage: number = 0;
  pageSize: number = 0;
  currPage: number = 0;
  dataList: Array<Merchant> = [];
}

export class File {
  constructor(url: string) {
    this.url = url
  }

  url: string = '';
  name: string = '';
  status: string = 'done';
  uid: string = '';
}

@Exclude()
class SavePackageSpaceVoQs {
  @Expose()
  createdBy: number = 0;
  @Expose()
  createdTime: number = 0;
  @Expose()
  isDelete: number = 0;

  @Expose()
  @Type(() => Goods)
  @Transform((value) => {
    return value || []
  })
  packageGoodsList: Goods[] = [];

  @Expose()
  packageId: number = 0;
  @Expose()
  packageSpaceId: number = 0;

  @Expose()
  @Type(() => Goods)
  selectPackageGoodsList: Goods[] = [];

  @Expose()
  spaceId: number = 0;
  @Expose()
  spaceName: string = '';
  @Expose()
  updatedBy: number = 0;
  @Expose()
  updatedTime: number = 0;
}

@Exclude()
export class SaveQuery {
  @Expose()
  album: Array<String> = [];
  @Expose()
  auditOpinion: string = '';
  @Expose()
  auditStatus: number = 0;
  @Expose()
  createdBy: number = 0;
  @Expose()
  createdTime: number = 0;
  @Expose()
  decorateStyleTagId: number = 0;
  @Expose()
  factoryId: number = 0;
  @Expose()
  houseTypeTags: string = '';
  @Expose()
  isTop: number = 0;
  @Expose()
  mainImgUrl: string = '';
  @Expose()
  merchantId: number = 0;

  @Expose()
  @Transform((value) => {
    return mul(value || 0, 100);
  })
  minPrice: number = 0;

  @Expose()
  orderNum: number = 0;
  @Expose()
  packageDesc: string = '';
  @Expose()
  packageDetail: string = '';
  @Expose()
  packageId: number = 0;
  @Expose()
  packageName: string = '';
  @Expose()
  packageShortName: string = '';

  @Expose()
  @Type(() => SavePackageSpaceVoQs)
  packageSpaceVoQs: SavePackageSpaceVoQs[] = [];

  @Expose()
  packageUrl: string = '';
  @Expose()
  status: number = 0;
  @Expose()
  threeDimenUrl: string = '';

  @Expose()
  @Transform((value) => {
    return mul(value || 0, 100);
  })
  totalPrice: number = 0;

  @Expose()
  updatedBy: number = 0;
}
