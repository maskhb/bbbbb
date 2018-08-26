```javascript
import request from './'
// 请求新接口
request('mj/[服务名]/api-path',{
  headers,
  body,
  ...,
  transformRequest (params) {
    // 入参转换
    return params
  },
  transformResponse (response) {
    // 回参转换
    // 默认只返回 data.result 的内容
    return response
  }
})

// 请求就接口
request('json/[服务名]/api-path',{
  headers,
  body,
  ...,
  transformRequest (params) {
    // 入参转换
    return params
  },
  transformResponse (response) {
    // 回参转换
    // 默认只返回 data.result 的内容
    return response
  }
})

// formData 请求
formData = new FormData();
formData.append('file', file);
formData.append('loginType', 1);
formData.append('type', 2);
formData.append('token', 'token.....');
// 无需设置content-type, fetch 会根据formData 自动设置content-type
request('/api/upload/file', {
  body: formData,
  ...
})

```
