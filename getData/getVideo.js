
//引入模块
const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')

const url = 'https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=3605331890120301327&ins_activity_param=A7b3DEe&origin_type=pc_buyin_group&pick_source=Dr4gK3C'

https.get(url, function (res) {
  let html = ''
  res.on('data', function (data) {
    html += data
  })
  res.on('end', function () {
    const $ = cheerio.load(html)
    console.log(html);
  })
})