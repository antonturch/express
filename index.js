const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
require('dotenv').config();

const productsRouter = require('./products-router')
const ordersRouter = require('./orders-router')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

app.use((req, res) => {
    res.sendStatus(404)
})

app.listen(process.env.PORT, function () {
    console.log('Example 7542')
})