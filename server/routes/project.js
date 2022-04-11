var express = require('express');
var router = express.Router();
var db = require('../db/db')
const proSql = require('../db/db.strSql/proSql')

/* 查询项目名唯一 */
router.post('/valitProname',function (req,res){
  let {username,projectname} = req.body;
  let param = [username,projectname]
  db.query(proSql.queryByUsenameAndProname,param,(_res)=>{
    if(_res.length > 0){
      res.send({isExit:true})
    }else{
      res.send({isExit:false})
    }
  })
})

/* 项目信息保存 */
router.post('/submitProInfo',function (req,res){
  let {pid,username,projectname,createdate,lastoperate} = req.body;
  let param = [pid,username,projectname,createdate,lastoperate];
  db.query(proSql.insert,param,(_res)=>{
    res.send({code:'1'})
  })
})

/* 项目列表信息 */
router.post('/getProList',function (req,res){
  let _name = req.body.username;
  db.query(proSql.queryAll,_name,(_res)=>{
    if(_res && _res.length != 0){
      res.send({data:_res,code:'1'})
    }else{
      res.send({code:'0'})
    }
  })
})

/* 删除指定项目 */
router.post('/deletePro',function (req,res){
  let _pid = req.body.pid;
  db.query(proSql.deleteByPid,_pid,(_res)=>{})
  res.send({code:'1'})
})

/* 查询指定项目 */
router.get('/getProInfo',function (req,res){
  let {pid,username} = req.query;
  db.query(proSql.queryByUsenameAndPid,[username,pid],(_res)=>{
    res.send({data:_res});
  })
})

module.exports = router;
