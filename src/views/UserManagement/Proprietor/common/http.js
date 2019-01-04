import Cache from "./util";

// 获取省市
async function doFetchRegion() {
  const { dispatch } = this.props;
  return await dispatch({
    type: "common/regionGetOrgRegion",
    payload: {}
  });
}

async function doFetchOrg(regionId) {
  const { dispatch } = this.props;
  return await dispatch({
    type: "baseSetting/orgGetOrgByRegion",
    payload: {
      regionId,
      currPage: 1,
      pageSize: 9999
    }
  });
}

async function doFetchBuilding(orgId) {
  const { dispatch } = this.props;
  return await dispatch({
    type: "building/queryListByPage",
    payload: {
      orgId,
      currPage: 1,
      pageSize: 9999
    }
  });
}

async function doFetchFloor(orgId) {
  const { dispatch } = this.props;
  return await dispatch({
    type: "floor/queryListByPage",
    payload: {
      orgId,
      currPage: 1,
      pageSize: 9999
    }
  });
}

async function doFetchRoom(buildingId, floorId) {
  const { dispatch } = this.props;
  return await dispatch({
    type: "houseStatus/getRoomList",
    payload: {
      buildingId,
      floorId,
      status: 0,
      currPage: 1,
      pageSize: 9999
    }
  });
}

// 获取省市
const cache = {
  region: new Cache(doFetchRegion),
  org: new Cache(doFetchOrg),
  building: new Cache(doFetchBuilding),
  floor: new Cache(doFetchFloor),
  room: new Cache(doFetchRoom)
};

export const fetchRegion = async function() {
  cache.region
    .fromContext(this)
    .get("all")
    .then(res => {
      // debugger;
      res = res?.map(item => {
        return { ...item, value: item.regionId, text: item.regionName };
      });
      this.setState({
        options: {
          ...this.state.options,
          regionId: res
        }
      });
      return Promise.resolve(res);
    });
};

// 获取门店
export const fetchOrg = async function(regionId) {
  cache.org
    .fromContext(this)
    .get(regionId)
    .then(res => {
      res = res?.map(item => {
        return { ...item, value: item.orgId, text: item.orgName };
      });
      this.setState({
        options: {
          ...this.state.options,
          orgId: res
        }
      });
    });
};

// 获取楼栋
export const fetchBuilding = async function(orgId) {
  cache.building
    .fromContext(this)
    .get(orgId)
    .then(res => {
      res = res?.list?.map(item => {
        return { ...item, value: item.buildingId, text: item.buildingName };
      });
      this.setState({
        options: {
          ...this.state.options,
          buildingId: res
        }
      });
    });
};

// 获取楼层
export const fetchFloor = async function(orgId) {
  cache.floor
    .fromContext(this)
    .get(orgId)
    .then(res => {
      res = res?.list?.map(item => {
        return { ...item, value: item.floorId, text: item.floorName };
      });

      this.setState({
        options: {
          ...this.state.options,
          floorId: res
        }
      });
    });
};

// 获取房间
export const fetchRoom = async function(buildingId, floorId) {
  cache.room
    .fromContext(this)
    .get([buildingId, floorId])
    .then(res => {
      res = res?.dataList?.map(item => {
        return { ...item, value: item.roomId, text: item.roomNo };
      });
      this.setState({
        options: {
          ...this.state.options,
          roomId: res
        }
      });
    });
};
