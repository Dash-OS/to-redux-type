// Allow for wildcard in the types

const SSC_RE = /^[A-Z0-9*]+([_*][A-Z0-9*]+)*?$/;
const SPLIT_RE = /([A-Z]+|[a-z]+|[0-9]+)/;

const isReduxType = str => SSC_RE.test(str);

/*
  Give a best effort to make the type formatting as reliable as possible.
  We start by splitting the string into upper case and lowercase elements.
  Then we iterate through the value and try to determine how we need to
  format it.

  We used to use:
  str => isReduxType(str) ? str : str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase()

  However, this led to certain situations causing an improperly formatted action.
  Specifically when not done properly (systemRX instead of systemRx).  In order to
  attempt to work in all situations we parse it with some logic instead.

  systemHeartbeat -> 'SYSTEM_HEARTBEAT'
  FormatThis -> 'FORMAT_THIS'
  systemRx -> 'SYSTEM_RX'
  systemRX -> 'SYSTEM_RX'
*/
function formatType(type) {
  if (isReduxType(type)) {
    return type;
  }
  const list = type.split(SPLIT_RE).filter(Boolean);
  if (list.length === 1) {
    return type.toUpperCase();
  }
  let wasCapital = false;
  let wasWildcard = false;
  return list.reduce((buffer, e) => {
    const isCapital = /[A-Z]/.test(e);
    const isWildcard = e === '*';
    e = e.toUpperCase();
    if (isReduxType(e)) {
      if (buffer === '' || isWildcard || wasWildcard) {
        buffer += e;
      } else if (isCapital && !wasCapital) {
        buffer += `_${e}`;
      } else if (wasCapital && isCapital) {
        buffer += e;
      } else if (wasCapital && !isCapital) {
        if (buffer.slice(-2, -1) === '_' || buffer.slice(-2, -1) === '') {
          buffer += e;
        } else {
          buffer = `${buffer.slice(0, -1)}_${buffer.slice(-1)}${e}`;
        }
      } else if (wasCapital && !isCapital) {
        if (buffer.slice(-2, -1) === '_' || buffer.slice(-2, -1) === '') {
          buffer += e;
        } else {
          buffer += `_${e}`;
        }
      } else {
        buffer += `_${e}`;
      }
    } else if (isWildcard) {
      buffer += e;
    } else {
      buffer += e;
    }
    wasCapital = isCapital;
    wasWildcard = isWildcard;
    return buffer;
  }, '');
}

const formatValue = value => {
  if (typeof value === 'string') {
    return value.startsWith('@') ? value.slice(1) : formatType(value);
  }
  if (Array.isArray(value)) {
    return value.map(e => (e.startsWith('@') ? e.slice(1) : formatValue(e)));
  }
  if (typeof value === 'object') {
    return Object.keys(value).reduce((p, c) => {
      if (typeof c === 'string') {
        if (c.startsWith('@')) {
          p[c.slice(1)] = value[c];
        } else {
          p[formatType(c)] = value[c];
        }
      }
      return p;
    }, {});
  }
  return value;
};

export default formatValue;
