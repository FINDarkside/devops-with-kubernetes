const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const { connect, StringCodec } = require('nats');

const sc = StringCodec();
/** @type {import('nats').NatsConnection} */
let nc = null;
let pool = null;
let appReady = false

const pgConfig = {
    user: 'postgres',
    host: 'postgres-svc',
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
}
/* const pgConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'tobenamed',
    password: 'docker',
    port: 5432,
} */

const app = express()
app.use(bodyParser.json());
app.use(cors())

app.post('/todos', async (req, res) => {
    const todo = req.body
    console.log(todo.text)
    if (typeof todo.text !== 'string' || todo.text.length > 140)
        res.status(400).end()
    console.log(`New todo created: ${todo.text}`)
    const dbRes = await pool.query('INSERT INTO todos (text,done) VALUES ($1,FALSE) RETURNING *', [todo.text])
    res.json(dbRes.rows[0])

    nc.publish('newTodo', sc.encode(JSON.stringify(dbRes.rows[0])))
})

app.get('/todos', async (req, res) => {
    const todos = await pool.query('SELECT * FROM todos ORDER BY id')
    res.json(todos.rows)
})

app.put('/todos/:id', async (req, res) => {
    const id = Number(req.params.id)
    await pool.query('UPDATE todos SET done=$1 WHERE id=$2', [!!req.body.done, id])
    res.end()
})

async function initApp() {
    do {
        try {
            nc = await connect({ servers: process.env.NATS_URL })
            const newPool = new Pool(pgConfig)
            await newPool.query(`
                CREATE TABLE IF NOT EXISTS todos (
                    id SERIAL PRIMARY KEY,
                    text VARCHAR,
                    done BOOLEAN
                );
            `)
            pool = newPool
        } catch (err) {
            console.error(err)
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
    } while (!pool)

    app.listen(3001, () => {
        console.log('Server started in port 3001')
    })
    appReady = true
}

const healthCheckApp = express()
healthCheckApp.get('/healthz', (req, res) => {
    res.status(appReady ? 200 : 500).end()
})
healthCheckApp.listen(3541, () => console.log('Listening 3541 for health checks'))

initApp().catch(err => {
    console.error(err)
    process.exit(1)
})

