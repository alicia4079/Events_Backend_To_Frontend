const template = () => `
  <section id="events">
    ${
      localStorage.getItem('user')
        ? `<h3></h3>`
        : `<h3>Por favor, introduce tu usuario y contraseña para publicar nuevos eventos</h3>`
    }
    <ul id="eventscontainer">
    </ul>
    ${
      localStorage.getItem('user')
        ? `<button id="newEventBtn">Publicar Nuevo Evento</button>`
        : ''
    }
    <div id="newEventFormContainer" style="display: none;">
      <form id="newEventForm">
      <h3>Crear Nuevo Evento</h3>
        <label for="title">Título:</label>
        <input type="text" id="title" name="title" required>

        <label for="img">URL de la Imagen:</label>
        <input type="file" id="img" name="img" required>

        <label for="date">Fecha:</label>
        <input type="text" id="date" name="date" required>

        <label for="location">Ubicación:</label>
        <input type="text" id="location" name="location" required>

        <label for="description">Descripción:</label>
        <textarea id="description" name="description" required></textarea>

        <button type="submit">Publicar</button>
      </form>
    </div>
  </section>
`

const getEvents = async () => {
  const eventsData = await fetch(
    'https://events-backend-to-frontend.vercel.app/api/events'
  )
  const events = await eventsData.json()
  const eventsContainer = document.querySelector('#eventscontainer')

  for (const event of events) {
    const li = document.createElement('li')
    const enlace = document.createElement('a')
    enlace.href = `/eventos/${event._id}`
    enlace.textContent = event.title
    li.appendChild(enlace)

    li.innerHTML += `
      <img src=${event.img} alt=${event.title}/>
      <h4>${event.date}</h4>
      <h5>${event.location}</h5>
      <h5>${event.description}</h5>
    `

    eventsContainer.appendChild(li)
  }
}
document.addEventListener('click', async (event) => {
  const enlace = event.target.closest('a')
  if (enlace && enlace.href.includes('/eventos/')) {
    event.preventDefault()

    const eventId = enlace.href.split('/').pop()

    await cargarDetallesEvento(eventId)
  }
})

async function cargarDetallesEvento(eventId) {
  try {
    const response = await fetch(
      `https://events-backend-to-frontend.vercel.app/api/events/${eventId}`
    )
    if (!response.ok) {
      throw new Error(
        `Error al cargar detalles del evento: ${response.statusText}`
      )
    }

    const evento = await response.json()

    mostrarDetallesEvento(evento)
  } catch (error) {
    console.error(error.message)
  }
}

function mostrarDetallesEvento(evento) {
  const contenedorExistente = document.getElementById('events')

  contenedorExistente.innerHTML = ''

  const detallesContainer = document.createElement('section')
  detallesContainer.className = 'detailEvents'

  detallesContainer.innerHTML = `
    <h2>${evento.title}</h2>
    <img src="${evento.img}" alt="${evento.title}" />
    <p><strong>Fecha:</strong> ${evento.date}</p>
    <p><strong>Ubicación:</strong> ${evento.location}</p>
    <p><strong>Descripción:</strong> ${evento.description}</p>
  `

  contenedorExistente.appendChild(detallesContainer)
}

const handleNewEventClick = () => {
  const newEventFormContainer = document.querySelector('#newEventFormContainer')
  newEventFormContainer.style.display = 'flex'
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

const handleNewEventSubmit = async (event) => {
  event.preventDefault()

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    console.error(
      'No hay token de acceso disponible. El usuario no está autenticado.'
    )
    return
  }
  console.log('Token de acceso:', accessToken)

  const formData = new FormData(document.getElementById('newEventForm'))
  console.log([...formData.entries()])

  try {
    const response = await fetch(
      'https://events-backend-to-frontend.vercel.app/api/events',
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => null)
      const errorMessage = errorResponse
        ? errorResponse.error
        : 'Error desconocido'
      throw new Error(
        `Error al publicar el evento: ${response.status} ${response.statusText}. ${errorMessage}`
      )
    }

    const result = await response.json()
    console.log('Respuesta del servidor:', result)

    if (result && result._id) {
      const eventsContainer = document.querySelector('#eventscontainer')
      const existingEvent = eventsContainer.querySelector(
        `[data-event-id="${result._id}"]`
      )

      if (!existingEvent) {
        const li = document.createElement('li')
        li.innerHTML = `
          <h3>${result.title}</h3>
          <img src="${result.img}" alt="${result.title}"/>
          <h4>${result.date}</h4>
          <h5>${result.location}</h5>
          <h5>${result.description}</h5>
        `
        li.setAttribute('data-event-id', result._id)
        eventsContainer.appendChild(li)
      }

      const newEventFormContainer = document.querySelector(
        '#newEventFormContainer'
      )
      newEventFormContainer.style.display = 'none'

      document.getElementById('newEventForm').reset()
    } else {
      throw new Error('La respuesta del servidor no contiene un _id válido.')
    }
  } catch (error) {
    alert(`Error al publicar el evento: ${error.message}`)
  }
}

const Events = () => {
  document.querySelector('main').innerHTML = template()
  getEvents()

  const newEventBtn = document.querySelector('#newEventBtn')
  if (newEventBtn) {
    newEventBtn.addEventListener('click', handleNewEventClick)
  }

  const newEventForm = document.querySelector('#newEventForm')
  if (newEventForm) {
    newEventForm.addEventListener('submit', handleNewEventSubmit)
  }
}

export default Events
