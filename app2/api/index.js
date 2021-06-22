const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const promisfy = require('util').promisify

/* const pool = new Pool({
    user: 'postgres',
    host: 'postgres-svc',
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
}) */
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'docker',
    port: 5432,
})
pool.query = promisfy(pool.query)

const app = express()
app.use(bodyParser.json());
app.use(cors())


app.post('/todos', async (req, res) => {
    const todo = req.body
    console.log(todo.text)
    if (typeof todo.text !== 'string' || todo.text.length > 140)
        res.status(400).end()
    await pool.query('INSERT INTO todos (text) VALUES ($1)', [todo.text])
    res.end()
})

app.get('/todos', async (req, res) => {
    const todos = await pool.query('SELECT * FROM todos')
    res.json(todos.rows)
})


async function initApp() {
    const res = await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            text VARCHAR
        );
    `)

    app.listen(3001, () => {
        console.log('Server started in port 3001')
    })
}

initApp().catch(err => {
    console.error(err)
    process.exit(1)
})