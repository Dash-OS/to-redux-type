# to-redux-type

Converts camelCase to SCREAMING_SNAKE_CASE with special considerations for small 
differences (systemRX vs systemRx --> SYSTEM_RX)

### Simple Example

```js
import ToSnake from 'to-redux-type'

const pre = 'myValue'

const post = ToSnake(pre) ; // MY_VALUE
```