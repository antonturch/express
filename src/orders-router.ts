const {getOrdersList} = require('./utils/handlers');
const {addOrder} = require('./utils/handlers');
import express from 'express';
const ordersRouter = express.Router();

ordersRouter.use((req, res, next) => {
    console.log('Request order router')
    next()
})

ordersRouter.get('/:id', async function (req, res) {
    const ordersList = await getOrdersList()
    res.send(ordersList)
})

ordersRouter.post('/:id', async function (req, res) {
    addOrder(Number(req.body.productId))
    const ordersList = await getOrdersList()
    res.send(ordersList)
})

module.exports = ordersRouter;
