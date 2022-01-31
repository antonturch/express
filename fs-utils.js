const fs = require('fs');

exports.readJsonFromFile = (filePath) => {
    return new Promise((resolve, rej) =>
        fs.readFile(filePath, function (err, buf) {
            if (err) {
                rej(err)
            } else {
                resolve(JSON.parse(buf.toString()))
            }
        }))
}

exports.writeJsonToFile = (filePath, data) => {
    return new Promise((resolve, rej) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) rej(err)
            resolve()
        })
    })
}