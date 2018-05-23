import { IsPositive, IsNumber, IsUrl, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import PaginationList from './PaginationList';

enum Status {
  // 启用
  ENABLE = 1,
  // 禁用
  DISABLE = 2,
  // 草稿
  DRAFT = 3,
}

export default class GoodsBrand {
  @IsPositive()
  brandId: number = 0;

  @IsString()
  brandName: string = '';

  @IsString()
  brandHomeUrl?: string;

  @IsNumber()
  orderNum: number = 0;

  status: Status = Status.DRAFT;

  @IsDate()
  @Type(() => Date)
  createdTime?: Date;

  createdName?: string;

  @IsString()
  brandUrl?: string;
}

export function GoodsBrandPaginationList() {
  return new PaginationList<GoodsBrand>(GoodsBrand);
}
