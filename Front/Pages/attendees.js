const template = (events) => `
  <section id="attendee">
    ${
      localStorage.getItem('user')
        ? `
        <h3></h3>`
        : `<h3>Por favor, introduce tu usuario y contraseña para publicar nuevos asistentes</h3>`
    }
    <ul id="attendeeContainer">
    </ul>
    ${
      localStorage.getItem('user')
        ? `<button id="newAttendeeBtn">Publicar Nuevo asistente</button>`
        : ''
    }
    <div id="newAttendeeFormContainer" style="display: none;">
      <form id="newAttendeeForm">
        <h3>Crear Nuevo Asistente</h3>
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" required>
        <label for="events">Eventos:</label>
        <select id="events" name="events" multiple required>
          ${events
            .map(
              (event) => `<option value="${event._id}">${event.title}</option>`
            )
            .join('')}
        </select>
        
        <button type="submit">Publicar</button>
      </form>
    </div>
    <div id="editAttendeeFormContainer" style="display: none;">
      <form id="editAttendeeForm">
        <label for="editName">Nombre:</label>
        <input type="text" id="editName" name="editName" required>
        
        <label for="editEvents">Eventos:</label>
        <select id="editEvents" name="editEvents" multiple required>
          ${events
            .map(
              (event) => `<option value="${event._id}">${event.title}</option>`
            )
            .join('')}
        </select>
        
        <button type="submit">Guardar Cambios</button>
      </form>
      <button id="addEventEditBtn">Añadir Evento</button>
    </div>
  </section>
`

const getAttendees = async () => {
  try {
    const response = await fetch(
      'https://events-backend-to-frontend.vercel.app/api/attendees'
    )
    if (!response.ok) {
      throw new Error(`Error al obtener asistentes: ${response.statusText}`)
    }

    const attendees = await response.json()
    mostrarAsistentes(attendees)
  } catch (error) {
    console.error(`Error al obtener asistentes: ${error.message}`)
  }
}

const mostrarAsistentes = (attendees) => {
  const attendeeContainer = document.querySelector('#attendeeContainer')
  attendeeContainer.innerHTML = ''

  attendees.forEach((attendee) => {
    const li = document.createElement('li')
    li.dataset.attendeeId = attendee._id
    li.dataset.attendee = JSON.stringify(attendee)

    li.addEventListener('click', () => {
      console.log('Clic en asistente. ID:', attendee._id)
      cargarDetallesAsistente(attendee._id)
    })

    const h4 = document.createElement('h4')
    h4.textContent = attendee.name

    const h5Events = document.createElement('h5')
    h5Events.textContent = 'Eventos:'

    const ulEvents = document.createElement('ul')
    attendee.events.forEach((event) => {
      const liEvent = document.createElement('li')
      liEvent.textContent = `${event.title} - Confirmado: `

      const spanIcon = document.createElement('span')
      spanIcon.className = 'icon'
      spanIcon.textContent = event.confirmation ? '✅' : '❌'

      const confirmButton = document.createElement('button')
      confirmButton.className = 'confirmButton'
      confirmButton.dataset.attendeeId = attendee._id
      confirmButton.dataset.eventId = event._id
      confirmButton.textContent = event.confirmation
        ? 'Anular Confirmación'
        : 'Confirmar Asistencia'

      if (localStorage.getItem('user')) {
        confirmButton.style.display = 'block'
      } else {
        confirmButton.style.display = 'none'
      }

      confirmButton.addEventListener('click', async (event) => {
        await handleConfirmationClick(event, confirmButton)
      })

      liEvent.appendChild(spanIcon)
      liEvent.appendChild(confirmButton)
      ulEvents.appendChild(liEvent)
    })

    li.appendChild(h4)
    li.appendChild(h5Events)
    li.appendChild(ulEvents)

    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.className = 'editButton'
    editButton.addEventListener('click', () =>
      handleEditAttendeeClick(attendee._id)
    )
    if (localStorage.getItem('user')) {
      li.appendChild(editButton)
    }
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.className = 'deleteButton'
    deleteButton.addEventListener('click', () =>
      handleDeleteAttendeeClick(attendee._id)
    )
    if (localStorage.getItem('user')) {
      li.appendChild(deleteButton)
    }

    attendeeContainer.appendChild(li)
  })
}

const handleConfirmationClick = async (event, confirmButton) => {
  event.stopPropagation()

  const attendeeId = confirmButton.dataset.attendeeId
  const eventId = confirmButton.dataset.eventId

  try {
    const confirmationStatus = !confirmButton.textContent.includes('Anular')
    const confirmationResult = await confirmEvent(
      attendeeId,
      eventId,
      confirmationStatus
    )

    confirmButton.textContent = confirmationStatus
      ? 'Anular Confirmación ❌'
      : 'Confirmar Asistencia ✅'

    console.log('Botón de confirmación - Contenido:', confirmButton.textContent)

    console.log(
      `Confirmation Status for Event ${eventId}:`,
      confirmationResult.events.find((event) => event._id === eventId)
        ?.confirmation
    )
  } catch (error) {
    console.error(error)
  }
}

const cargarDetallesAsistente = async (attendeeId) => {
  try {
    const response = await fetch(
      `https://events-backend-to-frontend.vercel.app/api/attendees/${attendeeId}`
    )
    if (!response.ok) {
      throw new Error(
        `Error al cargar detalles del asistente: ${response.statusText}`
      )
    }

    const attendee = await response.json()
    mostrarDetallesAsistente(attendee)
  } catch (error) {
    console.error(error.message)
  }
}

const mostrarDetallesAsistente = (attendee) => {
  const detallesContainer = document.querySelector('#attendeeContainer')

  detallesContainer.innerHTML = ''

  const detallesDiv = document.createElement('div')
  detallesDiv.innerHTML = `
    <h2>${attendee.name}</h2>
    <h3>Eventos:</h3>
    <ul>
      ${attendee.events.map((event) => `<li>${event.title}</li>`).join('')}
    </ul>
  `

  detallesContainer.appendChild(detallesDiv)
}

const handleNewAttendeeClick = async () => {
  const newAttendeeFormContainer = document.querySelector(
    '#newAttendeeFormContainer'
  )
  newAttendeeFormContainer.style.display = 'flex'
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })

  const newAttendeeForm = document.getElementById('newAttendeeForm')
  newAttendeeForm.dataset.attendeeId = ''

  newAttendeeForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(newAttendeeForm)
    const selectedEvents = Array.from(formData.getAll('events'))

    const data = {
      name: formData.get('name'),
      events: selectedEvents
    }

    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await fetch(
        'https://events-backend-to-frontend.vercel.app/api/attendees',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(
          `Error al crear el asistente: ${response.status} ${response.statusText}. ${errorMessage}`
        )
      }

      alert('Asistente creado con éxito.')
      getAttendees()
    } catch (error) {
      alert(`Error al crear el asistente: ${error.message}`)
    }
  })
}

const handleEditAttendeeSubmit = async (event) => {
  event.preventDefault()

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    console.error(
      'No hay token de acceso disponible. El usuario no está autenticado.'
    )
    return
  }

  const attendeeId = event.currentTarget.dataset.attendeeId

  const formData = new FormData(document.getElementById('editAttendeeForm'))
  const selectedEvents = Array.from(formData.getAll('editEvents'))

  const data = {
    name: formData.get('editName'),
    events: selectedEvents
  }

  try {
    const response = await fetch(
      `https://events-backend-to-frontend.vercel.app/api/attendees/${attendeeId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(
        `Error al editar el asistente: ${response.status} ${response.statusText}. ${errorMessage}`
      )
    }

    alert('Asistente editado con éxito.')
    getAttendees()
  } catch (error) {
    alert(`Error al editar el asistente: ${error.message}`)
  }
}

const handleDeleteAttendeeClick = async (attendeeId) => {
  const confirmDelete = confirm(
    '¿Estás seguro de que deseas eliminar este asistente?'
  )
  if (!confirmDelete) {
    return
  }

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    console.error(
      'No hay token de acceso disponible. El usuario no está autenticado.'
    )
    return
  }

  try {
    const response = await fetch(
      `https://events-backend-to-frontend.vercel.app/api/attendees/${attendeeId}`,
      {
        method: 'DELETE',
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
        `Error al eliminar el asistente: ${response.status} ${response.statusText}. ${errorMessage}`
      )
    }

    console.log('Asistente eliminado:', attendeeId)
    getAttendees()
  } catch (error) {
    alert(`Error al eliminar el asistente: ${error.message}`)
  }
}

const handleEditAttendeeClick = async (attendeeId) => {
  const editAttendeeFormContainer = document.querySelector(
    '#editAttendeeFormContainer'
  )

  if (editAttendeeFormContainer) {
    editAttendeeFormContainer.style.display = 'flex'
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })

    const currentAttendee = document.querySelector(
      `[data-attendee-id="${attendeeId}"]`
    )

    if (currentAttendee) {
      const { name, events } = JSON.parse(currentAttendee.dataset.attendee)

      document.getElementById('editName').value = name

      const editEventsSelect = document.getElementById('editEvents')
      editEventsSelect.value = events.map((event) => event._id)

      document.getElementById('editAttendeeForm').dataset.attendeeId =
        attendeeId

      populateEditForm(attendeeId)
    } else {
      console.error(
        'Error: No se encontró el asistente con el ID correspondiente.'
      )
    }
  } else {
    console.error(
      'Error: No se encontró el contenedor del formulario de edición.'
    )
  }
}

const populateEditForm = async (attendeeId) => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const response = await fetch(
      `https://events-backend-to-frontend.vercel.app/api/attendees/${attendeeId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(
        `Error al obtener detalles del asistente: ${response.statusText}`
      )
    }

    const attendee = await response.json()
    const { name, events } = attendee

    document.getElementById('editName').value = name

    const editEventsSelect = document.getElementById('editEvents')
    editEventsSelect.innerHTML = ''

    events.forEach((event) => {
      const option = document.createElement('option')
      option.value = event._id
      option.textContent = event.title
      editEventsSelect.appendChild(option)
    })

    const editAttendeeForm = document.querySelector('#editAttendeeForm')
    editAttendeeForm.dataset.attendeeId = attendeeId
    editAttendeeForm.addEventListener('submit', (event) =>
      handleEditAttendeeSubmit(event)
    )
  } catch (error) {
    console.error(`Error al obtener detalles del asistente: ${error.message}`)
  }
}

const handleAddEventEditClick = async () => {
  try {
    const eventsData = await fetch(
      'https://events-backend-to-frontend.vercel.app/api/events'
    )
    if (!eventsData.ok) {
      throw new Error(`Error al obtener eventos: ${eventsData.statusText}`)
    }
    const events = await eventsData.json()

    const selectedEventTitles = prompt(
      'Seleccione uno o más eventos:',
      events.map((event) => event.title).join(', ')
    )

    if (selectedEventTitles) {
      const editEventsSelect = document.getElementById('editEvents')

      const selectedEvents = selectedEventTitles
        .split(',')
        .map((title) => title.trim())

      selectedEvents.forEach((selectedEventTitle) => {
        const existingOption = [...editEventsSelect.options].find(
          (option) => option.text === selectedEventTitle
        )

        if (!existingOption) {
          const selectedEvent = events.find(
            (event) => event.title === selectedEventTitle
          )

          if (selectedEvent) {
            const option = document.createElement('option')
            option.value = selectedEvent._id
            option.textContent = selectedEvent.title
            editEventsSelect.appendChild(option)
          } else {
            console.error('Error: El evento seleccionado no existe.')
          }
        } else {
          console.log(`El evento "${selectedEventTitle}" ya está seleccionado.`)
        }
      })

      const event = new Event('change', { bubbles: true })
      editEventsSelect.dispatchEvent(event)
    }
  } catch (error) {
    console.error(`Error al agregar el evento: ${error.message}`)
  }
}

const confirmEvent = async (attendeeId, eventId, confirmationStatus) => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const response = await fetch(
      `https://events-backend-to-frontend.vercel.app/api/attendees/${attendeeId}/${eventId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ confirmation: confirmationStatus })
      }
    )

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(
        `Error al confirmar/el asistente: ${response.status} ${response.statusText}. ${errorMessage}`
      )
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    throw new Error(`Error al confirmar el evento: ${error.message}`)
  }
}

const attendees = async () => {
  try {
    const eventsData = await fetch(
      'https://events-backend-to-frontend.vercel.app/api/events'
    )
    if (!eventsData.ok) {
      throw new Error(`Error al obtener eventos: ${eventsData.statusText}`)
    }
    const events = await eventsData.json()

    document.querySelector('main').innerHTML = template(events)
    getAttendees()

    const newAttendeeBtn = document.querySelector('#newAttendeeBtn')
    if (newAttendeeBtn) {
      newAttendeeBtn.addEventListener('click', handleNewAttendeeClick)
    }

    const newAttendeeForm = document.querySelector('#newAttendeeForm')
    if (newAttendeeForm) {
      newAttendeeForm.addEventListener('submit', (event) =>
        handleEditAttendeeSubmit(event)
      )
    }

    const editButtons = document.querySelectorAll(
      '#attendeeContainer button.editButton'
    )
    editButtons.forEach((button) => {
      button.addEventListener('click', async function () {
        const attendeeId = button.closest('li').dataset.attendeeId
        handleEditAttendeeClick(attendeeId)
      })
    })

    const deleteButtons = document.querySelectorAll(
      '#attendeeContainer button.deleteButton'
    )
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const attendeeId = button.closest('li').dataset.attendeeId
        handleDeleteAttendeeClick(attendeeId)
      })
    })

    const addEventEditBtn = document.querySelector('#addEventEditBtn')
    if (addEventEditBtn) {
      addEventEditBtn.addEventListener('click', () => handleAddEventEditClick())
    }
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

export default attendees
