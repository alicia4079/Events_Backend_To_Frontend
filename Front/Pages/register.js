import { updateNavbar } from '../main'
import Login from './login'

const template = () => `
  <section id="register">
    <form id="registerForm">
      <input type="email" placeholder="Correo Electrónico" id="email"/>
      <input type="text" placeholder="Usuario" id="username"/>
      <input type="password" id="password" placeholder="Contraseña" />
      <input type="file" id="profileImage" placeholder="Foto de Perfil" />
      <button type="submit" id="registerbtn">Registrarse</button>
    </form>
  </section>
`

const checkUsername = async (username) => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/users/check-username',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: username })
      }
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data.available
  } catch (error) {
    console.error('Error al comprobar el nombre de usuario:', error.message)
    return false
  }
}

const registerSubmit = async (formData) => {
  try {
    const username = formData.get('userName')
    const isUsernameAvailable = await checkUsername(username)

    if (!isUsernameAvailable) {
      throw new Error(
        'El nombre de usuario ya está en uso. Por favor, elija otro.'
      )
    }

    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const userData = await response.json()
    localStorage.setItem('user', JSON.stringify(userData))
    alert('Registro exitoso.')
    Login()
    updateNavbar()
  } catch (error) {
    console.error('Error en el registro:', error.message)
    alert(error.message)
  }
}

const Register = () => {
  document.querySelector('main').innerHTML = template()

  document
    .querySelector('#registerForm')
    .addEventListener('submit', async (event) => {
      event.preventDefault()

      const formData = new FormData(event.target)
      registerSubmit(formData)
    })
}

export default Register
