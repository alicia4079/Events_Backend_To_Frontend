const mongoose = require('mongoose')

const holidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    period: { type: String, required: true },
    events: [{ type: mongoose.Types.ObjectId, ref: 'events', required: false }],
    attendee: [
      { type: mongoose.Types.ObjectId, ref: 'attendees', required: false }
    ]
  },
  {
    timestamps: true,
    collection: 'Holidays'
  }
)

const Holiday = mongoose.model('Holidays', holidaySchema, 'Holidays')
module.exports = Holiday
