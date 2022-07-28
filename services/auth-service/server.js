const restify = require('restify')
const db = require('../db.json')

const server = restify.createServer({
    name: 'auth-service',
    version: '1'
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.post('/sessions', (req, res) => {
    let { username } = req.body

    const users = db.users.filter(user => user.id == username && user.authenticated)

    if (users.length === 0) {
        res.json(401)
    } else {
        res.json(200, users[0])
    }
})

server.post('/sessions/validate', (req, res) => {
    const apiKey = req.headers['x-api-key']

    if (db.users.findIndex(user => user.api_key === apiKey && user.authenticated) === -1) {
        res.json(403)
    } else {
        res.json(200)
    }
})

server.listen(process.env.AUTH_SERVICE_PORT || 9001, () => {
    console.log(`${server.name} is listening at ${server.url}...`)
})
