const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: false },
    date: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    confirmation: { type: Boolean, required: false, default: false }
  },
  {
    timestamps: true,
    collection: 'events'
  }
)

const Event = mongoose.model('events', eventSchema, 'events')
module.exports = Event
