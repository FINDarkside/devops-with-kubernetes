const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json());
app.use(cors())

const todos = []
let id = 0

app.post('/todos', (req, res) => {
    const todo = req.body
    todo.id = id++

    if (typeof todo.text !== 'string' || todo.text.length > 140)
        res.status(400).end()
    todos.push(todo)
    res.end()
})

app.get('/todos', (req, res) => {
    res.json(todos)
})

app.listen(3001, () => {
    console.log('Server started in port 3001')
})