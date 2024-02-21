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
        
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" required>
        
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
        
        <label for="editEmail">Correo electrónico:</label>
        <input type="email" id="editEmail" name="editEmail" required>
        
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
    const response = await fetch('http://localhost:3000/api/attendees')
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

    li.innerHTML = `
      <h4>${attendee.name}</h4>
      <h5>Email: ${attendee.email}</h5>
      <h5>Eventos:</h5>
      <ul>
        ${attendee.events
          .map(
            (event) => `
              <li>
                ${event.title} - Confirmado: ${event.confirmation ? '✅' : '❌'}
                <button class="confirmButton" data-attendee-id="${
                  attendee._id
                }" data-event-id="${event._id}">
                  ${
                    event.confirmation
                      ? 'Anular Confirmación'
                      : 'Confirmar Asistencia'
                  }
                </button>
              </li>
            `
          )
          .join('')}
      </ul>
    `

    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.className = 'editButton'
    editButton.addEventListener('click', () =>
      handleEditAttendeeClick(attendee._id)
    )
    li.appendChild(editButton)

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.className = 'deleteButton'
    deleteButton.addEventListener('click', () =>
      handleDeleteAttendeeClick(attendee._id)
    )
    li.appendChild(deleteButton)

    attendeeContainer.appendChild(li)
  })

  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('confirmButton')) {
      const attendeeId = event.target.dataset.attendeeId
      const eventId =
        event.target.dataset.eventId ||
        event.target.parentElement.dataset.eventId

      console.log('Attendee ID:', attendeeId)
      console.log('Event ID:', eventId)

      try {
        const confirmButton = event.target
        const confirmationStatus = !confirmButton.textContent.includes('Anular')

        const confirmationResult = await confirmEvent(
          attendeeId,
          eventId,
          confirmationStatus
        )

        console.log('Confirmation Result:', confirmationResult)

        if (confirmButton) {
          const eventToUpdate = confirmationResult.events.find(
            (event) => event._id === eventId
          )

          confirmButton.textContent = confirmationStatus
            ? 'Anular Confirmación'
            : 'Confirmar Asistencia'

          console.log(
            `Confirmation Status for Event ${eventId}:`,
            eventToUpdate.confirmation
          )
          getAttendees(attendees)
        } else {
          console.error('Botón de confirmación no encontrado')
        }
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const cargarDetallesAsistente = async (attendeeId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/attendees/${attendeeId}`
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
    <p>Email: ${attendee.email}</p>
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
      email: formData.get('email'),
      events: selectedEvents
    }

    const accessToken = localStorage.getItem('accessToken')

    try {
      const response = await fetch('http://localhost:3000/api/attendees', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

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
    email: formData.get('editEmail'),
    events: selectedEvents
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/attendees/${attendeeId}`,
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
      `http://localhost:3000/api/attendees/${attendeeId}`,
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
      const { name, email, events } = JSON.parse(
        currentAttendee.dataset.attendee
      )

      document.getElementById('editName').value = name
      document.getElementById('editEmail').value = email

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
      `http://localhost:3000/api/attendees/${attendeeId}`,
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
    const { name, email, events } = attendee

    document.getElementById('editName').value = name
    document.getElementById('editEmail').value = email

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
    const eventsData = await fetch('http://localhost:3000/api/events')
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
      `http://localhost:3000/api/attendees/${attendeeId}/${eventId}`,
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

const obtenerDetallesAsistente = async (attendeeId) => {
  try {
    if (!attendeeId) {
      console.error('Error: No se proporcionó un ID de asistente.')
      return null
    }

    const responseDetails = await fetch(
      `http://localhost:3000/api/attendees/${attendeeId}`
    )

    if (!responseDetails.ok) {
      const errorText = await responseDetails.text()
      console.error(
        `Error al obtener detalles del asistente: ${responseDetails.status} ${responseDetails.statusText}. ${errorText}`
      )
      return null
    }

    const updatedAttendeeDetails = await responseDetails.json()
    return updatedAttendeeDetails
  } catch (error) {
    console.error(`Error al obtener detalles del asistente: ${error.message}`)
    return null
  }
}

const attendees = async () => {
  try {
    const eventsData = await fetch('http://localhost:3000/api/events')
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
