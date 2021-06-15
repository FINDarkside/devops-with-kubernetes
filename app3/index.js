const express = require('express')
const fs = require('fs')

const app = express()

let counter = 0
app.get('*', (req, res) => {
    counter++
    fs.writeFileSync('/usr/src/app/files/pongCount', counter.toString())
    res.end('pong ' + counter)
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})