const Holiday = require('../models/holiday')

const getHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find()
      .populate('events')
      .populate('attendee')
    return res.status(200).json(holidays)
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

const getHolidayById = async (req, res, next) => {
  try {
    const { id } = req.params
    const holiday = await Holiday.findById(id)
      .populate('events')
      .populate('attendee')
    return res.status(200).json(holiday)
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

const postHoliday = async (req, res, next) => {
  try {
    const newHoliday = new Holiday(req.body)
    const holidaySaved = await newHoliday.save()
    return res.status(201).json(holidaySaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}
const updateHoliday = async (req, res, next) => {
  try {
    const { id } = req.params
    const newHoliday = new Artist(req.body)
    newHoliday._id = id
    const up = await Holiday.findByIdAndUpdate(id, newHoliday, { new: true })
    return res.status(200).json(up)
  } catch (error) {
    return res.status(400).json('Error')
  }
}

module.exports = { getHolidays, getHolidayById, postHoliday, updateHoliday }
