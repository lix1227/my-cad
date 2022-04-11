/*
    查询语句文本
*/

//用户信息操作
var UserSQL = {
  insert: 'INSERT INTO user(uid,username,password) VALUES(?,?,?)',  // 插入
  queryAll: 'SELECT * FROM user',                                   // 查询
  queryByUsename: 'SELECT * FROM user WHERE username = ?',          // 通过用户名查询
}

module.exports = UserSQL;

