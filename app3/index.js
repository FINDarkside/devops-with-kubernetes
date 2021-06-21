const express = require('express')
const { Pool, Client } = require('pg')
const app = express()

let counter = 0


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
const initDb = () => {
    pool.query(createTableQuery, initValue)
}
const initValue = () => {
    pool.query("INSERT INTO pingpong VALUES ('count',0) ON CONFLICT DO NOTHING", initCount)
}
const initCount = (err2, res2) => {
    pool.query("SELECT * FROM pingpong", (err, res) => {
        console.log(err)
        counter = res.rows[0].value
        app.listen(3000, () => {
            console.log('Server started in port 3000')
        })
    })
}
initDb()

app.get('*', (req, res) => {
    counter++
    pool.query('UPDATE pingpong SET value=$1', [counter])
    res.end('pong ' + counter)
})
