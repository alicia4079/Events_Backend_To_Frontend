const isAuth = require('../../middlewares/auth')
const {
  getAttendee,
  getAttendeeById,
  postAttendee,
  putAttendee,
  deleteAttendee,
  putConfirmAttendeeEvents
} = require('../controllers/attendee')

const attendeesRoutes = require('express').Router()

attendeesRoutes.get('/', getAttendee)
attendeesRoutes.get('/:id', getAttendeeById)
attendeesRoutes.post('/', [isAuth], postAttendee)
attendeesRoutes.put('/:id', [isAuth], putAttendee)
attendeesRoutes.put('/:id/:eventId', [isAuth], putConfirmAttendeeEvents)
attendeesRoutes.delete('/:id', [isAuth], deleteAttendee)

module.exports = attendeesRoutes
