const express = require('express');
const app = express();
const port = 3000;    //端口号
const request = require('request');
var bodyParser = require('body-parser')
//只要加入这个配置，在req请求对象上会多出来一个属性
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())
 
// 允许跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  if(req.method === "OPTIONS") res.send(200);
  else  next();
});
 
//监听请求 *代表所有的请求路径。
//也可指定请求路径，如/text，则只能接收http://localhost:3000/text的请求
app.get('*', (req, res) => {
  //接收要转发的http地址
  let url = req.url.substr(1);
  if(url.startsWith('http')){
    const options = {
      url,
      method:"GET",
      //headers: req.headers    //如果需要设置请求头，就加上
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //拿到实际请求返回的响应头，根据具体需求来设置给原来的响应头
        let headers = response.headers;
        res.setHeader('content-type',headers['content-type']);
        res.send(body);
      } else {
        res.send(options);
      }
    });
  }
})
 
app.post('*', (req, res) => {
  console.log(req.headers)
  console.log(req.body)
  let url = req.url.substr(1);
  if(url.startsWith('http')){
    const options = {
      url,
      method: 'POST',
      json: req.body,    //content-type是application/json的时候使用,其它请查看requiest用法
      headers: {
        token: req.headers.token,
        'content-type': req.headers['content-type']
      }
    }
    request(options, function (error, response, body) {
      console.log(body,response,error)
      if (!error) {
        let headers = response.headers;
        res.setHeader('content-type',headers['content-type']);
        // for(let key in headers){
        //   res.setHeader(key,headers[key]);
        // }
        console.log(body)
        res.send(body);
      } else {
        res.send(options);
      }
    });
  }
  // res.send('Hello World!')
})
 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})