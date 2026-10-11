const Router = require('koa-router')
const { random, search, collect, collection } = require('../controllers/poemController')
const { verifyToken } = require('../utils/jwt')
const router = new Router({ prefix: '/api/poem' })
router.get('/random', random)
router.get('/search', search)
router.post('/collect', verifyToken(), collect)
router.get('/collection', verifyToken(), collection)
module.exports = router
