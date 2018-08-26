// 提交时候的数据重组
function formatData(formInfo, state) {
  let merchantCommunityRefVoList = [];
  const { seleted, checkAll } = state;
  if (seleted && Array.isArray(seleted)) {
    seleted.forEach(v => merchantCommunityRefVoList.push({ communityId: v }));
  } else {
    merchantCommunityRefVoList = state.fmtData?.merchantCommunityRefVoList || [];
  }
  const {
    merchantOperateArr,
    AUTH, LEGALA, LEGALB, HEAD, BENEA, BENEB, LICENCE,
    LOGO, ORGA, TAX, address, regionId,
    beneficiaryAccountNumber,
    beneficiaryBankName,
    beneficiaryIdentityCardNumber,
    beneficiaryName,
    beneficiaryOpeningBankName,
    merchantName,
    couponAccount,
    chineseName,
    contactPersonEmail,
    contactPersonMobilePhone,
    contactPersonName,
    contactPersonPhone,
    englishName,
    institutionaCode,
    legalRepresentative,
    legalRepresentativeIdcardNo,
    licenseName,
    licenseNumber,
    merchantType,
    orderReceiveTelphoneNo,
    predepositCouponSwitch,
    categoryName,
    summary,
    taxNumber,
    telphoneNo,
    trafficInfo,
    unionMerchantId,
  } = formInfo;
  let { categoryId } = formInfo;
  if (categoryId&&Array.isArray(categoryId)&&categoryId.length) { categoryId = categoryId[categoryId.length-1]; }//eslint-disable-line
  const originImgVoList = [
    {
      type: 1,
      url: LOGO,
    },
    {
      type: 2,
      url: HEAD,
    },
    {
      type: 3,
      url: LICENCE,
    },
    {
      type: 4,
      url: LEGALA,
    },
    {
      type: 5,
      url: LEGALB,
    },
    {
      type: 6,
      url: ORGA,
    },
    {
      type: 7,
      url: AUTH,
    },
    {
      type: 8,
      url: TAX,
    },
    {
      type: 9,
      url: BENEA,
    },
    {
      type: 10,
      url: BENEB,
    },
  ];
  const merchantImgVoList = [];
  originImgVoList.forEach((v) => {
    if (v.url) {
      merchantImgVoList.push(v);
    }
  });
  const { value } = regionId || {};
  const merchantBaseVo = {
    address,
    merchantName,
    allCommunity: checkAll ? 1 : (Array.isArray(seleted) && !seleted.length ? 0 : 2),
    categoryId,
    chineseName,
    englishName,
    categoryName,
    status,
    merchantType,
    orderReceiveTelphoneNo,
    predepositCouponSwitch,
    summary,
    telphoneNo,
    trafficInfo,
    couponAccount,
    unionMerchantId,
    regionId: value && Array.isArray(value) ? value[value.length - 1] : null,
    merchantId: state.merchantId && state.merchantId.indexOf('&') > 0 ? state.merchantId.split('&')[0] : state.merchantId,
  };

  const merchantBeneficiaryVo = {
    beneficiaryAccountNumber,
    beneficiaryBankName,
    beneficiaryIdentityCardNumber,
    beneficiaryName,
    beneficiaryOpeningBankName,
    taxNumber,
  };


  const merchantContactVo = {
    contactPersonEmail,
    contactPersonMobilePhone,
    contactPersonName,
    contactPersonPhone,
  };


  const merchantOperateScopeVoList = [];
  if (merchantOperateArr && Array.isArray(merchantOperateArr)) {
    merchantOperateArr.forEach(v => merchantOperateScopeVoList.push(
      { goodsCategoryId: v }
    ));
  }


  const merchantQualificationVo = {
    institutionaCode,
    legalRepresentative,
    legalRepresentativeIdcardNo,
    licenseName,
    licenseNumber,
  };
  const res = {
    merchantBaseVo,
    merchantBeneficiaryVo,
    merchantCommunityRefVoList,
    merchantContactVo,
    merchantImgVoList,
    merchantOperateScopeVoList,
    merchantQualificationVo,
  };

  return res;
}

// 查看详情和编辑的数据重组
function unFormatData(data, regArr) {
  let {
    merchantCommunityRefVoList ,merchantOperateScopeVoList, merchantBaseVo, merchantImgVoList, merchantQualificationVo, merchantBeneficiaryVo, ...otherParams//eslint-disable-line
  } = data;
  let LOGO;
  let HEAD;
  let LICENCE;
  let LEGALA;
  let LEGALB;
  let ORGA;
  let AUTH;
  let TAX;
  let BENEA;
  let BENEB;

  const merchantOperateArr = [];
  const merchantOperateNameArr = [];
  if (merchantOperateScopeVoList && Array.isArray(merchantOperateScopeVoList)) {
    merchantOperateScopeVoList.forEach((v) => {
      merchantOperateArr.push(
        v.goodsCategoryId.toString()
      );
      merchantOperateNameArr.push(
        v.goodsCategoryName
      );
    });
  }
  const checkedCommunityIds = [];
  // eslint-disable-next-line
  merchantCommunityRefVoList && Array.isArray(merchantCommunityRefVoList) && merchantCommunityRefVoList.forEach((v) => {
    checkedCommunityIds.push(v.communityId);
  });

  merchantImgVoList?.forEach((v) => {
    if (v.url) {
      switch (v.type) {
        case 1:
          LOGO = v.url;
          break;
        case 2:
          HEAD = v.url;
          break;
        case 3:
          LICENCE = v.url;
          break;
        case 4:
          LEGALA = v.url;
          break;
        case 5:
          LEGALB = v.url;
          break;
        case 6:
          ORGA = v.url;
          break;
        case 7:
          AUTH = v.url;
          break;
        case 8:
          TAX = v.url;
          break;
        case 9:
          BENEA = v.url;
          break;
        case 10:
          BENEB = v.url;
          break;
        default:
          break;
      }
    }
  });
  merchantBaseVo = {
    ...merchantBaseVo,
    regionId: regArr,
    merchantOperateArr,
    merchantOperateNameArr,
    LOGO,
    HEAD,
    checkedCommunityIds,
  };
  merchantQualificationVo = {
    ...merchantQualificationVo,
    ORGA,
    AUTH,
    LEGALA,
    LEGALB,
    LICENCE,
  };
  merchantBeneficiaryVo = {
    ...merchantBeneficiaryVo,
    TAX,
    BENEA,
    BENEB,
  };
  const res = {
    merchantBaseVo,
    merchantQualificationVo,
    merchantBeneficiaryVo,
    merchantCommunityRefVoList,
    ...otherParams,
  };
  return res;
}


export {
  formatData,
  unFormatData,
};
