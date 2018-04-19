# mock

## mock入口文件
.roadhogrc.mock.js
```js
// 获取mock文件夹所有的文件
const config = require('require-glob').sync('./mock/*');

// 根据config的方法，生成get和post请求
for(const [key, val] of Object.entries(config)) {
  for(const [k, v] of Object.entries(val)) {
    proxy[`GET /api/${key}/${k}`] = proxy[`POST /api/${key}/${k}`] = v;
  }
}
```

## 新增mock
模板：tempaltes/mock.js

```
├─mock
│  ├─mock.js           # mock文件
```

```js
function add(req, res) {
  const result = { };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export {
  add,
};
```
则生成api：GET/POST /api/xxx/a
