const express = require('express')
const { check } = require('express-validator')

const usersController = require('../controllers/users')

const router = express.Router()

// Midleware Setup
router.get('/', usersController.getUsers)

router.post(
  '/singup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty().isLength({ min: 6 })
  ],
  usersController.singup
)

router.post('/login', usersController.login)

module.exports = router
