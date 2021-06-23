const express = require('express')
const { Pool, Client } = require('pg')
const app = express()

let counter = 0
let dbConnected = false

const pool = new Pool({
    user: 'postgres',
    host: 'postgres-svc',
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})
pool.on('connect', (client) => {
    initDb()
    dbConnected = true
})


const createTableQuery = `
    CREATE TABLE IF NOT EXISTS pingpong (
        name VARCHAR PRIMARY KEY,
        value INT NOT NULL
    );
`
async function initDb() {
    await pool.connect()
    await pool.query(createTableQuery)
    await pool.query("INSERT INTO pingpong VALUES ('count',0) ON CONFLICT DO NOTHING")
    const res = await pool.query('SELECT * FROM pingpong')
    counter = res.rows[0].value
    if (!dbConnected) {
        app.listen(3000, () => {
            console.log('Server started in port 3000')
        })
    }
}
initDb()

app.get('*', (req, res) => {
    counter++
    pool.query('UPDATE pingpong SET value=$1', [counter])
    res.end('pong ' + counter)
})

const healthCheckApp = express()
healthCheckApp.get('/healthz', (req, res) => {
    res.status(dbConnected ? 200 : 500).end()
})
healthCheckApp.listen(3541)
