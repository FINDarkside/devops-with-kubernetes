const crypto = require('crypto')
const express = require('express')

const hash = crypto.createHash('sha1')
    .update(Buffer.from(Math.random().toString()))
    .digest('hex')

const state = () => (new Date()).toISOString() + ' ' + hash

setInterval(() => {
    console.log(state())
}, 5000)


const app = express()

app.get('*', (req, res) => {
    res.end(state())
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})