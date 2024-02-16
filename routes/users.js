const express = require('express')

const usersController = require('../controllers/users')

const router = express.Router()

// Midleware Setup
router.get('/', usersController.getUsers)

router.post('/singup', usersController.singup)

router.post('/login', usersController.login)

module.exports = router
