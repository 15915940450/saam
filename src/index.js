import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  /*
  * es6, commonjs, amd
  * */
  element.innerHTML = _.join(['Hello', 'webpack'], '__ES6，CommonJS 和 AMD__');

  return element;
}

document.body.appendChild(component());
