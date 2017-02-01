var express = require('express')
var router = express.Router()
var config = require('../../../config.json')
var igdb = require('igdb-api-node')
var YouTube = require('youtube-node')
var youtube = new YouTube()

youtube.setKey(config.youtube_key)
process.env.mashapeKey = config.mashape_key

router.get('/', function (req, res) {
  getGames(function (list) {
    getTrailers(list, function (data) {
      res.send(data)
    })
  })
})

const getGames = (cb) => {
  igdb.games({
    limit: 25,
    offset: 0,
    fields: 'name',
    order: 'release_dates.date:desc',
    search: 'marvel'
  }).then(function (games) {
    cb(games.body)
  }).catch(function (err) {
    cb(err)
  })
}

const getTrailers = (list, cb) => {
  let items = []
  // console.log(list)
  list.forEach(function (video) {
    // console.log(video.name)
    youtube.search(`${video.name} trailer`, 1, function (error, result) {
      items.push({
        name: video.name,
        youtube: `https://youtu.be/${result.items[0].id.videoId}`
      })
      // console.log(urls)
      if (items.length === list.length) cb(items)
    })
  })
}

module.exports = router
