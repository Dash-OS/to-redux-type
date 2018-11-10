const toReduxType = require('./dist/main').default;

console.log(
  // Tests
  toReduxType('helloThere'),
  toReduxType('h*whatup'),
  toReduxType('h*Whatup'),
  toReduxType('@hello'),
  toReduxType('@@helloDude'),
  toReduxType('systemRX'),
  toReduxType('systemRx'),
  toReduxType('APerson'),
  toReduxType('RXComputer'),
  toReduxType(Symbol('hi')),
);
