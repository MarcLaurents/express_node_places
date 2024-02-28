const express = require('express')
const { check } = require('express-validator')

const productsController = require('../controllers/products')

const router = express.Router()

// Midleware Setup
router.get('/', productsController.getProducts)

router.get('/:pid', productsController.getProduct)

router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('brand').not().isEmpty(),
    check('store').not().isEmpty(),
    check('size').not().isEmpty(),
    check('price').not().isEmpty()
  ],
  productsController.createProduct
)

router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesController.updatePlaceById
)

router.delete('/:pid', placesController.deletePlaceById)

module.exports = router
