var express = require('express');
var router = express.Router();
var db = require("../db/db");

router.get('/first', function(req, res, next) {
  res.send({name:'aaa',pwd:'123'});
});
module.exports = router;
