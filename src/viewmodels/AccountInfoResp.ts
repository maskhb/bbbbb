import {AccountInfoVO} from './st'
import {Type, Expose} from 'class-transformer';

class AccountInfoRespVO extends AccountInfoVO{
  @Expose()
  get value(){
    return this.accountId
  }

  @Expose()
  get label(){
    return this.userName
  }
}

class AccountInfoResp {
  @Type(() => AccountInfoRespVO)
  result:AccountInfoRespVO[]=[];
}

export default AccountInfoResp
