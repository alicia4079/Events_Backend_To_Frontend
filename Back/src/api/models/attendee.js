const mongoose = require('mongoose')

const attendeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    events: [{ type: mongoose.Types.ObjectId, ref: 'events', required: true }]
  },
  {
    timestamps: true,
    collection: 'attendee'
  }
)

const Attendee = mongoose.model('attendees', attendeeSchema, 'attendees')
module.exports = Attendee
