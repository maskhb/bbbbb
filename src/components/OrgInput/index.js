import React from 'react';
import { Cascader } from 'antd';

export default class ProjectInput extends React.PureComponent {
  state = {
    value: [],
  }

  getOrgData() {
    const { data } = this.props;
    if (data) {
      return data;
    }
    return mocks;
  }

  convertByDataList = (data) => {
    const tempStr = JSON.stringify(data);
    const tempStr1 = tempStr.replace(/childOrgs/g, 'children').replace(/orgName/g, 'label').replace(/orgId/g, 'value');
    return JSON.parse(tempStr1);
  }

  convertByTreeList = (data) => {
    return data.map((province) => {
      return {
        value: province.orgId,
        label: province.orgNName,
        children: province.communitiesOfCityModels.map((city) => {
          return {
            value: city.cityId,
            label: city.cityName,
            children: city.communitiesInfo.map((community) => {
              return {
                value: community.communityId,
                label: community.communityName,
              };
            }),
          };
        }),
      };
    });
  }

  convertToOptions = () => {
    const { convertToOptions } = this.props;
    if (convertToOptions) {
      return convertToOptions(this.getOrgData());
    }
    return this.convertByDataList(this.getOrgData());
  }

  convertValue = () => {
    if ('value' in this.props) {
      return this.props.value;
    }
    return this.state.value;
  }

  handleSelectChange = (value, isInit) => {
    let newVal = value;
    if (value.length === 0) {
      newVal = this.initValue || value;
    }

    this.setState({
      value,
    });
    // onChangeExt可以跳过表单验证
    if (isInit === true) {
      this.props.onChangeExt && this.props.onChangeExt(newVal, isInit); //eslint-disable-line
    } else {
      this.props.onChange && this.props.onChange(newVal, isInit); //eslint-disable-line
    }
  }

  render() {
    const { style, value, selectLevel, placeholder, ...other } = this.props;
    const arr = ['省', '市', '项目'];
    return (
      <Cascader
        {...other}
        placeholder={placeholder || (selectLevel ? arr.slice(0, selectLevel).join('／') : '请选择')}
        style={style || { width: 220 }}
        value={this.convertValue()}
        options={this.convertToOptions()}
        onChange={this.handleSelectChange}
        changeOnSelect
      />
    );
  }
}

let mocks = [];
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  mocks = [{ orgId: 2, orgName: '伊斯登酒店', level: 1, parentId: 0, path: '', pathName: '', regionId: 11, regionNamePath: '广东省_广州市_天河区_冼村路', address: '1', lng: 0, lat: 0, memo: '1', orgType: 2, status: 1, isDelete: 0, createdTime: 0, updatedTime: 0, createdBy: 2203, updatedBy: 0, storeIds: null, childOrgs: [{ orgId: 3, orgName: '广东省', level: 2, parentId: 2, path: '2', pathName: '伊斯登酒店', regionId: 11, regionNamePath: '广东省_广州市_天河区_冼村路', address: '1', lng: 0, lat: 0, memo: '1', orgType: 2, status: 1, isDelete: 0, createdTime: 0, updatedTime: 0, createdBy: 2203, updatedBy: 0, storeIds: null, childOrgs: [{ orgId: 4, orgName: '粤东片区', level: 3, parentId: 3, path: '2_3', pathName: '伊斯登酒店_广东省', regionId: 11, regionNamePath: '广东省_广州市_天河区_冼村路', address: '1', lng: 0, lat: 0, memo: '1', orgType: 2, status: 1, isDelete: 0, createdTime: 0, updatedTime: 0, createdBy: 2203, updatedBy: 0, storeIds: null, childOrgs: [{ orgId: 6, orgName: '阳江恒大御景湾', level: 3, parentId: 4, path: '2_3_4', pathName: '伊斯登酒店_广东省_粤西片区', regionId: 11, regionNamePath: '广东省_广州市_天河区_冼村路', address: '1', lng: 0, lat: 0, memo: '1', orgType: 1, status: 1, isDelete: 0, createdTime: 0, updatedTime: 0, createdBy: 2203, updatedBy: 0, storeIds: null, childOrgs: null }, { orgId: 7, orgName: '恩平恒大泉都', level: 3, parentId: 4, path: '2_3_4', pathName: '伊斯登酒店_广东省_粤西片区', regionId: 11, regionNamePath: '广东省_广州市_天河区_冼村路', address: '1', lng: 0, lat: 0, memo: '1', orgType: 1, status: 1, isDelete: 0, createdTime: 0, updatedTime: 0, createdBy: 2203, updatedBy: 0, storeIds: null, childOrgs: null }] }, { orgId: 5, orgName: '粤西片区', level: 3, parentId: 3, path: '2_3', pathName: '伊斯登酒店_广东省', regionId: 11, regionNamePath: '广东省_广州市_天河区_冼村路', address: '1', lng: 0, lat: 0, memo: '1', orgType: 2, status: 1, isDelete: 0, createdTime: 0, updatedTime: 0, createdBy: 2203, updatedBy: 0, storeIds: null, childOrgs: null }] }] }];
}
