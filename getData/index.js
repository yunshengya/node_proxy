//引入模块
const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')
//获取页面的html结构
// https.get('https://movie.douban.com/top250', function (res) {
    https.get('https://book.douban.com/chart?subcat=all', function (res) {
    let html = ''
    res.on('data', function (chunk) {
        //console.log(chunk + '');
        html += chunk
    })
    res.on('end', function () {
        // 获取html中的数据
        const $ = cheerio.load(html)
        console.log(html,'html')
        let allFiles = []
        //拿到每一个item中我们需要的数据
        $('.media').each(function () {
         
            const title = $('.media__body h2 .fleft', this).text()
            const star = $('.media__body p .ml8', this).text()
            const pic = $('.media__img .subject-cover', this).attr('src')
            const price = $('.buy-info a', this).text().trim()
            //数据以对象的形式存放在数组中
            allFiles.push({
                title: title,
                star: star,
                pic: pic,
                price
            })
        })
        //console.log(allFiles);
        //将数据写入文件中
        fs.writeFile('./files.json', JSON.stringify(allFiles), function (err, data) {
            if (err) {
                throw err
            }
            console.log('文件保存成功');
        })
    })
})