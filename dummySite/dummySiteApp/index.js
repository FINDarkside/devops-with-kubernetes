const fetch = require('node-fetch').default
const express = require('express')

const app = express()

let siteBuf = null;
async function init() {
    const siteUrl = process.env.SITE_URL || 'https://example.com/'
    const res = await fetch(siteUrl)
    siteBuf = await res.buffer()
    console.log(siteBuf)
    app.listen(3000, () => console.log('Listening port 3000'))
}
init()

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(siteBuf)
})
