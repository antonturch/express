import fs from  'fs'

exports.readJsonFromFile = (filePath: string) => {
    return new Promise((resolve, rej) =>
        fs.readFile(filePath, function (err, buf) {
            if (err) {
                rej(err)
            } else {
                resolve(JSON.parse(buf.toString()))
            }
        }))
}

exports.writeJsonToFile = (filePath: string, data: unknown) => {
    return new Promise((resolve, rej) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) rej(err)
            resolve(true)
        })
    })
}
