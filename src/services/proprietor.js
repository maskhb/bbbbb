import request from '../utils/request';
// import moment from 'moment';

export const roomOwnerList = (params) => {
  return request('/fc/ht-fc-pms-server/roomOwner/list', {
    mock: true,
    method: 'POST',
    body: params,
  });
};

/**
 * roomOwnerVO:{
  "birthday": 0,
  "createdBy": 0,
  "createdTime": 0,
  "docNo": "string",
  "docType": 0,
  "gender": "string",
  "isDelete": 0,
  "name": "string",
  "phone": "string",
  "roomOwnerId": 0,
  "roomPathName": "string",
  "roomVO": [
    {
      "buildingId": 0,
      "buildingName": "string",
      "buildingRoomNo": "string",
      "floorId": 0,
      "floorName": "string",
      "orgId": 0,
      "orgName": "string",
      "phone": "string",
      "regionId": 0,
      "regionNamePath": "string",
      "roomDescription": "string",
      "roomId": 0,
      "roomNo": "string",
      "roomOwners": [
        {
          "docNo": "string",
          "docType": 0,
          "gender": "string",
          "name": "string",
          "phone": "string"
        }
      ],
      "roomTags": [
        {
          "roomId": 0,
          "tagId": 0,
          "tagName": "string"
        }
      ],
      "roomTypeId": 0,
      "status": 0
    }
  ],
  "updatedBy": 0,
  "updatedTime": 0
}
 */
export const roomOwnerSave = (params) => {
  return request('/fc/ht-fc-pms-server/roomOwner/save', {
    mock: true,
    method: 'POST',
    body: params,
  });
};

export const roomOwnerDetail = (params) => {
  return request('/fc/ht-fc-pms-server/roomOwner/detail', {
    mock: true,
    method: 'POST',
    body: params,
  });
};

export const findRoom = (roomOwnerQuery) => {
  return request('/fc/ht-fc-pms-server/roomOwner/listByModel', {
    mock: true,
    method: 'POST',
    body: {
      roomOwnerQuery,
    },
  });
};
