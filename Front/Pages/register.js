import Login from './login'

const template = () => `
  <section id="register">
    <form>
      <input type="email" placeholder="Correo Electrónico" id="email"/>
      <input type="text" placeholder="Usuario" id="username"/>
      <input type="password" id="password" placeholder="Contraseña" />
      <input type="text" id="rol" placeholder="Rol" />
      <input type="file" id="profileImage" placeholder="Foto de Perfil" />
      <button id="registerbtn">Registrarse</button>
    </form>
  </section>
`

const registerSubmit = async () => {
  try {
    const email = document.querySelector('#email').value
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value
    const rol = document.querySelector('#rol').value
    const profileImage = document.querySelector('#profileImage').files[0]

    const formData = new FormData()
    formData.append('email', email)
    formData.append('userName', username)
    formData.append('password', password)
    formData.append('rol', rol)
    formData.append('profileImage', profileImage)

    const data = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      body: formData
    })

    console.log('Response:', data)

    if (data.status === 200 || data.status === 201) {
      alert(
        'Registro exitoso. Por favor, inicia sesión con tu usuario y contraseña.'
      )
      Login()
    }
  } catch (error) {
    console.error('Error en el registro:', error.message)
    alert('Error en el registro. Por favor, inténtalo de nuevo.')
  }
}

const Register = () => {
  document.querySelector('main').innerHTML = template()

  document.querySelector('#registerbtn').addEventListener('click', () => {
    registerSubmit()
  })
}

export default Register
