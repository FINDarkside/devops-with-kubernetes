const express = require('express')

const app = express()

let counter = 0
app.get('*', (req, res) => {
    counter++
    res.end('pong ' + counter)
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})