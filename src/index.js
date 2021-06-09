// import _ from 'lodash';




let str = 'https://www.cnblogs.com/gaoht/p/11310365.html'
let link = '<a href="https://www.webpackjs.com/">https://www.webpackjs.com/</a>'

// var compiled = _.template(str)
// let result = compiled({
//   version: '<script>alert("hahaha...")</script>'
// })

// console.log(typeof compiled)
// console.log(result)

function component() {
  const element = document.createElement('div');
  element.innerHTML = link
  // element.innerHTML = _.join(['<h2>webpack is used to compile JavaScript modules', '.</h2>', link, result], '<br />');

  return element;
}

document.body.appendChild(component());


