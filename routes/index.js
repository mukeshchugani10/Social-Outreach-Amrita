var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../public/index.html'));
});


router.get('/admin', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../public/admin_login.html'));
});

router.get('/home', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../public/admin_index.html'));
});



module.exports = router;
