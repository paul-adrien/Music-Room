const fs = require('fs');

module.exports = (req, res) => {
    let log = "";

    let fileName = "/logs/" + req.headers["x-access-token"] + ".logs"
    log = "date=" + new Date().toISOString() + ";"
    // log += "deviceModel=" + req.headers.devicemodel + ";"
    // log += "deviceOSVersion=" + req.headers.deviceosversion + ";"
    // log += "musicRoomVersion=" + req.headers.musicroomversion + ";"
    log += "root=" + req.protocol + '://' + req.get('host') + req.originalUrl + ";"
    log += "status=" + res.statusCode.toString() + ";"
    if (res.message)
        log += "message=" + res.message + "\r\n";
    console.log(__dirname + fileName)
    fs.appendFile(__dirname + fileName, log, (err) => {
        if (err) {
            console.log(err)
            console.log("Error when trying to write log!")
        } else {
            // console.log("correctly written logs!")
        }
    })
    console.log(log)
}