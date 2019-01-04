const path = require('path');
const Builder = require('htlib/src/builder/config-builder');
const _ = require('lodash');


const builder = new Builder();
builder.willCreateConfigJsonFile = true;

builder
  .output(path.resolve(__dirname, './proxy-configs'))
  .envMap({
    release: {
      server_name: 'pms.ifencheng.cn',
      locationRoot: '/htdata/www/fcpms-platform',
      access_log: '/var/log/nginx/log/fcpms-platform.log logstash buffer=32k flush=5m',
      error_log: '/var/log/nginx/log/err-fcpms-patform.log',
    },
    stg: {
      server_name: 'pms-stg.ifencheng.cn',
      locationRoot: '/htdata/www/fcpms-platform',
      access_log: '/var/log/nginx/log/stg.fcpms-platform.log',
      error_log: '/var/log/nginx/log/stg.err-fcpms-patform.log',
    },
    fix: {
      server_name: 'ht-fcpms-fix.hd fix.fcpms.hd',
      locationRoot: '/htdata/www/fcpms-platform',
      access_log: '/var/log/nginx/log/beta.fcpms-platform.log',
      error_log: '/var/log/nginx/log/beta.err-fcpms-patform.log',
    },
    beta: {
      server_name: 'ht-fcpms-test.htmimi.com ht-fcpms-test.hd test.fcpms.hd',
      locationRoot: '/htdata/www2/fcpms-platform',
      access_log: '/var/log/nginx/log/beta.fcpms-platform.log',
      error_log: '/var/log/nginx/log/beta.err-fcpms-patform.log',
    },
    sit: {
      server_name: 'ht-fcpms-sit.htmimi.com ht-fcpms-sit.hd sit.fcpms.hd',
      locationRoot: '/htdata/www2/fcpms-platform',
      access_log: '/var/log/nginx/log/sit.fcpms-platform.log',
      error_log: '/var/log/nginx/log/sit.err-fcpms-patform.log',
    },
    development: {
      server_name: 'ht-fcpms-dev.hd dev.fcpms.hd',
      locationRoot: '/htdata/www/fcpms-platform',
      access_log: '/var/log/nginx/log/beta.fcpms-platform.log',
      error_log: '/var/log/nginx/log/beta.err-fcpms-patform.log',
    },
    dev: {
      server_name: 'ht-fcpms-dev.hd dev.fcpms.hd',
      locationRoot: '/htdata/www/fcpms-platform',
      access_log: '/var/log/nginx/log/beta.fcpms-platform.log',
      error_log: '/var/log/nginx/log/beta.err-fcpms-patform.log',
    },
    stress: {
      server_name: 'ht-fcpms-stress.hd stress.fcpms.hd',
      locationRoot: '/htdata/www/fcpms-platform',
      access_log: '/var/log/nginx/log/stress.fcpms-platform.log',
      error_log: '/var/log/nginx/log/stress.err-fcpms-patform.log',
    },
  })
  .setCustomProxy((config) => {
    // 为了nginx能访问到img
    const img = _.template(builder.envTemplates.preImgDomainMap[config.env || 'dev'])({ preDomain: 'img1' });
    const imgHost = img.replace('http://', '');
    const fc = builder.envTemplates.fcPreDomainMap[config.env || 'dev'];

    // console.log(fc);

    return `location ~* /api/img/(.*) {
        proxy_pass ${img}/$1;
        proxy_set_header Host ${imgHost};
      }

      gzip on;
      gzip_min_length 2048;
      gzip_types text/plain application/x-javascript application/javascript text/css text/javascript;
      location / {
        root ${config.locationRoot};
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control no-store;
      }

      location /download/ {
        proxy_pass http://${fc}/;
        proxy_set_header Host ${fc};
      }

      location ~* .(js|css|png|jpg)$ {
        root ${config.locationRoot};
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        expires 5d;
      }`;
  })
  .setProxy((pre) => {
    return {
      '/api/system': `${pre('sys-sso-api')}`,
      '/api/system/private': `${pre('sys-privilege-api')}`,
      '/api/system/user': `${pre('sys-user-api')}`,
      '/api/pay': `${pre('payment-api')}`,
      '/api/upload': `${pre('upload-api')}/upload`,
      '/api/captcha': `${pre('verify-api')}/captcha`,
      '/api/excel/export/getFileWithToken': `${pre('pub-export-api')}/export/getFileWithToken`,
      '/api/download/export/getFileWithToken': `${pre('web-proxy')}/fc/ht-fc-pms-server/statistics/receivables/download`,
      '/api/encode-get': `${pre('web-proxy')}/encode-get`,
      '/fc': `${pre('web-proxy')}/fc`,
      '/json': `${pre('web-proxy')}/json`,
    };
  });

builder.run();
