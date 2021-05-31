const path = require('path')


// console.log(process)
console.log('==========process=======process.env=====process.argv==================================')
/*
* http://nodejs.cn/api/process/process_argv.html
* */
console.log(process.argv)

console.log(__dirname)
console.log(__filename)

module.exports = (env) => {
  console.log(env)

  return ({
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    }
  })
}
