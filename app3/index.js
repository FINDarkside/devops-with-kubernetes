const express = require('express')
const { Pool } = require('pg')
const app = express()

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
    app.listen(8080, () => {
        console.log('Server started in port 8080')
    })
}
initDb()

app.get('*', async (req, res) => {
    const response = await pool.query('UPDATE pingpong SET value=value+1 RETURNING value')
    console.log(response.rows)
    const counter = response.rows[0].value
    res.end('pong ' + counter)
})

const healthCheckApp = express()
healthCheckApp.get('/healthz', (req, res) => {
    console.log(dbConnected)
    res.status(dbConnected ? 200 : 500).end()
})
healthCheckApp.listen(3541)
