const { deleteFile } = require('../../utils/deleteFile')
const Event = require('../models/event')

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
    return res.status(200).json(events)
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id)
    return res.status(200).json(event)
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

const postEvent = async (req, res, next) => {
  try {
    const newEvent = new Event(req.body)
    if (req.file) {
      newEvent.img = req.file.path
    }
    const eventSaved = await newEvent.save()
    return res.status(201).json(eventSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const putEvent = async (req, res, next) => {
  try {
    const { id } = req.params

    const oldEvent = await Event.findById(id)
    let img = oldEvent.img
    if (req.file) {
      img = req.file.path
    }

    const eventData = {
      ...req.body,
      img
    }

    const eventUpdated = await Event.findByIdAndUpdate(id, eventData, {
      new: true
    })

    return res.status(200).json(eventUpdated)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error en la solicitud')
  }
}

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const eventDeleted = await Event.findByIdAndDelete(id)
    deleteFile(eventDeleted.img)
    return res.status(200).json({
      mensaje: 'Elemento eliminado',
      eventDeleted
    })
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

module.exports = { getEvents, getEventById, postEvent, putEvent, deleteEvent }
