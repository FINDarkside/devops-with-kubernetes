const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs')

const imgPath = '/usr/src/app/files/img.jpg'
// const imgPath = '/home/jesse/img.jpg'

const app = express()

/** @type {Date | null} */
let lastRequestDate = null;

app.get('/image.jpg', async (req, res) => {
    const img = await getImage()
    // Ik, bad idea to do it like this
    res.contentType('image/jpeg');
    res.end(img, 'binary');
})

app.get('*', (req, res) => {
    res.sendFile('./static/index.html', { root: __dirname })
})

async function getImage() {
    const date = new Date()
    if (!lastRequestDate || lastRequestDate.toISOString().substr(0, 10) !== date.toISOString().substr(0, 10)) {
        lastRequestDate = date
        const img = await fetch('https://picsum.photos/1200')
            .then((res) => res.buffer())
        fs.writeFileSync(imgPath, img)
        return img
    }
    return fs.readFileSync(imgPath)
}

app.listen(3000, () => {
    console.log('Server started in port 3000')
})