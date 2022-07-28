const restify = require('restify')
const db = require('../db.json')

const server = restify.createServer({
    name: 'domain-service',
    version: '1'
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/domains', (req, res) => {
    const apiKey = req.headers['x-api-key']

    if (db.users.findIndex(user => user.api_key === apiKey && user.authenticated) === -1) {
        res.json(403)
    } else {
        res.json(200, db.domains)
    }
})

server.get('/domains/:id', (req, res) => {
    const apiKey = req.headers['x-api-key']

    if (db.users.findIndex(user => user.api_key === apiKey && user.authenticated) === -1) {
        res.json(403)
    } else {
        const { id } = req.params
        const domains = db.domains.filter(domain => domain.id == id)

        if (domains.length > 0) {
            res.json(200, domains[0])
        } else {
            res.json(404)
        }
    }
})

server.listen(process.env.DOMAIN_SERVICE_PORT || 9002, () => {
    console.log(`${server.name} is listening at ${server.url}...`)
})
