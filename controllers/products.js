const uuid = require('uuid')
const { validationResult } = require('express-validator')

const validate = require('../validations/inputs')
const MongoProducts = require('../database/places')

async function getProducts(req, res, next) {
    try {
        const products = await MongoProducts.getProducts()
        res.status(201).json({ products })
    } catch (error) {
        return next(error)
    }
}

async function getProduct(req, res, next) {
    try {
        const id = req.params.pid
        const product = await MongoProducts.getProduct(id)
        res.status(201).json({ product })
    } catch (error) {
        return next(error)
    }
}

async function createProduct(req, res, next) {
    try {
        const { name, brand, time, size, price } = req.params
        const createdProduct = {
            id: uuid(),
            name, 
            brand, 
            time, 
            size, 
            price
        }
        await MongoProducts.createProduct(createdProduct)
        res.status(200).json({ createdProduct })
    } catch (error) {
        return next(error)
    }
}

// TODO: implement database!
async function deleteProduct(req, res, next) {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { getProducts, getProduct, createProduct }
