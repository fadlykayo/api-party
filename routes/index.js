var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('index')
})

router.get('/api', function (req, res, next) {
  res.send('api')
})

router.get('/api/twitter', function (req, res, next) {
  res.send('twitter')
})

// router.get('/api/twitter/search', function (req, res, next) {
//   res.send('search')
// })

module.exports = router
