const isAuth = require('../../middlewares/auth')
const upload = require('../../middlewares/file')
const {
  getEvents,
  getEventById,
  postEvent,
  putEvent
} = require('../controllers/event')
bcrypt = require('bcrypt')

const eventsRoutes = require('express').Router()

eventsRoutes.get('/', getEvents)
eventsRoutes.get('/:id', getEventById)
eventsRoutes.post('/', [isAuth], upload.single('img'), postEvent)
eventsRoutes.put('/:id', [isAuth], upload.single('img'), putEvent)

module.exports = eventsRoutes
