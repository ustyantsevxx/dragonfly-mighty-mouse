const { Router } = require('express')
const authController = require('./controllers/authController')
const taskController = require('./controllers/taskController')
const subjectController = require('./controllers/subjectController')
const groupController = require('./controllers/groupController')
const marksController = require('./controllers/marksController')
const router = Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)

router.post('/subjects', subjectController.create)
router.delete('/subjects', subjectController.delete)
router.put('/subjects', subjectController.update)

module.exports = router
