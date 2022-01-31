const {getOrdersList} = require('./store');
const express = require('express');
const ordersRouter = express.Router();

ordersRouter.use((req, res, next) => {
    console.log('Request order router')
    next()
})


ordersRouter.get('/', async function (req, res) {
    const ordersList = await getOrdersList()
    res.send(ordersList)
})

// router.post('/:id', async function (req, res) {
//     const result = await addUser(req.body.userName)
//     const users = await getUsers()
//     res.send(users)
// })


module.exports = ordersRouter;
