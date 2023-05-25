const express = require('express');
const bodyParser = require('body-parser')
var axios = require('axios')
const cors = require('cors');
const cheerio = require('cheerio');
const app = express();

app.use(bodyParser.json())
app.use(cors());
let url = 'https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=3605331890120301327&ins_activity_param=A7b3DEe&origin_type=pc_buyin_group&pick_source=Dr4gK3C'


app.post('/urls', async (req, res) => {
  const url = req.body.url;
  var result = '';
  if (url) {
    await axios.get(url).then((res) => {
      result = res.data
    })
  }
  return res.status(200).json(result);

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
