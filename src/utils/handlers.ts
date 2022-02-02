import {Orders, Products} from '../types/dbTypes';

const {readJsonFromFile, writeJsonToFile} = require('./fs-utils')

const getProducts = () => {
    return readJsonFromFile('./src/db/products.json')
}
const getOrdersList = () => {
    return readJsonFromFile('./src/db/orders.json')
}

const addOrder = async (productId: number) => {
    const products: Products = await getProducts()
    const product = products.find(u => u.id === productId)
    let ordersList: Orders = await getOrdersList()
    if (product) {
        ordersList.push(product)
    }
    return writeJsonToFile('./src/db/orders.json', ordersList)
}


exports.getProducts = getProducts;
exports.getOrdersList = getOrdersList;
exports.addOrder = addOrder;
