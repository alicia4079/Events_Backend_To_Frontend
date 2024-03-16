import attendees from './Pages/asistentes'
import Events from './Pages/events'
import holidays from './Pages/holiday'
import Login from './Pages/login'
import Register from './Pages/register'
import './style.css'

let isLoggedIn = localStorage.getItem('user')

export const updateNavbar = () => {
  const loginButton = document.getElementById('loginlink')
  const registerButton = document.getElementById('registerlink')
  const logOutButton = document.getElementById('logoutlink')

  if (isLoggedIn) {
    loginButton.style.display = 'none'
    registerButton.style.display = 'none'
    logOutButton.style.display = 'block'
  } else {
    loginButton.style.display = 'block'
    logOutButton.style.display = 'none'
    registerButton.style.display = 'block'
  }
}

const handleLoginClick = () => {
  if (!isLoggedIn) {
    Login()
    isLoggedIn = true
  } else {
    localStorage.removeItem('user')
    isLoggedIn = false
    updateNavbar()
  }
}

const handleLogoutClick = () => {
  Login()
}

const handleEventClick = () => Events()
const handleRegisterClick = () => Register()
const handleAttendeeClick = () => attendees()
const handleHolidayClick = () => holidays()

const loginLink = document.querySelector('#loginlink')
loginLink.addEventListener('click', handleLoginClick)

const logoutLink = document.querySelector('#logoutlink')
logoutLink.addEventListener('click', handleLogoutClick)

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

  updateNavbar()
})
