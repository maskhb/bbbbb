import { Type, Exclude } from 'class-transformer';
import Pagination from './Pagination';

export default class PaginationList<T> {
  @Exclude()
  private type: Function;

  @Type(options => {
    return (options!.newObject as PaginationList<T>).type;
  })
  list: Array<T> = [];

  pagination: Pagination = new Pagination();

  constructor(type: Function) {
    this.type = type;
  }
}
