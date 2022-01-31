const {readJsonFromFile, writeJsonToFile} = require('./fs-utils')


const getProducts = () => {
    return readJsonFromFile('./products.json')
}
const getOrdersList = () => {
    return readJsonFromFile('./orders.json')
}

// const addUser = async (userName) => {
//     let users = await getProducts()
//     users.push({id: users.length + 1, name: userName})
//     return writeJsonToFile("./products.json", users)
// }

exports.getProducts = getProducts;
exports.getOrdersList = getOrdersList;
// exports.addUser = addUser;
