import attendees from './Pages/attendees'
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

document.addEventListener('DOMContentLoaded', function () {
  updateNavbar()

  document
    .querySelector('#loginlink')
    .addEventListener('click', handleLoginClick)
  document
    .querySelector('#logoutlink')
    .addEventListener('click', handleLogoutClick)
  document
    .querySelector('#eventlink')
    .addEventListener('click', handleEventClick)
  document
    .querySelector('#registerlink')
    .addEventListener('click', handleRegisterClick)
  document
    .querySelector('#attendeelink')
    .addEventListener('click', handleAttendeeClick)
  document
    .querySelector('#holidaylink')
    .addEventListener('click', handleHolidayClick)

  handleEventClick()

  const menuIcon = document.getElementById('menu-icon')
  const nav = document.querySelector('nav')

  menuIcon.addEventListener('click', function () {
    nav.classList.toggle('show')
  })
})

const header = document.createElement('header')

const menuIconDiv = document.createElement('div')
menuIconDiv.classList.add('menu-icon')
menuIconDiv.id = 'menu-icon'

const menuIconImg = document.createElement('img')
menuIconImg.src = './menu.png'
menuIconImg.alt = 'Menú Hamburguesa'

menuIconDiv.appendChild(menuIconImg)

const h1 = document.createElement('h1')
h1.textContent = 'Disfruta de los mejores eventos del año'

const nav = document.createElement('nav')

const eventLink = document.createElement('a')
eventLink.href = '#'
eventLink.id = 'eventlink'
eventLink.textContent = 'Eventos'

const loginLink = document.createElement('a')
loginLink.href = '#'
loginLink.id = 'loginlink'
loginLink.textContent = 'Login'

const logoutLink = document.createElement('a')
logoutLink.href = '#'
logoutLink.id = 'logoutlink'
logoutLink.textContent = 'Log out'

const registerLink = document.createElement('a')
registerLink.href = '#'
registerLink.id = 'registerlink'
registerLink.textContent = 'Regístrate'

const attendeeLink = document.createElement('a')
attendeeLink.href = '#'
attendeeLink.id = 'attendeelink'
attendeeLink.textContent = 'Asistentes'

const holidayLink = document.createElement('a')
holidayLink.href = '#'
holidayLink.id = 'holidaylink'
holidayLink.textContent = 'Vacaciones'

nav.appendChild(eventLink)
nav.appendChild(loginLink)
nav.appendChild(logoutLink)
nav.appendChild(registerLink)
nav.appendChild(attendeeLink)
nav.appendChild(holidayLink)

header.appendChild(menuIconDiv)
header.appendChild(h1)
header.appendChild(nav)

const footer = document.createElement('footer')
footer.innerHTML = `
    <h3>2024 - Alicia Gálvez - Eventos</h3>
  `

const app = document.getElementById('app')
app.insertBefore(header, app.firstChild)
app.appendChild(footer)
const main = document.createElement('main')
app.insertBefore(main, footer)
