const {getProducts} = require('./store');
const express = require('express');
const productsRouter = express.Router();

productsRouter.use((req, res, next) => {
    console.log('Request products router')
    next()
})

productsRouter.get('/', async function (req, res) {
    const products = await getProducts()
    res.send(products)
})

productsRouter.get('/:id', async function (req, res) {
    const productId = Number(req.params.id)
    const products = await getProducts()
    const product = products.find(u => u.id === productId)
    product ? res.send(product) : res.sendStatus(404)
})


module.exports = productsRouter;
