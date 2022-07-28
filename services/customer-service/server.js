const restify = require('restify')
const axios = require('axios').default
const db = require('../db.json')

const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:9001'
const DOMAIN_SERVICE_BASE_URL = process.env.DOMAIN_SERVICE_BASE_URL || 'http://localhost:9002'

const server = restify.createServer({
    name: 'customer-service',
    version: '1'
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/customers', (req, res) => {
    const apiKey = req.headers['x-api-key']

    if (db.users.findIndex(user => user.api_key === apiKey && user.authenticated) === -1) {
        res.json(403)
    } else {
        res.json(200, db.customers.map(user => {
            return {
                ...user,
                domain_id: undefined
            }
        }))
    }
})

server.get('/customers/:id', async (req, res) => {
    let apiKey = req.headers['x-api-key']

    try {
        await axios.post(`${AUTH_SERVICE_BASE_URL}/sessions/validate`, null, { headers: { 'x-api-key': apiKey } })

        const { id } = req.params
        const customers = db.customers.filter(cust => cust.id == id)

        if (customers.length === 0) {
            res.json(404)
        } else {
            let customer = customers[0]

            try {
                const domainResponse = await axios.get(`${DOMAIN_SERVICE_BASE_URL}/domains/${customer.domain_id}`, { headers: { 'x-api-key': apiKey } })
                customer = {
                    ...customer,
                    domain_id: undefined,
                    domain: domainResponse.data
                }
            } catch (err) {
                console.log(err.response.status)
            }

            res.json(200, customer)
        }
    } catch (err) {
        res.json(err.response.status)
    }
})

server.listen(process.env.CUSTOMER_SERVICE_PORT || 9003, () => {
    console.log(`${server.name} is listening at ${server.url}...`)
})
