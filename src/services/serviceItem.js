import baseRequest from 'utils/request';

const request = (url, params) => {
  return baseRequest(`/fc/ht-fc-pms-server/serviceItem/${url}`, params);
};

export function page(params) {
  return request('page', {
    method: 'POST',
    body: {
      ServiceItemPageVO: params,
    },
    pagination: true,
  });
}

export function stockLogPage(params) {
  return request('stockLogPage', {
    method: 'POST',
    body: {
      serviceItemLogPageVO: params,
    },
    pagination: true,
  });
}

export function deleteItem(params) {
  return request('delete', {
    body: {
      serviceItemVO: params,
    },
  });
}

export function saveItem(params) {
  return request('save', {
    body: {
      serviceItemVO: params,
    },
  });
}

export function update(params) {
  return request('update', {
    body: {
      serviceItemVO: params,
    },
  });
}

export function updateStatus(params) {
  return request('updateStatus', {
    body: {
      serviceItemVO: params,
    },
  });
}

export function updateStock(params) {
  return request('updateStock', {
    body: {
      serviceItemVO: params,
    },
  });
}
