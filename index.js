const express = require('express')
const redis = require('redis');
const pgp = require('pg-promise')(/* options */)

const app = express()

const port = 3000
const redisUrl = 'redis://localhost:6379'
const postgresUrl = 'postgres://nasir:123456@172.17.0.1:5432/waypoint'

const db = pgp(postgresUrl)
let redisClient;

(async () => {
  redisClient = redis.createClient({ url: redisUrl });

  redisClient.on('connect', () => console.log('Redis server connected'))
  redisClient.on("error", (error) => console.error(`Redis ERROR: ${error}`));

  await redisClient.connect();
  await redisClient.set('key', 999);
  const value = await redisClient.get('key');
  console.log(`Redis DATA:`, Number(value))
})();

db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('Connected to Postgres DATA:', data.value)
  })
  .catch((error) => {
    console.log('Postgres ERROR:', error)
  })

function greet(req, res) {
    res.json({
        message: 'Working fine!!!'
    })
}

app.get('/', greet)
// app.get('/cached', cache.route(), greet)

app.listen(port, () => console.log(`app listening on port ${port}!`))