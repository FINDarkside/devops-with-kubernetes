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

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS pingpong (
        name VARCHAR PRIMARY KEY,
        value INT NOT NULL
    );
`
async function initDb() {
    const client = await pool.connect()
    client.release()
    dbConnected = true
    await pool.query(createTableQuery)
    await pool.query("INSERT INTO pingpong VALUES ('count',0) ON CONFLICT DO NOTHING")
    const res = await pool.query('SELECT * FROM pingpong')
    counter = res.rows[0].value
    app.listen(3000, () => {
        console.log('Server started in port 3000')
    })
}
initDb()

app.get('*', (req, res) => {
    counter++
    pool.query('UPDATE pingpong SET value=$1', [counter])
    res.end('pong ' + counter)
})

const healthCheckApp = express()
healthCheckApp.get('/healthz', (req, res) => {
    console.log(dbConnected)
    res.status(dbConnected ? 200 : 500).end()
})
healthCheckApp.listen(3541)
