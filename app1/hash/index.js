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
    res.end(process.env.MESSAGE + '\n' + timestamp + ' ' + hash + '.\n Ping / Pongs: ' + pongCount)
})

app.listen(3000, () => {
    // console.log('Server started in port 3000')
})

const healthCheckApp = express()
healthCheckApp.get('/healthz', (req, res) => {
    // Readiness probe should fail after 1s, so no need to timeout manually
    fetch('http://app3-svc/')
        .then(() => res.status(200).end())
        .catch((err) => {
            console.error(err)
            res.status(500).end()
        })

})
healthCheckApp.listen(3541)