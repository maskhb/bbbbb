import { ValidateNested } from 'class-validator';
import { Type, Exclude } from 'class-transformer';
import Pagination from './Pagination';
import GoodsBrand from './GoodsBrand';

export default class PaginationList<T> {
  @Exclude()
  private type: Function;

  @ValidateNested({ each: true })
  @Type(options => {
    return (options!.newObject as PaginationList<T>).type;
  })
  list: Array<T> = [];

  pagination: Pagination = new Pagination();

  constructor(type: Function) {
    this.type = type;
  }
}
