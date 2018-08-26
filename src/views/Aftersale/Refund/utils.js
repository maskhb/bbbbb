function setCookie(name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = `${name}=${escape(value)
  }${(expiredays == null) ? '' : `;expires=${exdate.toGMTString()}`}`;
}

const mapEn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

const mapDe = {};

for (let i = 0; i < 64; i++) { mapDe[mapEn[i]] = i; }//eslint-disable-line

/*

* 函数: Base64Encode

* 说明: 编码

*/

function Base64Encode(data) {
  const buf = [];

  const map = mapEn;

  const n = data.length; // 总字节数

  let val; // 中间值

  let i = 0;

  /*

        * 3字节 ==> val ==> 4字符

        */

  while (i < n) {
    val = (data[i] << 16) |

                       (data[i + 1] << 8) |

                       (data[i + 2]);

    buf.push(map[val >> 18],

      map[val >> 12 & 63],//eslint-disable-line

      map[val >> 6 & 63],//eslint-disable-line

      map[val & 63]);

    i += 3;
  }
  // 凑两个"="
  if (n % 3 === 1)
  // 凑一个"="
  { buf.pop(), buf.pop(), buf.push('=', '='); } else // eslint-disable-line

  { buf.pop(), buf.push('='); }//eslint-disable-line

  return buf.join('');
}

/*

* 函数: Base64Decode

* 说明: 解码

*/

function Base64Decode(str) {
  const buf = [];

  const arr = str.split('');

  const map = mapDe;

  let n = arr.length; // 总字符数

  let val; // 中间值

  let i = 0;

  /*

        * 长度异常

        */

  if (n % 4) { return; }

  /*

        * 4字符 ==> val ==> 3字节

        */

  while (i < n) {
    val = (map[arr[i]] << 18) |

                       (map[arr[i + 1]] << 12) |

                       (map[arr[i + 2]] << 6) |

                       (map[arr[i + 3]]);

    buf.push(val >> 16,

      val >> 8 & 0xFF, // eslint-disable-line

      val & 0xFF);

    i += 4;
  }

  /*

        * 凑字字符"="个数

        */

  while (arr[--n] == '=') { buf.pop(); } // eslint-disable-line

  return buf;
}

export { setCookie, Base64Encode, Base64Decode };

export const transformCommunityAll = (data, project) => {
  const [provinceId, cityId, communityId] = project || [];

  const returnAllCommunityIds = [];

  if (communityId) {
    returnAllCommunityIds.push(communityId);
  } else if (provinceId) {
    (data || []).filter(item => (
      cityId ? item.cityId === cityId : item.provinceId === provinceId
    )).forEach((item) => {
      returnAllCommunityIds.push(item.communityId);
    });
  }

  return returnAllCommunityIds;
};
