const fs = require('fs');
const db = require(appRoot + "/models");
const User = db.user;

logsHTTP = (req, res) => {
    let log = "";
    let userId = req.userId;

    User.findOne({ _id: userId }).exec((err, user) => {
        if (err) {
        } else if (!user){
            let fileName = "/logs/" + req.headers["x-access-token"] + ".logs"
            log = "date=" + new Date().toISOString() + ";"
            log += "root=" + req.protocol + '://' + req.get('host') + req.originalUrl + ";"
            log += "status=" + res.statusCode.toString() + ";"
            if (res.message)
                log += "message=" + res.message + "\r\n";
            fs.appendFile(__dirname + fileName, log, (err) => {
                if (err) {
                    // console.log(err)
                    // console.log("Error when trying to write log!")
                }
            })
        } else {
            let fileName = "/logs/" + req.headers["x-access-token"] + ".logs"
            log = "date=" + new Date().toISOString() + ";"
            log += "device=" + user.application?.model + ";"
            log += "platform=" + user.application?.platform + ";"
            log += "musicRoomVersion=" + user.application?.version + ";"
            log += "root=" + req.protocol + '://' + req.get('host') + req.originalUrl + ";"
            log += "status=" + res.statusCode.toString() + ";"
            if (res.message)
                log += "message=" + res.message + "\r\n";
            fs.appendFile(__dirname + fileName, log, (err) => {
                if (err) {
                    // console.log(err)
                    // console.log("Error when trying to write log!")
                }
            })
        }
    })
    // console.log(log)
};

//soit on récupère les infos avec le token -> userId, soit on les mets dans la query a coté du token

logsSOCKS = (message, status, token) => {
    let log = "";

    let fileName = "/logs/" + token + ".logs"
    log = "date=" + new Date().toISOString() + ";"
    // log += "deviceModel=" + req.headers.devicemodel + ";"
    // log += "deviceOSVersion=" + req.headers.deviceosversion + ";"
    // log += "musicRoomVersion=" + req.headers.musicroomversion + ";"
    log += "root=" + "socket.io;"
    log += "status=" + status + ";"
    log += "message=" + message + "\r\n";
    fs.appendFile(__dirname + fileName, log, (err) => {
        if (err) {
            console.log(err)
            console.log("Error when trying to write log!")
        } else {
            // console.log("correctly written logs!")
        }
    })
    // console.log(log)
};

const logs = {
    logsHTTP,
    logsSOCKS
};

module.exports = logs