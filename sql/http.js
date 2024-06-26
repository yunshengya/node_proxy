const express = require('express');
const app = express();
const cors = require('cors');
const url = require('url');
const db = require('./db.js');
// 配置cors中间件 
app.use(cors({
  origin: '*'
}));

app.options('*', cors()); // 预请求
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 解析查询参数
const parseQuery = (req) => {
  const queryObject = url.parse(req.url, true).query;
  return {
    sno: queryObject.sno || '',
    sname: queryObject.sname || ''
  };
};

// 学生信息获取路由
app.get('/student/getOne', (req, res) => {
  const { sno, sname } = parseQuery(req);

  // 假设db是您的数据库连接对象，并且它有一个叫做query的方法
  // 使用参数化查询来防止SQL注入
  const params = [sno, sname];
  const sql = 'SELECT * FROM student WHERE sno = ? AND sname = ?';


  db.query(sql, params, function (err, data) {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.send(data);
  });
});

// 学生信息插入接口
app.post('/student/insert', (req, res) => {
  // 解析请求体中的JSON数据
  const { sno, sname } = req.body;

  // 检查必填项是否已提供
  if (!sno || !sname) {
    return res.status(400).send('缺少必要的参数: sno 和 sname');
  }



  // 准备SQL查询语句，检查sno是否已存在
  const checkSql = 'SELECT COUNT(*) AS count FROM student WHERE sno = ?';

  // 执行SQL查询语句
  db.query(checkSql, [sno], function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: '数据库查询失败' });
    }

    // 如果sno已存在
    if (results[0].count > 0) {
      return res.status(400).send({ message: '错误：学号 ' + sno + ' 已存在' });
    }


    // 准备SQL插入语句
    const sql = 'INSERT INTO student (sno, sname) VALUES (?, ?)';

    // 执行SQL插入语句
    db.query(sql, [sno, sname], function (err, result) {
      if (err) {
        console.error(err, 'error');
        return res.status(500).send('数据库插入失败');
      }
      // 返回插入结果
      res.status(200).send({
        success: true,
        message: '数据插入成功',
        insertId: result.insertId
      });
    });
  });
})


// 学生信息列表接口
app.get('/student/list', (req, res) => {
  // 解析请求参数中的分页信息
  const page = parseInt(req.query.page, 10) || 1; // 如果没有提供page，默认为1
  const pageSize = parseInt(req.query.pagesize, 10) || 10; // 如果没有提供pagesize，默认为10

  // 计算SQL查询的LIMIT子句的偏移量
  const offset = (page - 1) * pageSize;

  // 准备SQL查询语句，使用LIMIT和OFFSET进行分页
  const sql = 'SELECT sno, sname FROM student LIMIT ? OFFSET ?';

  // 执行SQL查询语句
  db.query(sql, [pageSize, offset], function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).send('数据库查询失败');
    }

    // 执行另一个SQL查询以获取总数据量
    const countSql = 'SELECT COUNT(*) AS total FROM student';
    db.query(countSql, function (err, countResult) {
      if (err) {
        console.error(err);
        return res.status(500).send('获取数据总量失败');
      }

      // 构造响应数据
      const response = {
        data: results,
        total: countResult[0].total,
        page: page,
        pagesize: pageSize
      };

      // 返回分页列表数据
      res.status(200).json(response);
    });
  });
});

// 设置端口并启动服务
app.listen(8888, function () {
  console.log('服务器启动在端口8888...');
});