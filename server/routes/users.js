var express = require('express');
var router = express.Router();
var db = require('../db/db')
var userSql = require('../db/db.strSql/userSql')
const {render} = require("express/lib/application");

/* 获取用户信息 */
router.get('/userinfo', function(req, res, next) {
  let username = req.query.username;
  db.query(userSql.queryByUsename,username,(_res)=>{
    res.send({data:_res})
  })
});

/* 查询用户名唯一 */
router.post('/vailtAccount',function (req,res){
  let _name = req.body.username;
  let param = [_name]
  db.query(userSql.queryByUsename,param,(_res)=>{
    if(_res.length > 0){
      res.send({isExit:true})
    }else{
      res.send({isExit:false})
    }
  })
})

/* 登录时用户信息校验 */
router.post('/logInfo',function (req,res){
  let {username, password} = req.body;
  db.query(userSql.queryByUsename,username,(_res)=>{
    if(_res.length > 0){
      if(_res[0].password == password){
        res.send({code:'1',msg:'登录成功!'})
      }else{
        res.send({code:'0',msg:'密码错误!'})
      }
    }else{
      res.send({code:'0',msg:'用户名不存在!'})
    }
  })
})

/* 注册用户信息 */
router.post('/regInfo',function (req,res){
  let issucced = Reflect.deleteProperty(req.body,"password_again")
  let param = [];
  for(let key in req.body){
    param.push(req.body[key])
  }
  if(issucced){
    db.query(userSql.insert,param,(_res)=>{})
  }
  res.send({isoperate:true})
})

/* 更新用户信息 */
router.post('/updateInfo',function (req,res){
  let {username,infoType,newInfo} = req.body;
  let sql = 'UPDATE user SET '+ infoType + '=' + "'" + newInfo + "'" + 'WHERE username = ' + "'" + username + "'";
  if(username){
    db.query(sql,[],(_res)=>{
      if(_res.err){
        res.send({code:'0'})
      }else{
        res.send({code:'1'})
      }
    })
  }
})

module.exports = router;
