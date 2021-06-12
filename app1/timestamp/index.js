const fs = require('fs')

function writeTimeStamp() {
    const timestamp = (new Date()).toISOString()
    fs.writeFileSync('/usr/src/app/files/timestamp', timestamp)
}
writeTimeStamp()
setInterval(writeTimeStamp, 5000)