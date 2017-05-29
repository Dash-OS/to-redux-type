// Allow for wildcard in the types
const isReduxType = str => /^[A-Z\*]+([_\*][A-Z\*]+)*?$/.test(str)

const isPlainObject =
  o => ( o !== null && ! Array.isArray(o) && typeof o !== 'function' && typeof o === 'object' )

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
function formatType (type) {
  if ( isReduxType(type) ) { return type }
  let buffer = '',
      list = type
              .split(/([A-Z]+|[a-z]+)/)
              .reduce(
                (a, c) => {
                  if ( c === '' ) { return a }
                  a.push(c)
                  return a
                }, []
              )
  if ( list.length === 1 ) { return type.toUpperCase() }
  let wasCapital = false, wasWildcard = false
  for ( let e of list ) {
    if ( ! e.length  ) { continue }
    const isCapital = /[A-Z]/.test(e)
    const isWildcard = e.includes('*')
    e = e.toUpperCase()
    if ( isReduxType(e) ) {
      if ( buffer === '' || isWildcard || wasWildcard ) {
        buffer += e
      } else {
        if ( isCapital && ! wasCapital ) {
          buffer += '_' + e
        } else if ( wasCapital && isCapital ) {
          buffer += e
        } else if ( wasCapital && ! isCapital ) {
          if ( buffer.slice(-2, -1) === '_' || buffer.slice(-2, -1) === '' ) {
            buffer += e
          } else { buffer = buffer.slice(0, -1) + '_' + buffer.slice(-1) + e }
        } else if ( wasCapital && ! isCapital ) {
          if ( buffer.slice(-2, -1) === '_' || buffer.slice(-2, -1) === '' ) {
            buffer += e
          } else { buffer += '_' + e }
        } else { buffer += '_' + e }
      }
    } else if ( isWildcard ) { buffer += e }
    wasCapital = isCapital ; wasWildcard = isWildcard
  }
  if ( isReduxType(buffer) ) { return buffer }
}

const formatValue = value => {
  if ( typeof value === 'string' ) {
    return formatType(value)
  } else if ( Array.isArray(value) ) {
    return value.map(e => e.startsWith('!')
      ? e.slice(1)
      : formatValue(e)
    )
  } else if ( typeof value === 'object' ) {
    return Object.keys(value).reduce((p, c) => {
      if ( c.startsWith('!') ) {
        p[c.slice(1)] = value[c]
      } else {
        p[formatType(c)] = value[c]
      }
      return p
    }, {}) 
  }
}

export default formatValue