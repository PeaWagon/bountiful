var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});

router.post("/code", (req, res, next) => {
    console.log(req.headers);
    console.log(req.statusCode);
    console.log(req.body);
    console.log(res.headers);
    console.log(res.statusCode);
    console.log(res.body);
    res.redirect("/");
});

module.exports = router;
