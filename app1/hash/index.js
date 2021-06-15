const crypto = require('crypto')
const express = require('express')
const fs = require('fs')

const hash = crypto.createHash('sha1')
    .update(Buffer.from(Math.random().toString()))
    .digest('hex')

const app = express()

app.get('*', (req, res) => {
    const timestamp = fs.readFileSync('/usr/src/app/files/timestamp')
    const pongCount = fs.readFileSync('/usr/src/app/files/pongCount')
    res.end(timestamp + ' ' + hash + '.\n Ping / Pongs: '+ pongCount)
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})