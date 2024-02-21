const upload = require('../../middlewares/file')
const { getUsers, register, login } = require('../controllers/user')

const usersRoutes = require('express').Router()

usersRoutes.get('/', getUsers)
usersRoutes.post('/register', upload.single('profileImage'), register)
usersRoutes.post('/login', login)

module.exports = usersRoutes
