/**
 * AccountInfoVO
 * 账号信息
 */
export class AccountInfoVO {
  /**
   * 账号ID
   */
  accountId?: number; // int64
  /**
   * pms系统用户
   */
  accountType?: number; // int32
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 登陆账号
   */
  loginName?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 当前所选所属组织ID
   */
  orgIdSelected?: number; // int64
  /**
   * 账号所有关联组织ID列表
   */
  orgIds?: number /* int64 */ [];
  /**
   * 账号所属组织名称
   */
  orgNameSelected?: string;
  /**
   * 登录密码,查询时候不会返回该字段值
   */
  passWord?: string;
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 用户真实姓名
   */
  userName?: string;
}
/**
 * AccountReceivablePageVO
 * 查询分页参数对象封装对象
 */
export class AccountReceivablePageVO {
  /**
   * 应收账号
   */
  accountReceivableQueryVO?: AccountReceivableQueryVO;
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
}
/**
 * AccountReceivableQueryVO
 * 应收账号查询入参
 */
export class AccountReceivableQueryVO {
  /**
   * 账号名称
   */
  accountName?: string;
}
/**
 * AccountReceivableVO
 * 应收账号
 */
export class AccountReceivableVO {
  /**
   * 账号代码
   */
  accountCode?: string;
  /**
   * 账号名称
   */
  accountName?: string;
  /**
   * 关联的业务来源
   */
  businessSource?: string;
  /**
   * 账号状态(1启用 2 禁用)
   */
  status?: number; // int32
  /**
   * 总挂账额度
   */
  totalAmountCredit?: number; // int64
  /**
   * 已使用额度
   */
  usedAmount?: number; // int64
}
/**
 * AgreementUnitAccountVO
 * 协议单位挂账
 */
export class AgreementUnitAccountVO {
  /**
   * 应收账号ID
   */
  accountId?: number; // int64
  /**
   * 客单ID
   */
  gresId?: number; // int64
}
/**
 * AuthVO
 * 权限实体
 */
export class AuthVO {
  /**
   * 权限码
   */
  authCode?: string;
  /**
   * 权限ID
   */
  authId?: number; // int64
  /**
   * 权限名称
   */
  authName?: string;
  /**
   * 权限分组编码
   */
  groupCode?: string;
  /**
   * 权限分组名称
   */
  groupName?: string;
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 模块编码
   */
  moduleCode?: string;
  /**
   * 模块id
   */
  moduleId?: number; // int64
  /**
   * 模块名称
   */
  moduleName?: string;
  /**
   * 备注
   */
  remarks?: string;
  /**
   * 0-全平台适用
   */
  type?: number; // int32
}
/**
 * BuildingQueryVO
 * 楼栋分页查询对象
 */
export class BuildingQueryVO {
  /**
   * 楼栋名称，模糊查询
   */
  buildingName?: string;
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织id
   */
  orgId?: number; // int32
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 状态：0-全部，1-启用，2-禁用
   */
  status?: 1; // int32
}
/**
 * BuildingVO
 * 楼栋
 */
export class BuildingVO {
  /**
   * 楼栋Id
   */
  buildingId?: number; // int64
  /**
   * 楼栋名
   */
  buildingName?: string;
  /**
   * 建筑类型，与t_tag表关联
   */
  buildingType?: number; // int64
  /**
   * 所属门店
   */
  orgId?: number; // int64
  /**
   * 房间数
   */
  roomQty?: number; // int32
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
}
/**
 * ChannelQueryVO
 * 渠道分页查询对象
 */
export class ChannelQueryVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织id
   */
  orgId?: number; // int32
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
}
/**
 * ChannelVO
 * 渠道表
 */
export class ChannelVO {
  /**
   * 渠道id
   */
  channelId?: number; // int64
  /**
   * 渠道名称
   */
  channelName?: number; // int64
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * CheckOutFeeVO
 * 客单主表
 */
export class CheckOutFeeVO {
  /**
   * 应收客人费用
   */
  receivableAmount?: number; // int64
  /**
   * 当前总消费
   */
  totalFee?: number; // int64
  /**
   * 当前总收款
   */
  totalReceipt?: number; // int64
}
/**
 * CreditAccountDetailsModel
 */
export class CreditAccountDetailsModel {
  accountId?: number; // int64
  accountType?: number; // int64
  amount?: number; // int64
  businessDate?: number; // int64
  checkInDate?: number; // int64
  checkOutDate?: number; // int64
  createdBy?: number; // int64
  createdTime?: number; // int64
  creditAccountId?: number; // int64
  ifModify?: number; // int32
  isDelete?: number; // int32
  modifyCreditAccountId?: number; // int64
  regNo?: string;
  regTime?: number; // int64
  remark?: string;
  roomNo?: string;
  settlementStatus?: number; // int32
  settlementTime?: number; // int64
  updatedBy?: number; // int64
  updatedTime?: number; // int64
}
/**
 * CreditAccountDetailsPageVO
 * 查询分页参数对象封装对象
 */
export class CreditAccountDetailsPageVO {
  /**
   * 应收账号-账务详情
   */
  creditAccountDetailsQueryVO?: CreditAccountDetailsQueryVO;
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
}
/**
 * CreditAccountDetailsQueryVO
 * 账务详情查询入参
 */
export class CreditAccountDetailsQueryVO {
  /**
   * 应收账号ID
   */
  accountId?: number; // int64
  /**
   * 营业日期(结束时间)
   */
  businessDateEnd?: number; // int64
  /**
   * 营业日期(开始时间)
   */
  businessDateStart?: number; // int64
  /**
   * 入住日期(结束时间)
   */
  checkInDateEnd?: number; // int64
  /**
   * 入住日期(开始时间)
   */
  checkInDateStart?: number; // int64
  /**
   * 离店日期(结束时间)
   */
  checkOutDateEnd?: number; // int64
  /**
   * 离店日期(开始时间)
   */
  checkOutDateStart?: number; // int64
  /**
   * 登记单号
   */
  regNo?: string;
  /**
   * 结算状态（1已结算 2未结算)
   */
  settlementStatus?: number; // int32
}
/**
 * CreditAccountDetailsVO
 * 应收账号-账务详情
 */
export class CreditAccountDetailsVO {
  /**
   * 应收账号ID
   */
  accountId?: number; // int64
  /**
   * 账务类型
   */
  accountType?: number; // int32
  /**
   * 账务类型
   */
  accountTypeName?: string;
  /**
   * 金额
   */
  amount?: number; // int64
  /**
   * 营业日期
   */
  businessDate?: number; // int64
  /**
   * 入住日期
   */
  checkInDate?: number; // int64
  /**
   * 离店日期
   */
  checkOutDate?: number; // int64
  ifModify?: number; // int32
  modifyCreditAccountId?: number; // int64
  /**
   * 登记单号
   */
  regNo?: string;
  /**
   * 挂账时间
   */
  regTime?: number; // int64
  /**
   * 备注
   */
  remark?: string;
  /**
   * 房间号
   */
  roomNo?: string;
  /**
   * 结算状态（1已结算 2未结算)
   */
  settlementStatus?: number; // int32
  /**
   * 结算时间
   */
  settlementTime?: number; // int64
}
/**
 * CreditAccountVO
 * 应收账号-账务详情
 */
export class CreditAccountVO {
  /**
   * 应收账号ID
   */
  accountId?: number; // int64
  /**
   * 金额
   */
  amount?: number; // int64
  /**
   * 入住日期
   */
  checkInDate?: number; // int64
  /**
   * 离店日期
   */
  checkOutDate?: number; // int64
  creditAccountDetailsList?: CreditAccountDetailsVO[];
  /**
   * 登记单号
   */
  regNo?: string;
  /**
   * 房间号
   */
  roomNo?: string;
}
/**
 * DepVO
 * 部门表
 */
export class DepVO {
  /**
   * 该部门下的子部门列表
   */
  childDeps?: DepVO[];
  /**
   * 部门ID
   */
  depId?: number; // int64
  /**
   * 部门名称
   */
  depName?: string;
  /**
   * 部门层级
   */
  level?: number; // int32
  /**
   * 备注
   */
  memo?: string;
  /**
   * 所属组织
   */
  orgId?: string;
  /**
   * 上级部门
   */
  parentId?: number; // int64
  /**
   * 路径  leve1_level2_level3
   */
  path?: string;
  pathName?: string;
  /**
   * 状态 1 启用  2 禁用
   */
  status?: number; // int32
}
/**
 * FloorQueryVO
 * 楼层分页查询对象
 */
export class FloorQueryVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 楼层名称，模糊查询
   */
  floorName?: string;
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织id
   */
  orgId?: number; // int32
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 状态：0-全部，1-启用，2-禁用
   */
  status?: 1; // int32
}
/**
 * FloorVO
 * 楼层
 */
export class FloorVO {
  /**
   * 楼层Id
   */
  floorId?: number; // int64
  /**
   * 楼层名
   */
  floorName?: string;
  /**
   * 所属门店
   */
  orgId?: number; // int64
  /**
   * 房间数
   */
  roomQty?: number; // int32
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
}
/**
 * GresAccountTotalVO
 * 客单挂账汇总表
 */
export class GresAccountTotalVO {
  /**
   * 账务类型 1 费用 2 收款 3 退款
   */
  accType?: number; // int32
  /**
   * 账务类型明细列表
   */
  accountDetails?: GresAccountVO[];
  /**
   * 金额
   */
  rate?: number; // int64
}
/**
 * GresAccountVO
 * 客单挂账表
 */
export class GresAccountVO {
  /**
   * 账务类型 1 费用 2 收款 3 退款
   */
  accType?: number; // int32
  /**
   * 记账日期
   */
  accountDate?: number; // int64
  /**
   * 单据号
   */
  accountNo?: string;
  businessDay?: string;
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  gresAccountId?: number; // int64
  /**
   * 客单id
   */
  gresId?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 记账条目id
   */
  itemId?: number; // int64
  /**
   * 备注
   */
  memo?: string;
  /**
   * 金额
   */
  rate?: number; // int64
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
  /**
   * 收银员账号
   */
  userId?: number; // int64
}
/**
 * GresDetailSaveVO
 * 客单主表
 */
export class GresDetailSaveVO {
  /**
   * 入店日期
   */
  arrivalDate?: number; // int64
  /**
   * 儿童数
   */
  children?: number; // int32
  /**
   * 离店日期
   */
  departureDate?: number; // int64
  /**
   * 性别：F 女性 ，M  男性
   */
  gender?: string;
  /**
   * 账务信息
   */
  gresAccountVOs?: GresAccountVO[];
  /**
   * 房客信息
   */
  gresGuestVOs?: GresGuestVO[];
  /**
   * gresId,新增不用传
   */
  gresId?: number; // int64
  /**
   * 预订单号/登记单号
   */
  gresNo?: string;
  /**
   * 预订房型及房价
   */
  gresRoomTypeVOs?: GresRoomTypeVO[];
  /**
   * 单据类型：1 预订单  2 入住单
   */
  gresType?: number; // int32
  /**
   * 团队名称
   */
  groupName?: string;
  /**
   * 姓名
   */
  guestName?: string;
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 联房的主房id
   */
  linkId?: number; // int64
  /**
   * 下属次房,多个次房用英文逗号隔开
   */
  linkRooms?: string;
  /**
   * 男性数
   */
  man?: number; // int32
  /**
   * 备注
   */
  memo?: string;
  /**
   * 所属组织，比如阳江恒大御景湾
   */
  orgId?: number; // int64
  /**
   * 预订单号
   */
  parentGresNo?: number; // int64
  /**
   * 父单id
   */
  parentId?: number; // int64
  /**
   * 电话
   */
  phone?: string;
  /**
   * 价格代码（关联）
   */
  rateCodeId?: number; // int64
  /**
   * 房间保留至
   */
  remainTime?: number; // int64
  /**
   * 客单类别：1 散客  2 团体
   */
  resType?: number; // int32
  /**
   * 预留房间
   */
  roomBookingVOs?: RoomBookingVO[];
  /**
   * 房间id
   */
  roomId?: number; // int64
  /**
   * 总价
   */
  roomRate?: number; // int64
  /**
   * 销售部门(关联)
   */
  salesDeptId?: number; // int64
  /**
   * 业务来源
   */
  sourceId?: number; // int64
  /**
   * 客单状态: 待入住WI、部分入住 PI 取消C、失约N、在住I、离店O
   */
  status?: string;
  /**
   * 女性数
   */
  woman?: number; // int32
}
/**
 * GresDetailVO
 * 客单主表
 */
export class GresDetailVO {
  /**
   * 入店日期
   */
  arrivalDate?: number; // int64
  /**
   * 开始入店日期
   */
  beginArrivalDate?: number; // int64
  /**
   * 开始创建时间（查询用）
   */
  beginCreatedTime?: number; // int64
  /**
   * 开始离店日期
   */
  beginDepartureDate?: number; // int64
  /**
   * 儿童数
   */
  children?: number; // int32
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 离店日期
   */
  departureDate?: number; // int64
  /**
   * 结束入店日期
   */
  endArrivalDate?: number; // int64
  /**
   * 结束创建时间（查询用）
   */
  endCreatedTime?: number; // int64
  /**
   * 结束离店日期
   */
  endDepartureDate?: number; // int64
  /**
   * 性别：F 女性 ，M  男性
   */
  gender?: string;
  /**
   * 账务信息(查询用)
   */
  gresAccountTotalVOs?: GresAccountTotalVO[];
  /**
   * 账务信息(保存用)
   */
  gresAccountVOs?: GresAccountVO[];
  /**
   * 房客信息
   */
  gresGuestVOs?: GresGuestVO[];
  /**
   * gresId,新增不用传
   */
  gresId?: number; // int64
  /**
   * 操作日志
   */
  gresLogVOs?: GresLogVO[];
  /**
   * 预订单号/登记单号
   */
  gresNo?: number; // int64
  /**
   * 预订房型及房价
   */
  gresRoomTypeVOs?: GresRoomTypeVO[];
  /**
   * 单据类型：1 预订单  2 入住单
   */
  gresType?: number; // int32
  /**
   * 团队名称
   */
  groupName?: string;
  /**
   * 姓名
   */
  guestName?: string;
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 联房的主房id
   */
  linkId?: number; // int64
  /**
   * 下属次房,多个次房用英文逗号隔开
   */
  linkRooms?: string;
  /**
   * 男性数
   */
  man?: number; // int32
  /**
   * 备注
   */
  memo?: string;
  /**
   * 所属组织，比如阳江恒大御景湾
   */
  orgId?: number; // int64
  /**
   * 预订单号
   */
  parentGresNo?: number; // int64
  /**
   * 父单id
   */
  parentId?: number; // int64
  /**
   * 电话
   */
  phone?: string;
  /**
   * 价格代码（关联）
   */
  rateCodeId?: number; // int64
  /**
   * 房间保留至
   */
  remainTime?: number; // int64
  /**
   * 客单类别：1 散客  2 团体
   */
  resType?: number; // int32
  /**
   * 预留房间(显示用)
   */
  roomBookingTotalVOs?: RoomBookingTotalVO[];
  /**
   * 预留房间（保存用）
   */
  roomBookingVOs?: RoomBookingVO[];
  /**
   * 房间id
   */
  roomId?: number; // int64
  /**
   * 房号，冗余
   */
  roomNo?: string;
  /**
   * 总价
   */
  roomRate?: number; // int64
  /**
   * 销售部门(关联)
   */
  salesDeptId?: number; // int64
  /**
   * 业务来源
   */
  sourceId?: number; // int64
  /**
   * 客单状态: 待入住WI、部分入住 PI 取消C、失约N、在住I、离店O
   */
  status?: string;
  /**
   * 女性数
   */
  woman?: number; // int32
}
/**
 * GresGuestVO
 * 房客信息
 */
export class GresGuestVO {
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  docNo?: string;
  /**
   * 证件号码
   */
  docType?: number; // int32
  /**
   * 性别: F 女性 M 男性
   */
  gender?: string;
  gresGuestId?: number; // int64
  gresId?: number; // int64
  guestName?: string;
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  mobile?: string;
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * GresLogVO
 */
export class GresLogVO {
  /**
   * 操作内容
   */
  content?: string;
  /**
   * 操作时间
   */
  time?: number; // int64
  /**
   * 操作类型:1 新增 2 编辑
   */
  type?: number; // int32
  /**
   * 操作人
   */
  userName?: string;
}
/**
 * GresPageVO
 * 查询分页参数对象封装对象
 */
export class GresPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 客单主表
   */
  gresVO?: GresVO;
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 查询类型： All 所有登记单 TodayWillIn 今日预抵（到) TodayIn 今日已到 TodayWillOut 今日预离  TodayOut 今日已离
   */
  queryType?: string;
}
/**
 * GresRoomTypeVO
 */
export class GresRoomTypeVO {
  /**
   * 加床价格
   */
  bedPrice?: number; // int64
  /**
   * 加床数量
   */
  bedQty?: number; // int64
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  gresId?: number; // int64
  gresRoomTypeId?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 加餐价格
   */
  mealPrice?: number; // int64
  /**
   * 加餐数量
   */
  mealQty?: number; // int64
  /**
   * 自定义房价
   */
  realPrice?: number; // int64
  /**
   * 预订房数
   */
  roomQty?: number; // int64
  /**
   * 可订房数
   */
  roomStock?: number; // int64
  /**
   * 房型Id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名称
   */
  roomTypeName?: string;
  /**
   * 标准房价
   */
  stdPrice?: number; // int64
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * GresVO
 * 客单主表
 */
export class GresVO {
  /**
   * 入店日期
   */
  arrivalDate?: number; // int64
  /**
   * 开始入店日期
   */
  beginArrivalDate?: number; // int64
  /**
   * 开始创建时间（查询用）
   */
  beginCreatedTime?: number; // int64
  /**
   * 开始离店日期
   */
  beginDepartureDate?: number; // int64
  /**
   * 儿童数
   */
  children?: number; // int32
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 离店日期
   */
  departureDate?: number; // int64
  /**
   * 结束入店日期
   */
  endArrivalDate?: number; // int64
  /**
   * 结束创建时间（查询用）
   */
  endCreatedTime?: number; // int64
  /**
   * 结束离店日期
   */
  endDepartureDate?: number; // int64
  /**
   * 性别：F 女性 ，M  男性
   */
  gender?: string;
  /**
   * gresId,新增不用传
   */
  gresId?: number; // int64
  /**
   * 预订单号/登记单号
   */
  gresNo?: number; // int64
  /**
   * 单据类型：1 预订单  2 入住单
   */
  gresType?: number; // int32
  /**
   * 团队名称
   */
  groupName?: string;
  /**
   * 姓名
   */
  guestName?: string;
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 联房的主房id
   */
  linkId?: number; // int64
  /**
   * 下属次房,多个次房用英文逗号隔开
   */
  linkRooms?: string;
  /**
   * 男性数
   */
  man?: number; // int32
  /**
   * 备注
   */
  memo?: string;
  /**
   * 所属组织，比如阳江恒大御景湾
   */
  orgId?: number; // int64
  /**
   * 预订单号
   */
  parentGresNo?: number; // int64
  /**
   * 父单id
   */
  parentId?: number; // int64
  /**
   * 电话
   */
  phone?: string;
  /**
   * 价格代码（关联）
   */
  rateCodeId?: number; // int64
  /**
   * 房间保留至
   */
  remainTime?: number; // int64
  /**
   * 客单类别：1 散客  2 团体
   */
  resType?: number; // int32
  /**
   * 房间id
   */
  roomId?: number; // int64
  /**
   * 房号，冗余
   */
  roomNo?: string;
  /**
   * 总价
   */
  roomRate?: number; // int64
  /**
   * 销售部门(关联)
   */
  salesDeptId?: number; // int64
  /**
   * 业务来源
   */
  sourceId?: number; // int64
  /**
   * 客单状态: 待入住WI、部分入住 PI 取消C、失约N、在住I、离店O
   */
  status?: string;
  /**
   * 女性数
   */
  woman?: number; // int32
}
/**
 * InvoiceVO
 */
export class InvoiceVO {
  /**
   * 营业日
   */
  businessDay?: string;
  /**
   * gresId
   */
  gresId?: number; // int64
  /**
   * 发票单位
   */
  invoiceCompany?: string;
  /**
   * 发票抬头
   */
  invoiceHeader?: string;
  /**
   * 发票id
   */
  invoiceId?: number; // int64
  /**
   * 发票编号
   */
  invoiceNo?: string;
  /**
   * 发票金额
   */
  rate?: number; // int64
  /**
   * 备注
   */
  remark?: string;
}
/**
 * NightAuditExceptionStatisticsVO
 * 夜审数据异常统计
 */
export class NightAuditExceptionStatisticsVO {
  /**
   * 营业日期
   */
  businessTime?: number; // int64
  /**
   * 应离未离住客总个数
   */
  notAwayGuestCount?: number; // int64
  /**
   * 应到未到散客总个数
   */
  notToGuestCount?: number; // int64
  /**
   * 应到未到团队总个数
   */
  notToTeamCount?: number; // int64
  /**
   * 列表数据
   */
  pageQuery?: PageQueryGresVO_;
}
/**
 * NightAuditRecordCondition
 * 夜审记录查询条件
 */
export class NightAuditRecordCondition {
  /**
   * 结束营业日期
   */
  endBusinessTime?: number; // int64
  /**
   * 开始营业日期
   */
  startBusinessTime?: number; // int64
}
/**
 * NightAuditRecordPageVO
 * 查询分页参数对象封装对象
 */
export class NightAuditRecordPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 夜审记录查询条件
   */
  nightAuditRecordCondition?: NightAuditRecordCondition;
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
}
/**
 * NightAuditRecordVO
 * 夜审记录
 */
export class NightAuditRecordVO {
  /**
   * 营业日期
   */
  businessTime?: number; // int64
  /**
   * 操作人
   */
  createdName?: string;
  /**
   * 夜审时间
   */
  endNaturalTime?: number; // int64
  /**
   * 文件路径
   */
  fileUrl?: string;
  /**
   * 本日收入
   */
  incomeToday?: number; // int32
  /**
   * 记录id
   */
  recordId?: number; // int32
}
/**
 * OrgVO
 * 组织表
 */
export class OrgVO {
  address?: string;
  /**
   * 该组织下的子组织列表
   */
  childOrgs?: OrgVO[];
  /**
   * 纬度
   */
  lat?: number; // double
  /**
   * 组织层级
   */
  level?: number; // int32
  /**
   * 经度
   */
  lng?: number; // double
  /**
   * 备注
   */
  memo?: string;
  /**
   * 组织ID
   */
  orgId?: number; // int64
  /**
   * 组织名称
   */
  orgName?: string;
  /**
   * 组织类型 1 酒店门店型 2 管理架构型
   */
  orgType?: number; // int32
  /**
   * 上级组织
   */
  parentId?: number; // int64
  /**
   * 组织路径  leve1_level2_level3
   */
  path?: string;
  /**
   * 组织路径名称冗余
   */
  pathName?: string;
  /**
   * 四级地址id
   */
  regionId?: number; // int32
  /**
   * 四级地址冗余
   */
  regionNamePath?: string;
  /**
   * 状态 1 启用  2 禁用
   */
  status?: number; // int32
  /**
   * 该组织下所有门店列表
   */
  storeIds?: number /* int64 */ [];
}
/**
 * PageQuery«AccountReceivableVO»
 * 网关分页返回信息
 */
export class PageQueryAccountReceivableVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: AccountReceivableVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«BuildingVO»
 * 网关分页返回信息
 */
export class PageQueryBuildingVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: BuildingVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«ChannelVO»
 * 网关分页返回信息
 */
export class PageQueryChannelVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: ChannelVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«CreditAccountVO»
 * 网关分页返回信息
 */
export class PageQueryCreditAccountVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: CreditAccountVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«FloorVO»
 * 网关分页返回信息
 */
export class PageQueryFloorVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: FloorVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«GresVO»
 * 网关分页返回信息
 */
export class PageQueryGresVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: GresVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«NightAuditRecordVO»
 * 网关分页返回信息
 */
export class PageQueryNightAuditRecordVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: NightAuditRecordVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«PaymentItemOrgVO»
 * 网关分页返回信息
 */
export class PageQueryPaymentItemOrgVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: PaymentItemOrgVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«PaymentItemVO»
 * 网关分页返回信息
 */
export class PageQueryPaymentItemVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: PaymentItemVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«PaymentMethodOrgVO»
 * 网关分页返回信息
 */
export class PageQueryPaymentMethodOrgVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: PaymentMethodOrgVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«PaymentMethodVO»
 * 网关分页返回信息
 */
export class PageQueryPaymentMethodVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: PaymentMethodVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«PriceCheckVO»
 * 网关分页返回信息
 */
export class PageQueryPriceCheckVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: PriceCheckVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«RateCodeVO»
 * 网关分页返回信息
 */
export class PageQueryRateCodeVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: RateCodeVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«RepairVO»
 * 网关分页返回信息
 */
export class PageQueryRepairVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: RepairVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«RoomTypeVO»
 * 网关分页返回信息
 */
export class PageQueryRoomTypeVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: RoomTypeVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«RoomVO»
 * 网关分页返回信息
 */
export class PageQueryRoomVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: RoomVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«SourceVO»
 * 网关分页返回信息
 */
export class PageQuerySourceVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: SourceVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«StatisticsVO»
 * 网关分页返回信息
 */
export class PageQueryStatisticsVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: StatisticsVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«TagVO»
 * 网关分页返回信息
 */
export class PageQueryTagVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: TagVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PageQuery«TempAccountRegVO»
 * 网关分页返回信息
 */
export class PageQueryTempAccountRegVO_ {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 查询结果
   */
  dataList?: TempAccountRegVO[];
  firstPage?: boolean;
  lastPage?: boolean;
  /**
   * 每页条数
   */
  pageSize: number=0; // int32
  /**
   * 总数
   */
  totalCount: number=0; // int64
  /**
   * 总页数
   */
  totalPage: number=0; // int32
}
/**
 * PaymentItemOrgPageVO
 * 查询分页参数对象封装对象
 */
export class PaymentItemOrgPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 组织收费类目设置
   */
  paymentItemOrgVO?: PaymentItemOrgVO;
}
/**
 * PaymentItemOrgVO
 * 组织收费类目设置
 */
export class PaymentItemOrgVO {
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 所属组织
   */
  orgId?: number; // int64
  /**
   * 收费类目id
   */
  paymentItemId?: number; // int64
  /**
   * 组织收费设置Id
   */
  paymentItemOrgId?: number; // int64
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * PaymentItemPageVO
 * 查询分页参数对象封装对象
 */
export class PaymentItemPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 收费类目表
   */
  paymentItemVO?: PaymentItemVO;
}
/**
 * PaymentItemVO
 * 收费类目表
 */
export class PaymentItemVO {
  /**
   * 账务类型 1 费用 2 收款 3 退款
   */
  accountType?: number; // int32
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 所属组织
   */
  orgId?: number; // int64
  /**
   * 收费Id
   */
  paymentItemId?: number; // int64
  /**
   * 收费类目名称
   */
  paymentItemName?: string;
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * PaymentMethodOrgPageVO
 * 查询分页参数对象封装对象
 */
export class PaymentMethodOrgPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 组织付款方式设置
   */
  paymentMethodOrgVO?: PaymentMethodOrgVO;
}
/**
 * PaymentMethodOrgVO
 * 组织付款方式设置
 */
export class PaymentMethodOrgVO {
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 付款方式Id
   */
  orgId?: number; // int64
  /**
   * 付款方式Id
   */
  paymentMethodId?: number; // int64
  /**
   * id
   */
  paymentMethodOrgId?: number; // int64
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * PaymentMethodPageVO
 * 查询分页参数对象封装对象
 */
export class PaymentMethodPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 付款方式
   */
  paymentMethodVO?: PaymentMethodVO;
}
/**
 * PaymentMethodVO
 * 付款方式
 */
export class PaymentMethodVO {
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 付款方式编码
   */
  paymentMethodCode?: string;
  /**
   * 付款方式Id
   */
  paymentMethodId?: number; // int64
  /**
   * 付款方式名称
   */
  paymentMethodName?: string;
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * PriceCheckStatisticsVO
 * 价格核对统计
 */
export class PriceCheckStatisticsVO {
  /**
   * 营业日期
   */
  businessTime?: number; // int64
  /**
   * 列表数据
   */
  pageQuery?: PageQueryPriceCheckVO_;
  /**
   * 标准房价入住总个数
   */
  realPriceCount?: number; // int64
  /**
   * 非标准房价入住总个数
   */
  stdPriceCount?: number; // int64
}
/**
 * PriceCheckVO
 * 价格核对
 */
export class PriceCheckVO {
  /**
   * 入店日期
   */
  arrivalDate?: number; // int64
  /**
   * 离店日期
   */
  departureDate?: number; // int64
  /**
   * 入住单id
   */
  gresId?: number; // int64
  /**
   * 代码名称
   */
  rateCodeName?: string;
  /**
   * 实际房价
   */
  realPrice?: number; // int64
  /**
   * 房间号
   */
  roomNo?: string;
  /**
   * 房型名
   */
  roomTypeName?: string;
  /**
   * 业务来源名称
   */
  sourceName?: number; // int64
  /**
   * 标准房价
   */
  stdPrice?: number; // int64
}
/**
 * RateCodeAndDateCalendarVO
 * 房价管理（按房型查看）列表查询结果
 */
export class RateCodeAndDateCalendarVO {
  /**
   * 日期数组（顺序与价格数组一一对应）
   */
  dateArr?: number /* int64 */ [];
  /**
   * 月
   */
  month?: number; // int32
  /**
   * 价格数组（顺序与日期数组一一对应）
   */
  priceArr?: number /* int64 */ [];
  /**
   * 价格代码id
   */
  rateCodeId?: number; // int64
  /**
   * 价格代码名称
   */
  rateCodeName?: string;
  /**
   * 年
   */
  year?: number; // int32
}
/**
 * RateCodeAndDateVO
 * 房价管理（按房型查看）列表查询结果
 */
export class RateCodeAndDateVO {
  /**
   * 日期数组（顺序与价格数组一一对应）
   */
  dateArr?: number /* int64 */ [];
  /**
   * 价格数组（顺序与日期数组一一对应）
   */
  priceArr?: number /* int64 */ [];
  /**
   * 价格代码id
   */
  rateCodeId?: number; // int64
  /**
   * 价格代码名称
   */
  rateCodeName?: string;
}
/**
 * RateCodeAndPriceVO
 * 保存房价的价格代码与价格实体
 */
export class RateCodeAndPriceVO {
  /**
   * 价格
   */
  price?: number; // int64
  /**
   * 价格代码id
   */
  rateCodeId?: number; // int64
}
/**
 * RateCodeDeleteVO
 * 价格代码删除实体
 */
export class RateCodeDeleteVO {
  /**
   * 代码名称ID
   */
  rateCodeId?: number; // int64
}
/**
 * RateCodePageQueryVO
 * 价格代码管理查询列表条件VO
 */
export class RateCodePageQueryVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织ID（0：全部）
   */
  orgId?: number; // int64
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 代码名称
   */
  rateCodeName?: string;
  /**
   * 业务来源（0：全部）
   */
  sourceId?: number; // int64
  /**
   * 状态（0：全部，1：启用，2：禁用）
   */
  status?: number; // int32
}
/**
 * RateCodeSaveOrUpdateVO
 * 新增or编辑价格代码实体
 */
export class RateCodeSaveOrUpdateVO {
  /**
   * 代码名称ID（新增时候传0，编辑时候传原来记录的ID）
   */
  rateCodeId?: number; // int64
  /**
   * 代码名称
   */
  rateCodeName?: string;
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 业务来源
   */
  sourceIdList?: number /* int64 */ [];
  /**
   * 图片url
   */
  url?: string;
}
/**
 * RateCodeUpdateStatusVO
 * 价格代码启用or禁用实体
 */
export class RateCodeUpdateStatusVO {
  /**
   * 代码名称ID
   */
  rateCodeId?: number; // int64
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
}
/**
 * RateCodeVO
 * 价格代码
 */
export class RateCodeVO {
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 所属门店
   */
  orgName?: string;
  /**
   * 价格代码Id
   */
  rateCodeId?: number; // int64
  /**
   * 代码名称
   */
  rateCodeName?: string;
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 业务来源（多条记录用逗号分隔）
   */
  sourceName?: string;
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
  /**
   * 图片url
   */
  url?: string;
}
/**
 * RepairCondition
 * 维修管理查询条件
 */
export class RepairCondition {
  /**
   * 维修内容
   */
  content?: string;
  /**
   * 报修人
   */
  createdName?: string;
  /**
   * 结束时间
   */
  endTime?: number; // int64
  /**
   * 组织id
   */
  orgId?: number; // int64
  /**
   * 组织级别
   */
  orgLevel?: number; // int32
  /**
   * 开始时间
   */
  startTime?: number; // int64
  /**
   * 维修状态（1：待维修；2：维修完成；3：已取消）
   */
  status?: number; // int32
  /**
   * 维修类型（1：漏水）
   */
  type?: number; // int32
}
/**
 * RepairPageVO
 * 查询分页参数对象封装对象
 */
export class RepairPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 查询条件
   */
  repairCondition?: RepairCondition;
}
/**
 * RepairVO
 * 维修管理
 */
export class RepairVO {
  /**
   * 维修地点
   */
  address?: string;
  /**
   * 维修地点类型（1：房间；2：公共区域；3：其他）
   */
  addressType?: number; // int32
  /**
   * 维修内容
   */
  content?: string;
  /**
   * 报修人
   */
  createdName?: string;
  /**
   * 报修时间
   */
  createdTime?: number; // int64
  /**
   * 结束时间
   */
  endTime?: number; // int64
  /**
   * 维修id（更新时必填）
   */
  repairId?: number; // int64
  /**
   * 房间id
   */
  roomId?: number; // int64
  /**
   * 开始时间
   */
  startTime?: number; // int64
  /**
   * 维修状态（1：待维修；2：维修完成；3：已取消）
   */
  status?: number; // int32
  /**
   * 门店名称
   */
  storesName?: string;
  /**
   * 维修类型（1：漏水）
   */
  type?: number; // int32
}
/**
 * RoleVO
 * 角色实体
 */
export class RoleVO {
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  isSelected?: number; // int32
  /**
   * 组织Id
   */
  orgId?: number; // int64
  /**
   * 组织名称
   */
  orgName?: string;
  /**
   * 角色ID
   */
  roleId?: number; // int64
  /**
   * 角色名称
   */
  roleName?: string;
}
/**
 * RoomBookingTotalVO
 * 预留房间
 */
export class RoomBookingTotalVO {
  /**
   * 具体预留房间
   */
  list?: RoomBookingVO[];
  /**
   * 所属门店
   */
  orgId?: number; // int64
  /**
   * 预留数量
   */
  remainQty?: number; // int32
  /**
   * 房型id
   */
  roomId?: number; // int64
  /**
   * 预订数量
   */
  roomQty?: number; // int32
  /**
   * 房间类型id
   */
  roomTypeId?: number; // int64
  /**
   * 房型
   */
  roomTypeName?: number; // int64
  /**
   * 预留房间
   */
  rooms?: string;
}
/**
 * RoomBookingVO
 * 房型房间预订表
 */
export class RoomBookingVO {
  /**
   * 入店日期
   */
  arrivalDate?: number; // int64
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 离店日期
   */
  departureDate?: number; // int64
  /**
   * 预订的源客单id
   */
  gresId?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 所属门店
   */
  orgId?: number; // int64
  /**
   * 预订id
   */
  roomBookingId?: number; // int64
  /**
   * 房型id
   */
  roomId?: number; // int64
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 房价
   */
  roomRate?: string;
  /**
   * 房间类型id
   */
  roomTypeId?: number; // int64
  /**
   * 状态 1 有效预订 2 失效预订
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * RoomDetailsVO
 * 房间详情
 */
export class RoomDetailsVO {
  /**
   * 楼栋名
   */
  buildingName?: string;
  /**
   * 维修内容、自留用途
   */
  content?: string;
  /**
   * 结束日期
   */
  endTime?: number; // int64
  /**
   * 入住单id
   */
  gresId?: number; // int64
  /**
   * 姓名
   */
  name?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 房间id
   */
  roomId?: number; // int64
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 房态编码（1001：空房；1002：预定房：1003：在住房；1004：今日离；1005：维修房；1006：自留房）
   */
  roomStatusCode?: string;
  /**
   * 房态标签编码列表（3001：脏房；3002：散客入住；3003：团队入住；3004：欠款；3005：自留占用；3006：维修；3007：叫醒；3008：锁定；3009：未来预订；3010：今日离）
   */
  roomStatusTagCodeList?: string[];
  /**
   * 开始日期
   */
  startTime?: number; // int64
  /**
   * 类型名称（房型、维修）
   */
  typeName?: string;
}
/**
 * RoomGroupVO
 * 房间组
 */
export class RoomGroupVO {
  /**
   * 楼层名
   */
  floorName?: string;
  /**
   * 房间详情列表
   */
  roomDetailsVOList?: RoomDetailsVO[];
  /**
   * 房间号
   */
  roomNo?: string;
}
/**
 * RoomQueryVO
 * 房间分页查询对象
 */
export class RoomQueryVO {
  /**
   * 楼栋id
   */
  buildingId?: number; // int64
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 楼层id
   */
  floorId?: number; // int64
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织id
   */
  orgId?: number; // int32
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 楼层标签，多个用英文逗号隔开
   */
  roomTags?: string;
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 状态：0-全部，1-启动，2-禁用
   */
  status?: 1; // int32
}
/**
 * RoomRateCalendarPriceVO
 * 房价日历查询列表结果
 */
export class RoomRateCalendarPriceVO {
  /**
   * 时间-房型价格列表
   */
  rateCodeAndDateCalendarList?: RateCodeAndDateCalendarVO[];
  /**
   * 价格代码id
   */
  rateCodeId?: number; // int64
  /**
   * 价格代码名称
   */
  rateCodeName?: string;
  /**
   * 时间-房型价格列表
   */
  roomTypeAndDateCalendarList?: RoomTypeAndDateCalendarVO[];
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名称
   */
  roomTypeName?: string;
}
/**
 * RoomRateQueryResultVO
 * 房价管理列表查询结果实体
 */
export class RoomRateQueryResultVO {
  /**
   * 结果列表
   */
  list?: RoomRateVO[];
  /**
   * 结果列表循环出来的价格代码列表
   */
  rateCodeList?: RateCodeVO[];
  /**
   * 结果列表循环出来的房型列表
   */
  roomTypeList?: RoomTypeVO[];
}
/**
 * RoomRateQueryVO
 * 房价管理列表查询条件
 */
export class RoomRateQueryVO {
  /**
   * 开始日期
   */
  beginDate?: number; // int64
  /**
   * 结束日期
   */
  endDate?: number; // int64
  /**
   * 价格代码ID（0：全部）
   */
  rateCodeId?: number; // int64
  /**
   * 房型ID（0：全部）
   */
  roomTypeId?: number; // int64
  /**
   * 业务来源（0：全部）
   */
  sourceId?: number; // int64
  /**
   * 查看视图类型（1：按价格代码查看，2：按房型查看）
   */
  viewType?: number; // int32
}
/**
 * RoomRateSaveOrUpdateVO
 * 房价规则保存实体
 */
export class RoomRateSaveOrUpdateVO {
  /**
   * 开始时间（格式为yyyy-MM-dd的时间戳）
   */
  beginDate?: number; // int64
  /**
   * 结束时间（格式为yyyy-MM-dd的时间戳）
   */
  endDate?: number; // int64
  /**
   * 价格代码与价格列表
   */
  rateCodeAndPriceList?: RateCodeAndPriceVO[];
  /**
   * 价格代码id
   */
  rateCodeId?: number; // int64
  /**
   * 房型与价格列表
   */
  roomTypeAndPriceList?: RoomTypeAndPriceVO[];
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 星期掩码（页面上选了周一周二就1_2，选了周一周三周六就1_3_6，选了周三就3）
   */
  weekMask?: string;
}
/**
 * RoomRateVO
 * 房价管理列表结果
 */
export class RoomRateVO {
  /**
   * 时间-房型价格列表
   */
  rateCodeAndDateList?: RateCodeAndDateVO[];
  /**
   * 价格代码id
   */
  rateCodeId?: number; // int64
  /**
   * 价格代码名称
   */
  rateCodeName?: string;
  /**
   * 时间-房型价格列表
   */
  roomTypeAndDateList?: RoomTypeAndDateVO[];
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名称
   */
  roomTypeName?: string;
}
/**
 * RoomRetentionVO
 * 房间自留
 */
export class RoomRetentionVO {
  /**
   * 证件号码
   */
  docNo?: string;
  /**
   * 卡类型（1：身份证；2：护照；3：军官证；4：回乡证；5：其他）
   */
  docType?: number; // int32
  /**
   * 结束时间
   */
  endTime?: number; // int64
  /**
   * 客户姓名
   */
  guestName?: string;
  /**
   * 是否自留结束后设置为脏房（0：否；1：是）
   */
  isSetDirtyRoom?: number; // int32
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 房间id（新增时必填）
   */
  roomId?: number; // int64
  /**
   * 房间自留id（更新时必填）
   */
  roomRetentionId?: number; // int32
  /**
   * 开始时间
   */
  startTime?: number; // int64
}
/**
 * RoomStatusCondition
 * 房态查询条件
 */
export class RoomStatusCondition {
  /**
   * 楼栋id列表（远期房态使用）
   */
  buildingIdList?: number /* int64 */ [];
  /**
   * 类型（1：房型；2：房号）（今日房态使用）
   */
  orderType?: number; // int32
  /**
   * 房态标签编码列表（3001：脏房；3002：散客入住；3003：团队入住；3004：欠款；3005：自留占用；3006：维修；3007：叫醒；3008：锁定；3009：未来预订；3010：今日离）
   */
  roomStatusTagCodeList?: string[];
  /**
   * 房型id列表（远期房态使用）
   */
  roomTypeIdList?: number /* int64 */ [];
  /**
   * 开始时间（远期房态使用）
   */
  startTime?: number; // int64
  /**
   * 房间标签id列表（今日房态使用）
   */
  tagIdList?: number /* int64 */ [];
}
/**
 * RoomTagVO
 * 标签
 */
export class RoomTagVO {
  /**
   * 房态标签
   */
  roomStatusVOList?: TagVO[];
  /**
   * 房间标签
   */
  tagVOList?: TagVO[];
}
/**
 * RoomTypeAndDateCalendarVO
 * 房价管理（按价格代码查看）列表查询结果
 */
export class RoomTypeAndDateCalendarVO {
  /**
   * 日期数组（顺序与价格数组一一对应）
   */
  dateArr?: number /* int64 */ [];
  /**
   * 月
   */
  month?: number; // int32
  /**
   * 价格数组（顺序与日期数组一一对应）
   */
  priceArr?: number /* int64 */ [];
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名称
   */
  roomTypeName?: string;
  /**
   * 年
   */
  year?: number; // int32
}
/**
 * RoomTypeAndDateVO
 * 房价管理（按价格代码查看）列表查询结果
 */
export class RoomTypeAndDateVO {
  /**
   * 日期数组（顺序与价格数组一一对应）
   */
  dateArr?: number /* int64 */ [];
  /**
   * 价格数组（顺序与日期数组一一对应）
   */
  priceArr?: number /* int64 */ [];
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名称
   */
  roomTypeName?: string;
}
/**
 * RoomTypeAndPriceVO
 * 保存房价的房型与价格实体
 */
export class RoomTypeAndPriceVO {
  /**
   * 价格
   */
  price?: number; // int64
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
}
/**
 * RoomTypeBookingVO
 * 预订房型及房价
 */
export class RoomTypeBookingVO {
  /**
   * 房价
   */
  rate?: number; // int64
  /**
   * 可订数
   */
  roomQty?: number; // int32
  /**
   * 房型Id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名
   */
  roomTypeName?: string;
}
/**
 * RoomTypeGroupVO
 * 房间类型组
 */
export class RoomTypeGroupVO {
  /**
   * 可售个数
   */
  availableSaleCountList?: number /* int64 */ [];
  /**
   * 房间组列表
   */
  roomGroupVOList?: RoomGroupVO[];
  /**
   * 类型名称
   */
  typeName?: string;
}
/**
 * RoomTypeQueryVO
 * 房型分页查询对象
 */
export class RoomTypeQueryVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织id
   */
  orgId?: number; // int32
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 房型名称，模糊查询
   */
  roomTypeName?: string;
  /**
   * 状态：0-全部，1-启用，2-禁用
   */
  status?: 1; // int32
}
/**
 * RoomTypeVO
 * 房型表
 */
export class RoomTypeVO {
  /**
   * 所属门店
   */
  orgId?: number; // int64
  /**
   * 房间数
   */
  roomQty?: number; // int32
  /**
   * 房型Id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名
   */
  roomTypeName?: string;
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
}
/**
 * RoomVO
 * 房间表
 */
export class RoomVO {
  /**
   * 楼栋id
   */
  buildingId?: number; // int64
  /**
   * 楼层id
   */
  floorId?: number; // int64
  /**
   * 前台房态：O 占用  A  可用
   */
  frontState?: string;
  /**
   * 管家房态 D 脏房  C 清洁房（干净房）
   */
  hkState?: string;
  /**
   * 所属门店
   */
  orgId?: number; // int64
  /**
   * 分机号
   */
  phone?: string;
  /**
   * 房间Id
   */
  roomId?: number; // int64
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 楼层标签，多个用英文逗号隔开
   */
  roomTags?: string;
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
}
/**
 * RoomWakeVO
 * 叫醒
 */
export class RoomWakeVO {
  /**
   * 房间id列表
   */
  roomIdList?: number /* int64 */ [];
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 叫醒时间
   */
  wekeTime?: number; // int64
}
/**
 * SourcePageVO
 * 查询分页参数对象封装对象
 */
export class SourcePageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 业务来源
   */
  sourceVO?: SourceVO;
}
/**
 * SourceVO
 * 业务来源
 */
export class SourceVO {
  /**
   * 所属渠道
   */
  channelId?: number; // int64
  /**
   * 创建人
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 来源id
   */
  sourceId?: number; // int64
  /**
   * 业务来源名称
   */
  sourceName?: number; // int64
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
}
/**
 * SsoVO
 * 登陆后获取信息
 */
export class SsoVO {
  /**
   * 账号ID
   */
  accountId?: number; // int64
  /**
   * 账号类型
   */
  accountType?: number; // int32
  /**
   * 登陆状态码
   */
  code?: number; // int32
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 登陆账号
   */
  loginName?: string;
  /**
   * 登陆状态信息
   */
  msg?: string;
  /**
   * 账号所选组织ID
   */
  orgIdSelected?: number; // int64
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 用户token
   */
  token?: string;
  /**
   * 用户真实姓名
   */
  userName?: string;
}
/**
 * StatisticsCondition
 * 统计查询条件
 */
export class StatisticsCondition {
  /**
   * 结束营业日期
   */
  endBusinessTime?: number; // int64
  /**
   * 开始营业日期
   */
  startBusinessTime?: number; // int64
}
/**
 * StatisticsPageVO
 * 查询分页参数对象封装对象
 */
export class StatisticsPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 统计查询条件
   */
  statisticsCondition?: StatisticsCondition;
}
/**
 * StatisticsVO
 * 报表统计
 */
export class StatisticsVO {
  /**
   * 营业日期
   */
  businessTime?: number; // int64
  /**
   * 操作人
   */
  createdName?: string;
  /**
   * 夜审时间
   */
  endNaturalTime?: number; // int64
  /**
   * 文件路径
   */
  fileUrl?: string;
  /**
   * 本日收入
   */
  incomeToday?: number; // int32
  /**
   * 记录id
   */
  recordId?: number; // int32
}
/**
 * TagQueryVO
 * 标签分页查询对象
 */
export class TagQueryVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 标签名称
   */
  name?: string;
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 所属组织id
   */
  orgId?: number; // int32
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 状态：0-全部，1-启用，2-禁用
   */
  status?: 1; // int32
}
/**
 * TagVO
 * 通用标签
 */
export class TagVO {
  /**
   * code
   */
  code?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 组织id
   */
  orgId?: number; // int64
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
  /**
   * 标签id
   */
  tagId?: number; // int64
  /**
   * 类型
   */
  type?: string;
}
/**
 * TempAccountRegPageVO
 * 查询分页参数对象封装对象
 */
export class TempAccountRegPageVO {
  /**
   * 当前页,第一页默认1
   */
  currPage: number=0; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField?: string;
  /**
   * 默认降序
   */
  orderType?: string;
  /**
   * 每页的数量
   */
  pageSize: number=0; // int32
  /**
   * 临时挂账登记单
   */
  tempAccountRegQueryVO?: TempAccountRegQueryVO;
}
/**
 * TempAccountRegQueryVO
 * 临时挂账登记单列表查询入参
 */
export class TempAccountRegQueryVO {
  /**
   * 入住日期
   */
  checkInDate?: number; // int64
  /**
   * 入住人
   */
  owner?: string;
  /**
   * 挂账日期(结束时间)
   */
  regTimeEnd?: number; // int64
  /**
   * 挂账日期(开始时间)
   */
  regTimeStart?: number; // int64
  /**
   * 房间号
   */
  roomNo?: number; // int32
  /**
   * 协议单位
   */
  sourceName?: string;
}
/**
 * TempAccountRegVO
 * 临时挂账登记单
 */
export class TempAccountRegVO {
  /**
   * 账务余额
   */
  accountBalance?: number; // int64
  /**
   * 入住日期
   */
  checkInDate?: number; // int64
  /**
   * 离店日期
   */
  checkOutDate?: number; // int64
  /**
   * 入住人
   */
  owner?: string;
  /**
   * 登记单号
   */
  regNo?: string;
  /**
   * 挂账日期
   */
  regTime?: number; // int64
  /**
   * 备注
   */
  remark?: string;
  /**
   * 房间号
   */
  roomNo?: number; // int32
  /**
   * 房间类型
   */
  roomType?: number; // int32
  /**
   * 房间类型名称
   */
  roomTypeName?: string;
  /**
   * 协议单位
   */
  sourceName?: string;
}
/**
 * TodayRoomStatusVO
 * 今日房态
 */
export class TodayRoomStatusVO {
  /**
   * 房间详情列表
   */
  roomDetailsVOList?: RoomDetailsVO[];
  /**
   * 类型名称
   */
  typeName?: string;
}
/**
 * UsanceRoomStatusVO
 * 远期房态
 */
export class UsanceRoomStatusVO {
  /**
   * 可售总数
   */
  availableSaleSumList?: number /* int64 */ [];
  /**
   * 房间类型列表
   */
  roomTypeGroupVOList?: RoomTypeGroupVO[];
}
