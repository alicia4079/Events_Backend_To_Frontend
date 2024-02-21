const isAdmin = require('../../middlewares/auth')
const {
  getHolidays,
  getHolidayById,
  postHoliday,
  updateHoliday
} = require('../controllers/holiday')

bcrypt = require('bcrypt')

const holidayRoutes = require('express').Router()

holidayRoutes.get('/', getHolidays)
holidayRoutes.get('/:id', getHolidayById)
holidayRoutes.post('/', [isAdmin], postHoliday)
holidayRoutes.post('/:id', [isAdmin], updateHoliday)

module.exports = holidayRoutes
