# 生成nginx代理配置

## 目的
  为了不暴露真实的接口、图片等服务器地址。

## 如何做
  前端请求同域名接口，服务器代理到真实接口地址。

## 配置
  http://xxx/api/a/ -> http://axx/  
  http://xxx/api/b/ -> http://bxxx/
