import {errorHandler} from './error-handler/error-handler';
import {ErrorException} from './error-handler/error-exception';
import {ErrorCode} from './error-handler/error-code';
import {NextFunction} from 'express';
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();

const productsRouter = require('./products-router')
const ordersRouter = require('./orders-router')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

app.get('/throw-unauthenticated', (req: Express.Request, res: Express.Response, next: NextFunction) => {
    throw new ErrorException(ErrorCode.Unauthenticated);
});

app.use(errorHandler)

app.listen(process.env.PORT, function () {
    console.log('Example 7542')
})
