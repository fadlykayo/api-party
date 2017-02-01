var express = require('express')
var router = express.Router()
var config = require('../../../config.json')
var igdb = require('igdb-api-node')
var YouTube = require('youtube-node')
var youtube = new YouTube()

youtube.setKey(config.youtube_key)
process.env.mashapeKey = config.mashape_key

router.get('/:key', function (req, res) {
  igdb.games({
    limit: 50,
    offset: 0,
    fields: 'name,rating,popularity,url',
    order: 'rating:desc',
    search: req.params.key
  }).then(function (data) {
    // console.log(data.body)
    let items = []
    data.body.forEach(function (games) {
      youtube.search(`${games.name} game trailer`, 1, function (error, result) {
        items.push({
          name: games.name,
          rating: games.rating,
          popularity: games.popularity,
          url: games.url,
          youtube: `https://youtu.be/${result.items[0].id.videoId}`
        })
        if (items.length === data.body.length) res.send(items)
      })
    })
  }).catch(function (err) {
    res.send(err)
  })
})

const getGames = (cb, test) => {
  igdb.games({
    limit: 50,
    offset: 0,
    fields: 'name,rating,popularity,url',
    order: 'rating:desc',
    search: test
  }).then(function (games) {
    cb(games.body)
  }).catch(function (err) {
    cb(err)
  })
}

const getTrailers = (list, cb) => {
  let items = []
  list.forEach(function (video) {
    youtube.search(`${video.name} game trailer`, 1, function (error, result) {
      items.push({
        name: video.name,
        rating: video.rating,
        popularity: video.popularity,
        url: video.url,
        youtube: `https://youtu.be/${result.items[0].id.videoId}`
      })
      if (items.length === list.length) cb(items)
    })
  })
}

module.exports = router
