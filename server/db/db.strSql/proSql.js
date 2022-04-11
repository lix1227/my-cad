/*
    查询语句文本
*/

//项目信息操作
var ProSQL = {
  insert: 'INSERT INTO project(pid,username,projectname,createdate,lastoperate) VALUES(?,?,?,?,?)',  // 插入
  queryAll:'SELECT * FROM project WHERE username = ?',                                              // 获取用户项目列表
  queryByUsenameAndProname: 'SELECT * FROM project WHERE username = ? AND projectname = ?',          // 通过用户名和项目名查询
  deleteByPid: 'DELETE FROM project WHERE pid = ?',                                                  // 根据pid进行项目删除
  queryByUsenameAndPid: 'SELECT * FROM project WHERE username = ? AND pid = ?'                       // 根据用户名和项目id获取
}

module.exports = ProSQL;
