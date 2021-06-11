const crypto = require('crypto')

const hash = crypto.createHash('sha1')
    .update(Buffer.from(Math.random().toString()))
    .digest('hex')

setInterval(() => {
    console.log((new Date()).toISOString() + ' ' + hash)
}, 5000)