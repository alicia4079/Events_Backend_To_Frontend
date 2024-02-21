import attendees from './Pages/asistentes'
import Events from './Pages/events'
import holidays from './Pages/holiday'
import Login from './Pages/login'
import Register from './Pages/register'
import './style.css'

const handleLoginClick = () => Login()
const handleEventClick = () => Events()
const handleRegisterClick = () => Register()
const handleAttendeeClick = () => attendees()
const handleHolidayClick = () => holidays()

const loginLink = document.querySelector('#loginlink')
loginLink.addEventListener('click', handleLoginClick)

const eventLink = document.querySelector('#eventlink')
eventLink.addEventListener('click', handleEventClick)

const registerLink = document.querySelector('#registerlink')
registerLink.addEventListener('click', handleRegisterClick)

const attendeeLink = document.querySelector('#attendeelink')
attendeeLink.addEventListener('click', handleAttendeeClick)

const holidayLink = document.querySelector('#holidaylink')
holidayLink.addEventListener('click', handleHolidayClick)

handleEventClick()

document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.getElementById('menu-icon')
  const nav = document.querySelector('nav')

  menuIcon.addEventListener('click', function () {
    nav.classList.toggle('show')
  })
})
