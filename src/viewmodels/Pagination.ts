import { IsPositive } from 'class-validator';

export default class Pagination {
  @IsPositive()
  total: number = 0;

  @IsPositive()
  pageSize: number = 0;

  @IsPositive()
  current: number = 0;
}
