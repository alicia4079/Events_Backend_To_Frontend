const template = () => `
  <section id="holidays">
    ${
      localStorage.getItem('user')
        ? `
        <h3></h3>`
        : `<h3>Por favor, introduce tu usuario y contraseña</h3>`
    }
    <ul id="holidaycontainer">
    </ul>
  </section>
`

const getholidays = async () => {
  const holidayData = await fetch('http://localhost:3000/api/holidays')

  const holidays = await holidayData.json()

  const holidayContainer = document.querySelector('#holidaycontainer')

  for (const holiday of holidays) {
    const li = document.createElement('li')
    const events = holiday.events
      .map((event) => `<li>${event.title}</li>`)
      .join('')
    const attendees = holiday.attendee
      .map((attendee) => `<li>${attendee.name}</li>`)
      .join('')

    li.innerHTML = `
      <h3>${holiday.name}</h3>
      <h4>${holiday.period}</h4>
      <h5>Eventos:</h5>
      <ul>${events}</ul>
      <h5>Asistentes:</h5>
      <ul>${attendees}</ul>
    `

    holidayContainer.appendChild(li)
  }
}

const holidays = () => {
  document.querySelector('main').innerHTML = template()
  getholidays()
}

export default holidays
