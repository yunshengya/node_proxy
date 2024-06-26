// db.js
const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
  host: "localhost",
  // user 用户名
  user: "user",
  // password 密码
  password: "123456",
  // 所连接的数据库名称
  database: "student",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 导出查询函数
module.exports.query = (sql, params, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err);
    }
    connection.query(sql, params, (error, results, fields) => {
      connection.release(); // 释放连接
      console.log(error, results,fields);
      callback(error, results, fields);
    });
  });
};