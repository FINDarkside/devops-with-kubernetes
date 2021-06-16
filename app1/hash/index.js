const crypto = require('crypto')
const express = require('express')
const fs = require('fs')
const fetch = require('node-fetch')

const hash = crypto.createHash('sha1')
    .update(Buffer.from(Math.random().toString()))
    .digest('hex')

const app = express()

app.get('/', async (req, res) => {
    const timestamp = fs.readFileSync('/usr/src/app/files/timestamp')
    const pongCount = await fetch('http://app3-svc/').then(r => r.text())
    res.end(timestamp + ' ' + hash + '.\n Ping / Pongs: '+ pongCount)
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})