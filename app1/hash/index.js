const crypto = require('crypto')
const express = require('express')
const fs = require('fs')

const hash = crypto.createHash('sha1')
    .update(Buffer.from(Math.random().toString()))
    .digest('hex')

const app = express()

app.get('*', (req, res) => {
    const timestamp = fs.readFileSync('/usr/src/app/files/timestamp')
    res.end(timestamp + ' ' + hash)
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})