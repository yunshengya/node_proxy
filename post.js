// 引入express
const express = require('express')
// 调用express()
const app = express()

// 会自动加入req.body属性，这个属性中就包含了post请求所传入的参数,格式为json格式
app.use(express.json()).use(cors())

// 接口3--post-json格式
app.post('/add-json', (request, response) => {
  console.log('请求返回', request.body)
  response.send({ "name": "xxx" })
})