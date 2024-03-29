const Attendee = require('../models/attendee')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const getAttendee = async (req, res, next) => {
  try {
    const attendee = await Attendee.find().populate('events')
    return res.status(200).json(attendee)
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

const getAttendeeById = async (req, res, next) => {
  try {
    const { id } = req.params
    const attendee = await Attendee.findById(id).populate('events')
    return res.status(200).json(attendee)
  } catch (error) {
    return res.status(400).json('Error en la solicitud')
  }
}

const postAttendee = async (req, res, next) => {
  try {
    const { name } = req.body
    const existingAttendee = await Attendee.findOne({ name })

    if (existingAttendee) {
      return res
        .status(400)
        .json({ error: 'Ya existe un asistente con este nombre.' })
    }

    const newAttendee = new Attendee(req.body)
    const attendeeSaved = await newAttendee.save()

    return res.status(201).json(attendeeSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const putAttendee = async (req, res, next) => {
  try {
    const { id } = req.params
    const newAttendee = new Attendee(req.body)
    newAttendee._id = id
    const up = await Attendee.findByIdAndUpdate(id, newAttendee, { new: true })
    return res.status(200).json(up)
  } catch (error) {
    return res.status(400).json('Error')
  }
}

const putConfirmAttendeeEvents = async (req, res, next) => {
  try {
    const { id, eventId } = req.params

    const attendee = await Attendee.findById(id)

    if (!attendee) {
      return res.status(404).json({ error: 'No se encontró el asistente' })
    }

    const eventIndex = attendee.events.findIndex((event) =>
      event.equals(eventId)
    )

    if (eventIndex !== -1) {
      attendee.events[eventIndex].confirmation =
        !attendee.events[eventIndex].confirmation

      const update = { $set: { events: attendee.events } }

      const options = { new: true }

      const attendeeUpdated = await Attendee.findByIdAndUpdate(
        id,
        update,
        options
      )

      return res.status(200).json(attendeeUpdated)
    } else {
      return res
        .status(400)
        .json({ error: 'El evento no está en la lista del asistente' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}

const deleteAttendee = async (req, res, next) => {
  try {
    const { id } = req.params
    const attendeeDeleted = await Attendee.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Este asistente ha sido eliminado',
      attendeeDeleted
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}

module.exports = {
  getAttendee,
  getAttendeeById,
  postAttendee,
  putAttendee,
  putConfirmAttendeeEvents,
  deleteAttendee
}
