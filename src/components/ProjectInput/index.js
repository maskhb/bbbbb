import React from 'react';
import { Cascader } from 'antd';

export default class ProjectInput extends React.PureComponent {
  state = {
    value: [],
  }

  getCommunities() {
    const { data } = this.props;
    if (data) {
      return data;
    }
    return mocks;
  }

  convertByDataList = (data) => {
    const result = [];
    for (const k of data) {
      let rp = null;
      let rc = null;
      result.forEach((r) => {
        if (r.value === k.provinceId) {
          rp = r;
          rp.children.forEach((c) => {
            if (c.label === k.cityName) {
              rc = c;
            }
          });
          if (rc === null) {
            rc = {
              value: k.cityId,
              label: k.cityName,
              children: [],
            };
            rp.children.push(rc);
          }
        }
      });
      if (rp === null) {
        rp = {
          value: k.provinceId,
          label: k.provinceName,
          children: [],
        };
        rc = {
          value: k.cityId,
          label: k.cityName,
          children: [],
        };
        rp.children.push(rc);
        result.push(rp);
      }

      rc.children.push({
        value: k.communityId,
        label: k.communityName,
      });
    }
    return result;
  }

  convertByTreeList = (data) => {
    return data.map((province) => {
      return {
        value: province.provinceId,
        label: province.provinceName,
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
      return convertToOptions(this.getCommunities());
    }
    return this.convertByDataList(this.getCommunities());
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
        placeholder={placeholder || (selectLevel ? arr.slice(0, selectLevel).join('／') : '省／市／项目')}
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
  // mocks = [{ provinceId: 1, provinceName: '北京', communitiesOfCityModels: [{ provinceId: 1, 'provinceName': '北京', cityId: 2, 'cityName': '北京市', communitiesInfo: [{ 'communityId': 83, communityName: '安阳恒大绿洲（安阳通瑞达）', provinceId: 1, provinceName: '北京', 'cityId': 2, cityName: '北京市', districtId: 3, 'districtName': '东城区', streetId: 6, 'streetName': '交道口街道', isVirtual: 0 }, { 'communityId': 69, communityName: '景德镇·恒大名都（景德镇置业）', provinceId: 1, provinceName: '北京', 'cityId': 2, cityName: '北京市', districtId: 3, 'districtName': '东城区', streetId: 4, streetName: '东华门街道', 'isVirtual': 0 }, { 'communityId': 656, 'communityName': '虚拟项目C（开发用）2017-11-22 11:09:14', provinceId: 1, 'provinceName': '北京', cityId: 2, cityName: '北京市', districtId: 202, districtName: '顺义区', 'streetId': 207, 'streetName': '天竺', isVirtual: 0 }, { 'communityId': 657, 'communityName': '虚拟项目D（开发用）2017-11-22 11:09:14', provinceId: 1, 'provinceName': '北京', 'cityId': 2, 'cityName': '北京市', districtId: 202, 'districtName': '顺义区', streetId: 207, streetName: '天竺', 'isVirtual': 0 }, { communityId: 658, 'communityName': '虚拟项目E（开发用）2017-11-22 11:09:14', 'provinceId': 1, provinceName: '北京', cityId: 2, 'cityName': '北京市', districtId: 202, districtName: '顺义区', 'streetId': 207, streetName: '天竺', isVirtual: 0 }, { communityId: 659, communityName: '虚拟项目C（开发用）2017-11-22 12:37:29', 'provinceId': 1, provinceName: '北京', cityId: 2, 'cityName': '北京市', districtId: 202, districtName: '顺义区', 'streetId': 207, 'streetName': '天竺', 'isVirtual': 0 }, { communityId: 660, communityName: '虚拟项目C（开发用）10000', provinceId: 1, provinceName: '北京', cityId: 2, 'cityName': '北京市', 'districtId': 202, 'districtName': '顺义区', streetId: 207, 'streetName': '天竺', 'isVirtual': 0 }, { communityId: 661, 'communityName': '虚拟项目E（开发用）2017-11-22 12:37:29', provinceId: 1, 'provinceName': '北京', 'cityId': 2, 'cityName': '北京市', 'districtId': 202, 'districtName': '顺义区', streetId: 207, streetName: '天竺', isVirtual: 0 }] }] }, { 'provinceId': 27730, provinceName: '广东省', 'communitiesOfCityModels': [{ 'provinceId': 27730, 'provinceName': '广东省', cityId: 28224, 'cityName': '佛山市', communitiesInfo: [{ communityId: 469, 'communityName': '恒大御景半岛', provinceId: 27730, provinceName: '广东省', cityId: 28224, cityName: '佛山市', 'districtId': 28230, districtName: '南海区', 'streetId': 28237, 'streetName': '里水镇', 'isVirtual': 0 }] }, { provinceId: 27730, provinceName: '广东省', cityId: 27731, cityName: '广州市', communitiesInfo: [{ communityId: 467, communityName: '第二金碧花园', 'provinceId': 27730, provinceName: '广东省', cityId: 27731, cityName: '广州市', districtId: 27774, 'districtName': '海珠区', streetId: 27787, 'streetName': '瑞宝街道', 'isVirtual': 0 }, { 'communityId': 147, 'communityName': '第三金碧花园', provinceId: 27730, 'provinceName': '广东省', cityId: 27731, cityName: '广州市', districtId: 27774, districtName: '海珠区', 'streetId': 27787, 'streetName': '瑞宝街道', isVirtual: 0 }, { communityId: 145, 'communityName': '第一金碧花园', provinceId: 27730, provinceName: '广东省', 'cityId': 27731, cityName: '广州市', districtId: 27774, 'districtName': '海珠区', 'streetId': 27787, streetName: '瑞宝街道', isVirtual: 0 }, { 'communityId': 62, 'communityName': '广州恒大中心', 'provinceId': 27730, provinceName: '广东省', cityId: 27731, cityName: '广州市', 'districtId': 27793, districtName: '天河区', streetId: 27806, 'streetName': '冼村街道', 'isVirtual': 0 }, { communityId: 555, communityName: '广州亚运城', provinceId: 27730, 'provinceName': '广东省', cityId: 27731, 'cityName': '广州市', 'districtId': 27793, 'districtName': '天河区', streetId: 27806, streetName: '冼村街道', 'isVirtual': 1 }, { 'communityId': 663, communityName: '恒大山城12', provinceId: 27730, provinceName: '广东省', cityId: 27731, cityName: '广州市', 'districtId': 27793, 'districtName': '天河区', streetId: 27805, streetName: '猎德街道', 'isVirtual': 0 }, { communityId: 664, 'communityName': '恒大山城12', 'provinceId': 27730, provinceName: '广东省', 'cityId': 27731, 'cityName': '广州市', 'districtId': 27793, 'districtName': '天河区', streetId: 27805, 'streetName': '猎德街道', 'isVirtual': 0 }, { communityId: 667, communityName: '【开发】小区项目名称003', 'provinceId': 27730, 'provinceName': '广东省', cityId: 27731, cityName: '广州市', districtId: 27774, 'districtName': '海珠区', 'streetId': 27787, 'streetName': '瑞宝街道', 'isVirtual': 1 }, { communityId: 668, 'communityName': '【开发】小区项目名称004+1', 'provinceId': 27730, provinceName: '广东省', 'cityId': 27731, 'cityName': '广州市', districtId: 27774, 'districtName': '海珠区', streetId: 27787, 'streetName': '瑞宝街道', 'isVirtual': 0 }] }] }, { 'provinceId': 674, provinceName: '河北省', 'communitiesOfCityModels': [{ 'provinceId': 674, 'provinceName': '河北省', cityId: 675, cityName: '石家庄市', 'communitiesInfo': [{ 'communityId': 662, communityName: 'testtet', 'provinceId': 674, 'provinceName': '河北省', cityId: 675, cityName: '石家庄市', districtId: 676, districtName: '长安区', streetId: 687, 'streetName': '高营镇', 'isVirtual': 0 }, { 'communityId': 507, 'communityName': '恒大御景半岛', provinceId: 674, 'provinceName': '河北省', 'cityId': 675, 'cityName': '石家庄市', districtId: 676, districtName: '长安区', streetId: 687, streetName: '高营镇', isVirtual: 0 }] }] }, { provinceId: 20939, 'provinceName': '河南省', communitiesOfCityModels: [{ 'provinceId': 20939, provinceName: '河南省', cityId: 21289, cityName: '洛阳市', communitiesInfo: [{ 'communityId': 225, communityName: '恒大绿洲', 'provinceId': 20939, 'provinceName': '河南省', cityId: 21289, 'cityName': '洛阳市', 'districtId': 21310, districtName: '瀍河回族区', streetId: 21318, streetName: '瀍河回族乡', isVirtual: 0 }] }] }, { provinceId: 23618, 'provinceName': '湖北省', communitiesOfCityModels: [{ provinceId: 23618, provinceName: '湖北省', 'cityId': 23619, cityName: '武汉市', communitiesInfo: [{ 'communityId': 508, communityName: '恒大首府', provinceId: 23618, provinceName: '湖北省', cityId: 23619, 'cityName': '武汉市', 'districtId': 23678, districtName: '武昌区', 'streetId': 23679, streetName: '积玉桥街办事处', isVirtual: 0 }] }] }, { provinceId: 25130, provinceName: '湖南省', communitiesOfCityModels: [{ provinceId: 25130, 'provinceName': '湖南省', cityId: 25131, cityName: '长沙市', communitiesInfo: [{ communityId: 439, communityName: '恒大雅苑', 'provinceId': 25130, 'provinceName': '湖南省', 'cityId': 25131, 'cityName': '长沙市', 'districtId': 25180, 'districtName': '开福区', 'streetId': 25190, streetName: '洪山街道', isVirtual: 0 }] }] }, { provinceId: 17071, provinceName: '江西省', 'communitiesOfCityModels': [{ 'provinceId': 17071, provinceName: '江西省', cityId: 17072, 'cityName': '南昌市', 'communitiesInfo': [{ communityId: 329, communityName: '恒大城', 'provinceId': 17071, 'provinceName': '江西省', 'cityId': 17072, cityName: '南昌市', 'districtId': 17130, districtName: '南昌县', 'streetId': 17146, 'streetName': '富山乡', 'isVirtual': 0 }] }] }, { provinceId: 6108, provinceName: '辽宁省', 'communitiesOfCityModels': [{ 'provinceId': 6108, provinceName: '辽宁省', cityId: 6109, 'cityName': '沈阳市', communitiesInfo: [{ communityId: 229, 'communityName': '恒大绿洲', provinceId: 6108, 'provinceName': '辽宁省', 'cityId': 6109, 'cityName': '沈阳市', 'districtId': 6223, districtName: '于洪区', 'streetId': 6229, 'streetName': '南阳湖街道', 'isVirtual': 0 }] }] }, { provinceId: 18961, 'provinceName': '山东省', communitiesOfCityModels: [{ 'provinceId': 18961, 'provinceName': '山东省', 'cityId': 18962, 'cityName': '济南市', communitiesInfo: [{ communityId: 441, communityName: '恒大城', provinceId: 18961, provinceName: '山东省', 'cityId': 18962, 'cityName': '济南市', 'districtId': 19027, districtName: '历城区', 'streetId': 19038, 'streetName': '郭店街道', isVirtual: 0 }, { communityId: 477, 'communityName': '恒大绿洲', provinceId: 18961, provinceName: '山东省', cityId: 18962, 'cityName': '济南市', 'districtId': 19049, 'districtName': '长清区', streetId: 19050, 'streetName': '文昌街道', 'isVirtual': 0 }] }] }, { provinceId: 31936, provinceName: '四川省', communitiesOfCityModels: [{ provinceId: 31936, provinceName: '四川省', 'cityId': 31937, 'cityName': '成都市', communitiesInfo: [{ 'communityId': 211, 'communityName': '恒大城', 'provinceId': 31936, 'provinceName': '四川省', cityId: 31937, cityName: '成都市', districtId: 32058, 'districtName': '温江区', 'streetId': 32059, streetName: '柳城街道', isVirtual: 0 }] }] }];
  // eslint-disable-next-line
  mocks = [{ communityId: 669, provinceId: 1, provinceName: '北京', communityName: '才', cityName: '北京市', cityArea: '' }, { communityId: 668, provinceId: 27730, provinceName: '广东省', communityName: '【开发】小区项目名称004+1', cityName: '广州市', cityArea: '' }, { communityId: 667, provinceId: 27730, provinceName: '广东省', communityName: '【开发】小区项目名称003', cityName: '广州市', cityArea: '' }, { communityId: 665, provinceId: 27730, provinceName: '广东省', communityName: '【开发】小区项目名称002', cityName: '广州市', cityArea: '' }, { communityId: 665, provinceId: 27730, provinceName: '广东省', communityName: '【开发】小区项目名称002', cityName: '广州市', cityArea: '' }, { communityId: 229, provinceId: 6108, provinceName: '辽宁省', communityName: '恒大绿洲', cityName: '沈阳市', cityArea: '沈阳区' }, { communityId: 477, provinceId: 18961, provinceName: '山东省', communityName: '恒大绿洲', cityName: '济南市', cityArea: '长清区' }, { communityId: 62, provinceId: 27730, provinceName: '广东省', communityName: '广州恒大中心', cityName: '广州市', cityArea: '' }, { communityId: 658, provinceId: 1, provinceName: '北京', communityName: '虚拟项目E（开发用）2017-11-22 11:09:14', cityName: '北京市', cityArea: '' }, { communityId: 225, provinceId: 20939, provinceName: '河南省', communityName: '恒大绿洲', cityName: '洛阳市', cityArea: '洛阳区' }, { communityId: 664, provinceId: 27730, provinceName: '广东省', communityName: '恒大山城12', cityName: '广州市', cityArea: '' }, { communityId: 469, provinceId: 27730, provinceName: '广东省', communityName: '恒大御景半岛', cityName: '佛山市', cityArea: '南海区' }, { communityId: 657, provinceId: 1, provinceName: '北京', communityName: '虚拟项目D（开发用）2017-11-22 11:09:14', cityName: '北京市', cityArea: '' }, { communityId: 211, provinceId: 31936, provinceName: '四川省', communityName: '恒大城', cityName: '成都市', cityArea: '温江区' }, { communityId: 663, provinceId: 27730, provinceName: '广东省', communityName: '恒大山城12', cityName: '广州市', cityArea: '' }, { communityId: 467, provinceId: 27730, provinceName: '广东省', communityName: '第二金碧花园', cityName: '广州市', cityArea: '海珠区' }, { communityId: 656, provinceId: 1, provinceName: '北京', communityName: '虚拟项目C（开发用）2017-11-22 11:09:14', cityName: '北京市', cityArea: '' }, { communityId: 147, provinceId: 27730, provinceName: '广东省', communityName: '第三金碧花园', cityName: '广州市', cityArea: '海珠区' }, { communityId: 662, provinceId: 674, provinceName: '河北省', communityName: 'testtet', cityName: '石家庄市', cityArea: '' }, { communityId: 441, provinceId: 18961, provinceName: '山东省', communityName: '恒大城', cityName: '济南市', cityArea: '历城区' }, { communityId: 555, provinceId: 27730, provinceName: '广东省', communityName: '广州亚运城', cityName: '广州市', cityArea: '' }, { communityId: 145, provinceId: 27730, provinceName: '广东省', communityName: '第一金碧花园', cityName: '广州市', cityArea: '海珠区' }, { communityId: 661, provinceId: 1, provinceName: '北京', communityName: '虚拟项目E（开发用）2017-11-22 12:37:29', cityName: '北京市', cityArea: '' }, { communityId: 439, provinceId: 25130, provinceName: '湖南省', communityName: '恒大雅苑', cityName: '长沙市', cityArea: '开福区' }, { communityId: 508, provinceId: 23618, provinceName: '湖北省', communityName: '恒大首府', cityName: '武汉市', cityArea: '三江' }, { communityId: 83, provinceId: 1, provinceName: '北京', communityName: '安阳恒大绿洲（安阳通瑞达）', cityName: '北京市', cityArea: '' }, { communityId: 660, provinceId: 1, provinceName: '北京', communityName: '虚拟项目C（开发用）10000', cityName: '北京市', cityArea: '' }, { communityId: 329, provinceId: 17071, provinceName: '江西省', communityName: '恒大城', cityName: '南昌市', cityArea: '南昌区' }, { communityId: 507, provinceId: 674, provinceName: '河北省', communityName: '恒大御景半岛', cityName: '石家庄市', cityArea: '高营' }, { communityId: 69, provinceId: 1, provinceName: '北京', communityName: '景德镇·恒大名都（景德镇置业）', cityName: '北京市', cityArea: '' }, { communityId: 659, provinceId: 1, provinceName: '北京', communityName: '虚拟项目C（开发用）2017-11-22 12:37:29', cityName: '北京市', cityArea: '' }];
}
