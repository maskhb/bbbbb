import { IsNotEmpty, IsPositive, IsUrl, IsDate, IsString, MaxLength, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import moment from 'moment';
import PaginationList from './PaginationList';

enum AuditStatus {
  // 待审核
  DRAFT = 1,
  // 审核通过
  ENABLE = 2,
  // 审核不通过
  DISABLE = 3,
};

enum Status {
  // 草稿
  DRAFT = 0,
  // 启用
  ENABLE = 1,
  // 禁用
  DISABLE = 2,
};

enum OnlineStatus {
  // 待上架
  WAITING = 0,
  // 上架
  ENABLE = 1,
  // 下架
  DISABLE = 2,
};

// 商品类型
enum GoodsType {
  // 标准商品
  STANDARD = 0,
  // 普通商品
  NORMAL = 1,
  // 订制商品
  CUSTOM = 2,
  // 赠品
  FREE = 3,
}

// 售后服务类型
enum ServiceType {
  // 未知
  UNKNOW = 0,
  // 日
  DAY = 1,
  // 月
  MONTH = 2,
  // 年
  YEAR = 3,
}

class Image {
  @IsUrl()
  url: string = '';
}

export default class Goods {
  @IsPositive()
  goodsId: number = 0;

  // 商品标题
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  goodsName: string = '';

  // 商品图片
  @IsString()
  imgUrl: string = '';

  // 所属厂家id
  factoryId: number = 0 ;
  // 所属商家id
  merchantId: number = 0;

  // 所属商家名称
  @IsNotEmpty()
  @IsString()
  merchantName: string = '';

  // 商品分类ID
  @IsPositive()
  goodsCategoryId: number = 0;

  model?: string;

  supplierShortName?: string;

  // 品牌id
  brandId: number = 0;
  // 品牌
  brand?: string;

  sellUnitName?: string;

  @IsDate()
  @Type(() => Date)
  createdTime?: Date;

  @IsDate()
  @Type(() => Date)
  beginTime?: Date;

  @IsEnum(AuditStatus)
  auditStatus?: AuditStatus = AuditStatus.DRAFT;

  orderStatus?: Status = Status.DRAFT;

  @IsEnum(OnlineStatus)
  onlineStatus?: OnlineStatus = OnlineStatus.WAITING;

  // 商家商品编码
  goodsCode?: string;

  // 商品skuId
  skuId?: number;

  // 商家sku编码
  skuCode?: number;

  moq?: number;

  supplyPrice?: number;

  marketPrice?: number;

  price?: number;

  discountPrice?: number;

  // 库存(大于等于)
  remainNum1?: number;

  // 库存(小于等于)
  remainNum2?: number;

  // 商品类型
  goodsType? : GoodsType;

  // 营销分类
  marketingCategoryId?: number;

  // 售后服务时间
  serviceTime: number = 0;

  // 售后服务类型
  serviceType?: ServiceType;
}

export function GoodsPaginationList() {
  return new PaginationList<Goods>(Goods);
}
