function get(key) {
  const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

function set(key, value) {
  document.cookie = `${key}=${escape(value)};path=/`;
}

function del(key) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const val = get(key);
  if (val !== null) {
    document.cookie = `${name}=${val};expires=${exp.toGMTString()}`;
  }
}

const cookie = {
  get,
  set,
  del,
};

export default cookie;
