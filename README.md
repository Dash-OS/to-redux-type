# to-redux-type

Converts camelCase to SCREAMING_SNAKE_CASE with special considerations for wildcard 
(*) and handling of short strings (systemRX vs systemRx --> SYSTEM_RX)

### Simple Example

```js
import ToReduxType from 'to-redux-type'

// string

const pre = 'myValue'

const post = ToReduxType(pre) ; // MY_VALUE

// object

const pre2 = {
  myValue: 'my value!',
  'SYSTEM_*': 'system wildcard'
}

const post2 = ToReduxType(pre2) ; // { MY_VALUE: 'my value!', 'SYSTEM_*': 'system wildcard' }

// array

const pre3 = [ 'myValue', 'ANOTHER_VALUE' ]

const post3 = ToReduxType(pre3) ; // [ 'MY_VALUE', 'ANOTHER_VALUE' ]

```