require('dotenv').config()
const { connectDB } = require('./src/config/db')
const express = require('express')
const cors = require('cors')
const usersRoutes = require('./src/api/routes/user.routes')
const eventsRoutes = require('./src/api/routes/events.routes')
const attendeesRoutes = require('./src/api/routes/attendee.routes')
const holidayRoutes = require('./src/api/routes/holiday.routes')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const server = express()
connectDB()

server.use(cors())

server.use(express.json())

server.use('/api/users', usersRoutes)
server.use('/api/events', eventsRoutes)
server.use('/api/attendees', attendeesRoutes)
server.use('/api/holidays', holidayRoutes)

server.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

server.listen(3000, () => {
  console.log('Servidor arriba en http://localhost:3000 😍')
})
