export function createEventForm() {
  const form = document.createElement('form')
  form.id = 'newEventForm'

  const titleLabel = document.createElement('label')
  titleLabel.setAttribute('for', 'title')
  titleLabel.textContent = 'Título:'
  const titleInput = document.createElement('input')
  titleInput.setAttribute('type', 'text')
  titleInput.setAttribute('id', 'title')
  titleInput.setAttribute('name', 'title')
  titleInput.required = true

  const imgLabel = document.createElement('label')
  imgLabel.setAttribute('for', 'img')
  imgLabel.textContent = 'URL de la Imagen:'
  const imgInput = document.createElement('input')
  imgInput.setAttribute('type', 'file')
  imgInput.setAttribute('id', 'img')
  imgInput.setAttribute('name', 'img')
  imgInput.required = true

  const dateLabel = document.createElement('label')
  dateLabel.setAttribute('for', 'date')
  dateLabel.textContent = 'Fecha:'
  const dateInput = document.createElement('input')
  dateInput.setAttribute('type', 'text')
  dateInput.setAttribute('id', 'date')
  dateInput.setAttribute('name', 'date')
  dateInput.required = true

  const locationLabel = document.createElement('label')
  locationLabel.setAttribute('for', 'location')
  locationLabel.textContent = 'Ubicación:'
  const locationInput = document.createElement('input')
  locationInput.setAttribute('type', 'text')
  locationInput.setAttribute('id', 'location')
  locationInput.setAttribute('name', 'location')
  locationInput.required = true

  const descriptionLabel = document.createElement('label')
  descriptionLabel.setAttribute('for', 'description')
  descriptionLabel.textContent = 'Descripción:'
  const descriptionInput = document.createElement('textarea')
  descriptionInput.setAttribute('id', 'description')
  descriptionInput.setAttribute('name', 'description')
  descriptionInput.required = true

  const submitButton = document.createElement('button')
  submitButton.setAttribute('type', 'submit')
  submitButton.textContent = 'Publicar'

  form.appendChild(titleLabel)
  form.appendChild(titleInput)
  form.appendChild(imgLabel)
  form.appendChild(imgInput)
  form.appendChild(dateLabel)
  form.appendChild(dateInput)
  form.appendChild(locationLabel)
  form.appendChild(locationInput)
  form.appendChild(descriptionLabel)
  form.appendChild(descriptionInput)
  form.appendChild(submitButton)

  return form
}
