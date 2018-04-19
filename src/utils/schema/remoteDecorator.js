import { env } from 'config/global';

export default function remote(alias) {
  return (target, name) => {
    if (env === 'development' && alias) {
      /* eslint no-param-reassign: 0 */
      target[alias] = name;
    }
  };
}
