const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')

let pool = null;

let appReady = false

const app = express()
app.use(bodyParser.json());
app.use(cors())

app.post('/todos', async (req, res) => {
    const todo = req.body
    console.log(todo.text)
    if (typeof todo.text !== 'string' || todo.text.length > 140)
        res.status(400).end()
    console.log(`New todo created: ${todo.text}`)
    await pool.query('INSERT INTO todos (text) VALUES ($1)', [todo.text])
    res.end()
})

app.get('/todos', async (req, res) => {
    const todos = await pool.query('SELECT * FROM todos')
    res.json(todos.rows)
})

async function initApp() {
    do {
        try {
            const newPool = new Pool({
                user: 'postgres',
                host: 'postgres-svc',
                database: 'postgres',
                password: process.env.POSTGRES_PASSWORD,
                port: 5432,
            })
            await newPool.query(`
                CREATE TABLE IF NOT EXISTS todos (
                    id SERIAL PRIMARY KEY,
                    text VARCHAR
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

