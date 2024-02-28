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

// TODO: Add req validations!
async function createProduct(req, res, next) {
    try {
        const { name, brand, store, size, price } = req.params
        const createdProduct = {
            id: uuid(),
            name, 
            brand, 
            store, 
            size, 
            price
        }
        await MongoProducts.createProduct(createdProduct)
        res.status(200).json({ createdProduct })
    } catch (error) {
        return next(error)
    }
}

async function updateProduct(req, res, next) {
    try {
        const updatedProduct = req.params
        await MongoProducts.updateProduct(body)
        res.status(201).json({ product: updatedProduct })
    } catch (error) {
        return next(error)
    }
}

// TODO: implement database!
async function deleteProduct(req, res, next) {
    try {
        const id = req.params.pid
        await MongoProducts.deleteProduct(id)
        res.status(201).json({message: `Product id ${id} deleted successefuly!`})
    } catch (error) {
        return next(error)
    }''
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct }
