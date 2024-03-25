import Events from './events'
import { updateNavbar } from '../main'

const template = () => `
<section id="login">
  ${
    localStorage.getItem('user')
      ? `<div>
      <img src="${
        JSON.parse(localStorage.getItem('user')).profileImage
      }" alt="User Image"/>
      <h2>¡Hola de nuevo, ${
        JSON.parse(localStorage.getItem('user')).userName
      }!</h2>
      <button id="logoutbtn">Desconectar</button>
    </div>`
      : `<form>
        <input type="text" placeholder="Usuario" id="username" autocomplete="username"/>
        <input type="password" id="password" placeholder="Contraseña" autocomplete="current-password" />
        <button id="loginbtn">Acceder</button>
      </form>`
  }
</section>
`

const loginSubmit = async () => {
  try {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value

    const data = await fetch(
      'https://events-backend-to-frontend.vercel.app/api/users/login',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          userName: username,
          password: password
        })
      }
    )

    if (!data.ok) {
      throw new Error(`Error: ${data.status} - ${data.statusText}`)
    }

    const dataRes = await data.json()
    localStorage.setItem('user', JSON.stringify(dataRes))
    localStorage.setItem('accessToken', dataRes.token)

    localStorage.setItem('user', JSON.stringify(dataRes.user))

    alert(`¡Hola de nuevo ${username}!`)

    updateNavbar()

    Events()
  } catch (error) {
    console.error('Error en la autenticación:', error.message)
    alert(
      'Nombre de usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.'
    )
  }
}

const logout = () => {
  localStorage.removeItem('user')
  window.location.href = '/'
}

const Login = () => {
  document.querySelector('main').innerHTML = template()

  if (localStorage.getItem('user')) {
    document.querySelector('#logoutbtn').addEventListener('click', (ev) => {
      ev.preventDefault()
      logout()
    })
  } else {
    document.querySelector('#loginbtn').addEventListener('click', (ev) => {
      ev.preventDefault()
      loginSubmit()
    })
  }
}

export default Login
